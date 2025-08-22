"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Code } from "lucide-react";
import { DesktopNav } from "@/components/navbar/desktop-nav";
import { MobileNav } from "@/components/navbar/mobile-nav";

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Navbar */}
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out rounded-[24px]",
          isScrolled
            ? "w-[95%] max-w-4xl bg-background/80 backdrop-blur-xl border shadow-lg shadow-black/5 dark:shadow-white/5"
            : "w-[95%] max-w-5xl bg-background/60 backdrop-blur-md border border-border/50"
        )}
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo with Name */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                  <Code />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Anish Paudel
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Software Engineer
                </span>
              </div>
            </Link>

            <DesktopNav items={navItems} pathname={pathname} />
            <MobileNav items={navItems} pathname={pathname} />
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-20" />
    </>
  );
};
