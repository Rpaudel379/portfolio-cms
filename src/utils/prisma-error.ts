import { AppError } from "@/types/common.types";
import { Prisma } from "@prisma/client";

export const handlePrismaErrors = (
  error: Prisma.PrismaClientKnownRequestError,
): AppError => {
  switch (error.code) {
    case "P2002": {
      // unique constraint
      const target = (error?.meta?.target as string[]) || null;

      if (target) {
        return {
          message: "Duplicate value",
          fieldError: {
            [target[0]]: `${target[0]} already exists`,
          },
        };
      }
      return {
        message: "Duplicate value",
        fieldError: null,
      };
    }
    case "P2023": {
      return {
        message: "Invalid ID format",
        fieldError: null,
      };
    }
    default:
      return {
        message: "Bad Request",
        fieldError: null,
      };
  }
};
