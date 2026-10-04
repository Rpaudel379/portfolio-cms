import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { getUplinkConfig, getUplinkPublicUrl } from "@/lib/uplink/config";
import { UplinkDashboard } from "@/modules/dashboard/uplink";

const UplinkPage = async () => {
  const isConfigured = getUplinkConfig() !== null;

  const records = isConfigured
    ? await prisma.uplinkAsset.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          publicName: true,
          originalName: true,
          contentType: true,
          size: true,
          objectKey: true,
          status: true,
          createdAt: true,
        },
      })
    : [];

  const assets = records.map((asset) => {
    const storageUrl = getUplinkPublicUrl(asset.objectKey);
    if (!storageUrl) {
      throw new Error("Uplink storage is not configured");
    }

    return {
      id: asset.id,
      publicName: asset.publicName,
      originalName: asset.originalName,
      contentType: asset.contentType,
      sizeBytes: asset.size.toString(),
      storageUrl,
      status: asset.status,
      createdAt: asset.createdAt.toISOString(),
    };
  });

  return (
    <UplinkDashboard
      assets={assets}
      isConfigured={isConfigured}
      siteUrl={siteConfig.url.replace(/\/+$/, "")}
    />
  );
};

export default UplinkPage;
