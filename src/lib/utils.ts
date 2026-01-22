import { StatusEmum } from "@/const";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case StatusEmum.LIVE:
      return "border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10";
    case StatusEmum.DEVELOPMENT:
    case StatusEmum.INPROGRESS:
      return "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10";
    case StatusEmum.MAINTENANCE:
      return "border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-500/10";
    case StatusEmum.ARCHIVED:
      return "border-gray-500/30 text-gray-600 dark:text-gray-400 bg-gray-500/10";
    default:
      return "border-primary/30 text-primary bg-primary/10";
  }
};

export const getStatusDot = (status: string) => {
  switch (status) {
    case StatusEmum.LIVE:
      return "bg-green-500";
    case StatusEmum.DEVELOPMENT:
    case StatusEmum.INPROGRESS:
      return "bg-blue-500";
    case StatusEmum.MAINTENANCE:
      return "bg-yellow-500";
    case StatusEmum.ARCHIVED:
      return "bg-gray-500";
    default:
      return "bg-primary";
  }
};

type FormatDateOptions = {
  fromNow?: boolean;
  format?: string;
};

export const formatDate = (date: string | Date, options: FormatDateOptions) => {
  dayjs.extend(relativeTime);

  if (options?.format) {
    return dayjs(date).format(options.format);
  } else if (options?.fromNow) {
    return dayjs(date).fromNow();
  }

  return dayjs(date).format();
};

export const downloadBlob = (
  data: BlobPart,
  fileName: string,
  type = "application/octet-stream",
) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName; // desired file name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};
