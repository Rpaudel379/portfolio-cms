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
  const [file, setFile] = useState<File | null>(null);
  const [publicName, setPublicName] = useState("");
  const [uploadPhase, setUploadPhase] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const isUploading = uploadPhase.length > 0;

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) setPublicName(defaultPublicName(selectedFile.name));
  };

  const handlePublicNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPublicName(event.target.value);
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (uploadedUrl) return;
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
      const reservation = await createGuestUplinkUploadUrl(token, {
        publicName,
        originalName: file.name,
        contentType,
        size: file.size,
      });

      if (reservation.status !== "success" || !reservation.data) {
        toast.error(reservation.message || "Could not prepare the upload");
        return;
      }

      setUploadPhase("Uploading to storage…");
      const response = await fetch(reservation.data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
          "If-None-Match": "*",
        },
        body: file,
      });

      if (!response.ok && response.status !== 412) {
        throw new Error("Upload failed (" + response.status + ")");
      }

      setUploadPhase("Verifying upload…");
      const completed = await completeGuestUplinkUpload(
        token,
        reservation.data.assetId,
      );
      if (completed.status !== "success" || !completed.data) {
        toast.error(completed.message || "Could not verify the uploaded file");
        return;
      }

      setUploadedUrl(completed.data.storageUrl);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("File uploaded");
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
    file,
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
