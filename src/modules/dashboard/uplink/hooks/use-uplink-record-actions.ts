"use client";

import { deleteUplinkAsset } from "@/app/(dashboard)/dashboard/uplink/_actions";
import { useConfirm } from "@/components/confirm-context";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { UploadAssetDTO } from "../types";

const useUplinkRecordActions = (asset: UploadAssetDTO) => {
  const router = useRouter();
  const confirm = useConfirm();

  const { execute: remove, isLoading: isDeleting } = useEnhancedAction(
    deleteUplinkAsset,
    {
      onSuccess(message) {
        toast.success(message);
        router.refresh();
      },
      onError(error) {
        toast.error(error?.message || "Could not delete this file");
      },
    },
  );

  const handleDelete = async () => {
    await confirm({
      title: "Delete this file?",
      message:
        "This permanently removes " +
        asset.publicName +
        " from R2 and deletes its reference.",
      confirmText: "Delete file",
      cancelText: "Keep file",
      action: async () => remove(asset.id),
    });
  };

  const copyLink = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(label + " copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return { copyLink, handleDelete, isDeleting };
};

export { useUplinkRecordActions };
