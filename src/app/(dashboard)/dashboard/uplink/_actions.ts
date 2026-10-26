"use server";

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createHash, randomBytes } from "node:crypto";
import { extname } from "node:path";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { getUplinkObjectKey, getUplinkPublicUrl } from "@/lib/uplink/config";
import { getUplinkStorage } from "@/lib/uplink/r2-client";
import { idSchema } from "@/schema/common.schema";
import {
  uplinkUploadLinkRequestSchema,
  uplinkUploadRequestSchema,
} from "@/schema/uplink.schema";
import type { ServerActionState } from "@/types/common.types";
import { handleErrorResponse } from "@/utils/error-response";

type CreateUploadUrlData = {
  assetId: string;
  uploadUrl: string;
  objectKey: string;
  storageUrl: string;
  expiresIn: number;
};

type CompleteUploadData = {
  objectKey: string;
  storageUrl: string;
};

type CreateUploadLinkData = {
  url: string;
  expiresAt: string;
};

const failed = <T>(message: string): ServerActionState<T> => ({
  status: "failed",
  message,
  data: null,
  errors: { message, fieldError: null },
});

const hasAuthenticatedSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return Boolean(session);
};

// Adds the original file's safe extension to the object name unless it's already present.
const getObjectName = (publicName: string, originalName: string) => {
  const extension = extname(originalName).toLowerCase();
  const safeExtension = /^\.[a-z0-9]{1,20}$/.test(extension) ? extension : "";

  if (!safeExtension || publicName.toLowerCase().endsWith(safeExtension)) {
    return publicName;
  }

  return `${publicName}${safeExtension}`;
};

// Guest upload url
export const createUplinkUploadLink = async (
  input: unknown,
): Promise<ServerActionState<CreateUploadLinkData>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to create upload links");
    }

    if (!getUplinkStorage()) {
      return failed("Uplink storage is not configured");
    }

    const request = uplinkUploadLinkRequestSchema.parse(input);
    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + request.expiresInMinutes * 60_000,
    );
    const link = await prisma.uplinkUploadLink.create({
      data: {
        name: request.name,
        token,
        tokenHash,
        createdAt,
        expiresAt,
      },
      select: { expiresAt: true },
    });

    revalidatePath("/dashboard/uplink");

    return {
      status: "success",
      message: "Upload link created",
      data: {
        expiresAt: link.expiresAt.toISOString(),
        url: siteConfig.url.replace(/\/+$/, "") + "/uplink/upload/" + token,
      },
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const deleteUplinkUploadLink = async (
  linkId: string,
): Promise<ServerActionState<null>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to delete upload links");
    }

    const id = idSchema.parse(linkId);
    const result = await prisma.uplinkUploadLink.deleteMany({ where: { id } });

    if (result.count === 0) {
      return failed("Upload link not found");
    }

    revalidatePath("/dashboard/uplink");

    return {
      status: "success",
      message: "Upload link deleted",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const createUplinkUploadUrl = async (
  input: unknown,
): Promise<ServerActionState<CreateUploadUrlData>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to upload files");
    }

    const request = uplinkUploadRequestSchema.parse(input);
    const storage = getUplinkStorage();
    if (!storage) {
      return failed("Uplink storage is not configured");
    }

    const byteSize = BigInt(request.size);
    const existingAsset = await prisma.uplinkAsset.findUnique({
      where: { publicName: request.publicName },
    });

    // Reuse matching pending records so an interrupted upload can retry with a fresh URL and the same object key.
    if (existingAsset?.status === "READY") {
      return failed("A file with this link name already exists");
    }

    // Keep a pending link name tied to its original upload details; otherwise require a new name.
    if (
      existingAsset &&
      (existingAsset.originalName !== request.originalName ||
        existingAsset.contentType !== request.contentType ||
        existingAsset.size !== byteSize)
    ) {
      return failed(
        "A pending upload uses this link name. Retry it with the same file or choose another name",
      );
    }

    const objectName = getObjectName(request.publicName, request.originalName);
    const objectKey =
      existingAsset?.objectKey ?? getUplinkObjectKey(objectName);
    const bucketName = existingAsset?.bucketName ?? storage.bucketName;
    const expiresIn = 900; // 15 minutes

    const uploadUrl = await getSignedUrl(
      storage.client,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: request.contentType,
      }),
      { expiresIn },
    );

    const asset =
      existingAsset ??
      (await prisma.uplinkAsset.create({
        data: {
          publicName: request.publicName,
          bucketName: storage.bucketName,
          objectKey,
          originalName: request.originalName,
          contentType: request.contentType,
          size: byteSize,
          status: "PENDING",
        },
        select: { id: true },
      }));

    const storageUrl = getUplinkPublicUrl(objectKey);
    if (!storageUrl) {
      return failed("Uplink storage is not configured");
    }

    return {
      status: "success",
      message: "Upload URL created",
      data: { assetId: asset.id, uploadUrl, objectKey, storageUrl, expiresIn },
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const completeUplinkUpload = async (
  assetId: string,
): Promise<ServerActionState<CompleteUploadData>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to complete uploads");
    }

    const id = idSchema.parse(assetId);
    const asset = await prisma.uplinkAsset.findUnique({ where: { id } });
    if (!asset) {
      return failed("Upload record was not found");
    }

    const storage = getUplinkStorage();
    if (!storage) {
      return failed("Uplink storage is not configured");
    }

    if (asset.status === "READY") {
      const storageUrl = getUplinkPublicUrl(asset.objectKey);
      if (!storageUrl) {
        return failed("Uplink storage is not configured");
      }

      return {
        status: "success",
        message: "Upload is already complete",
        data: { objectKey: asset.objectKey, storageUrl },
        errors: null,
      };
    }

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
      return failed("Uploaded file metadata did not match the upload request");
    }

    await prisma.uplinkAsset.update({
      where: { id },
      data: { status: "READY" },
    });

    revalidatePath("/dashboard/uplink");

    const storageUrl = getUplinkPublicUrl(asset.objectKey);
    if (!storageUrl) {
      return failed("Uplink storage is not configured");
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

export const deleteUplinkAsset = async (
  assetId: string,
): Promise<ServerActionState<null>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to delete files");
    }

    const id = idSchema.parse(assetId);
    const storage = getUplinkStorage();
    if (!storage) {
      return failed("Uplink storage is not configured");
    }

    const asset = await prisma.uplinkAsset.findUnique({
      where: { id },
      select: { bucketName: true, objectKey: true, publicName: true },
    });

    if (!asset) {
      return failed("Uplink file was not found");
    }

    // Delete from R2 first so a storage error leaves the database row intact.
    await storage.client.send(
      new DeleteObjectCommand({
        Bucket: asset.bucketName,
        Key: asset.objectKey,
      }),
    );
    await prisma.uplinkAsset.delete({ where: { id } });

    revalidatePath("/dashboard/uplink");
    revalidatePath(`/uplink/${encodeURIComponent(asset.publicName)}`);

    return {
      status: "success",
      message: "Uplink file deleted",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
