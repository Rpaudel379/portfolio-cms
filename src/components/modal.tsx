import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  containerClassName?: string;
  title?: string;
  description?: string;
  hideClose?: boolean;
  content: React.ReactNode;
  onCancel?: () => void;
};

const Modal = ({
  open,
  onOpenChange,
  containerClassName,
  title,
  description,
  content,
  onCancel,
}: Props) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onCancel?.();
    }
    onOpenChange && onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("block space-y-5", containerClassName)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
