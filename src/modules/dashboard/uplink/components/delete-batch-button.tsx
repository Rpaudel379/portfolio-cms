"use client";

import { deleteUplinkBatch } from "@/app/(dashboard)/dashboard/uplink/_actions";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/confirm-context";
import { useEnhancedAction } from "@/hooks/use-enhanced-action";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  batchId: string;
  publicName: string;
  fileCount: number;
};

const DeleteBatchButton = ({ batchId, publicName, fileCount }: Props) => {
  const router = useRouter();
  const confirm = useConfirm();
  const fileLabel = fileCount === 1 ? "file" : "files";
  const { execute: removeBatch, isLoading } = useEnhancedAction(
    deleteUplinkBatch,
    {
      onSuccess(message) {
        toast.success(message);
        router.refresh();
      },
      onError(error) {
        toast.error(error?.message || "Could not delete this upload batch");
      },
    },
  );

  const handleDelete = () =>
    confirm({
      title: "Delete this upload batch?",
      message:
        `This permanently deletes ${fileCount} ${fileLabel} in “${publicName}” ` +
        "and removes their public URLs.",
      confirmText: "Delete batch",
      cancelText: "Keep batch",
      action: async () => removeBatch(batchId),
    });

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="shrink-0 text-destructive hover:text-destructive"
      disabled={isLoading}
      onClick={handleDelete}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <Trash2 />
      )}
      Delete batch
    </Button>
  );
};

export { DeleteBatchButton };
