import { createClient } from "@/lib/supabase/server";

export const existsObject = async (path: string, bucket: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from(bucket).exists(path);

  return data;
};

export const uploadFileToBucket = async (
  file: File,
  bucketName: string,
  name?: string
) => {
  const supabase = await createClient();
  const imageName = name ? name : Date.now() + file.name;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(imageName, file);

  return { data, error };
};

export const getPublicUrl = async (path: string, bucket: string) => {
  const supabase = await createClient();

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const replaceObjectFromBucket = async (
  path: string,
  bucket: string,
  file: File
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .update(path, file);

  return { data, error };
};

export const deleteObjectFromBucket = async (path: string, bucket: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  return { data, error };
};

export const downloadObject = async (path: string, bucket: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from(bucket).download(path);

  return { data, error };
};
