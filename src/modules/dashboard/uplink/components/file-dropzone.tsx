"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatFileSize } from "@/lib/utils";
import { File as FileIcon, Upload } from "lucide-react";
import { useState } from "react";
import type { DragEvent, ChangeEventHandler, RefObject } from "react";

type Props = {
  files: File[];
  inputRef: RefObject<HTMLInputElement | null>;
  isDisabled: boolean;
  onFileSelect: (files: File[]) => void;
};

const FileDropzone = ({ files, inputRef, isDisabled, onFileSelect }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  let zoneStateClass = "border-border bg-muted/20";
  if (isDragging) {
    zoneStateClass = "border-primary bg-primary/5";
  } else if (isDisabled) {
    zoneStateClass += " opacity-60";
  } else {
    zoneStateClass += " hover:border-foreground/40";
  }
  const fileIcon = files.length ? (
    <FileIcon aria-hidden="true" className="size-5" />
  ) : (
    <Upload aria-hidden="true" className="size-5" />
  );

  let title = files.length
    ? `${files.length} ${files.length === 1 ? "file" : "files"} selected`
    : "Drop files here";
  let detail = files.length
    ? "Drop or browse to replace the selection."
    : "or browse your device";

  if (isDragging) {
    title = files.length
      ? "Drop to replace these files"
      : "Release to choose files";
    detail = files.length
      ? "The dropped files will replace the current selection."
      : "All dropped files will be uploaded together.";
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onFileSelect(Array.from(event.currentTarget.files ?? []));
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

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    if (inputRef.current) inputRef.current.value = "";
    onFileSelect(droppedFiles);
  };

  const renderFile = (file: File, index: number) => (
    <div
      key={`${file.name}-${index}`}
      className="flex items-start justify-between gap-3 text-xs"
    >
      <span className="min-w-0 break-all text-foreground">{file.name}</span>
      <span className="shrink-0 text-muted-foreground">
        {formatFileSize(file.size)}
      </span>
    </div>
  );

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
        multiple
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
        {files.length > 0 && (
          <div className="pointer-events-auto relative z-20 mt-3 w-full max-w-sm space-y-1 text-left">
            {files.slice(0, 5).map(renderFile)}
            {files.length > 5 && (
              <Popover>
                <PopoverTrigger className="text-xs text-primary underline underline-offset-4">
                  View all {files.length} files
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[32rem] max-w-[calc(100vw-2rem)] p-3"
                >
                  <p className="mb-2 text-sm font-medium">
                    Selected files ({files.length})
                  </p>
                  <ScrollArea className="h-48 pr-3">
                    <div className="space-y-1">{files.map(renderFile)}</div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
        <span id="uplink-dropzone-help" className="sr-only">
          Drop files here or activate this area to browse for files.
        </span>
      </div>
    </div>
  );
};

export { FileDropzone };
