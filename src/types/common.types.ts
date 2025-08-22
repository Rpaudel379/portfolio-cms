export type ServerAction<TInput, TResult> = (
  data: TInput
) => Promise<ServerActionState<TResult>>;

export type ServerActionState<T> = {
  status: "success" | "failed" | "null";
  message: string;
  values?: string | Record<string, string | string[] | Date>;
  data: T | null;
  errors: Record<string, string | string[]> | null;
};

export interface UseCustomActionReturn<TInput> {
  execute: (data: TInput) => Promise<void>;
  isLoading: boolean;
}
