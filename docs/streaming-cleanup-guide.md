# Next.js 15 Streaming Cleanup Guide

This document outlines the specific steps to clean up our custom streaming implementation and transition to Next.js 15's built-in streaming capabilities. It serves as an extension to the [Streaming Implementation Guide](./streaming-implementation-guide.md) and complements the [Streaming Migration Plan](./streaming-migration-plan.md).

## Overview

Next.js 15 provides native streaming capabilities that make our custom implementation unnecessary. This guide will help you:

1. Identify all custom streaming code that needs to be cleaned up
2. Provide step-by-step instructions for replacing it with Next.js 15 patterns
3. Ensure backward compatibility during the transition
4. Verify everything works correctly after cleanup

## Complete Page Analysis

After analyzing our entire codebase, here's the status of streaming implementation across all pages:

### Pages Using Suspense or Custom Streaming (Require Updates)
- ✅ `app/page.tsx` (Homepage) - Uses Suspense boundaries
- ✅ `app/contact/page.tsx` - Uses multiple Suspense boundaries
- ✅ `app/case-studies/page.tsx` - Uses Suspense with custom components 
- ✅ `app/case-studies/[slug]/page.tsx` - Needs loading.js
- ✅ `app/case-studies/streaming-page.tsx` - Demo implementation (to be removed)

### Pages Not Currently Using Streaming (Optional Updates)
- ⏩ `app/get-started/page.tsx` - No Suspense or streaming usage
- ⏩ `app/resources/page.tsx` - No Suspense or streaming usage
- ⏩ `app/services/page.tsx` - No Suspense or streaming usage

While the second group doesn't currently use our custom streaming patterns, we'll still create loading.js files for them to maintain consistency and prepare for future data fetching needs.

## Files to Clean Up

Based on a comprehensive analysis of our codebase, the following files need attention:

### 1. Custom Utilities (Complete Removal)

These files can be completely removed once all usages are replaced with Next.js 15 patterns:

| File | Description | Replacement |
|------|-------------|-------------|
| `lib/streaming-utils.ts` | Contains custom streaming utilities | Use native React Suspense and async Server Components |
| `app/case-studies/streaming-page.tsx` | Demo implementation of streaming | Migrate to main page components |

### 2. Data Fetching Utilities (Refactor)

These files should be refactored to remove the custom resource pattern while preserving the core data fetching logic:

| File | Description | Refactoring Needed |
|------|-------------|-------------------|
| `lib/data/streaming-case-studies.ts` | Streaming wrappers for case studies | Remove resource pattern, keep cache() functions |

### 3. Components (Refactor)

These components need to be refactored to use Next.js 15's simplified streaming approach:

| File | Description | Refactoring Needed |
|------|-------------|-------------------|
| `app/case-studies/components/streaming-case-study-grid.tsx` | Custom streaming grid | Extract loading UI, simplify with async components |

### 4. Pages Using Suspense (Update)

These pages use Suspense and will need updates to align with the new pattern:

| File | Description | Updates Needed |
|------|-------------|---------------|
| `app/case-studies/page.tsx` | Main case studies page | Update Suspense boundaries, add loading.js |
| `app/case-studies/[slug]/page.tsx` | Case study detail | Add loading.js, update Suspense usage |
| `app/contact/page.tsx` | Contact page | Update Suspense boundaries |
| `app/page.tsx` | Homepage | Update Suspense boundaries |

## Step-by-Step Cleanup Process

### Phase 1: Create Next.js 15 Streaming Infrastructure

1. **Create loading.js files for all relevant routes**:

```tsx
// app/case-studies/loading.tsx
export default function CaseStudiesLoading() {
  return (
    <div className="py-24 px-4 md:px-6">
      {/* Header placeholder */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-4 w-1/2 mx-auto"></div>
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4 mx-auto"></div>
      </div>
      
      {/* Filter placeholder */}
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8"></div>
      
      {/* Grid placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
```

2. **Create Skeleton Components for Reuse**:

```tsx
// components/ui/skeletons/case-study-skeleton.tsx
export function CaseStudySkeleton() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64 animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
    </div>
  );
}
```

### Phase 2: Update Page Components

1. **Refactor Case Studies Page**:

```tsx
// app/case-studies/page.tsx
export default async function CaseStudiesPage() {
  return (
    <PageLayout>
      <SectionContainer className="py-24 px-4 md:px-6">
        {/* Static header content rendered immediately */}
        <CaseStudiesHeader />
        
        {/* Industry filters with suspense boundary */}
        <Suspense fallback={<FilterSkeleton />}>
          <CaseStudiesFilters />
        </Suspense>
        
        {/* Case studies with suspense boundary */}
        <Suspense fallback={<CaseStudyGridSkeleton />}>
          <CaseStudiesContent />
        </Suspense>
      </SectionContainer>
    </PageLayout>
  );
}

// Async component for filters
async function CaseStudiesFilters() {
  const caseStudies = await getCaseStudies();
  const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
  return <CaseStudiesFilter industries={industries} />;
}

// Async component for case study content
async function CaseStudiesContent() {
  const caseStudies = await getCaseStudies();
  return <CaseStudiesClientWrapper caseStudies={caseStudies} />;
}
```

2. **Refactor Case Study Detail Page**:

