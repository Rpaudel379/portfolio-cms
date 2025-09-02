import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw Error("supabase keys must be in the enviroment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createBucketIfNotExists = async (
  bucketName: string,
  publicBucket: boolean = false
) => {
  const { data: bucket, error: getError } = await supabase.storage.getBucket(
    bucketName
  );

  // If bucket exists, no action is needed
  if (bucket) {
    console.log(`Bucket: "${bucket.name}" exists`);
    return;
  }

  // If an error other than "not found" occurred, throw or log
  if (getError && !getError.message.toLowerCase().includes("not found")) {
    console.error("Error retrieving bucket:", getError.message);
    return;
  }

  // Create the bucket
  const { data: newBucket, error: createError } =
    await supabase.storage.createBucket(bucketName, {
      public: publicBucket,
    });

  if (newBucket) {
    console.log(`Bucket: "${newBucket.name}" created`);
  }

  if (createError) {
    console.error("Error creating bucket:", createError.message);
    return;
  }
};
export async function initSupabaseStorage() {
  await createBucketIfNotExists("resume_bucket", true);
  await createBucketIfNotExists("thumbnail_bucket", true);
}

initSupabaseStorage();
