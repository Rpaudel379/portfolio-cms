"use server";

import {
  contactSchema,
  ContactSchema,
  ContactSchemaDTO,
  contactSchemaDTO,
} from "@/schema/contact.schema";
import { prisma } from "@/lib/prisma";
import { ServerActionState } from "@/types/common.types";
import { updateTag } from "next/cache";
import { handleErrorResponse } from "@/utils/error-response";

export const updateContactInfoAction = async (
  data: ContactSchema | ContactSchemaDTO,
): Promise<ServerActionState<null>> => {
  try {
    const isNew: boolean = !("id" in data);
    if (isNew) {
      const contact = contactSchema.parse(data);
      await prisma.contact.create({
        data: contact,
      });
    } else {
      const contact = contactSchemaDTO.parse(data);
      await prisma.contact.update({
        where: { id: contact.id },
        data: contact,
      });
    }

    updateTag("contact");
    return {
      status: "success",
      message: "Contact Info updated",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
