"use client";

import {
  completeGuestUplinkUpload,
  createGuestUplinkUploadUrl,
} from "@/app/(portfolio)/uplink/upload/[token]/_actions";
import { MAX_UPLINK_SINGLE_UPLOAD_BYTES } from "@/schema/uplink.schema";
import slugify from "slugify";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

const defaultPublicName = (fileName: string) => {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  const nameWithoutDots = nameWithoutExtension.replace(/\./g, " ");
  const slug = slugify(nameWithoutDots, { lower: true }).replace(/_/g, "-");

  return slug || "file";
};

const useGuestUplinkUpload = (token: string) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [publicName, setPublicName] = useState("");
  const [uploadPhase, setUploadPhase] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const isUploading = uploadPhase.length > 0;

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles[0]) {
      setPublicName(defaultPublicName(selectedFiles[0].name));
    }
  };

  const handlePublicNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPublicName(event.target.value);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (uploadedUrl) return;
    if (files.length === 0) {
      toast.error("Choose at least one file to upload");
      return;
    }
    const oversizedFile = files.find(
      (file) => file.size > MAX_UPLINK_SINGLE_UPLOAD_BYTES,
    );
    if (oversizedFile) {
      toast.error(`${oversizedFile.name} exceeds the single-upload size limit`);
      return;
    }

    try {
      setUploadPhase("Preparing upload…");
      const reservation = await createGuestUplinkUploadUrl(token, {
        publicName,
        files: files.map((file) => ({
          originalName: file.name,
          contentType: file.type || "application/octet-stream",
          size: file.size,
        })),
      });

      if (reservation.status !== "success" || !reservation.data) {
        toast.error(reservation.message || "Could not prepare the upload");
        return;
      }
      if (reservation.data.length !== files.length) {
        throw new Error("The server returned an incomplete set of upload URLs");
      }

      for (const [index, file] of files.entries()) {
        const upload = reservation.data[index];
        if (!upload) throw new Error("An upload URL is missing");

        setUploadPhase(`Uploading file ${index + 1} of ${files.length}…`);
        const contentType = file.type || "application/octet-stream";
        const response = await fetch(upload.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": contentType,
            "If-None-Match": "*",
          },
          body: file,
        });

        if (!response.ok && response.status !== 412) {
          throw new Error(`Upload failed for ${file.name} (${response.status})`);
        }
      }

      setUploadPhase("Verifying upload…");
      const completed = await completeGuestUplinkUpload(
        token,
        reservation.data.map(({ assetId }) => assetId),
      );
      if (
        completed.status !== "success" ||
        !completed.data ||
        completed.data.length !== files.length
      ) {
        toast.error(completed.message || "Could not verify the uploaded file");
        return;
      }

      setUploadedUrl(completed.data[0]?.storageUrl ?? null);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(files.length === 1 ? "File uploaded" : "Files uploaded");
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

  return {
    files,
    fileInputRef,
    handleFileSelect,
    handlePublicNameChange,
    handleUpload,
    isUploading,
    publicName,
    uploadPhase,
    uploadedUrl,
  };
};

export { useGuestUplinkUpload };
