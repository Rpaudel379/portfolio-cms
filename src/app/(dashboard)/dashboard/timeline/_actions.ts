"use server";

import { prisma } from "@/lib/prisma";
import { idSchema } from "@/schema/common.schema";
import {
  TimelineSchema,
  timelineSchema,
  TimelineSchemaDTO,
  timelineSchemaDTO,
} from "@/schema/timeline.schema";
import { ServerActionState } from "@/types/common.types";
import { handleErrorResponse } from "@/utils/error-response";
import { updateTag } from "next/cache";

export const saveTimelineAction = async (
  data: TimelineSchema | TimelineSchemaDTO,
): Promise<ServerActionState<null>> => {
  try {
    const isNew: boolean = !("id" in data);
    if (isNew) {
      const timeline = timelineSchema.parse(data);
      await prisma.timeline.create({
        data: timeline,
      });
    } else {
      const timeline = timelineSchemaDTO.parse(data);
      await prisma.timeline.update({
        where: { id: timeline.id },
        data: timeline,
      });
    }

    updateTag("timeline");

    return {
      status: "success",
      message: `Timeline ${isNew ? "Created" : "Updated"}`,
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const bulkUpdateTimelineAction = async (
  orderedTimeline: (TimelineSchemaDTO & { order: number })[],
): Promise<ServerActionState<void>> => {
  try {
    await prisma.$transaction(
      orderedTimeline.map((timeline) =>
        prisma.timeline.update({
          where: { id: timeline.id },
          data: { order: timeline.order },
        }),
      ),
    );

    updateTag("timeline");
    return {
      status: "success",
      message: "Timeline Updated Successfully",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const deleteTimelineAction = async (
  uuid: string,
): Promise<ServerActionState<void>> => {
  try {
    const id = idSchema.parse(uuid);
    await prisma.timeline.delete({ where: { id: id } });

    updateTag("timeline");

    return {
      status: "success",
      message: "Timeline Deleted",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