```tsx
// app/case-studies/[slug]/page.tsx
export default async function CaseStudyPage({ params }) {
  return (
    <PageLayout>
      {/* Header streams in */}
      <Suspense fallback={<CaseStudyHeaderSkeleton />}>
        <CaseStudyHeader slug={params.slug} />
      </Suspense>
      
      {/* Content streams in */}
      <Suspense fallback={<CaseStudyContentSkeleton />}>
        <CaseStudyContent slug={params.slug} />
      </Suspense>
      
      {/* Related studies stream in */}
      <Suspense fallback={<RelatedCaseStudiesSkeleton />}>
        <RelatedCaseStudies slug={params.slug} />
      </Suspense>
    </PageLayout>
  );
}

// Async components for each section
async function CaseStudyHeader({ slug }) {
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) return <CaseStudyNotFound />;
  
  return <CaseStudyHeaderComponent caseStudy={caseStudy} />;
}

async function CaseStudyContent({ slug }) {
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) return null;
  
  return <CaseStudyContentComponent caseStudy={caseStudy} />;
}

async function RelatedCaseStudies({ slug }) {
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) return null;
  
  const relatedStudies = await getRelatedCaseStudies(
    caseStudy.id, 
    caseStudy.industry,
    3
  );
  
  return <RelatedCaseStudiesComponent studies={relatedStudies} />;
}
```

### Phase 3: Refactor Data Fetching

1. **Simplify streaming-case-studies.ts**:

```tsx
// lib/data/streaming-case-studies.ts
import { cache } from 'react';
import { CaseStudyProps } from '@/components/custom/case-study-card';
import { getCaseStudies, getCaseStudyBySlug } from './case-studies';

/**
 * Batch fetch case studies with streaming support
 * This allows for progressive loading of multiple case studies
 * 
 * @param slugs - Array of case study slugs to fetch
 * @returns Array of case study data
 */
export const getStreamingBatchCaseStudies = cache(async (
  slugs: string[]
): Promise<(CaseStudyProps | null)[]> => {
  // Create individual promises for each case study
  const promises = slugs.map(slug => getCaseStudyBySlug(slug));
  
  // Using Promise.all with Suspense in the component will allow
  // React to stream the UI as each promise resolves
  return Promise.all(promises);
});

/**
 * Get featured case studies with streaming support
 */
export const getStreamingFeaturedCaseStudies = cache(async (
  limit: number = 3
): Promise<CaseStudyProps[]> => {
  const allCaseStudies = await getCaseStudies();
  
  // Sort by some criteria to determine "featured" status
  return allCaseStudies
    .sort((a, b) => (b.id > a.id ? 1 : -1)) // Sort by id as a proxy for recency
    .slice(0, limit); // Take the first few as "featured"
});

/**
 * Get paginated case studies with streaming support
 */
export const getStreamingPaginatedCaseStudies = cache(async (
  page: number = 1,
  pageSize: number = 6
): Promise<{
  caseStudies: CaseStudyProps[];
  totalPages: number;
  currentPage: number;
}> => {
  const allCaseStudies = await getCaseStudies();
  
  const startIndex = (page - 1) * pageSize;
  const paginatedCaseStudies = allCaseStudies.slice(startIndex, startIndex + pageSize);
  
  return {
    caseStudies: paginatedCaseStudies,
    totalPages: Math.ceil(allCaseStudies.length / pageSize),
    currentPage: page,
  };
});
```

2. **Rename the file to indicate transition**:

Once all code is migrated, rename the file to `enhanced-case-studies.ts` to better reflect its purpose as enhanced data fetching rather than custom streaming.

### Phase 4: Remove Obsolete Code

Once all pages are migrated to the new pattern:

1. **Delete these files**:
   - `lib/streaming-utils.ts`
   - `app/case-studies/streaming-page.tsx`

2. **Update imports**:
   - Update all import statements referring to these files
   - Ensure all references are removed or replaced

### Phase 5: Testing Plan

1. **Visual Comparison**:
   - Compare side-by-side rendering of old vs. new implementation
   - Verify the same content appears in the same order

2. **Performance Testing**:
   - Use Chrome DevTools Performance tab to compare metrics
   - Verify Time to First Byte (TTFB) remains similar or improves
   - Check First Contentful Paint (FCP) metrics

3. **Network Throttling**:
   - Test under slow 3G conditions to verify streaming behavior
   - Ensure content appears progressively as expected

4. **Browser Compatibility**:
   - Test in Chrome, Firefox, Safari, and Edge
   - Verify fallback behavior in browsers without streaming support

## Fallback Strategy

In case of unexpected issues during migration:

1. Keep both implementations running in parallel until verification is complete
2. Use feature flags to switch between implementations if needed
3. Document any edge cases discovered during migration

## Conclusion

The migration to Next.js 15's built-in streaming capabilities will result in:

- Cleaner, more maintainable code with less custom implementation
- Better alignment with Next.js best practices
- Same or improved performance characteristics
- Reduced technical debt
- Better future compatibility with Next.js updates

This cleanup aligns with our project's architectural principles of maintaining modular component design, type safety, and performance optimization as outlined in our PLANNING.md document.

## References

1. [Next.js Documentation: Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
2. [Next.js Documentation: Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
3. [Streaming Implementation Guide](./streaming-implementation-guide.md)
4. [Streaming Migration Plan](./streaming-migration-plan.md)
