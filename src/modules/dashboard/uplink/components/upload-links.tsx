"use client";

import {
  createUplinkUploadLink,
  deleteUplinkUploadLink,
} from "@/app/(dashboard)/dashboard/uplink/_actions";
import { useConfirm } from "@/components/confirm-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemGroup } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Link2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import type { UploadLinkDTO } from "../types";
import { formatDateTime } from "../utils";
import { UploadLinkItem } from "./upload-link-item";

const EXPIRY_UNITS = {
  minutes: { label: "minutes", minutes: 1, min: 5, max: 7200 },
  hours: { label: "hours", minutes: 60, min: 1, max: 120 },
  days: { label: "days", minutes: 1440, min: 1, max: 5 },
} as const;

type Props = {
  links: UploadLinkDTO[];
};

const UplinkUploadLinks = ({ links }: Props) => {
  const router = useRouter();
  const confirm = useConfirm();

  const [name, setName] = useState("");
  const [expiryAmount, setExpiryAmount] = useState("5");
  const [expiryUnit, setExpiryUnit] =
    useState<keyof typeof EXPIRY_UNITS>("minutes");

  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    expiresAt: string;
  } | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);

    try {
      const result = await createUplinkUploadLink({
        name,
        expiresInMinutes:
          Number(expiryAmount) * EXPIRY_UNITS[expiryUnit].minutes,
      });

      if (result.status !== "success" || !result.data) {
        toast.error(result.message || "Could not create the upload link");
        return;
      }

      setGeneratedLink({
        url: result.data.url,
        expiresAt: result.data.expiresAt,
      });
      setName("");
      router.refresh();

      try {
        await navigator.clipboard.writeText(result.data.url);
        toast.success("Upload link created and copied");
      } catch {
        toast.success("Upload link created. Copy it below.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not create the upload link",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Upload link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const handleDelete = async (link: UploadLinkDTO) => {
    const confirmed = await confirm({
      title: "Delete this upload link?",
      message: `“${link.name}” will be removed from this list. Any uploaded file will remain available. This cannot be undone.`,
      confirmText: "Delete link",
      cancelText: "Keep link",
    });
    if (!confirmed) return;

    try {
      const result = await deleteUplinkUploadLink(link.id);
      if (result.status !== "success") {
        toast.error(result.message || "Could not delete the upload link");
        router.refresh();
        return;
      }

      toast.success("Upload link deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete the upload link",
      );
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-start gap-4 border-b border-border px-5 py-5 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-700/20 bg-emerald-700/5 text-emerald-800 dark:text-emerald-300">
          <Link2 aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Let someone upload a file
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create a one-use link. It expires after the time you choose, up to
            five days.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 bg-muted/20 p-5 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.6fr)_auto] md:items-end"
      >
        <div className="space-y-2">
          <Label htmlFor="uplink-link-name">Link name</Label>
          <Input
            id="uplink-link-name"
            value={name}
            maxLength={100}
            placeholder="For example, design files"
            autoComplete="off"
            required
            onChange={(event) => setName(event.target.value)}
            disabled={isCreating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uplink-link-expiry">Expires after</Label>
          <div className="flex gap-2">
            <Input
              id="uplink-link-expiry"
              type="number"
              min={EXPIRY_UNITS[expiryUnit].min}
              max={EXPIRY_UNITS[expiryUnit].max}
              value={expiryAmount}
              required
              onChange={(event) => setExpiryAmount(event.target.value)}
              disabled={isCreating}
            />
            <Select
              value={expiryUnit}
              onValueChange={(value) =>
                setExpiryUnit(value as keyof typeof EXPIRY_UNITS)
              }
              disabled={isCreating}
            >
              <SelectTrigger aria-label="Expiry unit" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXPIRY_UNITS).map(([value, unit]) => (
                  <SelectItem key={value} value={value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={isCreating || !name.trim()}>
          {isCreating ? (
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <Link2 aria-hidden="true" />
          )}
          {isCreating ? "Creating…" : "Create link"}
        </Button>
      </form>

      {generatedLink && (
        <div
          aria-live="polite"
          className="border-t border-emerald-700/20 bg-emerald-700/[0.04] px-5 py-4 sm:px-6"
        >
          <Label htmlFor="uplink-new-link">New upload link</Label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              id="uplink-new-link"
              value={generatedLink.url}
              readOnly
              onFocus={(event) => event.currentTarget.select()}
              className="font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => handleCopy(generatedLink.url)}
            >
              <Copy aria-hidden="true" />
              Copy link
            </Button>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Expires {formatDateTime(generatedLink.expiresAt)}. You can copy it
            again from the list below.
          </p>
        </div>
      )}

      <div className="border-t border-border px-5 py-5 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-semibold">Generated links</h3>
          <span className="text-sm text-muted-foreground">
            {links.length} {links.length === 1 ? "link" : "links"}
          </span>
        </div>

        {links.length === 0 ? (
          <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
            No upload links yet. Create one to let someone send you a file.
          </p>
        ) : (
          <ItemGroup className="mt-3 gap-2">
            {links.map((link) => (
              <UploadLinkItem
                key={link.id}
                link={link}
                onCopy={handleCopy}
                onDelete={() => handleDelete(link)}
              />
            ))}
          </ItemGroup>
        )}
      </div>
    </section>
  );
};

export { UplinkUploadLinks };
