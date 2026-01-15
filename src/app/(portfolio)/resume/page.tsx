import { getPublicUrl } from "@/utils/supabase/file";
import { redirect } from "next/navigation";

const ResumePage = async () => {
  const resume =
    (await getPublicUrl("resume.pdf", "resume_bucket")) || "/resume.pdf";

  redirect(resume);
};

export default ResumePage;
