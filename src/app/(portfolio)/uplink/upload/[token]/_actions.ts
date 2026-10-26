"use server";

import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extname } from "node:path";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getUplinkObjectKey, getUplinkPublicUrl } from "@/lib/uplink/config";
import { getUplinkStorage } from "@/lib/uplink/r2-client";
import { idSchema } from "@/schema/common.schema";
import { uplinkUploadRequestSchema } from "@/schema/uplink.schema";
import type { ServerActionState } from "@/types/common.types";
import { handleErrorResponse } from "@/utils/error-response";

type CreateGuestUploadUrlData = {
  assetId: string;
  uploadUrl: string;
  objectKey: string;
  storageUrl: string;
  expiresIn: number;
};

type CompleteGuestUploadData = {
  objectKey: string;
  storageUrl: string;
};

const failed = <T>(message: string): ServerActionState<T> => ({
  status: "failed",
  message,
  data: null,
  errors: { message, fieldError: null },
});

const uploadLinkTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{43}$/);

const getAvailableUploadLink = async (value: unknown) => {
  const parsedToken = uploadLinkTokenSchema.safeParse(value);
  if (!parsedToken.success) return { error: "Upload link not found" } as const;

  const link = await prisma.uplinkUploadLink.findUnique({
    where: { token: parsedToken.data },
    select: { id: true, expiresAt: true, usedAt: true },
  });

  if (!link) return { error: "Upload link not found" } as const;
  if (link.usedAt) {
    return { error: "This upload link has already been used" } as const;
  }
  if (link.expiresAt <= new Date()) {
    return { error: "This upload link has expired" } as const;
  }

  return { link } as const;
};

const getObjectName = (publicName: string, originalName: string) => {
  const extension = extname(originalName).toLowerCase();
  const safeExtension = /^\.[a-z0-9]{1,20}$/.test(extension) ? extension : "";

  return !safeExtension || publicName.toLowerCase().endsWith(safeExtension)
    ? publicName
    : `${publicName}${safeExtension}`;
};

export const createGuestUplinkUploadUrl = async (
  token: string,
  input: unknown,
): Promise<ServerActionState<CreateGuestUploadUrlData>> => {
  try {
    const available = await getAvailableUploadLink(token);
    if ("error" in available) return failed(available.error as never);

    const request = uplinkUploadRequestSchema.parse(input);
    const storage = getUplinkStorage();
    if (!storage) return failed("Uplink storage is not configured");

    const byteSize = BigInt(request.size);
    let asset = await prisma.uplinkAsset.findUnique({
      where: { uploadLinkId: available.link.id },
      select: {
        id: true,
        publicName: true,
        bucketName: true,
        objectKey: true,
        originalName: true,
        contentType: true,
        size: true,
        status: true,
      },
    });

    if (asset?.status === "READY") {
      return failed("This upload link has already been used");
    }

    if (
      asset &&
      (asset.publicName !== request.publicName ||
        asset.originalName !== request.originalName ||
        asset.contentType !== request.contentType ||
        asset.size !== byteSize)
    ) {
      return failed(
        "A pending upload uses this link. Retry with the same file or ask for a new link",
      );
    }

    if (!asset) {
      const nameInUse = await prisma.uplinkAsset.findUnique({
        where: { publicName: request.publicName },
        select: { id: true },
      });
      if (nameInUse) return failed("A file with this link name already exists");

      asset = await prisma.uplinkAsset.create({
        data: {
          publicName: request.publicName,
          bucketName: storage.bucketName,
          objectKey: getUplinkObjectKey(
            getObjectName(request.publicName, request.originalName),
          ),
          originalName: request.originalName,
          contentType: request.contentType,
          size: byteSize,
          uploadLinkId: available.link.id,
          status: "PENDING",
        },
        select: {
          id: true,
          publicName: true,
          bucketName: true,
          objectKey: true,
          originalName: true,
          contentType: true,
          size: true,
          status: true,
        },
      });
    }

    const storageUrl = getUplinkPublicUrl(asset.objectKey);
    if (!storageUrl) return failed("Uplink storage is not configured");

    const expiresIn = Math.min(
      900,
      Math.floor((available.link.expiresAt.getTime() - Date.now()) / 1000),
    );
    if (expiresIn <= 0) return failed("This upload link has expired");

    const uploadUrl = await getSignedUrl(
      storage.client,
      new PutObjectCommand({
        Bucket: asset.bucketName,
        Key: asset.objectKey,
        ContentType: request.contentType,
        IfNoneMatch: "*",
      }),
      { expiresIn },
    );

    return {
      status: "success",
      message: "Upload URL created",
      data: {
        assetId: asset.id,
        uploadUrl,
        objectKey: asset.objectKey,
        storageUrl,
        expiresIn,
      },
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const completeGuestUplinkUpload = async (
  token: string,
  assetId: string,
): Promise<ServerActionState<CompleteGuestUploadData>> => {
  try {
    const available = await getAvailableUploadLink(token);
    if ("error" in available) return failed(available.error as never);

    const id = idSchema.parse(assetId);
    const asset = await prisma.uplinkAsset.findFirst({
      where: { id, uploadLinkId: available.link.id, status: "PENDING" },
      select: {
        id: true,
        bucketName: true,
        objectKey: true,
        contentType: true,
        size: true,
      },
    });
    if (!asset) return failed("Upload record was not found for this link");

    const storage = getUplinkStorage();
    if (!storage) return failed("Uplink storage is not configured");

    const head = await storage.client.send(
      new HeadObjectCommand({ Bucket: asset.bucketName, Key: asset.objectKey }),
    );
    if (
      head.ContentLength === undefined ||
      BigInt(head.ContentLength) !== asset.size ||
      head.ContentType !== asset.contentType
    ) {
      return failed("Uploaded file metadata did not match the upload request");
    }

    const storageUrl = getUplinkPublicUrl(asset.objectKey);
    if (!storageUrl) return failed("Uplink storage is not configured");

    const usedAt = new Date();
    const completed = await prisma.$transaction(async (tx) => {
      const consumedLink = await tx.uplinkUploadLink.updateMany({
        where: {
          id: available.link.id,
          usedAt: null,
          expiresAt: { gt: usedAt },
        },
        data: { usedAt },
      });
      if (consumedLink.count !== 1) return false;

      const readyAsset = await tx.uplinkAsset.updateMany({
        where: {
          id: asset.id,
          uploadLinkId: available.link.id,
          status: "PENDING",
        },
        data: { status: "READY" },
      });
      if (readyAsset.count !== 1) throw new Error("Guest upload state changed");

      return true;
    });

    if (!completed) {
      return failed("This upload link has already been used or has expired");
    }

    return {
      status: "success",
      message: "Upload complete",
      data: { objectKey: asset.objectKey, storageUrl },
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
