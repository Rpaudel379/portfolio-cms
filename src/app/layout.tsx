import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anish Paudel | Software Engineer",
  description:
    "Anish Paudel is a Software Engineer specialized in crafting digital experiences with reliable backend systems and  modern web technologies.",
  keywords: [
    "Anish Paudel",
    "Software Engineer",
    "Full Stack Developer",
    "Node.js Developer",
    "React Developer",
    "NextJS Developer",
    "Java Developer",
  ],
  authors: [{ name: "Anish Paudel", url: "https://anishsite.vercel.app/" }],
  creator: "Anish Paudel",
  openGraph: {
    title: "Anish Paudel | Software Engineer",
    description:
      "Portfolio of Anish Paudel - Software Engineer working with Node.js, React, Java and backend systems.",
    url: "https://anishsite.vercel.app/",
    siteName: "Anish Paudel Portfolio",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Suspense fallback={<FallbackLoading />}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}

export const FallbackLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="tracking-widest text-2xl md:text-5xl text-gray-500 animate-pulse">
        LOADING
      </p>
    </div>
  );
};
