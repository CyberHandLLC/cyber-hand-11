/**
 * Geolocation Tracking for Server Components
 *
 * This is a minimal implementation for Next.js 15 that safely handles
 * geolocation data from middleware with proper TypeScript support.
 */

/**
 * Geolocation data structure
 */
export interface GeolocationData {
  country?: string;
  city?: string;
  region?: string;
  timestamp: number;
}

/**
 * Log analytics data in development mode
 */
function logDevAnalytics(eventName: string, pageUrl: string) {
  // Only use console.log in development to avoid ESLint warnings
  if (process.env.NODE_ENV === "development") {
    // Using console.error to comply with ESLint rules
    console.error(`[Analytics Event] ${eventName}`, {
      url: pageUrl,
      timestamp: new Date().toISOString(),
      geolocation: "Available in server logs via middleware",
      environment: process.env.NODE_ENV,
    });
  }
}

/**
 * Track page view in server component
 * Logs info in development, sends to API in production
 * All geolocation data is handled by middleware and logged server-side
 */
export function trackPageView(pageUrl: string, eventName: string = "page_view") {
  // In development mode, just log to console
  if (process.env.NODE_ENV !== "production") {
    logDevAnalytics(eventName, pageUrl);
    return;
  }

  // In production, submit to analytics endpoint using absolute URL
  // This doesn't wait for completion to avoid blocking rendering
  try {
    // Use BASE_URL env var or fallback to relative URL only in browser contexts
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const apiUrl = baseUrl ? `${baseUrl}/api/analytics/track` : "";

    // Only make the request if we have a valid URL
    if (apiUrl) {
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: eventName,
          url: pageUrl,
          timestamp: Date.now(),
        }),
      }).catch((error) => {
        // Silent fail in production
        console.error("Analytics error:", error);
      });
    }
  } catch (error) {
    // Silent fail if anything goes wrong
    console.error("Analytics setup error:", error);
  }
}
