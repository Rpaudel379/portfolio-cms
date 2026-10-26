"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { DeleteBatchButton } from "./components/delete-batch-button";
import { UplinkRecordsEmptyState } from "./components/records-empty-state";
import { UplinkRecordCard } from "./components/record-card";
import type { UploadAssetDTO } from "./types";

type SourceFilter = "ALL" | UploadAssetDTO["source"];

type Props = {
  assets: UploadAssetDTO[];
  siteUrl: string;
};

const UplinkRecordsList = ({ assets, siteUrl }: Props) => {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("ALL");
  const filteredAssets =
    sourceFilter === "ALL"
      ? assets
      : assets.filter((asset) => asset.source === sourceFilter);
  const readyCount = filteredAssets.filter(
    (asset) => asset.status === "READY",
  ).length;
  const pendingCount = filteredAssets.length - readyCount;

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
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">{readyCount}</span>{" "}
              ready
            </p>
            <p>
              <span className="font-medium text-foreground">
                {pendingCount}
              </span>{" "}
              pending
            </p>
          </div>
          <Select
            value={sourceFilter}
            onValueChange={(value) => setSourceFilter(value as SourceFilter)}
          >
            <SelectTrigger
              aria-label="Filter stored files by upload source"
              className="w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All sources</SelectItem>
              <SelectItem value="SHARED">Shared uploads</SelectItem>
              <SelectItem value="DASHBOARD">Dashboard uploads</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <UplinkRecordsContent
        assets={filteredAssets}
        hasAssets={assets.length > 0}
        sourceFilter={sourceFilter}
        siteUrl={siteUrl}
      />
    </section>
  );
};

type ContentProps = {
  assets: UploadAssetDTO[];
  hasAssets: boolean;
  sourceFilter: SourceFilter;
  siteUrl: string;
};

const UplinkRecordsContent = ({
  assets,
  hasAssets,
  sourceFilter,
  siteUrl,
}: ContentProps) => {
  if (assets.length === 0) {
    if (hasAssets) {
      const sourceLabel = sourceFilter === "SHARED" ? "shared" : "dashboard";

      return (
        <p className="border-b border-dashed border-border py-8 text-sm text-muted-foreground">
          No {sourceLabel} uploads yet.
        </p>
      );
    }

    return <UplinkRecordsEmptyState />;
  }

  const groups = Array.from(
    Map.groupBy(assets, (asset) => asset.batchId ?? asset.id),
    ([id, batchAssets]) => ({
      id,
      batchId: batchAssets[0]?.batchId ?? null,
      assets: batchAssets,
    }),
  );

  return (
    <div className="space-y-3">
      {groups.map(({ id, batchId, assets: batchAssets }) => {
        if (!batchId) {
          return (
            <div key={id} className="border-b border-border">
              {batchAssets.map((asset) => (
                <UplinkRecordCard
                  key={asset.id}
                  asset={asset}
                  siteUrl={siteUrl}
                />
              ))}
            </div>
          );
        }

        const publicName =
          batchAssets.find((asset) => !asset.publicName.includes(batchId))
            ?.publicName ?? batchAssets[0]?.publicName ?? "";

        return (
          <section
            key={id}
            className="overflow-hidden rounded-xl border border-border bg-muted/20"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <h3 className="break-all text-sm font-semibold">{publicName}</h3>
                <p className="text-xs text-muted-foreground">
                  {batchAssets.length}{" "}
                  {batchAssets.length === 1 ? "file" : "files"}
                </p>
              </div>
              <DeleteBatchButton
                batchId={batchId}
                publicName={publicName}
                fileCount={batchAssets.length}
              />
            </header>
            <div className="divide-y divide-border px-4">
              {batchAssets.map((asset) => (
                <UplinkRecordCard
                  key={asset.id}
                  asset={asset}
                  siteUrl={siteUrl}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export { UplinkRecordsList };
