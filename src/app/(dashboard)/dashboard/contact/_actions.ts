"use server";

import {
  ContactSchema,
  ContactSchemaDTO,
  contactSchemaDTO,
} from "@/schema/contact.schema";
import { prisma } from "@/lib/prisma";
import { ServerActionState } from "@/types/common.types";
import { handleZodErrors } from "@/utils/zod-error";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export const updateContactInfo = async (
  data: ContactSchemaDTO
): Promise<ServerActionState<null>> => {
  try {
    const contactInfo = contactSchemaDTO.parse(data);

    const saveContactInfo = await prisma.contact.update({
      where: { id: contactInfo.id },
      data: contactInfo,
    });

    console.log(saveContactInfo);

    revalidatePath("/dashboard/contact");
    return {
      status: "success",
      message: "Contact Info updated",
      data: null,
      errors: null,
    };
  } catch (error) {
    let messageResponse = "Something went wrong";
    let errorResponse = null;

    if (error instanceof ZodError) {
      const err = handleZodErrors(error, "general") as string;
      messageResponse = err;
    }

    console.log("update contact error");
    console.dir(error, { depth: null });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.dir(error, { depth: null });
      if (error.code === "P2002") {
        messageResponse = "Skill already exists";
      } else if (error.code === "P2023") {
        messageResponse = "The skill id is not correct";
      } else {
        messageResponse = "Database validation failed";
      }
    }

    return {
      status: "failed",
      message: messageResponse,
      errors: errorResponse,
      data: null,
    };
  }
};
