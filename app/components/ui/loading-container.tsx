/**
 * LoadingContainer Component - Server Component
 * 
 * A customizable loading container for Suspense boundaries.
 * This is a server component as it doesn't require interactivity.
 * 
 * @module components/ui/loading-container
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * LoadingContainerProps interface for type safety
 * Following Cyber Hand's Principle 3: Enforce Complete Type Safety
 */
export interface LoadingContainerProps {
  /** Classes to apply to the container */
  className?: string;
  /** Height of the container */
  height?: string;
  /** Whether to show a loading indicator */
  showSpinner?: boolean;
  /** Content to display alongside the loading indicator */
  label?: string;
}

/**
 * LoadingContainer for use in Suspense fallbacks
 * Provides a container with optional height and styling
 */
export function LoadingContainer({
  className,
  height = 'h-48',
  showSpinner = true,
  label,
}: LoadingContainerProps) {
  return (
    <div 
      className={cn(
        "w-full rounded-lg flex items-center justify-center bg-muted/30",
        height,
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      {/* 
        Note: We don't directly include the Spinner here to avoid
        importing a client component into a server component.
        The Spinner will be used in a client wrapper component.
      */}
      <div className="text-center">
        {label && <p className="text-sm text-muted-foreground mb-2">{label}</p>}
        {showSpinner && <div className="h-6 w-6" />}
      </div>
    </div>
  );
}
