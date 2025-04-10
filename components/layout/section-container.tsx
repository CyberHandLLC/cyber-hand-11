/**
 * Section Container - Server Component
 *
 * A simple layout container component that provides consistent padding and width constraints.
 * This is a pure UI component with no client-side dependencies, making it an ideal Server Component.
 */

import React from "react";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ children, className = "" }: SectionContainerProps) {
  return <div className={`px-4 max-w-7xl mx-auto ${className}`}>{children}</div>;
}

/**
 * Decorative Elements - Server Component
 *
 * Renders static decorative UI elements like blobs and grid patterns.
 * This has no interactive elements or state dependencies.
 */

interface DecorativeElementsProps {
  className?: string;
}

export function DecorativeElements({ className = "" }: DecorativeElementsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    </div>
  );
}
