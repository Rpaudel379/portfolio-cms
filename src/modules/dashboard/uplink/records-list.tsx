"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

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
              <span className="font-medium text-foreground">{pendingCount}</span>{" "}
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
      const sourceLabel =
        sourceFilter === "SHARED" ? "shared" : "dashboard";

      return (
        <p className="border-b border-dashed border-border py-8 text-sm text-muted-foreground">
          No {sourceLabel} uploads yet.
        </p>
      );
    }

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
