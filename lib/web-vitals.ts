/**
 * Web Vitals configuration and reporting for Core Web Vitals monitoring 
 * 
 * This file implements real user monitoring for Core Web Vitals metrics
 * and sends the data to Vercel Analytics for performance analysis.
 */

import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';
import type { CLSMetric, FCPMetric, FIDMetric, INPMetric, LCPMetric, TTFBMetric } from 'web-vitals';

type SendToAnalytics = (metric: CLSMetric | FCPMetric | FIDMetric | INPMetric | LCPMetric | TTFBMetric) => void;

const vitalsUrl = 'https://vitals.vercel-insights.com/v1/vitals';

/**
 * Reports Web Vitals metrics to Vercel Analytics
 * 
 * @param metric The performance metric to report
 */
const sendToVercelAnalytics: SendToAnalytics = (metric) => {
  const body = {
    dsn: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || '', // Set this ID in your project's environment variables
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    // Use a proper type guard for the Navigator connection API
    speed: (() => {
      if (!('connection' in navigator)) return '';
      
      /**
       * NetworkInformation interface represents information about the connection a device is using to communicate with the network.
       * Since this API is experimental and not fully standardized, we use a specific interface instead of 'any'.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
       */
      interface NetworkInformation {
        effectiveType?: string;
        [key: string]: unknown;
      }
      
      const conn = navigator['connection'] as NetworkInformation; // Cast to NetworkInformation for the experimental API
      if (conn && 'effectiveType' in conn) {
        return conn.effectiveType;
      }
      return '';
    })(),
  };

  // Use `navigator.sendBeacon()` if available
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    // Fall back to fetch() if sendBeacon isn't available
    fetch(vitalsUrl, {
      body: JSON.stringify(body),
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error);
  }
};

/**
 * Reports all Core Web Vitals metrics for the current page
 */
export function reportWebVitals(): void {
  try {
    // Only load web-vitals in the browser
    if (typeof window !== 'undefined') {
      onCLS(sendToVercelAnalytics);
      onFID(sendToVercelAnalytics);
      onLCP(sendToVercelAnalytics);
      onINP(sendToVercelAnalytics);
      onFCP(sendToVercelAnalytics);
      onTTFB(sendToVercelAnalytics);
    }
  } catch (err) {
    console.error('[Web Vitals]', err);
  }
}

/**
 * Creates a Web Vitals budget configuration for performance monitoring
 * 
 * These values are based on Core Web Vitals guidelines:
 * - LCP: < 2.5s (good), < 4s (needs improvement), > 4s (poor)
 * - CLS: < 0.1 (good), < 0.25 (needs improvement), > 0.25 (poor)
 * - FID: < 100ms (good), < 300ms (needs improvement), > 300ms (poor)
 * - INP: < 200ms (good), < 500ms (needs improvement), > 500ms (poor)
 */
export const webVitalsBudget = {
  lcp: {
    good: 2500,
    needsImprovement: 4000,
  },
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  fid: {
    good: 100,
    needsImprovement: 300,
  },
  inp: {
    good: 200,
    needsImprovement: 500,
  },
  fcp: {
    good: 1800,
    needsImprovement: 3000,
  },
  ttfb: {
    good: 800,
    needsImprovement: 1800,
  },
};
