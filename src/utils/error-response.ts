import { AppError } from "@/types/common.types";
import { handlePrismaErrors } from "@/utils/prisma-error";
import { handleZodErrors } from "@/utils/zod-error";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export const handleErrorResponse = (error: unknown) => {
  const response = {
    status: "failed" as const,
    message: "Something went wrong, Please try again!",
    errors: {
      message: "failed to perform request!",
      fieldError: null,
    } as AppError,
    data: null,
  };

  if (error instanceof ZodError) {
    response.message = "Bad Request";
    response.errors = handleZodErrors(error);
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    response.message = "Bad Request";
    response.errors = handlePrismaErrors(error);
  } else {
    console.dir(error, { depth: null }); // log only unexpected errors
  }

  return response;
};
