"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import React, { createContext, useState, ReactNode, use } from "react";

type ConfirmContextType = {
  confirm: (message: string, onConfirm: () => Promise<void> | void) => void;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => Promise<void> | void>(
    () => {}
  );

  const confirm = (msg: string, callback: () => Promise<void> | void) => {
    setMessage(msg);
    setOnConfirm(() => callback);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    await onConfirm?.();
  };

  return (
    <ConfirmContext value={{ confirm }}>
      {children}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {message ? message : "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently change the
              data from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirm()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext>
  );
}

export function useConfirmContext() {
  const ctx = use(ConfirmContext);
  if (!ctx)
    throw new Error("useConfirmContext must be used inside ConfirmProvider");
  return ctx;
}
