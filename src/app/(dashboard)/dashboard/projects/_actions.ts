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
import { handlePrismaErrors } from "@/utils/prisma-error";
import {
  deleteObjectFromBucket,
  getPublicUrl,
  replaceObjectFromBucket,
  uploadFileToBucket,
} from "@/utils/supabase/file";
import { handleZodErrors } from "@/utils/zod-error";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export const saveProject = async (
  data: ProjectSchemaDTO | ProjectSchema
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
          "thumbnail_bucket"
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
            imageFile
          );
          if (!error) {
            const publicUrl = await getPublicUrl(
              data?.path!,
              "thumbnail_bucket"
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
            "thumbnail_bucket"
          );

          if (!error) {
            const publicUrl = await getPublicUrl(
              data?.path!,
              "thumbnail_bucket"
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

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");

    return {
      status: "success",
      message: `Project ${isNew ? "Created" : "Updated"}`,
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("inside create timeline PrismaClientKnownRequestError");
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

export const deleteProject = async (
  uuid: string
): Promise<ServerActionState<void>> => {
  try {
    const id = idSchema.parse(uuid);

    const project = await prisma.project.findFirstOrThrow({ where: { id } });

    await prisma.project.delete({ where: { id } });

    if (project.imagePath) {
      await deleteObjectFromBucket(project.imagePath, "thumbnail_bucket");
    }

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");

    return {
      status: "success",
      message: "Project Deleted",
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
