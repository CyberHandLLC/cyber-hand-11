"use client";

import React from "react";
import { useTheme } from "@/lib/theme-context";
import { Navbar } from "@/components/custom/navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  className?: string;
}

interface DecorativeElementsProps {
  className?: string;
}

// Extracting the decorative blobs and grid pattern into a reusable component
export const DecorativeElements: React.FC<DecorativeElementsProps> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    </div>
  );
};

// Main page layout component with common structure
export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  showNavbar = true,
  className = ""
}) => {
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
};

// Helper component for section containers
export const SectionContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={`px-4 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
};
