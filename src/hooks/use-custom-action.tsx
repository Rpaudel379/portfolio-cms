import { ServerAction, UseCustomActionReturn } from "@/types/common.types";
import { useState } from "react";

type Props<TInput, TResult> = ServerAction<TInput, TResult>;

type ExtraProps = {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export const useCustomAction = <TInput, TResult>(
  action: Props<TInput, TResult>,
  options?: ExtraProps
): UseCustomActionReturn<TInput> => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (data: TInput) => {
    setIsLoading(true);

    try {
      const res = await action(data);
      if (res.status === "success") {
        if (options?.onSuccess) {
          options.onSuccess(res.message);
        }
      } else {
        if (options?.onError) {
          options?.onError(res.message);
        }
      }
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
  };
};
