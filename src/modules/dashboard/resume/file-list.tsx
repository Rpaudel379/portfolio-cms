"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Download, File, Files, Trash2 } from "lucide-react";
import { FileObject } from "@supabase/storage-js";
import { downloadBlob, formatDate, formatFileSize } from "@/lib/utils";
import {
  downloadObjectFromBucket,
  getPublicUrlFromBucket,
} from "@/app/(dashboard)/dashboard/resume/_actions";
import { toast } from "sonner";

export const FileList = ({
  file,
  type,
}: {
  file: FileObject | undefined;
  type: "resume" | "sde";
}) => {
  if (!file) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <File className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No file uploaded yet</p>
      </div>
    );
  }

  const handleDownload = async () => {
    const { data, error } = await downloadObjectFromBucket(file.name);
    if (error) {
      toast.error(error.message, {
        duration: 4000,
      });
    } else {
      downloadBlob(data!, file.name);
    }
  };

  const handleNameClick = async () => {
    console.log(file);
    const url = await getPublicUrlFromBucket(file.name);
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div
        onClick={handleNameClick}
        className="flex items-center space-x-3 flex-1 min-w-0 group"
      >
        <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate group-hover:underline">
            {file.name}
          </p>
          <div className="cursor-pointer flex flex-col lg:flex-row items-start space-x-2 text-xs text-muted-foreground">
            <span>{formatFileSize(file.metadata.size)}</span>
            <span className="hidden lg:block">•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDate(file.metadata.lastModified, { fromNow: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        {/* <Button
          variant="ghost"
          size="sm"
          //   onClick={() => handleDelete(file.name, type)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button> */}
      </div>
    </div>
  );
};
