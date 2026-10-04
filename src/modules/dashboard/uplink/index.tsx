"use client";

import {
  completeUplinkUpload,
  createUplinkUploadUrl,
} from "@/app/(dashboard)/dashboard/uplink/_actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatFileSize } from "@/lib/utils";
import {
  UplinkRecordsList,
  type UplinkAssetView,
} from "@/modules/dashboard/uplink/records-list";
import { MAX_UPLINK_SINGLE_UPLOAD_BYTES } from "@/schema/uplink.schema";
import { LoaderCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { toast } from "sonner";

type Props = {
  assets: UplinkAssetView[];
  isConfigured: boolean;
  siteUrl: string;
};

const defaultPublicName = (fileName: string) => {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  const nameWithoutDots = nameWithoutExtension.replace(/\./g, " ")
  const slug = slugify(nameWithoutDots, {
    lower: true,
  }).replace(/_/g, "-");
  
  return slug || "file";
};

const UplinkDashboard = ({ assets, isConfigured, siteUrl }: Props) => {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [publicName, setPublicName] = useState("");
  const [uploadPhase, setUploadPhase] = useState("");
  const isUploading = uploadPhase.length > 0;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    if (selectedFile) setPublicName(defaultPublicName(selectedFile.name));
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast.error("Choose a file to upload");
      return;
    }
    if (file.size > MAX_UPLINK_SINGLE_UPLOAD_BYTES) {
      toast.error("This file exceeds the single-upload size limit");
      return;
    }

    try {
      setUploadPhase("Preparing upload…");
      const contentType = file.type || "application/octet-stream";
      const reservation = await createUplinkUploadUrl({
        publicName,
        originalName: file.name,
        contentType,
        size: file.size,
      });

      if (reservation.status !== "success" || !reservation.data) {
        toast.error(reservation.message || "Could not prepare the upload");
        return;
      }

      setUploadPhase("Uploading to R2…");
      const uploadResponse = await fetch(reservation.data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`R2 upload failed (${uploadResponse.status})`);
      }

      setUploadPhase("Verifying upload…");
      const completed = await completeUplinkUpload(reservation.data.assetId);
      if (completed.status !== "success") {
        toast.error(completed.message || "Could not verify the uploaded file");
        return;
      }

      toast.success("File added to Uplink");
      setFile(null);
      setPublicName("");
      if (fileInput.current) fileInput.current.value = "";
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The upload could not be completed",
      );
    } finally {
      setUploadPhase("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Uplink</h1>
        <p className="text-muted-foreground">
          Upload public files to R2 and manage their access links.
        </p>
      </div>

      {!isConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle>Uplink is not configured</CardTitle>
            <CardDescription>
              Add the R2 environment settings and public storage domain to
              enable uploads.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Add a file</CardTitle>
              <CardDescription>
                The file uploads from your browser directly to R2. The link name
                is the final URL segment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleUpload}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="uplink-file">File</Label>
                    <Input
                      ref={fileInput}
                      id="uplink-file"
                      type="file"
                      disabled={isUploading}
                      onChange={handleFileChange}
                    />
                    {file && (
                      <p className="text-xs text-muted-foreground">
                        {file.name} · {formatFileSize(file.size)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uplink-public-name">Public link name</Label>
                    <Input
                      id="uplink-public-name"
                      value={publicName}
                      onChange={(event) => setPublicName(event.target.value)}
                      placeholder="link name"
                      maxLength={180}
                      disabled={isUploading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use letters, numbers, dots, underscores, and hyphens. The
                      single-upload limit is{" "}
                      {(MAX_UPLINK_SINGLE_UPLOAD_BYTES / 1024 ** 3).toFixed(3)}{" "}
                      GiB.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={!file || isUploading}>
                    {isUploading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Upload />
                    )}
                    {isUploading ? uploadPhase : "Upload file"}
                  </Button>
                  {isUploading && (
                    <span
                      className="text-sm text-muted-foreground"
                      role="status"
                    >
                      {uploadPhase}
                    </span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <UplinkRecordsList assets={assets} siteUrl={siteUrl} />
        </>
      )}
    </div>
  );
};

export { UplinkDashboard };
