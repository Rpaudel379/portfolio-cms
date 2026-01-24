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
import { Loader2 } from "lucide-react";
import { createContext, useState, ReactNode, use } from "react";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  action?: () => Promise<void>;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();
  const [loading, setLoading] = useState(false);
  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = async () => {
    if (!options) return;

    if (options.action) {
      try {
        setLoading(true);
        await options.action();
        resolver?.(true);
        cleanup();
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      resolver?.(true);
      cleanup();
    }
  };

  const handleCancel = () => {
    if (loading) return;
    resolver?.(false);
    cleanup();
  };

  const cleanup = () => {
    setOptions(null);
    setResolver(undefined);
    setLoading(false);
  };

  return (
    <ConfirmContext value={{ confirm }}>
      {children}

      {options && (
        <AlertDialog open={options ? true : false}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {options?.title || "Are you absolutely sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {options?.message ||
                  "This action cannot be undone. This will permanently change the data from our server."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleCancel()}>
                {options?.cancelText || "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleConfirm()}
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" />}
                {options?.confirmText || "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ConfirmContext>
  );
}

export function useConfirm() {
  const ctx = use(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx.confirm;
}
