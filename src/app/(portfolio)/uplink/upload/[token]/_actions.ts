"use server";

import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
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
  assetId: string;
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

const getBatchPublicName = (
  publicName: string,
  batchId: string,
  index: number,
) => {
  const suffix = `-${batchId}-${index + 1}`;
  const prefix = publicName
    .slice(0, 180 - suffix.length)
    .replace(/[._-]+$/, "");
  return `${prefix}${suffix}`;
};

export const createGuestUplinkUploadUrl = async (
  token: string,
  input: unknown,
): Promise<ServerActionState<CreateGuestUploadUrlData[]>> => {
  try {
    const available = await getAvailableUploadLink(token);
    if ("error" in available) return failed(available.error as never);

    const request = uplinkUploadRequestSchema.parse(input);
    const storage = getUplinkStorage();
    if (!storage) return failed("Uplink storage is not configured");

    const existingAsset = await prisma.uplinkAsset.findFirst({
      where: { uploadLinkId: available.link.id },
      select: { id: true },
    });
    if (existingAsset) {
      return failed("This upload link has already been used");
    }

    const batchId = request.files.length > 1 ? nanoid() : null;
    const uploadDetails = request.files.map((file, index) => {
      const publicName =
        batchId && index > 0
          ? getBatchPublicName(request.publicName, batchId, index)
          : request.publicName;
      const objectName = getObjectName(publicName, file.originalName);

      return {
        file,
        publicName,
        byteSize: BigInt(file.size),
        objectKey: getUplinkObjectKey(objectName),
      };
    });

    const nameInUse = await prisma.uplinkAsset.findUnique({
      where: { publicName: request.publicName },
      select: { id: true },
    });
    if (nameInUse) return failed("A file with this link name already exists");

    const assets = await prisma.$transaction(
      uploadDetails.map((detail) =>
        prisma.uplinkAsset.create({
          data: {
            publicName: detail.publicName,
            bucketName: storage.bucketName,
            objectKey: detail.objectKey,
            originalName: detail.file.originalName,
            contentType: detail.file.contentType,
            size: detail.byteSize,
            batchId,
            uploadLinkId: available.link.id,
            status: "PENDING",
          },
          select: {
            id: true,
            batchId: true,
            publicName: true,
            bucketName: true,
            objectKey: true,
            originalName: true,
            contentType: true,
            size: true,
            status: true,
          },
        }),
      ),
    );

    const expiresIn = Math.min(
      900,
      Math.floor((available.link.expiresAt.getTime() - Date.now()) / 1000),
    );
    if (expiresIn <= 0) return failed("This upload link has expired");

    const uploads: CreateGuestUploadUrlData[] = [];
    for (const asset of assets) {
      const storageUrl = getUplinkPublicUrl(asset.objectKey);
      if (!storageUrl) return failed("Uplink storage is not configured");

      const uploadUrl = await getSignedUrl(
        storage.client,
        new PutObjectCommand({
          Bucket: asset.bucketName,
          Key: asset.objectKey,
          ContentType: asset.contentType,
          IfNoneMatch: "*",
        }),
        { expiresIn },
      );
      uploads.push({
        assetId: asset.id,
        uploadUrl,
        objectKey: asset.objectKey,
        storageUrl,
        expiresIn,
      });
    }
    return {
      status: "success",
      message: "Upload URLs created",
      data: uploads,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const completeGuestUplinkUpload = async (
  token: string,
  assetIds: string[],
): Promise<ServerActionState<CompleteGuestUploadData[]>> => {
  try {
    const available = await getAvailableUploadLink(token);
    if ("error" in available) return failed(available.error as never);

    const ids = idSchema.array().min(1).max(100).parse(assetIds);
    if (new Set(ids).size !== ids.length) {
      return failed("Duplicate upload IDs");
    }

    const foundAssets = await prisma.uplinkAsset.findMany({
      where: { id: { in: ids }, uploadLinkId: available.link.id },
      select: {
        id: true,
        batchId: true,
        bucketName: true,
        objectKey: true,
        contentType: true,
        size: true,
        status: true,
      },
    });
    if (foundAssets.length !== ids.length) {
      return failed("One or more upload records were not found for this link");
    }

    const foundAssetsById = new Map(
      foundAssets.map((asset) => [asset.id, asset]),
    );
    const assets = ids.map((id) => foundAssetsById.get(id)!);
    const batchId = assets[0]?.batchId ?? null;
    if (assets.some((asset) => asset.batchId !== batchId)) {
      return failed("All files must belong to the same upload batch");
    }
    if (batchId) {
      const batchSize = await prisma.uplinkAsset.count({
        where: { batchId, uploadLinkId: available.link.id },
      });
      if (batchSize !== ids.length) {
        return failed("Complete all files in the batch together");
      }
    } else if (ids.length > 1) {
      return failed("These files do not belong to a batch");
    }
    if (assets.some((asset) => asset.status !== "PENDING")) {
      return failed("This upload batch has already been completed");
    }

    const storage = getUplinkStorage();
    if (!storage) return failed("Uplink storage is not configured");

    const completedUploads: CompleteGuestUploadData[] = [];
    for (const asset of assets) {
      const head = await storage.client.send(
        new HeadObjectCommand({
          Bucket: asset.bucketName,
          Key: asset.objectKey,
        }),
      );
      if (
        head.ContentLength === undefined ||
        BigInt(head.ContentLength) !== asset.size ||
        head.ContentType !== asset.contentType
      ) {
        return failed(
          "Uploaded file metadata did not match the upload request",
        );
      }

      const storageUrl = getUplinkPublicUrl(asset.objectKey);
      if (!storageUrl) return failed("Uplink storage is not configured");
      completedUploads.push({
        assetId: asset.id,
        objectKey: asset.objectKey,
        storageUrl,
      });
    }

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

      const readyAssets = await tx.uplinkAsset.updateMany({
        where: {
          id: { in: ids },
          uploadLinkId: available.link.id,
          status: "PENDING",
        },
        data: { status: "READY" },
      });
      if (readyAssets.count !== ids.length) {
        throw new Error("Guest upload batch changed before completion");
      }

      return true;
    });

    if (!completed) {
      return failed("This upload link has already been used");
    }

    return {
      status: "success",
      message: "Uploads complete",
      data: completedUploads,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
