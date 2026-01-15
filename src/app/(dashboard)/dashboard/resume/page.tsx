import { createClient } from "@/lib/supabase/server";

import { ResumePageClient } from "@/modules/dashboard/resume/main";
import { notFound } from "next/navigation";

const ResumePage = async () => {
  const supabase = await createClient();

  const { error: bucketError } = await supabase.storage.getBucket(
    "resume_bucket"
  );

  if (bucketError) {
    if (bucketError.message.toLowerCase().includes("not found")) {
      notFound();
    } else {
      throw bucketError.message;
    }
  }

  const { data: resumeList, error: listError } = await supabase.storage
    .from("resume_bucket")
    .list();

  if (listError) {
    throw listError.message;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
        <p className="text-muted-foreground">
          View your resumes or update them.
        </p>
        <p className="mt-5 text-xs text-muted-foreground">
          There are two areas to hold the resume.
        </p>
      </div>

      <ResumePageClient resumeList={resumeList} />
    </div>
  );
};

export default ResumePage;
