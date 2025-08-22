import z, { ZodError } from "zod";

type ErrorType = "form" | "field" | "general";

export const handleZodErrors = (
  err: ZodError,
  type?: ErrorType
): string | Record<string, string | string[]> => {
  const { formErrors, fieldErrors } = z.flattenError(err);
  const firstFormError = formErrors[0];
  const firstFieldError = (Object.values(fieldErrors)[0] as string[])?.[0];

  switch (type) {
    case "form":
      return firstFormError ?? "";

    case "field":
      return Object.keys(fieldErrors).length ? fieldErrors : {};

    case "general":
      return firstFormError ?? firstFieldError ?? "";

    default:
      return firstFormError ?? fieldErrors;
  }
};
