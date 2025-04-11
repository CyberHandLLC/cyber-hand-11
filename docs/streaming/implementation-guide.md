# Next.js 15 Streaming Implementation Guide

This document outlines our standardized approach to implementing streaming for data-dependent UI sections in the Cyber Hand website using Next.js 15 and React 19 features. It includes patterns, best practices, and implementation details from our successful application-wide optimization.

## What is Streaming?

Streaming allows your server to send UI to the browser progressively as it becomes ready, rather than waiting for all data to load before sending any UI to the client. This significantly improves perceived performance for data-heavy pages.

## Implementation Pattern

Our streaming implementation follows these key patterns:

1. **React Suspense Boundaries**: Strategic placement of Suspense boundaries to allow different sections to stream independently
2. **Async Server Components**: Using async/await directly in Server Components for data fetching
3. **Progressive Rendering**: Loading critical UI first, then progressively enhancing with more data
4. **Loading.js Pattern**: Implementing route-level loading UI with Next.js 15's built-in pattern
5. **Standardized Skeleton UI**: Using reusable skeleton components for consistent loading experiences
6. **Comprehensive Error Handling**: Implementing ErrorBoundary components at strategic points

## Current Implementation

Our implementation successfully leverages Next.js 15's built-in streaming capabilities across all major pages:

- **Server Component Architecture**: Clear separation between Server and Client Components
- **Async Data Fetching**: Using the async/await pattern directly in Server Components
- **Strategic Suspense Boundaries**: Optimally placed around data-dependent UI sections
- **Standardized Skeleton UI Library**: Comprehensive component library in `components/ui/skeleton.tsx`
- **Centralized Error Boundaries**: Client component wrappers in `app/components/error-boundary.tsx`
- **Fallback UI**: Consistent loading states with proper animation sequencing
- **Accessibility Support**: Proper ARIA attributes on loading components

## Standardized Component Patterns

We've established three standardized patterns for implementing streaming throughout the application:

### 1. Server Component Pages with Client Islands

```tsx
// app/example/page.tsx
import { Suspense } from "react";
import { ContentErrorBoundary } from "@/app/components/error-boundary";
import { ExampleContent } from "./components/example-content";
import { ExampleSkeleton } from "./components/example-skeleton";

export default function ExamplePage() {
  return (
    <PageLayout>
      <SectionContainer>
        {/* Static content renders immediately */}
        <StaticHeader />

        {/* Interactive content streams in with error handling */}
        <ContentErrorBoundary>
          <Suspense fallback={<ExampleSkeleton />}>
            <ExampleContent />
          </Suspense>
        </ContentErrorBoundary>
      </SectionContainer>
    </PageLayout>
  );
}
```

### 2. Standardized Skeleton Components

Our skeleton component library in `components/ui/skeleton.tsx` provides consistent loading states with proper accessibility attributes:

```tsx
// Sample skeleton components
export function TextSkeleton({ width = "100%", className, ...props }) {
  return (
    <Skeleton
      className={cn("h-4 my-2", className)}
      style={{ width, ...(animationDelay ? { animationDelay } : {}) }}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
}

export function CardSkeleton({ className, ...props }) {
  return (
    <div className={cn("rounded-lg p-6 space-y-4", className)} {...props}>
      <ImageSkeleton className="mb-4" />
      <HeadingSkeleton level={3} width="70%" />
      <TextSkeleton width="90%" />
      <TextSkeleton width="60%" />
    </div>
  );
}
```

### 3. Client-Side Error Boundaries

Our error boundary system provides standardized error handling that works properly with Next.js serialization:

```tsx
// app/components/error-boundary.tsx
"use client";

import { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

export function ContentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={StandardErrorFallback}>{children}</ReactErrorBoundary>
  );
}
```

## Implemented Pages

We've successfully applied our standardized streaming patterns to all major pages:

### 1. Homepage (app/page.tsx)

```tsx
// Simplified implementation
export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-circuit-bg">
      {/* Static hero content rendered immediately */}
      <HomeHero />

      {/* Interactive buttons with error boundary */}
      <ContentErrorBoundary>
        <Suspense fallback={<ButtonsSkeleton />}>
          <HomepageButtons />
        </Suspense>
      </ContentErrorBoundary>

      {/* Circuit effects with error handling */}
      <ContentErrorBoundary>
        <Suspense fallback={<CircuitEffectsSkeleton />}>
          <CircuitEffectsWrapper />
        </Suspense>
      </ContentErrorBoundary>
    </main>
  );
}
```

### 2. Contact Page (app/contact/page.tsx)

```tsx
// Simplified implementation
export default function ContactPage() {
  return (
    <PageLayout>
      <section className="py-24 md:py-32">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            {/* Static header content renders immediately */}
            <ContactHeader />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact form with error boundary */}
              <div className="lg:col-span-3">
                <FormErrorBoundary>
                  <Suspense fallback={<FormSkeleton />}>
                    <ContactForm />
                  </Suspense>
                </FormErrorBoundary>
              </div>

              {/* Contact information */}
              <div className="lg:col-span-2">
                <ContentErrorBoundary>
                  <Suspense fallback={<ContactInfoSkeleton />}>
                    <AnimatedContactInfo reasons={...} contactInfo={...} />
                  </Suspense>
                </ContentErrorBoundary>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>
    </PageLayout>
  );
}
```

### 3. Services Page (app/services/page.tsx)

