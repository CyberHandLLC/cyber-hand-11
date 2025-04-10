"use client";

/**
 * Deferred Loading Utilities
 *
 * This module provides utilities for deferring the loading of non-critical UI components.
 * It helps improve initial page load performance by:
 * 1. Delaying non-critical component hydration until after the page is interactive
 * 2. Implementing prioritized loading based on viewport visibility
 * 3. Tracking loading metrics for performance analysis
 *
 * Modernized for React 19 and Next.js 15 - leverages React hooks, Suspense, and
 * modern browser APIs (Intersection Observer, Performance API) for improved user experience.
 */

import React, { useEffect, useState, useRef } from "react";

// Add TypeScript declarations for requestIdleCallback and cancelIdleCallback
declare global {
  interface Window {
    requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}
import { usePerformanceMetrics, METRIC_NAMES } from "@/lib/performance/performance-metrics";

/**
 * Options for deferred loading
 */
interface DeferredLoadingOptions {
  /** Delay in milliseconds before loading (default: 0) */
  delay?: number;
  /** Whether to load only when the component is visible in viewport */
  loadOnlyWhenVisible?: boolean;
  /** Priority level for loading (higher loads sooner) */
  priority?: "low" | "medium" | "high";
  /** Performance metric name for tracking */
  metricName?: string;
}

/**
 * Modern hook for deferred loading of non-critical components
 * Leverages React 19 improvements and modern browser APIs
 *
 * @param options - Configuration options
 * @returns Object with shouldRender state and containerRef for visibility detection
 */
export function useDeferredLoading(options: DeferredLoadingOptions = {}) {
  const { delay = 0, loadOnlyWhenVisible = false, priority = "medium", metricName } = options;

  const [shouldRender, setShouldRender] = useState(false);
  const reportWebVitals = usePerformanceMetrics();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Use the Performance API for accurate timing measurement
    const marker = `deferred-loading-${Date.now()}`;
    performance.mark(marker);

    // Calculate delay based on priority
    const priorityDelay =
      priority === "high" ? Math.max(0, delay - 100) : priority === "low" ? delay + 200 : delay;

    // Function to trigger rendering and measure performance
    const startRendering = () => {
      setShouldRender(true);

      // Report performance metrics if a name was provided
      if (metricName) {
        performance.measure(metricName, marker);
        const entries = performance.getEntriesByName(metricName, "measure");
        if (entries.length > 0) {
          reportWebVitals({
            name: metricName || METRIC_NAMES.DEFERRED_HYDRATION,
            value: entries[0].duration,
            id: "deferred-loading",
          });
        }
      }
    };

    // Handle visibility-based loading with Intersection Observer
    if (loadOnlyWhenVisible && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            // Schedule rendering based on priority
            if (priority === "low" && "requestIdleCallback" in window) {
              window.requestIdleCallback(() => {
                setTimeout(startRendering, priorityDelay);
              });
            } else {
              setTimeout(startRendering, priorityDelay);
            }
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "200px" }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      // Not visibility-based, schedule based on priority
      if (priority === "low" && "requestIdleCallback" in window) {
        const idleCallbackId = window.requestIdleCallback(() => {
          setTimeout(startRendering, priorityDelay);
        });
        return () => window.cancelIdleCallback(idleCallbackId);
      } else {
        const timeoutId = setTimeout(startRendering, priorityDelay);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [delay, loadOnlyWhenVisible, priority, metricName, reportWebVitals]);

  return { shouldRender, ref: containerRef };
}

/**
 * Modern wrapper component for deferred loading of children
 * Uses React 19 features and intersection observer for visibility detection
 */
export function DeferredContent({
  children,
  fallback = null,
  className = "",
  ...options
}: DeferredLoadingOptions & {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  const { shouldRender, ref } = useDeferredLoading(options);

  return (
    <div ref={ref} className={className} aria-busy={!shouldRender}>
      {shouldRender ? children : fallback}
    </div>
  );
}

/**
 * Note on usage with Next.js 15:
 *
 * For most cases, prefer using Next.js built-in streaming with Suspense:
 * - Use loading.js for route-level loading states
 * - Use <Suspense> for component-level loading states
 *
 * This utility is best for:
 * - Non-critical below-the-fold content
 * - Performance-sensitive applications with many components
 * - Progressive enhancement strategies
 */
