import { useConfirmContext } from "@/components/confirm-context";

export function useConfirmModal() {
  const { confirm } = useConfirmContext();

  const confirmAction = (Fn: () => Promise<void> | void, message: string) => {
    confirm(message, Fn);
  };

  return { confirmAction };
}
