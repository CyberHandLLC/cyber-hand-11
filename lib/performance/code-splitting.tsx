"use client";

/**
 * Code Splitting Utilities
 * 
 * This file provides utilities for dynamic imports and code splitting
 * using Next.js 15's built-in dynamic import function and React 19's error handling.
 * 
 * Simplified for Next.js 15 and React 19 - uses the react-error-boundary package
 * and aligns with modern React patterns for dynamic imports.
 */

import dynamic from 'next/dynamic';
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

// Default loading component
const DefaultLoading = () => (
  <div className="p-4 animate-pulse bg-card rounded-md min-h-[100px] flex items-center justify-center">
    <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Default error fallback component
const DefaultErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200">
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="text-sm mb-4">{error.message || "An unexpected error occurred"}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-3 py-1 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 rounded text-sm"
    >
      Try again
    </button>
  </div>
);

/**
 * Options for dynamic imports
 */
export interface DynamicImportOptions {
  /** Display name for the component (useful for debugging) */
  displayName?: string;
  /** Custom loading component */
  loading?: React.ReactNode;
  /** Whether to use server-side rendering */
  ssr?: boolean;
  /** Custom error fallback component */
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

/**
 * Create a dynamically imported component with standardized loading states.
 * This is a simplified wrapper around Next.js dynamic import that uses React 19 features.
 * 
 * @param importFn - Function that imports the component
 * @param options - Options for the dynamic import
 * @returns Dynamically imported component with error boundary
 */
export function createDynamicComponent<P extends Record<string, unknown> = Record<string, unknown>>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  options: DynamicImportOptions = {}
): React.ComponentType<P> {
  const {
    displayName,
    loading = <DefaultLoading />,
    ssr = false,
    errorFallback = DefaultErrorFallback
  } = options;

  // Create the Next.js dynamic component
  const DynamicComponent = dynamic(importFn, {
    loading: () => <>{loading}</>,
    ssr
  });

  // Set the display name for better debugging
  if (displayName) {
    DynamicComponent.displayName = `Dynamic(${displayName})`;
  }

  // Create the component with error boundary protection
  function ProtectedComponent(props: P) {
    return (
      <ReactErrorBoundary FallbackComponent={errorFallback}>
        <DynamicComponent {...props} />
      </ReactErrorBoundary>
    );
  }

  // Set the display name for the protected component
  ProtectedComponent.displayName = displayName ? `Protected(${displayName})` : 'ProtectedDynamicComponent';

  return ProtectedComponent;
}

/**
 * Re-export ErrorBoundary from react-error-boundary
 * This provides a consistent API while using the modern implementation
 * 
 * For modern Next.js applications, prefer using the built-in error.js files
 * for Server Components and this ErrorBoundary for Client Components
 */
export { ReactErrorBoundary as ErrorBoundary };
