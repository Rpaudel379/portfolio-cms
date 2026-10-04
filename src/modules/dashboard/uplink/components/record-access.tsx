import { Button } from "@/components/ui/button";
import { Clock3, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";

import type { UploadAssetDTO } from "../types";

type UplinkRecordAccessProps = {
  asset: UploadAssetDTO;
  portfolioUrl: string;
  onCopyLink: (url: string, label: string) => Promise<void>;
};

const UplinkRecordAccess = ({
  asset,
  portfolioUrl,
  onCopyLink,
}: UplinkRecordAccessProps) => {
  if (asset.status === "PENDING") {
    return (
      <div className="flex items-center gap-2 border-l-2 border-amber-600/40 bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
        <Clock3 aria-hidden="true" className="size-4 shrink-0" />
        <span>Access links are available after upload completes.</span>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
      <LinkRow
        label="Portfolio link"
        url={portfolioUrl}
        onCopy={() => onCopyLink(portfolioUrl, "Portfolio link")}
      />
      <LinkRow
        label="Direct storage link"
        url={asset.storageUrl}
        onCopy={() => onCopyLink(asset.storageUrl, "Storage link")}
      />
    </div>
  );
};

type LinkRowProps = {
  label: string;
  url: string;
  onCopy: () => void;
};

const LinkRow = ({ label, url, onCopy }: LinkRowProps) => (
  <div className="min-w-0 border-l-2 border-border pl-3">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <div className="mt-1 flex min-w-0 items-center gap-1">
      <Link
        className="min-w-0 flex-1 truncate font-mono text-xs text-primary hover:underline"
        href={url}
        target="_blank"
        rel="noreferrer"
        title={url}
      >
        {url}
      </Link>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-8"
        aria-label={"Copy " + label.toLowerCase()}
        onClick={onCopy}
      >
        <Copy />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        aria-label={"Open " + label.toLowerCase()}
        asChild
      >
        <Link href={url} target="_blank" rel="noreferrer">
          <ExternalLink />
        </Link>
      </Button>
    </div>
  </div>
);

export { UplinkRecordAccess };
