import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async () => {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (isAuthenticated) {
    redirect("/");
  }

  return redirectToSignIn();
};
