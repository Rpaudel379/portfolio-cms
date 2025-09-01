"use server";

import { idSchema } from "@/schema/common.schema";
import { skillSchema, skillSchemaDTO } from "@/schema/skill.schema";
import { prisma } from "@/lib/prisma";
import { ServerActionState } from "@/types/common.types";
import { SaveSkill } from "@/types/skill.types";
import { handleZodErrors } from "@/utils/zod-error";
import { revalidatePath } from "next/cache";
import z, { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { handlePrismaErrors } from "@/utils/prisma-error";

export const saveSkill = async (
  data: SaveSkill
): Promise<ServerActionState<null>> => {
  try {
    const isNew: boolean = typeof data === "string";

    if (isNew) {
      const name = skillSchema.parse(data);

      await prisma.skill.create({
        data: { name },
      });
    } else {
      const { id, name } = skillSchemaDTO.parse(data);

      await prisma.skill.update({
        where: { id: id },
        data: {
          name,
        },
      });
    }

    revalidatePath("/dashboard/skills");
    revalidatePath("/about");
    return {
      status: "success",
      message: `Skill ${isNew ? "Created" : "Updated"}`,
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

    console.log("delete skill error");
    console.dir(error, { depth: null });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      messageResponse = handlePrismaErrors(error);
    }

    return {
      status: "failed",
      message: messageResponse,
      errors: errorResponse,
      data: null,
    };
  }
};

export const deleteSkill = async (
  uuid: string
): Promise<ServerActionState<null>> => {
  try {
    const id = idSchema.parse(uuid);

    await prisma.skill.delete({ where: { id: id } });

    revalidatePath("/dashboard/skills");
    revalidatePath("/about");

    return {
      status: "success",
      message: "Skill Deleted",
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      messageResponse = handlePrismaErrors(error);
    }

    return {
      status: "failed",
      message: messageResponse,
      errors: errorResponse,
      data: null,
    };
  }
};
