"use client";

import {
  completeUplinkUpload,
  createUplinkUploadUrl,
} from "@/app/(dashboard)/dashboard/uplink/_actions";
import { MAX_UPLINK_SINGLE_UPLOAD_BYTES } from "@/schema/uplink.schema";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

const defaultPublicName = (fileName: string) => {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  const nameWithoutDots = nameWithoutExtension.replace(/\./g, " ");
  const slug = slugify(nameWithoutDots, {
    lower: true,
  }).replace(/_/g, "-");

  return slug || "file";
};

const useUplinkUpload = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [publicName, setPublicName] = useState("");
  const [uploadPhase, setUploadPhase] = useState("");
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
        throw new Error("R2 upload failed (" + uploadResponse.status + ")");
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
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  return {
    file,
    fileInputRef,
    handleFileSelect,
    handlePublicNameChange,
    handleUpload,
    isUploading,
    publicName,
    uploadPhase,
  };
};

export { useUplinkUpload };
