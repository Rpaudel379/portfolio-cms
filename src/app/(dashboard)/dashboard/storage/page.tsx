import { createClient } from "@/lib/supabase/server";
import { IconBucket } from "@tabler/icons-react";
// import { initSupabaseStorage } from "@/utils/supabase/storage";
import Link from "next/link";
import React from "react";

type Props = {};

const StoragePage = async (props: Props) => {
  const supabase = await createClient();
  // initSupabaseStorage({ supabase });
  const buckets = await supabase.storage.listBuckets();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Storage</h1>
        <p className="text-muted-foreground">View all your saved files</p>
      </div>

      <div className="border-2 bg-secondary px-5 py-10 md:px-10 md:py-20 rounded-lg flex gap-5 flex-wrap">
        {buckets.data?.map((bucket) => (
          <div
            key={bucket.id}
            className="cursor-pointer bg-neutral-200 hover:bg-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-700 px-5 py-3 flex items-center space-x-2 rounded-lg "
          >
            <IconBucket />
            <Link href={`/dashboard/storage/${bucket.name}`}>
              {bucket.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoragePage;