```tsx
// Simplified implementation
export default function Services() {
  return (
    <PageLayout>
      <SectionContainer className="pt-20 lg:pt-28 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{title}</h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg mb-16">{subtitle}</p>
      </SectionContainer>

      <SectionContainer>
        {/* Desktop Service Grid */}
        <div className="hidden md:block">
          <ContentErrorBoundary>
            <Suspense fallback={<ServicesGridSkeleton />}>
              <ServicesGrid services={services} />
            </Suspense>
          </ContentErrorBoundary>
        </div>

        {/* Mobile Service Carousel */}
        <div className="md:hidden">
          <ContentErrorBoundary>
            <Suspense fallback={<ServicesMobileSkeleton />}>
              <ServicesMobile services={services} />
            </Suspense>
          </ContentErrorBoundary>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}
```

## Data Fetching Pattern

Our data fetching approach for streaming uses Next.js 15's Server Component patterns:

- **Direct async/await**: Server Components fetch data directly using async/await syntax
- **Suspense Integration**: Components automatically integrate with Suspense boundaries
- **Proper Error Handling**: We implement error boundaries around data fetches
- **Clear Separation**: Data fetching is separated from UI rendering for better maintainability

* while the main content is loading. It leverages Next.js 15's built-in
* loading.js pattern for route-level loading states.
  \*/

export default function CaseStudiesLoading() {
return (

<div className="py-24 px-4 md:px-6">
{/_ Static header placeholder _/}
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

````

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
````

2. **Wrap with Suspense and ErrorBoundary**:

   ```tsx
   <ErrorBoundary fallback={<ErrorFallback />}>
     <Suspense fallback={<StandardizedSkeleton />}>
       <DataComponent id="example" />
     </Suspense>
   </ErrorBoundary>
   ```

3. **Use standardized skeleton components**:

   ```tsx
   import { HeadingSkeleton, TextSkeleton, ImageSkeleton } from "@/components/ui/skeleton";

   function StandardizedSkeleton() {
     return (
       <div className="space-y-4">
         <HeadingSkeleton level={1} width="60%" />
         <TextSkeleton width="80%" />
         <ImageSkeleton aspectRatio="16/9" />
       </div>
     );
   }
   ```

4. **Create loading.js files**:
   Create a loading.js file in the same directory as your page.tsx to provide a route-level loading UI using the standardized skeleton components.

   ```tsx
   import { SectionSkeleton, CardGridSkeleton } from "@/components/ui/skeleton";

   export default function Loading() {
     return (
       <div className="space-y-8">
         <SectionSkeleton />
         <CardGridSkeleton count={3} columns={3} />
       </div>
     );
   }
   ```

## Performance Benefits

Streaming provides several key benefits:

1. **Improved TTFB (Time to First Byte)** - The server starts sending HTML immediately
2. **Better FCP (First Contentful Paint)** - Critical content is visible sooner
3. **Progressive Enhancement** - The page builds progressively as data becomes available
4. **Reduced Perceived Latency** - Users see content stream in rather than waiting
5. **Better UX with Standardized Loading States** - Consistent loading experience prevents layout shifts
6. **Improved Error Recovery** - Well-placed error boundaries allow partial functionality even when some components fail

## Browser Support

Streaming is supported in all modern browsers. In older browsers that don't support streaming, the page will still work, but the entire UI will be delivered at once after all data is loaded.

## Testing Streaming

To verify streaming is working:

1. Use Chrome DevTools Network tab to observe progressive HTML chunks
2. Enable "Slow 3G" network throttling to better visualize the streaming effect
3. Use the Performance Insights panel to measure Time to First Byte (TTFB) and First Contentful Paint (FCP)
4. Compare metrics with and without streaming to quantify the benefits
5. Test error scenarios by temporarily modifying data fetching functions to throw errors
6. Verify that skeleton UI components match the final rendered content dimensions to prevent layout shifts

## References

1. [Next.js Documentation: Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
2. [Next.js Documentation: Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
3. [React Documentation: Suspense for Data Fetching](https://react.dev/reference/react/Suspense)
4. [React Error Boundary Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
5. [React Error Boundary Library](https://github.com/bvaughn/react-error-boundary)

## Best Practices Checklist

- [x] Use standardized skeleton components for consistent loading UX
- [x] Implement error boundaries around Suspense boundaries
- [x] Keep Suspense boundaries as high in the component tree as possible
- [x] Provide meaningful error recovery mechanisms
- [x] Test with network throttling to verify progressive rendering
- [x] Ensure skeletons match final content dimensions to prevent layout shifts
- [x] Separate data fetching from UI rendering for better maintainability

## Lessons Learned

1. **Server/Client Component Serialization**: We encountered serialization issues when passing function components directly from Server Components to Client Components. We solved this by creating client component wrappers in `app/components/error-boundary.tsx`.

2. **Error Boundary Integration**: React error boundaries must be client components, so we created specialized wrappers (ContentErrorBoundary, FormErrorBoundary) to maintain a clear Server/Client component separation.

3. **Skeleton Component Animation**: Staggered animations with small delays (0.1-0.3s) create a more natural loading experience than simultaneous animations.

4. **Layout Stability**: Properly sized skeleton components that match final content dimensions are crucial for preventing Cumulative Layout Shift (CLS).

5. **TypeScript Integration**: Strong TypeScript typing for skeleton components ensures proper props are passed and improves development experience.

6. **Client Component Islands**: The pattern of Server Component pages with Client Component islands works extremely well for balancing performance and interactivity.
