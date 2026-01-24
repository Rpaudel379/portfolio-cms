import { ConfirmProvider } from "@/components/confirm-context";
import SidebarDashboard from "@/components/dashboard/sidebar/sidebar-dashboard";
import { SiteHeader } from "@/components/dashboard/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value || "true";

  const isDefaultOpen = sidebarState === "true";

  return (
    <ConfirmProvider>
      <SidebarProvider defaultOpen={isDefaultOpen}>
        <SidebarDashboard />
        <SidebarInset className="p-5">
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ConfirmProvider>
  );
}
