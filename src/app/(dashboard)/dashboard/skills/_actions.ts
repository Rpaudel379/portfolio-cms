"use server";

import { idSchema } from "@/dto/common.schema";
import { SkillSchema, skillSchema, skillSchemaDTO } from "@/dto/skill.schema";
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
    // new skill
    if (typeof data === "string") {
      const name = skillSchema.parse(data);

      const saveSkill = await prisma.skill.create({
        data: { name },
      });

      console.log(saveSkill);
    } else {
      const { id, name } = skillSchemaDTO.parse(data);

      const updateSkill = await prisma.skill.update({
        where: { id: id },
        data: {
          name,
        },
      });

      console.log(updateSkill);
    }

    revalidatePath("/dashboard/skills");
    return {
      status: "success",
      message: `Skill ${typeof data === "string" ? "Created" : "Updated"}`,
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

export const deleteSkill = async (
  uuid: string
): Promise<ServerActionState<null>> => {
  try {
    const id = idSchema.parse(uuid);

    await prisma.skill.delete({ where: { id: id } });

    revalidatePath("/dashboard/skills");
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
