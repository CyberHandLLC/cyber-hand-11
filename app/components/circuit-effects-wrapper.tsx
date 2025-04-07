"use client";

/**
 * CircuitEffectsWrapper - Client Component
 * 
 * This component wraps the dynamic import of CircuitEffects to handle
 * client-side loading with useEffect for better performance.
 * It's isolated as a Client Component to keep dynamic imports and
 * client-side logic separate from Server Components.
 */

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy-loaded circuit components for better performance
const CircuitEffects = dynamic(
  () => import('@/components/custom/circuit-effects').then(mod => mod.CircuitEffects), 
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-5 opacity-30 pointer-events-none" />
  }
);

export function CircuitEffectsWrapper() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Only show circuit effects after component mounts
  // This improves initial page load performance
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <Suspense fallback={
      <div className="absolute inset-0 z-5 opacity-30 pointer-events-none" />
    }>
      <CircuitEffects />
    </Suspense>
  );
}
