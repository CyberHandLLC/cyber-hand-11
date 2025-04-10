# Performance Monitoring System

This document outlines the performance monitoring system implemented in the Cyber Hand website, which consists of a development dashboard and a production logging service.

## Overview

The performance monitoring system provides comprehensive visibility into client-side performance metrics during both development and production. It is designed to:

1. Provide real-time feedback during development
2. Collect and analyze performance data in production
3. Support data-driven performance optimization decisions
4. Monitor the effectiveness of implemented optimizations

## Components

### 1. Development Dashboard

Located at: `components/performance/performance-dashboard.tsx`

The development dashboard provides real-time visualization of performance metrics during local development. It's specifically designed to help developers identify and fix performance issues before they reach production.

#### Key Features

- **Real-time Metric Visualization**

  - Captures metrics from both Core Web Vitals and custom application events
  - Displays metrics with color-coded severity (good/needs-improvement/poor)
  - Shows timestamps and detailed attribution data when available

- **Filtering & Sorting**

  - Filter by metric name (LCP, FID, CLS, etc.) or performance category
  - Sort by timestamp, value, or name
  - Quick toggle to focus on specific problem areas

- **Threshold-Based Analysis**

  - Built-in thresholds for Core Web Vitals aligned with Google's recommendations
  - Customizable thresholds for application-specific metrics
  - Visual indicators make it easy to spot performance regressions

- **Development-Only**
  - The dashboard only renders in development environments
  - Has zero impact on production builds and bundle size

#### Usage

```tsx
// Example of using the dashboard in a layout or test component
import { PerformanceDashboard } from "@/components/performance/performance-dashboard";

// Add this during development
{
  process.env.NODE_ENV === "development" && (
    <PerformanceDashboard
      position="bottom-right"
      initiallyOpen={false}
      thresholds={{
        // Custom thresholds (optional)
        LCP: { poor: 3000, good: 2000 }, // milliseconds
      }}
    />
  );
}
```

### 2. Production Logging Service

Located at: `lib/performance/performance-logger.ts`

The production logging service is designed for efficient, production-grade performance monitoring with minimal overhead.

#### Key Architecture Components

- **Batched Logging System**

  - Metrics are collected in batches and sent periodically (default: every 10 seconds)
  - Reduces network overhead compared to sending metrics individually
  - Final batch is sent on page unload to capture late-occurring metrics

- **Intelligent Sampling**

  - Default 10% sampling rate in production to minimize data volume while maintaining statistical relevance
  - Configurable sampling rate for different environments (100% in development, 10% in production)
  - Statistically valid approach for high-traffic applications

- **Metric Filtering Strategy**

  - Built-in filters for Core Web Vitals and high-volume metrics
  - Prioritizes critical user experience metrics
  - Reduces noise by filtering out high-frequency metrics that are performing well

- **Resilient Error Handling**
  - Robust retry mechanism for failed metric submissions
  - Graceful degradation if logging endpoint is unavailable
  - Non-blocking implementation to avoid affecting user experience

#### Usage

```typescript
// Import and create logger instance (singleton pattern)
import { createPerformanceLogger } from "@/lib/performance/performance-logger";

// Get the logger instance (configured based on environment)
const logger = createPerformanceLogger();

// Log custom performance metrics
logger.logMetric({
  id: "unique-id",
  name: "component-render-time",
  value: 120, // milliseconds
  attribution: {
    component: "HeroSection",
    route: "/home",
  },
});
```

#### Configuration Options

The logging service supports several configuration options:

```typescript
// Custom configuration example
const logger = createPerformanceLogger({
  batchInterval: 5000, // Send metrics every 5 seconds
  sampleRate: 0.2, // Sample 20% of sessions
  shouldLogMetric: (metric) => {
    // Custom filtering logic
    return metric.value > 1000; // Only log metrics over 1000ms
  },
  consoleLog: true, // Also log to console in production
  endpoint: "/api/analytics", // Custom endpoint
});
```

## Integration with Existing Architecture

The performance monitoring system integrates with the existing performance optimization work:

1. **Web Vitals Integration**

   - Works with the existing `web-vitals.ts` and performance metric hooks
   - Captures the same custom events already being tracked

2. **Code Splitting Analysis**

   - Adds visibility to the effectiveness of code splitting implementation
   - Helps identify components that might benefit from dynamic imports

3. **CSS Optimization Analysis**
   - Provides data on CSS loading and painting performance
   - Shows the impact of critical vs. non-critical CSS

## Technical Implementation

- **Event-Based Architecture**: Uses the browser's custom events system to decouple metric generation from metric collection
- **Performance API Integration**: Leverages the browser's Performance API for accurate timing
- **TypeScript Safety**: Strict typing throughout for type safety and better developer experience
- **Memory-Efficient**: Implements cleanup to prevent memory leaks from accumulated metrics

## Metric Types

The system tracks several types of metrics:

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: Measures loading performance
- **FID (First Input Delay)**: Measures interactivity
- **CLS (Cumulative Layout Shift)**: Measures visual stability
- **INP (Interaction to Next Paint)**: Measures responsiveness

### Additional Web Vitals

- **TTFB (Time to First Byte)**: Measures server response time
- **FCP (First Contentful Paint)**: Measures time until first content appears

### Custom Application Metrics

- **Dynamic Import Time**: Measures time to load dynamically imported components
- **Hydration Time**: Measures time to hydrate client components
- **LCP Candidate**: Tracks potential largest contentful paint elements
- **Deferred Hydration**: Measures impact of deferred hydration strategies
- **JS Parse Time**: Measures JavaScript parsing time
- **CSS Block Time**: Measures CSS rendering blocking time
- **Image Load Time**: Measures image loading performance

## Analyzing Performance Data

For production data, we recommend:

1. Setting up a proper analytics pipeline to process the collected metrics
2. Creating dashboards for monitoring trends over time
3. Setting up alerts for significant performance regressions
4. Regularly reviewing data to identify optimization opportunities

## Next Steps and Future Enhancements

Potential future enhancements include:

1. Integration with third-party analytics services (Google Analytics, Azure Monitor, etc.)
2. Custom dashboard for visualizing production metrics
3. A/B testing framework for performance optimizations
4. Expanded set of custom metrics for more detailed insights
