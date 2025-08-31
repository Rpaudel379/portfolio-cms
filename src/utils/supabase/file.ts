import { createClient } from "@/lib/supabase/server";

export const uploadFileToBucket = async (file: File, bucketName: string) => {
  const supabase = await createClient();
  const imageName = Date.now() + file.name;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(imageName, file);

  return { data, error };
};

export const getPublicUrl = async (object: string, bucket: string) => {
  const supabase = await createClient();

  const { data } = supabase.storage.from(bucket).getPublicUrl(object);
  return data.publicUrl;
};
