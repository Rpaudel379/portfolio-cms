import { auth } from "@/lib/auth";
import { getPublicUrl } from "@/utils/supabase/file";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
  
  const url = new URL(request.url)

  if (url.pathname === '/resume') {
    const resume =
      (await getPublicUrl("resume.pdf", "resume_bucket")) || "/resume.pdf";
    return NextResponse.rewrite(new URL(resume));
  } 
  
  if (url.pathname === '/sde') {
    const resume =
      (await getPublicUrl("sde.pdf", "resume_bucket")) || "/sde.pdf";
    return NextResponse.rewrite(new URL(resume));
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/resume", "/sde", "/dashboard", "/dashboard/(.*)"],
};
