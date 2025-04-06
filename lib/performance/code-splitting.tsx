"use client";

/**
 * Code Splitting Utilities
 * 
 * This file provides utilities for dynamic imports and code splitting
 * using Next.js's built-in dynamic import function.
 */

import dynamic from 'next/dynamic';
import React from 'react';

// Default loading component
const DefaultLoading = () => (
  <div className="p-4 animate-pulse bg-card rounded-md min-h-[100px] flex items-center justify-center">
    <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
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
}

/**
 * Create a dynamically imported component with standardized loading states.
 * This is a wrapper around Next.js dynamic import with performance monitoring.
 * 
 * @param importFn - Function that imports the component
 * @param options - Options for the dynamic import
 * @returns Dynamically imported component
 */
export function createDynamicComponent<T extends React.ComponentType<P>, P = object>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): React.ComponentType<P> {
  const {
    displayName,
    loading = <DefaultLoading />,
    ssr = false
  } = options;

  // Use Next.js built-in dynamic import
  const DynamicComponent = dynamic(importFn, {
    loading: () => <>{loading}</>,
    ssr
  });

  // Set display name for better debugging
  if (displayName) {
    DynamicComponent.displayName = `Dynamic(${displayName})`;
  }

  return DynamicComponent;
}

/**
 * Error boundary component for handling errors in dynamic imports
 */
export class ErrorBoundary extends React.Component<
  { 
    children: React.ReactNode;
    fallback: React.ReactNode;
  },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
