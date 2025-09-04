export const dynamic = "force-static";

import { getPublicUrl } from "@/utils/supabase/file";
import { redirect } from "next/navigation";

const ResumePage = async () => {
  const resume = (await getPublicUrl("sde.pdf", "resume_bucket")) || "/sde.pdf";

  redirect(resume);
};

export default ResumePage;
