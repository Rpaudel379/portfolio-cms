"use server";

import { idSchema } from "@/schema/common.schema";
import {
  SkillSchema,
  skillSchema,
  SkillSchemaDTO,
  skillSchemaDTO,
} from "@/schema/skill.schema";
import { prisma } from "@/lib/prisma";
import { ServerActionState } from "@/types/common.types";
import { updateTag } from "next/cache";
import { handleErrorResponse } from "@/utils/error-response";

export const saveSkillAction = async (
  data: SkillSchema | SkillSchemaDTO,
): Promise<ServerActionState<null>> => {
  try {
    const isNew: boolean = !("id" in data);

    if (isNew) {
      const skill = skillSchema.parse(data);
      await prisma.skill.create({
        data: skill,
      });
    } else {
      const skill = skillSchemaDTO.parse(data);
      await prisma.skill.update({
        where: { id: skill.id },
        data: skill,
      });
    }

    updateTag("skills");
    return {
      status: "success",
      message: `Skill ${isNew ? "Created" : "Updated"}`,
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const deleteSkillAction = async (
  uuid: string,
): Promise<ServerActionState<null>> => {
  try {
    const id = idSchema.parse(uuid);

    await prisma.skill.delete({ where: { id: id } });

    updateTag("skills");
    return {
      status: "success",
      message: "Skill Deleted",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
