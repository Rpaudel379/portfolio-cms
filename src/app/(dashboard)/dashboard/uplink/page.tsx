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
          uploadLinkId: true,
          createdAt: true,
        },
      })
    : [];

  const linkRecords = isConfigured
    ? await prisma.uplinkUploadLink.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          token: true,
          createdAt: true,
          expiresAt: true,
          usedAt: true,
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
      source: asset.uploadLinkId ? ("SHARED" as const) : ("DASHBOARD" as const),
      createdAt: asset.createdAt.toISOString(),
    };
  });

  const now = new Date();
  const uploadLinks = linkRecords.map((link) => ({
    id: link.id,
    name: link.name,
    url: `${siteConfig.url.replace(/\/+$/, "")}/uplink/upload/${link.token}`,
    createdAt: link.createdAt.toISOString(),
    expiresAt: link.expiresAt.toISOString(),
    usedAt: link.usedAt?.toISOString() ?? null,
    status: link.usedAt
      ? ("USED" as const)
      : link.expiresAt <= now
        ? ("EXPIRED" as const)
        : ("ACTIVE" as const),
  }));

  return (
    <UplinkDashboard
      assets={assets}
      uploadLinks={uploadLinks}
      isConfigured={isConfigured}
      siteUrl={siteConfig.url.replace(/\/+$/, "")}
    />
  );
};

export default UplinkPage;
