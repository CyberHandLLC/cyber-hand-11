"use client";

/**
 * CircuitEffectsWrapperClient Component
 *
 * This client component wraps the dynamic import of CircuitEffects to handle
 * client-side loading with useEffect for better performance.
 * It's isolated as a Client Component to keep dynamic imports and
 * client-side logic separate from Server Components.
 *
 * Following Next.js 15.2.4 and React 19 best practices:
 * - Properly implements cleanup functions in useEffect hooks
 * - Uses error boundaries for Suspense boundaries
 * - Uses dynamic imports for code splitting
 */

import { useState, useEffect, ReactElement } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ContentErrorBoundaryClient } from "@/components/ui/client/error-boundary-client";

// Lazy-loaded circuit components for better performance
const CircuitEffects = dynamic(
  () => import("@/components/custom/circuit-effects").then((mod) => mod.CircuitEffects),
  {
    ssr: false,
    loading: (): ReactElement => (
      <div className="absolute inset-0 z-5 opacity-30 pointer-events-none" />
    ),
  }
);

export function CircuitEffectsWrapperClient(): ReactElement {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Only show circuit effects after component mounts
  // This improves initial page load performance
  useEffect(() => {
    // Set a small timeout to improve perceived performance
    const timerId = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    // Clean up timeout to prevent memory leaks in React 19 concurrency mode
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  if (!isLoaded) {
    return <></>; // Return empty fragment instead of null to satisfy ReactElement type
  }

  return (
    <ContentErrorBoundaryClient>
      <Suspense fallback={<div className="absolute inset-0 z-5 opacity-30 pointer-events-none" />}>
        <CircuitEffects />
      </Suspense>
    </ContentErrorBoundaryClient>
  );
}
