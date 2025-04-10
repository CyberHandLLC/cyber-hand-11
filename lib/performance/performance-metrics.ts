"use client";

/**
 * Performance Metrics Utilities
 *
 * This module provides functions and hooks for tracking and reporting
 * performance metrics in the application.
 */

import { useCallback } from "react";
import type { Metric as _Metric } from "web-vitals";

/**
 * Custom performance metric object
 */
export interface CustomPerformanceMetric {
  /** Unique identifier for the metric */
  id: string;
  /** Name of the metric */
  name: string;
  /** Numeric value of the metric (typically in milliseconds) */
  value: number;
  /** Additional metadata for the metric */
  attribution?: Record<string, unknown>;
}

/**
 * Hook that returns a function to report custom performance metrics
 *
 * @returns A function to report custom metrics
 */
export function usePerformanceMetrics() {
  return useCallback((metric: CustomPerformanceMetric) => {
    // Log metrics in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Performance] ${metric.name}: ${metric.value}ms`);
    }

    // Record in Performance API if available
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        // Mark the event in the performance timeline
        if (typeof window.performance?.mark === "function") {
          window.performance.mark(`${metric.name}:${metric.id}`);
        }

        // Create a performance measure
        if (typeof window.performance?.measure === "function") {
          window.performance.measure(`${metric.name}`, {
            start: "navigationStart",
            detail: {
              metricId: metric.id,
              value: metric.value,
              attribution: metric.attribution,
            },
          });
        }

        // Dispatch custom event for potential analytics integration
        const customEvent = new CustomEvent("performance-measurement", {
          detail: {
            name: metric.name,
            id: metric.id,
            value: metric.value,
            attribution: metric.attribution,
          },
        });

        window.dispatchEvent(customEvent);
      } catch (err) {
        // Handle Performance API errors
        console.error("Performance API error:", err);
      }
    }
  }, []);
}

/**
 * Standard metric names for consistent tracking
 */
export const METRIC_NAMES = {
  // Core Web Vitals
  LCP: "LCP",
  FID: "FID",
  CLS: "CLS",
  INP: "INP",

  // Additional metrics
  TTFB: "TTFB",
  FCP: "FCP",

  // Custom metrics
  DYNAMIC_IMPORT: "dynamic-import",
  HYDRATION_TIME: "hydration-time",
  LCP_CANDIDATE: "lcp-candidate",
  DEFERRED_HYDRATION: "deferred-hydration",

  // Performance optimization metrics
  JS_PARSE_TIME: "js-parse-time",
  CSS_BLOCK_TIME: "css-block-time",
  IMAGE_LOAD_TIME: "image-load-time",
} as const;
