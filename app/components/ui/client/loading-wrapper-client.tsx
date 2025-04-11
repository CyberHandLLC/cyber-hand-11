'use client';

/**
 * LoadingWrapperClient Component - Client Component
 * 
 * A client-side wrapper for loading states that includes the spinner.
 * This follows Cyber Hand's principle of keeping client components at leaf nodes.
 * 
 * @module components/ui/client/loading-wrapper-client
 */

import React from 'react';
import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

/**
 * LoadingWrapperClientProps interface for type safety
 */
export interface LoadingWrapperClientProps {
  /** Classes to apply to the container */
  className?: string;
  /** Height of the container */
  height?: string;
  /** Text to display with the spinner */
  label?: string;
  /** Size of the spinner */
  spinnerSize?: number;
}

/**
 * Client component for loading states with spinner animation
 * Use this in Suspense boundaries for interactive loading UI
 */
export function LoadingWrapperClient({
  className,
  height = 'h-48',
  label = 'Loading content...',
  spinnerSize = 24,
}: LoadingWrapperClientProps) {
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
      <Spinner 
        size={spinnerSize} 
        text={label} 
        textPosition="bottom"
      />
    </div>
  );
}
