import { ConfirmProvider } from "@/components/confirm-context";
import SidebarDashboard from "@/components/dashboard/sidebar/sidebar-dashboard";
import { SiteHeader } from "@/components/dashboard/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard Page",
  description: "Dashboard page visible only after logging in",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isDefaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ClerkProvider>
      <ConfirmProvider>
        <SidebarProvider defaultOpen={isDefaultOpen}>
          <SidebarDashboard />
          <SidebarInset className="p-5">
            <SiteHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ConfirmProvider>
    </ClerkProvider>
  );
}
