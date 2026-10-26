import {
  HeadObjectCommand,
  NotFound,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { UplinkBatchFiles } from "@/modules/uplink/components/batch-files";
import { prisma } from "@/lib/prisma";
import { getUplinkPublicUrl } from "@/lib/uplink/config";
import { getUplinkStorage } from "@/lib/uplink/r2-client";
import { uplinkPublicNameSchema } from "@/schema/uplink.schema";
import { notFound, redirect } from "next/navigation";

const UplinkAssetPage = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const parsedName = uplinkPublicNameSchema.safeParse((await params).name);
  if (!parsedName.success) notFound();

  const publicName = parsedName.data;
  const storage = getUplinkStorage();
  if (!storage) notFound();

  const asset = await prisma.uplinkAsset.findUnique({
    where: { publicName },
    select: {
      bucketName: true,
      objectKey: true,
      status: true,
      batchId: true,
    },
  });

  if (!asset || asset.status !== "READY") notFound();

  if (asset.batchId) {
    const batchId = asset.batchId;
    const assets = await prisma.uplinkAsset.findMany({
      where: { batchId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        publicName: true,
        originalName: true,
        contentType: true,
        objectKey: true,
        status: true,
      },
    });
    if (assets.length === 0 || assets.some((item) => item.status !== "READY")) {
      notFound();
    }

    const files = assets.map((item) => {
      const storageUrl = getUplinkPublicUrl(item.objectKey);
      if (!storageUrl) notFound();
      return {
        id: item.id,
        publicName: item.publicName,
        originalName: item.originalName,
        contentType: item.contentType,
        storageUrl,
      };
    });

    const batchPublicName =
      files.find((item) => !item.publicName.includes(batchId))?.publicName ??
      publicName;

    return <UplinkBatchFiles publicName={batchPublicName} files={files} />;
  }

  const storageUrl = getUplinkPublicUrl(asset.objectKey);
  if (!storageUrl) notFound();

  try {
    await storage.client.send(
      new HeadObjectCommand({ Bucket: asset.bucketName, Key: asset.objectKey }),
    );
  } catch (error) {
    if (error instanceof NotFound) {
      notFound();
    }

    if (error instanceof S3ServiceException) {
      throw new Error("There was a problem accessing this file from storage.");
    }

    throw new Error("Unable to serve this file right now.");
  }

  redirect(storageUrl);
};

export default UplinkAssetPage;
