"use client";

import { Input } from "@/components/ui/input";
import { cn, formatFileSize } from "@/lib/utils";
import { File as FileIcon, Upload } from "lucide-react";
import { useState } from "react";
import type { DragEvent, ChangeEventHandler, RefObject } from "react";

type Props = {
  file: File | null;
  inputRef: RefObject<HTMLInputElement | null>;
  isDisabled: boolean;
  onFileSelect: (file: File | null) => void;
};

const FileDropzone = ({ file, inputRef, isDisabled, onFileSelect }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  let zoneStateClass = "border-border bg-muted/20";
  if (isDragging) {
    zoneStateClass = "border-primary bg-primary/5";
  } else if (isDisabled) {
    zoneStateClass += " opacity-60";
  } else {
    zoneStateClass += " hover:border-foreground/40";
  }
  const fileIcon = file ? (
    <FileIcon aria-hidden="true" className="size-5" />
  ) : (
    <Upload aria-hidden="true" className="size-5" />
  );

  let title = file?.name || "Drop a file here";
  let detail = file
    ? formatFileSize(file.size) + ". Drop or browse to replace it."
    : "or browse your device";

  if (isDragging) {
    title = file ? "Drop to replace this file" : "Release to choose this file";
    detail = file
      ? "The dropped file will replace the current selection."
      : "One file will be uploaded.";
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onFileSelect(event.currentTarget.files?.[0] ?? null);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDisabled) setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;

    const droppedFile = event.dataTransfer.files.item(0);
    if (!droppedFile) return;

    if (inputRef.current) inputRef.current.value = "";
    onFileSelect(droppedFile);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-dashed transition-colors",
        zoneStateClass,
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Input
        ref={inputRef}
        id="uplink-file"
        type="file"
        disabled={isDisabled}
        onChange={handleInputChange}
        aria-describedby="uplink-file-help uplink-dropzone-help"
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      <div className="pointer-events-none flex min-h-52 flex-col items-center justify-center px-5 py-8 text-center peer-focus-visible:rounded-xl peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
        <span className="mb-4 flex size-11 items-center justify-center rounded-lg border bg-background text-foreground">
          {fileIcon}
        </span>
        <span
          aria-live="polite"
          className="max-w-full break-all text-sm font-medium text-foreground"
        >
          {title}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">{detail}</span>
        <span id="uplink-dropzone-help" className="sr-only">
          Drop one file here or activate this area to browse for a file.
        </span>
      </div>
    </div>
  );
};

export { FileDropzone };
