/**
 * Page Layout Module
 * 
 * This file uses a hybrid approach to React Server Components:
 * - It re-exports the Server Components from the layout directory
 * - It provides the PageLayout component which intelligently chooses
 *   between Server and Client implementations based on needs
 */

import React from "react";
import { PageLayoutClient } from "@/components/layout/page-layout-client";
import { SectionContainer as ServerSectionContainer, DecorativeElements } from "@/components/layout/section-container";

export { DecorativeElements };

/**
 * Page Layout Properties
 */
interface PageLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  className?: string;
}

/**
 * Main page layout component with common structure
 * 
 * This is a Server Component that delegates to the Client Component
 * for theme-dependent rendering. This architecture allows for progressive
 * enhancement and better performance.
 */
export function PageLayout({ 
  children,
  showNavbar = true,
  className = ""
}: PageLayoutProps) {
  return (
    <PageLayoutClient
      showNavbar={showNavbar}
      className={className}
    >
      {children}
    </PageLayoutClient>
  );
}

/**
 * SectionContainer - A simple layout container component
 * 
 * This is a direct re-export of the Server Component from the layout directory.
 * @see components/layout/section-container.tsx
 */
export const SectionContainer = ServerSectionContainer;
