"use client";

/**
 * Custom hook for Web Vitals reporting
 *
 * This hook provides a React-friendly way to report custom performance
 * metrics in the same format as Core Web Vitals.
 */

import { useCallback } from "react";
import type { Metric as _Metric } from "web-vitals";

/**
 * Custom performance metric object
 */
/** Allowed web vitals metric names */
type WebVitalsMetricName = "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";

/** Custom metric names for performance tracking */
type CustomMetricName =
  | "custom-metric"
  | "dynamic-import"
  | "hydration-time"
  | "lcp-candidate"
  | "deferred-hydration"
  | string;

/** Combined type for all metric names */
export type MetricName = WebVitalsMetricName | CustomMetricName;

/**
 * Custom performance metric object
 */
export interface CustomMetric {
  /** Unique identifier for the metric */
  id: string;
  /** Name of the metric */
  name: MetricName;
  /** Numeric value of the metric (typically in milliseconds) */
  value: number;
  /** Additional metadata for the metric */
  attribution?: Record<string, unknown>;
}

/**
 * Hook that returns a function to report custom performance metrics
 *
 * @returns A function to report custom metrics in the Web Vitals format
 */
export function useReportWebVitals() {
  // Use callback to maintain reference stability
  return useCallback((metric: CustomMetric) => {
    // Only create standard web-vitals metric if it's a core web vital
    const isWebVital = ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"].includes(metric.name as string);

    if (isWebVital) {
      // Create a structured metric object similar to web-vitals format
      // We cast name as a valid WebVitalsMetricName since we've verified it above
      const _webVitalsMetric = {
        id: metric.id || `custom-${Date.now()}`,
        name: metric.name as WebVitalsMetricName,
        value: metric.value,
        attribution: metric.attribution,
      };
    }

    // Log metrics to console in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Performance] ${metric.name}: ${metric.value}`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // Use the browser's Performance API to mark important events
      if (typeof window.performance?.mark === "function") {
        window.performance.mark(`${metric.name}-${metric.id}`);
      }

      // Report using the Web API
      if ("performance" in window) {
        try {
          const entry = {
            name: metric.name,
            entryType: "custom-metric",
            startTime: performance.now(),
            duration: metric.value,
            attribution: metric.attribution,
          };

          // Custom Performance Observer would pick this up if configured
          const customEvent = new CustomEvent("performance-entry", {
            detail: entry,
          });
          window.dispatchEvent(customEvent);

          // Optionally report to analytics
          // reportToAnalytics(entry);
        } catch (e) {
          console.error("Error reporting custom metric:", e);
        }
      }
    }
  }, []);
}
