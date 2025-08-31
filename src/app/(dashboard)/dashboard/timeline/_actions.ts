"use server";

import { prisma } from "@/lib/prisma";
import { idSchema } from "@/schema/common.schema";
import { timelineSchema, timeSchemaDTO } from "@/schema/timeline.schema";
import { ServerActionState } from "@/types/common.types";
import { handlePrismaErrors } from "@/utils/prisma-error";
import { handleZodErrors } from "@/utils/zod-error";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export const saveTimeline = async (
  _: any,
  data: FormData
): Promise<ServerActionState<void>> => {
  try {
    const rawTimeline = Object.fromEntries(data);
    const isNew: boolean = !rawTimeline?.id;

    if (isNew) {
      const timeline = timelineSchema.parse(rawTimeline);
      await prisma.timeline.create({
        data: timeline,
      });
    } else {
      const { createdAt, updatedAt, ...timeline } =
        timeSchemaDTO.parse(rawTimeline);
      await prisma.timeline.update({
        where: { id: timeline.id },
        data: timeline,
      });
    }

    revalidatePath("/dashboard/timeline");

    return {
      status: "success",
      message: `Timeline ${isNew ? "Created" : "Updated"}`,
      data: null,
      errors: null,
    };
  } catch (error) {
    let messageResponse = "Something went wrong";
    let errorResponse = null;

    if (error instanceof ZodError) {
      const err = handleZodErrors(error);
      if (typeof err == "string") {
        messageResponse = err;
      } else {
        errorResponse = err;
      }
    }

    console.log("create timeline error");
    console.dir(error, { depth: null });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("inside create timeline PrismaClientKnownRequestError");
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

export const deleteTimeline = async (
  uuid: string
): Promise<ServerActionState<void>> => {
  try {
    const id = idSchema.parse(uuid);
    await prisma.timeline.delete({ where: { id: id } });

    revalidatePath("/dashboard/timeline");

    return {
      status: "success",
      message: "Timeline Deleted",
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
