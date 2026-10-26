"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PublicNameField,
  UploadFileField,
  UploadSubmit,
} from "@/modules/dashboard/uplink/components/upload-fields";
import { useGuestUplinkUpload } from "@/modules/uplink/hooks/use-guest-uplink-upload";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Props = {
  linkName: string;
  siteUrl: string;
  token: string;
};

const GuestUplinkUploadForm = ({ linkName, siteUrl, token }: Props) => {
  const {
    files,
    fileInputRef,
    handleFileSelect,
    handlePublicNameChange,
    handleUpload,
    isUploading,
    publicName,
    uploadPhase,
    uploadedUrl,
  } = useGuestUplinkUpload(token);

  const publicUrl = `${siteUrl}/uplink/${encodeURIComponent(publicName)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  if (uploadedUrl) {
    return (
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border bg-card">
        <header className="border-b px-6 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Uplink / Shared upload
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Upload complete
          </h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Your upload is available at this link.
          </p>
        </header>
        <div className="flex flex-col gap-3 p-6 sm:flex-row">
          <Input
            aria-label="Uploaded file URL"
            readOnly
            value={publicUrl}
            className="h-11 font-mono text-sm"
          />
          <Button type="button" variant="outline" onClick={handleCopy}>
            <Copy aria-hidden="true" />
            Copy link
          </Button>
          <Button type="button" asChild>
            <a href={publicUrl} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              Open link
            </a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border bg-card">
      <header className="border-b px-6 py-5">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Uplink / Shared upload
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Upload files
        </h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Shared link: {linkName}
        </p>
      </header>
      <form onSubmit={handleUpload}>
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:gap-10">
          <UploadFileField
            files={files}
            inputRef={fileInputRef}
            isDisabled={isUploading}
            onFileSelect={handleFileSelect}
          />
          <PublicNameField
            publicName={publicName}
            siteUrl={siteUrl}
            isDisabled={isUploading}
            onChange={handlePublicNameChange}
          />
        </div>
        <UploadSubmit
          files={files}
          isUploading={isUploading}
          uploadPhase={uploadPhase}
        />
      </form>
    </section>
  );
};

export { GuestUplinkUploadForm };
