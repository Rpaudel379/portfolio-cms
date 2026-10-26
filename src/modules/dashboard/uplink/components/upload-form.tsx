"use client";

import { useUplinkUpload } from "../hooks/use-uplink-upload";
import {
  PublicNameField,
  UploadFileField,
  UploadSubmit,
} from "./upload-fields";

type Props = {
  siteUrl: string;
};

const UplinkUploadForm = ({ siteUrl }: Props) => {
  const {
    files,
    fileInputRef,
    handleFileSelect,
    handlePublicNameChange,
    handleUpload,
    isUploading,
    publicName,
    uploadPhase,
  } = useUplinkUpload();

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <header className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight">Add files</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Upload files directly to R2 and give them public addresses.
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

export { UplinkUploadForm };
