import { createClient } from "@/lib/supabase/client";
import Thumbnail from "@/modules/dashboard/storage/thumbnail";
import { FileObject } from "@supabase/storage-js";
import React from "react";

type Props = {
  list: FileObject[];
  bucketName: string;
};

export const ThumbnailContainer = async ({ list, bucketName }: Props) => {
  const supabase = createClient();

  const getThumbnails = async (list: FileObject[], bucketName: string) => {
    const thumbnails = await Promise.all(
      list.map(async (obj) => {
        const { data } = supabase.storage
          .from(bucketName)
          .getPublicUrl(obj.name);
        return {
          url: data.publicUrl,
          id: obj.id,
          name: obj.name,
          mimetype: obj.metadata?.mimetype,
        };
      })
    );

    return thumbnails;
  };

  const thumbnails = await getThumbnails(list, bucketName);
  return (
    <div className="border-2 bg-secondary px-5 py-10 md:px-10 md:py-20 rounded-lg flex gap-5 flex-wrap">
      {thumbnails.map((thumbnail) => (
        <Thumbnail key={thumbnail.id} object={thumbnail} />
      ))}
    </div>
  );
};
