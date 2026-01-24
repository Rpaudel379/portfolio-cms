"use server";

import { prisma } from "@/lib/prisma";
import { idSchema } from "@/schema/common.schema";
import {
  ProjectSchema,
  projectSchema,
  projectSchemaDTO,
  ProjectSchemaDTO,
} from "@/schema/project.schema";
import { ServerActionState } from "@/types/common.types";
import { handleErrorResponse } from "@/utils/error-response";
import {
  deleteObjectFromBucket,
  getPublicUrl,
  replaceObjectFromBucket,
  uploadFileToBucket,
} from "@/utils/supabase/file";
import { updateTag } from "next/cache";

export const saveProjectAction = async (
  data: ProjectSchemaDTO | ProjectSchema,
): Promise<ServerActionState<void>> => {
  try {
    const isNew: boolean = !("id" in data);
    if (isNew) {
      const { imageFile, technologies, ...project } = projectSchema.parse(data);
      let thumbnail;
      let imageId;
      let imagePath;

      if (imageFile) {
        const { data, error } = await uploadFileToBucket(
          imageFile,
          "thumbnail_bucket",
        );

        if (!error) {
          const publicUrl = await getPublicUrl(data?.path!, "thumbnail_bucket");
          if (publicUrl.length) {
            thumbnail = publicUrl;
            imageId = data?.id;
            imagePath = data?.path;
          }
        }
      }

      await prisma.project.create({
        data: {
          ...project,
          technologies: { ...technologies },
          thumbnail,
          imageId,
          imagePath,
        },
      });
    } else {
      const { imageFile, technologies, createdAt, updatedAt, ...project } =
        projectSchemaDTO.parse(data);
      let thumbnail = project?.thumbnail;
      let imageId = project?.imageId;
      let imagePath = project?.imagePath;
      if (imageFile) {
        if (imagePath) {
          const { data, error } = await replaceObjectFromBucket(
            imagePath,
            "thumbnail_bucket",
            imageFile,
          );
          if (!error) {
            const publicUrl = await getPublicUrl(
              data?.path!,
              "thumbnail_bucket",
            );
            if (publicUrl.length) {
              thumbnail = publicUrl;
              imageId = data?.id;
              imagePath = data?.path;
            }
          }
        } else {
          const { data, error } = await uploadFileToBucket(
            imageFile,
            "thumbnail_bucket",
          );

          if (!error) {
            const publicUrl = await getPublicUrl(
              data?.path!,
              "thumbnail_bucket",
            );
            if (publicUrl.length) {
              thumbnail = publicUrl;
              imageId = data?.id;
              imagePath = data?.path;
            }
          }
        }
      }

      await prisma.project.update({
        where: { id: project.id },
        data: {
          ...project,
          technologies: { ...technologies },
          thumbnail,
          imageId,
          imagePath,
        },
      });
    }

    updateTag("projects");
    return {
      status: "success",
      message: `Project ${isNew ? "Created" : "Updated"}`,
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};

export const deleteProjectAction = async (
  uuid: string,
): Promise<ServerActionState<void>> => {
  try {
    const id = idSchema.parse(uuid);

    const project = await prisma.project.findFirstOrThrow({ where: { id } });

    await prisma.project.delete({ where: { id } });

    if (project.imagePath) {
      await deleteObjectFromBucket(project.imagePath, "thumbnail_bucket");
    }

    updateTag("projects");

    return {
      status: "success",
      message: "Project Deleted",
      data: null,
      errors: null,
    };
  } catch (error) {
    return handleErrorResponse(error);
  }
};
