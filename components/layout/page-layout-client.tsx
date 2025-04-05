"use client";

/**
 * Page Layout Client Component
 * 
 * This component handles the theme-dependent aspects of the page layout.
 * It needs to be a Client Component because it uses the useTheme hook.
 */

import React from "react";
import { useTheme } from "@/lib/theme-context";
import { Navbar } from "@/components/custom/navbar";
import { DecorativeElements } from "@/components/layout/section-container";

interface PageLayoutClientProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  className?: string;
}

export function PageLayoutClient({ 
  children,
  showNavbar = true,
  className = ""
}: PageLayoutClientProps) {
  const { theme } = useTheme();
  
  // Theme-based background
  const bgClass = theme === 'light' 
    ? "bg-slate-50" 
    : "bg-[#0c1117]";
  
  return (
    <>
      {showNavbar && <Navbar />}
      <main className={`min-h-screen ${bgClass} ${className}`}>
        <DecorativeElements />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </>
  );
}
