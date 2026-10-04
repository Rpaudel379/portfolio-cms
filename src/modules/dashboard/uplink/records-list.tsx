"use client";

import { deleteUplinkAsset } from "@/app/(dashboard)/dashboard/uplink/_actions";
import { useConfirm } from "@/components/confirm-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { formatFileSize } from "@/lib/utils";
import {
  Clock3,
  Copy,
  ExternalLink,
  File,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type UplinkAssetView = {
  id: string;
  publicName: string;
  originalName: string;
  contentType: string;
  sizeBytes: string;
  storageUrl: string;
  status: "PENDING" | "READY";
  createdAt: string;
};

type Props = {
  assets: UplinkAssetView[];
  siteUrl: string;
};

const UplinkRecordsList = ({ assets, siteUrl }: Props) => {
  const router = useRouter();
  const confirm = useConfirm();
  const readyCount = assets.filter((asset) => asset.status === "READY").length;
  const pendingCount = assets.length - readyCount;

  const { execute: remove, isLoading: isDeleting } = useEnhancedAction(
    deleteUplinkAsset,
    {
      onSuccess(message) {
        toast.success(message);
        router.refresh();
      },
      onError(error) {
        toast.error(error?.message || "Could not delete this file");
      },
    },
  );

  const handleDelete = async (asset: UplinkAssetView) => {
    await confirm({
      title: "Delete this file?",
      message: `This permanently removes ${asset.publicName} from R2 and deletes its reference.`,
      confirmText: "Delete file",
      cancelText: "Keep file",
      action: async () => remove(asset.id),
    });
  };

  const copyLink = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Stored files</h2>
          <p className="text-sm text-muted-foreground">
            {readyCount} ready · {pendingCount} pending
          </p>
        </div>
      </div>

      {assets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <File className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No files yet</p>
              <p className="text-sm text-muted-foreground">
                Upload a file to create its Uplink links.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {assets.map((asset) => {
            const portfolioUrl = `${siteUrl}/uplink/${encodeURIComponent(asset.publicName)}`;
            const isReady = asset.status === "READY";

            return (
              <Card key={asset.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="break-all">
                          {asset.publicName}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            isReady
                              ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                              : "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400"
                          }
                        >
                          {isReady ? "Ready" : "Pending"}
                        </Badge>
                      </div>
                      <CardDescription className="break-all">
                        Original file: {asset.originalName}
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      aria-label={`Delete ${asset.publicName}`}
                      disabled={isDeleting}
                      onClick={() => handleDelete(asset)}
                    >
                      {isDeleting ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{asset.contentType}</span>
                    <span>{formatFileSize(Number(asset.sizeBytes))}</span>
                    <time dateTime={asset.createdAt}>
                      {asset.createdAt.slice(0, 10)}
                    </time>
                  </div>

                  {isReady ? (
                    <div className="space-y-3">
                      <LinkRow
                        label="Portfolio link"
                        url={portfolioUrl}
                        onCopy={() => copyLink(portfolioUrl, "Portfolio link")}
                      />
                      <LinkRow
                        label="Direct storage link"
                        url={asset.storageUrl}
                        onCopy={() => copyLink(asset.storageUrl, "Storage link")}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                      <Clock3 className="size-4 shrink-0" />
                      <span>Access links are available after upload completes.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

type LinkRowProps = {
  label: string;
  url: string;
  onCopy: () => void;
};

const LinkRow = ({ label, url, onCopy }: LinkRowProps) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <div className="flex min-w-0 items-center gap-1 rounded-md border px-2 py-1">
      <Link
        className="min-w-0 flex-1 truncate text-sm text-primary hover:underline"
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
        aria-label={`Copy ${label.toLowerCase()}`}
        onClick={onCopy}
      >
        <Copy />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        aria-label={`Open ${label.toLowerCase()}`}
        asChild
      >
        <Link href={url} target="_blank" rel="noreferrer">
          <ExternalLink />
        </Link>
      </Button>
    </div>
  </div>
);

export { UplinkRecordsList };
