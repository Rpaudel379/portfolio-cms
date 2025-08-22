import { Prisma } from "@prisma/client";

export const handlePrismaErrors = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  let messageResponse = "";
  if (error.code === "P2002") {
    messageResponse = "Skill already exists";
  } else if (error.code === "P2023") {
    messageResponse = "The skill id is not correct";
  } else {
    messageResponse = "Database validation failed";
  }

  return messageResponse;
};
