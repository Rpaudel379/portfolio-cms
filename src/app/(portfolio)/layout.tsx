import { BgDotGrid } from "@/components/animations/bg-dotgrid-wrapper";
import CursorFollower from "@/components/animations/cursor-follower";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <CursorFollower />
      <BgDotGrid />
      <section className="p-4">{children}</section>
    </>
  );
}
