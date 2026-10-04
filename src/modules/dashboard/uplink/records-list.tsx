import { UplinkRecordsEmptyState } from "./components/records-empty-state";
import { UplinkRecordCard } from "./components/record-card";
import type { UploadAssetDTO } from "./types";

type Props = {
  assets: UploadAssetDTO[];
  siteUrl: string;
};

const UplinkRecordsList = ({ assets, siteUrl }: Props) => {
  const readyCount = assets.filter((asset) => asset.status === "READY").length;
  const pendingCount = assets.length - readyCount;

  return (
    <section className="space-y-2">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Stored files
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Public routes and their source files.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">{readyCount}</span>{" "}
            ready
          </p>
          <p>
            <span className="font-medium text-foreground">{pendingCount}</span>{" "}
            pending
          </p>
        </div>
      </header>

      <UplinkRecordsContent assets={assets} siteUrl={siteUrl} />
    </section>
  );
};

type ContentProps = {
  assets: UploadAssetDTO[];
  siteUrl: string;
};

const UplinkRecordsContent = ({ assets, siteUrl }: ContentProps) => {
  if (assets.length === 0) {
    return <UplinkRecordsEmptyState />;
  }

  return (
    <div className="divide-y divide-border">
      {assets.map((asset) => (
        <UplinkRecordCard key={asset.id} asset={asset} siteUrl={siteUrl} />
      ))}
    </div>
  );
};

export { UplinkRecordsList };
