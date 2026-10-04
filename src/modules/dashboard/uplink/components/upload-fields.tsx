import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_UPLINK_SINGLE_UPLOAD_BYTES } from "@/schema/uplink.schema";
import { LoaderCircle, Upload } from "lucide-react";
import type { ChangeEventHandler, RefObject } from "react";

import { FileDropzone } from "./file-dropzone";

type UploadFileFieldProps = {
  file: File | null;
  inputRef: RefObject<HTMLInputElement | null>;
  isDisabled: boolean;
  onFileSelect: (file: File | null) => void;
};

const UploadFileField = ({
  file,
  inputRef,
  isDisabled,
  onFileSelect,
}: UploadFileFieldProps) => (
  <div className="space-y-3">
    <Label htmlFor="uplink-file">File</Label>
    <FileDropzone
      file={file}
      inputRef={inputRef}
      isDisabled={isDisabled}
      onFileSelect={onFileSelect}
    />
    <p id="uplink-file-help" className="text-xs text-muted-foreground">
      One file, up to{" "}
      {(MAX_UPLINK_SINGLE_UPLOAD_BYTES / 1024 ** 3).toFixed(3)} GiB.
    </p>
  </div>
);

type PublicNameFieldProps = {
  publicName: string;
  siteUrl: string;
  isDisabled: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const PublicNameField = ({
  publicName,
  siteUrl,
  isDisabled,
  onChange,
}: PublicNameFieldProps) => {
  const linkName = publicName
    ? encodeURIComponent(publicName)
    : "your-file";
  const linkNameClassName = publicName
    ? "text-foreground"
    : "text-muted-foreground";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="uplink-public-name">Public link name</Label>
        <p className="text-sm leading-5 text-muted-foreground">
          Choose the last part of your portfolio URL.
        </p>
      </div>
      <Input
        id="uplink-public-name"
        value={publicName}
        onChange={onChange}
        placeholder="link name"
        maxLength={180}
        disabled={isDisabled}
        aria-describedby="uplink-public-name-help"
        className="h-11"
      />
      <p
        id="uplink-public-name-help"
        className="text-xs leading-5 text-muted-foreground"
      >
        Use letters, numbers, dots, underscores, and hyphens.
      </p>
      <div className="border-l-2 border-foreground bg-muted/30 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          Portfolio link
        </p>
        <p className="mt-2 break-all font-mono text-xs leading-5 text-foreground">
          <span className="text-muted-foreground">{siteUrl}</span>
          <span>/uplink/</span>
          <span className={linkNameClassName}>{linkName}</span>
        </p>
      </div>
    </div>
  );
};

type UploadSubmitProps = {
  file: File | null;
  isUploading: boolean;
  uploadPhase: string;
};

const UploadSubmit = ({
  file,
  isUploading,
  uploadPhase,
}: UploadSubmitProps) => {
  const uploadLabel = isUploading ? "Uploading…" : "Upload file";
  const uploadIcon = isUploading ? (
    <LoaderCircle className="animate-spin" />
  ) : (
    <Upload />
  );

  return (
    <div className="flex flex-wrap items-center gap-3 border-t px-6 py-4">
      <Button type="submit" disabled={!file || isUploading}>
        {uploadIcon}
        {uploadLabel}
      </Button>

      {isUploading && (
        <span className="text-sm text-muted-foreground" role="status">
          {uploadPhase}
        </span>
      )}
    </div>
  );
};

export { PublicNameField, UploadFileField, UploadSubmit };
