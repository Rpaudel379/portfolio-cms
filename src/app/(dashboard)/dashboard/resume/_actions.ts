"use server";

import { ServerActionState } from "@/types/common.types";
import {
  downloadObject,
  existsObject,
  getPublicUrl,
  replaceObjectFromBucket,
  uploadFileToBucket,
} from "@/utils/supabase/file";
import { revalidatePath } from "next/cache";

const bucketName = "resume_bucket";

export const getPublicUrlFromBucket = async (path: string) => {
  return await getPublicUrl(path, bucketName);
};

export const downloadObjectFromBucket = async (path: string) => {
  const { data, error } = await downloadObject(path, bucketName);
  return { data, error };
};

export const replaceResume = async (
  file: File,
  type: "resume" | "sde"
): Promise<ServerActionState<void>> => {
  try {
    const extension = file.name.split(".").pop();
    if (extension !== "pdf") {
      return {
        status: "failed",
        message: `Resume must be ".pdf" type`,
        data: null,
        errors: null,
      };
    }
    const path = `${type}.${extension}`;

    const objectExists = await existsObject(path, bucketName);
    if (!objectExists) {
      //create
      const { error } = await uploadFileToBucket(file, bucketName, path);
      if (error) {
        throw error;
      }
    } else {
      // replace
      const { error } = await replaceObjectFromBucket(path, bucketName, file);

      if (error) {
        throw error;
      }
    }

    revalidatePath("/dashboard/resume");

    return {
      status: "success",
      message: `Resume saved`,
      data: null,
      errors: null,
    };
  } catch (error) {
    let messageResponse = "Something went wrong";
    let errorResponse = null;

    return {
      status: "failed",
      message: messageResponse,
      errors: errorResponse,
      data: null,
    };
  }
};
