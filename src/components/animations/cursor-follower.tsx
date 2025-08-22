"use client";
import React, { useEffect, useState } from "react";

type Props = {};

const CursorFollower = (props: Props) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed w-6 h-6 bg-primary/20 dark:bg-primary/40 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
        transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
      }}
    />
  );
};

export default CursorFollower;
