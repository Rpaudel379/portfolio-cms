"use client";

import {
  AppError,
  ServerAction,
  UseEnhancedActionReturn,
} from "@/types/common.types";
import { useState } from "react";

type Props<TInput, TResult> = ServerAction<TInput, TResult>;

type ExtraProps = {
  onSuccess?: (message?: string) => void;
  onError?: (errors: AppError) => void;
  onLoading?: (loading?: boolean) => void;
};

export const useEnhancedAction = <TInput, TResult>(
  action: Props<TInput, TResult>,
  options?: ExtraProps,
): UseEnhancedActionReturn<TInput> => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (data: TInput) => {
    setIsLoading(true);
    options?.onLoading?.(true);
    try {
      const res = await action(data);
      if (res.status === "success") {
        options?.onSuccess?.(res.message);
      } else {
        options?.onError?.(res.errors);
      }
    } catch (error: unknown) {
      options?.onError?.({
        message: "Something went wrong, please try again",
        fieldError: null,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
      options?.onLoading?.(false);
    }
  };

  return {
    execute,
    isLoading,
  };
};
