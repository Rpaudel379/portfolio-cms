import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";
import { GuestUplinkUploadForm } from "@/modules/uplink/components/guest-upload-form";
import UploadLinkUnavailable from "./upload-link-unavailable";

const UplinkUploadLinkPage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;

  const link = await prisma.uplinkUploadLink.findUnique({
    where: { token },
    select: { name: true, expiresAt: true, usedAt: true },
  });

  if (!link) notFound();

  const unavailable = link.usedAt
    ? {
        title: "This upload link has already been used",
        description: "Each shared upload link can be used only once.",
      }
    : link.expiresAt <= new Date()
      ? {
          title: "This upload link has expired",
          description: "Ask the person who shared it to create a new link.",
        }
      : null;

  if (unavailable) return <UploadLinkUnavailable {...unavailable} />;

  return (
    <GuestUplinkUploadForm
      linkName={link.name}
      siteUrl={siteConfig.url.replace(/\/+$/, "")}
      token={token}
    />
  );
};

export default UplinkUploadLinkPage;
