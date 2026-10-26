import { UplinkRecordsList } from "@/modules/dashboard/uplink/records-list";

import { UplinkConfigurationNotice } from "./components/configuration-notice";
import { UplinkUploadForm } from "./components/upload-form";
import { UplinkUploadLinks } from "./components/upload-links";
import type { UploadAssetDTO, UploadLinkDTO } from "./types";

type Props = {
  assets: UploadAssetDTO[];
  uploadLinks: UploadLinkDTO[];
  isConfigured: boolean;
  siteUrl: string;
};

export const UplinkDashboard = ({
  assets,
  uploadLinks,
  isConfigured,
  siteUrl,
}: Props) => (
  <main className="mx-auto w-full max-w-7xl space-y-10">
    <header className="border-b border-border pb-6">
      <h1 className="text-3xl font-semibold tracking-tight">Uplink</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        Give each file a stable address on your portfolio, with a direct R2 link
        ready alongside it.
      </p>
    </header>

    <UplinkDashboardContent
      assets={assets}
      uploadLinks={uploadLinks}
      isConfigured={isConfigured}
      siteUrl={siteUrl}
    />
  </main>
);

const UplinkDashboardContent = ({
  assets,
  uploadLinks,
  isConfigured,
  siteUrl,
}: Props) => {
  if (!isConfigured) {
    return <UplinkConfigurationNotice />;
  }

  return (
    <div className="space-y-8">
      <UplinkUploadForm siteUrl={siteUrl} />
      <UplinkUploadLinks links={uploadLinks} />
      <UplinkRecordsList assets={assets} siteUrl={siteUrl} />
    </div>
  );
};
