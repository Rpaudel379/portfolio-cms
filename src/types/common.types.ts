export type ServerAction<TInput, TResult> = (
  data: TInput,
) => Promise<ServerActionState<TResult>>;

export type AppError = {
  message: string;
  fieldError: Record<string, string> | null;
} | null;

export type ServerActionState<T> = {
  status: "success" | "failed" | null;
  message: string;
  data?: T | null;
  values?: string | Record<string, string | string[] | Date | null | undefined>;
  errors: AppError;
};

export interface UseEnhancedActionReturn<TInput> {
  execute: (data: TInput) => Promise<void>;
  isLoading: boolean;
}

export const serverActionState: ServerActionState<null> = {
  status: null,
  message: "",
  data: null,
  errors: null,
};
