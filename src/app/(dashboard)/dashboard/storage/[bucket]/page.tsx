import { createClient } from "@/lib/supabase/server";
import { ThumbnailContainer } from "@/modules/dashboard/storage/thumbnail-container";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ bucket: string }>;
};

const BucketPage = async ({ params }: Props) => {
  const bucketName = (await params).bucket;
  const supabase = await createClient();

  const { error: bucketError } = await supabase.storage.getBucket(bucketName);
  if (bucketError) {
    if (bucketError.message.toLowerCase().includes("not found")) {
      notFound();
    } else {
      throw bucketError.message;
    }
  }

  const { error: listError, data: list } = await supabase.storage
    .from(bucketName)
    .list();

  if (listError) {
    throw listError.message;
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-xl">Bucket Name: {bucketName}</h1>
      </div>

      <ThumbnailContainer list={list} bucketName={bucketName} />
    </div>
  );
};

export default BucketPage;
