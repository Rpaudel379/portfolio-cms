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
import { nanoid } from "nanoid";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { getUplinkObjectKey, getUplinkPublicUrl } from "@/lib/uplink/config";
import { getUplinkStorage } from "@/lib/uplink/r2-client";
import { idSchema, nanoidSchema } from "@/schema/common.schema";
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
  assetId: string;
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

const getBatchObjectName = (objectName: string, batchId: string) => {
  const extension = extname(objectName);
  const stem = extension ? objectName.slice(0, -extension.length) : objectName;
  return `${stem}-${batchId}${extension}`;
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
): Promise<ServerActionState<CreateUploadUrlData[]>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to upload files");
    }

    const request = uplinkUploadRequestSchema.parse(input);

    const batchId = request.files.length > 1 ? nanoid() : null;
    const storage = getUplinkStorage();
    if (!storage) {
      return failed("Uplink storage is not configured");
    }

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
        objectKey: getUplinkObjectKey(
          batchId ? getBatchObjectName(objectName, batchId) : objectName,
        ),
      };
    });

    const existingAsset = await prisma.uplinkAsset.findFirst({
      where: { publicName: request.publicName },
      select: { id: true },
    });
    if (existingAsset) {
      return failed("A file with this public name already exists");
    }

    const assets = await prisma.$transaction(
      uploadDetails.map((uploadDetail) =>
        prisma.uplinkAsset.create({
          data: {
            publicName: uploadDetail.publicName,
            bucketName: storage.bucketName,
            objectKey: uploadDetail.objectKey,
            originalName: uploadDetail.file.originalName,
            contentType: uploadDetail.file.contentType,
            size: uploadDetail.byteSize,
            batchId,
            status: "PENDING",
          },
          select: {
            id: true,
            bucketName: true,
            objectKey: true,
            contentType: true,
          },
        }),
      ),
    );

    const expiresIn = 900; // 15 minutes
    const uploads: CreateUploadUrlData[] = [];
    for (const asset of assets) {
      const storageUrl = getUplinkPublicUrl(asset.objectKey);
      if (!storageUrl) return failed("Uplink storage is not configured");
      const uploadUrl = await getSignedUrl(
        storage.client,
        new PutObjectCommand({
          Bucket: asset.bucketName,
          Key: asset.objectKey,
          ContentType: asset.contentType,
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

export const completeUplinkUpload = async (
  assetIds: string[],
): Promise<ServerActionState<CompleteUploadData[]>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to complete uploads");
    }

    const ids = idSchema.array().min(1).parse(assetIds);
    if (new Set(ids).size !== ids.length) {
      return failed("Duplicate upload IDs");
    }

    const foundAssets = await prisma.uplinkAsset.findMany({
      where: { id: { in: ids } },
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
      return failed("One or more upload records were not found");
    }

    const foundAssetsById = new Map(
      foundAssets.map((asset) => [asset.id, asset]),
    );
    const assets = ids.map((id) => foundAssetsById.get(id)!);
    const batchId = assets[0]?.batchId;
    if (assets.some((asset) => asset.batchId !== batchId)) {
      return failed("All files must belong to the same upload batch");
    }
    if (batchId) {
      const batchSize = await prisma.uplinkAsset.count({ where: { batchId } });
      if (batchSize !== ids.length) {
        return failed("Complete all files in the batch together");
      }
    } else if (ids.length > 1) {
      return failed("These files do not belong to a batch");
    }

    const storage = getUplinkStorage();
    if (!storage) {
      return failed("Uplink storage is not configured");
    }

    const completedUploads: CompleteUploadData[] = [];
    for (const asset of assets) {
      const storageUrl = getUplinkPublicUrl(asset.objectKey);
      if (!storageUrl) return failed("Uplink storage is not configured");
      completedUploads.push({
        assetId: asset.id,
        objectKey: asset.objectKey,
        storageUrl,
      });
    }

    const readyCount = assets.filter(
      (asset) => asset.status === "READY",
    ).length;
    if (readyCount === assets.length) {
      return {
        status: "success",
        message: "Uploads are already complete",
        data: completedUploads,
        errors: null,
      };
    }
    if (readyCount > 0) {
      return failed("The upload batch is partially complete");
    }

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
    }

    const updated = await prisma.uplinkAsset.updateMany({
      where: { id: { in: ids } },
      data: { status: "READY" },
    });
    if (updated.count !== ids.length) {
      return failed("One or more upload records were not found");
    }

    revalidatePath("/dashboard/uplink");

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

export const deleteUplinkBatch = async (
  batchId: string,
): Promise<ServerActionState<null>> => {
  try {
    if (!(await hasAuthenticatedSession())) {
      return failed("Sign in to delete upload batches");
    }

    const parsedBatchId = nanoidSchema.parse(batchId);
    const storage = getUplinkStorage();
    if (!storage) {
      return failed("Uplink storage is not configured");
    }

    const assets = await prisma.uplinkAsset.findMany({
      where: { batchId: parsedBatchId },
      select: { bucketName: true, objectKey: true, publicName: true },
    });
    if (assets.length === 0) {
      return failed("Upload batch was not found");
    }

    await Promise.all(
      assets.map((asset) =>
        storage.client.send(
          new DeleteObjectCommand({
            Bucket: asset.bucketName,
            Key: asset.objectKey,
          }),
        ),
      ),
    );
    await prisma.uplinkAsset.deleteMany({
      where: { batchId: parsedBatchId },
    });

    revalidatePath("/dashboard/uplink");
    const publicName =
      assets.find((asset) => !asset.publicName.includes(parsedBatchId))
        ?.publicName ?? assets[0]?.publicName;
    revalidatePath(`/uplink/${encodeURIComponent(publicName)}`);

    return {
      status: "success",
      message: "Upload batch deleted",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
