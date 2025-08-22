"use client";

import DotGrid from "@/components/animations/bg-dotgrid";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export const BgDotGrid = () => {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const getColors = (mode?: string) =>
    mode === "dark"
      ? { baseColor: "#171717", activeColor: "#5227FF" }
      : { baseColor: "#f5f5f5", activeColor: "#5227FF" };

  const [colors, setColors] = useState<{
    baseColor: string;
    activeColor: string;
  }>(() => getColors(currentTheme));

  useEffect(() => {
    setColors(getColors(currentTheme));
  }, [currentTheme]);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <DotGrid
        dotSize={5}
        gap={20}
        baseColor={colors.baseColor}
        activeColor={colors.activeColor}
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />
    </div>
  );
};
