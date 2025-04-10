# Next.js 15 Streaming Guide

> **Implementation Status**: Production-ready - This document provides a comprehensive guide to the streaming implementation in our Next.js 15 application, following best practices and architectural patterns

## Table of Contents

1. [Introduction](#introduction)
2. [What is Streaming?](#what-is-streaming)
3. [Implementation Approach](#implementation-approach)
4. [Component Patterns](#component-patterns)
5. [Code Examples](#code-examples)
6. [Error Handling](#error-handling)
7. [Skeleton Components](#skeleton-components)
8. [Performance Benefits](#performance-benefits)
9. [Implementation Status](#implementation-status)
10. [Testing Strategy](#testing-strategy)
11. [Migration Checklist](#migration-checklist)
12. [Lessons Learned](#lessons-learned)
13. [References](#references)

## Introduction

This document provides a comprehensive guide to implementing streaming in the Cyber Hand website using Next.js 15 and React 19. It combines our migration plan, implementation guide, and cleanup guidance into a single resource, ensuring a consistent approach to streaming throughout the application.

## What is Streaming

Streaming allows your server to send UI components to the browser progressively as they become ready, rather than waiting for all data to load before sending any UI to the client. This significantly improves perceived performance for data-heavy pages.

Key benefits include:

- **Improved TTFB (Time to First Byte)** - The server starts sending HTML immediately
- **Better FCP (First Contentful Paint)** - Critical content is visible sooner
- **Progressive Enhancement** - The page builds progressively as data becomes available
- **Reduced Perceived Latency** - Users see content stream in rather than waiting
- **Better UX with Standardized Loading States** - Consistent loading experience prevents layout shifts
- **Improved Error Recovery** - Well-placed error boundaries allow partial functionality even when some components fail

## Implementation Approach

Our streaming implementation follows these key patterns aligned with Next.js 15 best practices:

1. **React Server Components with Suspense** - Using built-in streaming capabilities of the App Router
2. **Strategic Suspense Boundaries** - Placed to allow different sections to stream independently
3. **Async Data Fetching** - Using async/await directly in Server Components
4. **Loading.js Pattern** - Implementing route-level loading UI for entire pages
5. **Standardized Skeleton UI** - Reusable components for consistent loading experiences
6. **Comprehensive Error Handling** - Error boundaries at strategic points with retry capabilities

This approach aligns with the Next.js 15 best practices:

```tsx
// Example of a streaming page pattern
// app/example/page.tsx
import { Suspense } from "react";
import { ContentErrorBoundary } from "@/components/error-boundary";
import { DataComponent } from "./data-component";
import { DataSkeleton } from "./data-skeleton";

export default function ExamplePage() {
  return (
    <PageLayout>
      {/* Static content renders immediately */}
      <StaticHeader />

      {/* Data-dependent content streams in with proper error handling */}
      <ContentErrorBoundary>
        <Suspense fallback={<DataSkeleton />}>
          <DataComponent />
        </Suspense>
      </ContentErrorBoundary>
    </PageLayout>
  );
}
```

## Component Patterns

We follow these standard patterns for implementing streaming throughout our application:

### 1. Server Component Pages with Client Islands

Server Components are used for the page structure and data fetching, with Client Components for interactive elements:

```tsx
// app/case-studies/page.tsx
export default function CaseStudiesPage() {
  return (
    <PageLayout>
      <SectionContainer>
        {/* Static content renders immediately */}
        <PageHeader title="Case Studies" description="Explore our latest work" />

        {/* Streaming content with error boundary */}
        <ContentErrorBoundary>
          <Suspense fallback={<CaseStudyGridSkeleton />}>
            <CaseStudiesContent />
          </Suspense>
        </ContentErrorBoundary>
      </SectionContainer>
    </PageLayout>
  );
}

// Async component for data-dependent content
async function CaseStudiesContent() {
  // Data fetching happens directly in the component
  const caseStudies = await getCaseStudies();

  // Return the component with the data
  return <CaseStudyGrid caseStudies={caseStudies} />;
}
```

### 2. Route-Level Loading UI

We use the Next.js 15 `loading.js` pattern for route-level loading states:

```tsx
// app/case-studies/loading.tsx
import { PageSkeleton, HeadingSkeleton, CardGridSkeleton } from "@/components/ui/skeleton";

export default function CaseStudiesLoading() {
  return (
    <PageSkeleton>
      <HeadingSkeleton level={1} width="60%" className="text-center mb-8" />
      <CardGridSkeleton count={6} columns={3} />
    </PageSkeleton>
  );
}
```

### 3. Component-Level Data Fetching

Server Components fetch data directly using async/await:

```tsx
// app/case-studies/[slug]/components/case-study-content.tsx
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { CaseStudyNotFound } from "./case-study-not-found";
import { CaseStudyDisplay } from "./case-study-display";

export async function CaseStudyContent({ slug }) {
  // Data fetching happens directly in the component
  const caseStudy = await getCaseStudyBySlug(slug);

  // Handle not found case
  if (!caseStudy) {
    return <CaseStudyNotFound />;
  }

  // Return the component with the data
  return <CaseStudyDisplay caseStudy={caseStudy} />;
}
```

## Code Examples

### Parallel Data Fetching

For optimized performance, we use parallel data fetching patterns:

```tsx
import { cache } from "react";

// Data fetching function with caching
export const getCaseStudyBySlug = cache(async (slug: string) => {
  // Fetch data from API or database
  const response = await fetch(`/api/case-studies/${slug}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch case study: ${response.statusText}`);
  }

  return response.json();
});

// Component using parallel data fetching
async function CaseStudyPage({ params }) {
  // Start data fetches in parallel
  const caseStudyPromise = getCaseStudyBySlug(params.slug);
  const relatedStudiesPromise = getRelatedCaseStudies(params.slug);

  // Await results when needed
  const caseStudy = await caseStudyPromise;
  const relatedStudies = await relatedStudiesPromise;

  return (
    <>
      <CaseStudyDisplay caseStudy={caseStudy} />
      <RelatedStudies studies={relatedStudies} />
    </>
  );
}
```

### Error Boundary Implementation

Our error boundaries are client components that wrap around Suspense boundaries:

```tsx
// components/error-boundary.tsx
"use client";

import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";

export function ContentErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ContentErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}

function ContentErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 my-6">
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Something went wrong</h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">
        {error.message || "Failed to load content. Please try again."}
      </p>
      <Button onClick={resetErrorBoundary} className="mt-4" variant="outline">
        Try again
      </Button>
    </div>
  );
}
```

## Error Handling

Our error handling approach ensures that failures in one part of the page don't break the entire page:

1. **Client Error Boundaries** - Wrap around Suspense boundaries to catch rendering errors
2. **Server-Side Error Handling** - Try/catch blocks in data fetching functions
3. **Retry Mechanisms** - Allow users to retry failed operations
4. **Graceful Degradation** - Show partial content when possible, with clear error messages
5. **Debugging Support** - Detailed error information in development, user-friendly messages in production

## Skeleton Components

We've implemented a comprehensive skeleton component library for consistent loading states:

```tsx
// components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  animationDelay?: string;
}

export function Skeleton({ className, width, height, animationDelay, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded bg-gray-200 dark:bg-gray-700", className)}
      style={{
        width,
        height,
        ...(animationDelay ? { animationDelay } : {}),
      }}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
}

export function TextSkeleton({ width = "100%", className, ...props }: SkeletonProps) {
  return <Skeleton className={cn("h-4 my-2", className)} style={{ width }} {...props} />;
}

export function HeadingSkeleton({
  level = 2,
  width = "100%",
  className,
  ...props
}: SkeletonProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const sizeClasses = {
    1: "h-8 mb-4",
    2: "h-7 mb-3",
    3: "h-6 mb-3",
    4: "h-5 mb-2",
    5: "h-4 mb-2",
    6: "h-3 mb-1",
  };

  return <Skeleton className={cn(sizeClasses[level], className)} style={{ width }} {...props} />;
}

export function CardSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("rounded-lg p-6 space-y-4", className)} {...props}>
      <Skeleton className="h-40 w-full" />
      <HeadingSkeleton level={3} width="70%" />
      <TextSkeleton width="90%" />
      <TextSkeleton width="60%" />
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  columns = 3,
  className,
  ...props
}: SkeletonProps & { count?: number; columns?: number }) {
  return (
    <div
      className={cn(
        "grid gap-6",
        {
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-1 sm:grid-cols-2": columns === 2,
          "grid-cols-1": columns === 1,
        },
        className
      )}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}
```

## Performance Benefits

Streaming provides significant performance benefits:

1. **Better User Experience** - Content appears progressively rather than all at once
2. **Improved Core Web Vitals**:
   - Lower LCP (Largest Contentful Paint) - Primary content loads faster
   - Minimal CLS (Cumulative Layout Shift) - Skeletons match final content dimensions
   - Reduced TBT (Total Blocking Time) - Less JavaScript execution blocks interaction
3. **Reduced Perceived Latency** - Users see content stream in rather than staring at a blank page
4. **Improved Time to Interactive** - Available UI can be used while additional content loads

## Implementation Status

Our streaming implementation has been applied throughout the application:

### Pages Using Optimized Streaming with Standardized Components

- ✅ `app/case-studies/[slug]/page.tsx` - Using standardized skeleton components and error boundaries
- ✅ `app/case-studies/page.tsx` - Using standardized skeleton components in loading.js

### Pages Using Basic Streaming (In Progress)

- 🔄 `app/page.tsx` (Homepage) - Uses Suspense boundaries but needs standardized skeletons
- 🔄 `app/contact/page.tsx` - Uses multiple Suspense boundaries but needs standardized skeletons

### Pages Pending Streaming Implementation

- ⏩ `app/get-started/page.tsx` - Has loading.js file but no Suspense boundaries yet
- ⏩ `app/resources/page.tsx` - Has loading.js file but no Suspense boundaries yet
- ⏩ `app/services/page.tsx` - Has loading.js file but no Suspense boundaries yet

## Quality Verification

To verify the streaming implementation is working correctly, consider these verification approaches:

1. **Visual Verification**:

   - Observe rendering of loading states in different network conditions
   - Ensure skeleton dimensions match final content to prevent layout shifts

2. **Performance Verification**:

   - Use Chrome DevTools to observe progressive HTML chunks
   - Review Core Web Vitals metrics in production environment

3. **Accessibility Verification**:

   - Ensure loading states communicate properly to assistive technologies
   - Verify error states provide meaningful information

4. **Network Condition Verification**:
   - Observe the application under various network conditions
   - Verify proper loading states and transitions in slow network environments

## Migration Checklist

If you're implementing streaming on a new page, follow this checklist:

1. **Implement Loading States**:

   - Create a `loading.js` file in the route directory
   - Use standardized skeleton components for consistent UI

2. **Structure Your Page Component**:

   - Place static content outside of Suspense boundaries
   - Wrap data-dependent content in Suspense boundaries
   - Apply ContentErrorBoundary around Suspense boundaries

3. **Implement Async Data Fetching**:

   - Use async/await directly in Server Components
   - Use React's cache() for request deduplication
   - Implement parallel data fetching where appropriate

4. **Add Error Handling**:

   - Wrap Suspense boundaries with error boundaries
   - Add retry functionality for failed operations
   - Provide user-friendly error messages

5. **Verify Thoroughly**:
   - Observe under different network conditions
   - Verify accessibility of loading and error states
   - Check performance metrics in production

## Lessons Learned

During our implementation of streaming with Next.js 15, we learned several important lessons:

1. **Server/Client Component Serialization**: We encountered serialization issues when passing function components directly from Server Components to Client Components. We solved this by creating client component wrappers in `app/components/error-boundary.tsx`.

2. **Error Boundary Integration**: React error boundaries must be client components, so we created specialized wrappers (ContentErrorBoundary, FormErrorBoundary) to maintain a clear Server/Client component separation.

3. **Skeleton Component Animation**: Staggered animations with small delays (0.1-0.3s) create a more natural loading experience than simultaneous animations.

4. **Layout Stability**: Properly sized skeleton components that match final content dimensions are crucial for preventing Cumulative Layout Shift (CLS).

5. **TypeScript Integration**: Strong TypeScript typing for skeleton components ensures proper props are passed and improves development experience.

6. **Client Component Islands**: The pattern of Server Component pages with Client Component islands works extremely well for balancing performance and interactivity.

## References

1. [Next.js Documentation: Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
2. [Next.js Documentation: Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
3. [React Documentation: Suspense for Data Fetching](https://react.dev/reference/react/Suspense)
4. [React Error Boundary Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
5. [React Error Boundary Library](https://github.com/bvaughn/react-error-boundary)
