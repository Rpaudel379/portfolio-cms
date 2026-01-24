import { AppError } from "@/types/common.types";
import z, { ZodError } from "zod";

export const handleZodErrors = (err: ZodError): AppError => {
  const { formErrors, fieldErrors } = z.flattenError(err);
  const message = formErrors[0] || "Bad Request";

  if (Object.keys(fieldErrors).length) {
    const errors: Record<string, string> = {};
    Object.entries(fieldErrors).forEach(([field, error]) => {
      errors[field] = (error as string)[0];
    });

    return {
      message,
      fieldError: errors,
    };
  }
  return {
    message,
    fieldError: null,
  };
};
