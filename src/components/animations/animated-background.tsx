"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-gradient-slow" />

      {/* Floating orbs - enhanced for dark mode */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-purple-500/20 dark:from-primary/30 dark:to-purple-500/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-pink-500/15 to-orange-500/15 dark:from-pink-500/25 dark:to-orange-500/25 rounded-full blur-2xl animate-pulse" />

      {/* Grid pattern - enhanced for dark mode */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
}
