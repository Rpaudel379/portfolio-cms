"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { File, LoaderCircle, Trash2 } from "lucide-react";

import { useUplinkRecordActions } from "../hooks/use-uplink-record-actions";
import type { UploadAssetDTO } from "../types";
import { UplinkRecordAccess } from "./record-access";

type Props = {
  asset: UploadAssetDTO;
  siteUrl: string;
};

const STATUS_PRESENTATION = {
  READY: {
    label: "Ready",
    className:
      "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  },
  PENDING: {
    label: "Pending",
    className:
      "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400",
  },
} as const;

const SOURCE_PRESENTATION = {
  SHARED: {
    label: "Shared upload",
    className:
      "border-sky-600/30 bg-sky-600/10 text-sky-700 dark:text-sky-400",
  },
  DASHBOARD: {
    label: "Dashboard upload",
    className: "border-border bg-muted/40 text-muted-foreground",
  },
} as const;

const UplinkRecordCard = ({ asset, siteUrl }: Props) => {
  const { copyLink, handleDelete, isDeleting } =
    useUplinkRecordActions(asset);
  const portfolioUrl =
    siteUrl + "/uplink/" + encodeURIComponent(asset.publicName);
  const status = STATUS_PRESENTATION[asset.status];
  const source = SOURCE_PRESENTATION[asset.source];

  return (
    <article className="grid gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] lg:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
          <File aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 space-y-2">
          <h3 className="break-all text-sm font-semibold text-foreground">
            <span className="font-mono font-normal text-muted-foreground">
              /uplink/
            </span>
            {asset.publicName}
          </h3>
          <p className="break-all text-xs text-muted-foreground">
            {asset.originalName}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{asset.contentType}</span>
            <span>{formatFileSize(Number(asset.sizeBytes))}</span>
            <time dateTime={asset.createdAt}>
              {asset.createdAt.slice(0, 10)}
            </time>
          </div>
        </div>
      </div>

      <UplinkRecordAccess
        asset={asset}
        portfolioUrl={portfolioUrl}
        onCopyLink={copyLink}
      />

      <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="outline" className={source.className}>
            {source.label}
          </Badge>
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </div>
        <DeleteRecordButton
          publicName={asset.publicName}
          isDeleting={isDeleting}
          onDelete={handleDelete}
        />
      </div>
    </article>
  );
};

type DeleteRecordButtonProps = {
  publicName: string;
  isDeleting: boolean;
  onDelete: () => void;
};

const DeleteRecordButton = ({
  publicName,
  isDeleting,
  onDelete,
}: DeleteRecordButtonProps) => {
  const icon = isDeleting ? (
    <LoaderCircle className="animate-spin" />
  ) : (
    <Trash2 />
  );

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="shrink-0 text-destructive hover:text-destructive"
      aria-label={"Delete " + publicName}
      disabled={isDeleting}
      onClick={onDelete}
    >
      {icon}
    </Button>
  );
};

export { UplinkRecordCard };
