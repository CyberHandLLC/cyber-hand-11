# Next.js 15 Streaming Implementation Guide

This document explains how we implement streaming for data-dependent UI sections in the Cyber Hand website using Next.js 15 and React 19 features.

## What is Streaming?

Streaming allows your server to send UI to the browser progressively as it becomes ready, rather than waiting for all data to load before sending any UI to the client. This significantly improves perceived performance for data-heavy pages.

## Implementation Pattern

Our streaming implementation follows these key patterns:

1. **React Suspense Boundaries**: Strategic placement of Suspense boundaries to allow different sections to stream independently
2. **Async Server Components**: Using async/await directly in Server Components for data fetching
3. **Progressive Rendering**: Loading critical UI first, then progressively enhancing with more data
4. **Loading.js Pattern**: Implementing route-level loading UI with Next.js 15's built-in pattern

## Current Implementation

Our implementation leverages Next.js 15's built-in streaming capabilities:

- **Async Server Components**: We use the async/await pattern in Server Components for data fetching
- **Strategic Suspense Boundaries**: Placed around data-dependent UI sections
- **Loading.js Files**: Used for route-level loading UI

## Data Fetching Pattern

Our data fetching approach for streaming uses Next.js 15's Server Component patterns:

- **Direct async/await**: Server Components fetch data directly using async/await syntax
- **Suspense Integration**: Components automatically integrate with Suspense boundaries
- **Proper Error Handling**: We implement error boundaries around data fetches

## Current Component Implementation Examples

### 1. Case Study Detail Page Component

The `app/case-studies/[slug]/page.tsx` demonstrates our streaming implementation:

```tsx
import { Suspense } from 'react';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { CaseStudyClientWrapper } from "@/components/case-studies/case-study-client-wrapper";

// Header and content skeleton components omitted for brevity

/**
 * Async component for case study content
 * This allows for parallel data fetching with streaming
 */
async function CaseStudyContent({ slug }: { slug: string }) {
  // Find the case study by slug - this happens during streaming
  const caseStudy = caseStudies.find(cs => cs.id === slug || cs.slug === slug);
  
  // If the case study is not found, show a not found state
  if (!caseStudy) {
    return <CaseStudyNotFound />;
  }
  
  // Return the client wrapper with the case study data
  return <CaseStudyClientWrapper caseStudy={caseStudy} />;
}

/**
 * Main Case Study Page component - Server Component
 * Uses Next.js 15 streaming with async components and Suspense boundaries
 */
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await and destructure params
  const { slug } = await params;
  
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <Suspense fallback={<ContentSkeleton />}>
        <CaseStudyContent slug={slug} />
      </Suspense>
    </Suspense>
  );
}
```

### 2. Loading Page Component

We use Next.js 15's loading.js pattern for route-level loading UI. The `app/case-studies/loading.tsx` demonstrates this approach:

```tsx
/**
 * Case Studies Loading UI Component
 * 
 * This component provides a skeleton UI for the case studies page
 * while the main content is loading. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function CaseStudiesLoading() {
  return (
    <div className="py-24 px-4 md:px-6">
      {/* Static header placeholder */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-4 w-1/2 mx-auto"></div>
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4 mx-auto"></div>
      </div>
      
      {/* Filter placeholder */}
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8"></div>
      
      {/* Grid placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Skeleton items */}
      </div>
    </div>
  );
}
```

## Implementing Streaming in Your Components

To implement streaming in your own components:

1. **Create an async Server Component**:
   ```tsx
   async function DataComponent({ id }: { id: string }) {
     // Data fetching happens directly in the component
     const data = await fetchData(id);
     
     // Return the component with the data
     return <YourComponent data={data} />;
   }
   ```

2. **Wrap with Suspense**:
   ```tsx
   <Suspense fallback={<LoadingSkeleton />}>
     <DataComponent id="example" />
   </Suspense>
   ```

3. **Create loading.js files**:
   Create a loading.js file in the same directory as your page.tsx to provide a route-level loading UI.

## Performance Benefits

Streaming provides several key benefits:

1. **Improved TTFB (Time to First Byte)** - The server starts sending HTML immediately
2. **Better FCP (First Contentful Paint)** - Critical content is visible sooner
3. **Progressive Enhancement** - The page builds progressively as data becomes available
4. **Reduced Perceived Latency** - Users see content stream in rather than waiting

## Browser Support

Streaming is supported in all modern browsers. In older browsers that don't support streaming, the page will still work, but the entire UI will be delivered at once after all data is loaded.

## Testing Streaming

To verify streaming is working:

1. Use Chrome DevTools Network tab to observe progressive HTML chunks
2. Enable "Slow 3G" network throttling to better visualize the streaming effect
3. Use the Performance Insights panel to measure Time to First Byte (TTFB) and First Contentful Paint (FCP)
4. Compare metrics with and without streaming to quantify the benefits

## References

1. [Next.js Documentation: Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
2. [Next.js Documentation: Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
3. [React Documentation: Suspense for Data Fetching](https://react.dev/reference/react/Suspense)
