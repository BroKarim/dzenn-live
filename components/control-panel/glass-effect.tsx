"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassEffect: React.FC<GlassEffectProps> = ({ children, className = "", style = {} }) => {
  const glassStyle = {
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  return (
    <div className={cn("relative transition-all border-none duration-700 backdrop-blur-lg ", className)} style={glassStyle}>
      {children}
    </div>
  );
};
