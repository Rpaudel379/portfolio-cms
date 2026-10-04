import {
  HeadObjectCommand,
  NotFound,
  S3ServiceException,
} from "@aws-sdk/client-s3";
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
    select: { bucketName: true, objectKey: true, status: true },
  });

  if (!asset || asset.status !== "READY") notFound();

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
