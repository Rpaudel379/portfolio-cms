import type { SupabaseClient } from "@supabase/supabase-js";

type InitProps = {
  supabase: SupabaseClient;
};

export async function initSupabaseStorage({ supabase }: InitProps) {
  await createBucketIfNotExists(supabase, "resume_bucket", true);
  await createBucketIfNotExists(supabase, "thumbnail_bucket", true);
}

const createBucketIfNotExists = async (
  supabase: SupabaseClient,
  bucketName: string,
  publicBucket: boolean = false
) => {
  const { data: bucket, error: getError } = await supabase.storage.getBucket(
    bucketName
  );

  // If bucket exists, no action is needed
  if (bucket) return;

  // If an error other than "not found" occurred, throw or log
  if (getError && !getError.message.toLowerCase().includes("not found")) {
    console.error("Error retrieving bucket:", getError.message);
    process.exit(1);
  }

  // Create the bucket
  const { error: createError } = await supabase.storage.createBucket(
    bucketName,
    {
      public: publicBucket,
    }
  );

  if (createError) {
    console.error("Error creating bucket:", createError.message);
    process.exit(1);
  }
};
