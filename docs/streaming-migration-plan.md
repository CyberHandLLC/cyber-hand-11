# Next.js 15 Streaming Migration Plan

This document outlines the steps required to update our current streaming implementation to better align with Next.js 15 best practices for streaming. The goal is to leverage Next.js 15's built-in streaming capabilities more effectively while maintaining our performance optimization goals.

## Current State Analysis

Our current streaming implementation consists of:

1. **Custom Utilities**:
   - `streaming-utils.ts`: Contains custom utilities like `createResource` and `createStreamingFetcher`
   - `streaming-case-studies.ts`: Wrapper around case studies data fetchers with streaming support

2. **Custom Components**:
   - `streaming-case-study-grid.tsx`: Implements progressive loading with nested suspense boundaries
   - `streaming-page.tsx`: A separate page implementation demonstrating streaming

3. **Implementation Approach**:
   - Uses custom resource pattern for data fetching
   - Implements multiple levels of Suspense boundaries
   - Maintains a complex state management approach for streaming

## Target State (Next.js 15 Best Practices)

Next.js 15 recommends:

1. **Built-in Streaming Support**:
   - Leverage the App Router's native streaming capabilities
   - Use `loading.js` for route-level streaming fallbacks

2. **Simplified Component Structure**:
   - Use async Server Components directly to handle data fetching
   - Rely on automatic streaming behavior of React Server Components

3. **Suspense-Based Approach**:
   - Strategic placement of Suspense boundaries around data-dependent UI sections
   - Let Next.js handle the streaming complexity

## Pages Requiring Streaming Migration

After a thorough analysis of our codebase, here's the complete status of streaming implementation across all pages:

### Pages Currently Using Suspense/Streaming (Critical Updates Required)

1. **Case Studies Pages**:
   - `app/case-studies/page.tsx` - Uses Suspense boundaries for filters and content
   - `app/case-studies/[slug]/page.tsx` - Needs loading.js for better user experience
   - `app/case-studies/streaming-page.tsx` - Demo implementation (to be removed)

2. **Contact Page**:
   - `app/contact/page.tsx` - Already uses multiple Suspense boundaries for forms and info sections

3. **Homepage**:
   - `app/page.tsx` - Uses Suspense for some content sections

### Pages Not Currently Using Streaming (Optional Updates)

4. **Static Content Pages**:
   - `app/resources/page.tsx` - Currently doesn't use Suspense, but could benefit from loading.js
   - `app/services/page.tsx` - Currently doesn't use Suspense, but could benefit from loading.js
   - `app/get-started/page.tsx` - Currently doesn't use Suspense, but could benefit from loading.js

While the second group doesn't currently use our custom streaming patterns, we'll still create loading.js files for them to maintain consistency and prepare for future data fetching needs.

Each page type requires a different migration approach depending on its data patterns and UI structure:

## Required Changes

The following changes are needed to align with Next.js 15 best practices:

### 1. Route-Level Changes

1. **Create Loading Files**:
   - Add `loading.js` alongside page components for route-level streaming
   - Implement appropriate skeleton UI in these loading files
   - Example locations:
     - `app/case-studies/loading.js`
     - `app/case-studies/[slug]/loading.js`

2. **Simplify Page Components**:
   - Convert our separate streaming implementation into the main page components
   - Leverage async/await directly in the Server Components

### 2. Component-Level Changes

1. **Update Server Components**:
   - Convert data-fetching patterns to use async/await directly in components
   - Remove manual resource creation in favor of Next.js automatic suspense

2. **Optimize Suspense Boundaries**:
   - Place Suspense boundaries strategically around data-dependent sections
   - Ensure each boundary has appropriate loading states
   - Move complex nested boundaries to a flatter structure

### 3. Data Fetching Updates

1. **Simplify Data Fetching**:
   - Continue using the `cache()` function for request deduplication
   - Remove manual resource patterns in favor of direct async/await
   - Retain parallel data fetching patterns where needed

2. **Maintain Streaming Benefits**:
   - Ensure loading states appear quickly
   - Preserve progressive rendering capabilities
   - Keep optimization for Time to First Byte (TTFB) and First Contentful Paint (FCP)

## Implementation Approach by Page Type

### 1. Case Studies Pages

**Current Implementation**:
- Uses `getCaseStudies()` with await in page component
- Has client-side filtering through `CaseStudiesClientWrapper`
- Separates concerns but doesn't fully leverage streaming

**Migration Strategy**:
- Add `loading.js` for immediate loading state
- Break down into multiple async components for parallel streaming
- Optimize suspense boundaries around data-dependent sections

### 2. Detail Pages (Case Study [slug])

**Current Implementation**:
- Fetches single case study data before rendering
- May block rendering of the entire page

**Migration Strategy**:
- Add route `loading.js` for immediate feedback
- Split into multiple async components (header, content, related)
- Stream each section independently as data becomes available

### 3. Resource-Heavy Pages

**Current Implementation**:
- May load all resources at once before rendering
- Limited streaming capability

**Migration Strategy**:
- Prioritize above-the-fold content loading
- Stream below-the-fold sections progressively
- Use suspense boundaries for resource sections

### 4. Static Content with Dynamic Sections

**Current Implementation**:
- Mostly static with some dynamic elements
- Less need for full streaming

**Migration Strategy**:
- Render static content immediately
- Only add suspense around truly dynamic portions
- Simpler implementation with focused optimization

## Implementation Steps

Here's the detailed list of changes required:

### Step 1: Create Loading Files

1. Create `app/case-studies/loading.tsx`:
   ```tsx
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

2. Create case study detail loading file:
   ```tsx
   // app/case-studies/[slug]/loading.tsx
   export default function CaseStudyDetailLoading() {
     return (
       <div className="max-w-5xl mx-auto px-4 py-12">
         {/* Header placeholder */}
         <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-6 w-3/4"></div>
         <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8 w-1/2"></div>
         
         {/* Content placeholders */}
         <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8"></div>
         <div className="space-y-4">
           <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
           <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-5/6"></div>
           <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-4/5"></div>
         </div>
       </div>
     );
   }
   ```

### Step 2: Update Page Components

1. Refactor `app/case-studies/page.tsx`:
   ```tsx
   // Refactored case-studies/page.tsx
   export default async function CaseStudiesPage() {
     return (
       <PageLayout>
         <SectionContainer>
           {/* Static header renders immediately */}
           <CaseStudiesHeader />
           
           {/* Filter section streams in */}
           <Suspense fallback={<FilterSkeleton />}>
             <CaseStudiesFilters />
           </Suspense>
           
           {/* Content grid streams in */}
           <Suspense fallback={<GridSkeleton />}>
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

2. Update case study detail page:
   ```tsx
   // app/case-studies/[slug]/page.tsx
   export default async function CaseStudyPage({ params }) {
     return (
       <PageLayout>
         <Suspense fallback={<CaseStudyHeaderSkeleton />}>
           <CaseStudyHeader slug={params.slug} />
         </Suspense>
         
         <Suspense fallback={<CaseStudyContentSkeleton />}>
           <CaseStudyContent slug={params.slug} />
         </Suspense>
         
         <Suspense fallback={<RelatedCaseStudiesSkeleton />}>
           <RelatedCaseStudies slug={params.slug} />
         </Suspense>
       </PageLayout>
     );
   }
   ```

### Step 3: Simplify Data Fetching

1. Update data fetching pattern:
   ```tsx
   // Simplified pattern in async Server Components
   async function CaseStudyContent({ slug }) {
     // Data fetching happens directly in the component
     // Next.js will automatically handle streaming with Suspense
     const caseStudy = await getCaseStudyBySlug(slug);
     
     if (!caseStudy) {
       return <CaseStudyNotFound />;
     }
     
     return <CaseStudyDetailComponent caseStudy={caseStudy} />;
   }
   ```

### Step 4: Clean Up Obsolete Files

After implementing the new pattern, we can remove or refactor:

1. `streaming-utils.ts` - Most utilities will be unnecessary
2. `streaming-case-studies.ts` - Simplify to remove resource pattern
3. `streaming-page.tsx` - Merge learnings into main page components
4. `streaming-case-study-grid.tsx` - Extract useful patterns into main components

## Impact Assessment

These changes will result in:

1. **Code Reduction**: ~40% less code across streaming implementations
2. **Simplified Mental Model**: More intuitive approach to streaming
3. **Better Maintainability**: Less custom code to understand and maintain
4. **Future Compatibility**: Better aligned with Next.js roadmap

## Testing Plan

1. Verify visual parity between old and new implementations
2. Conduct performance testing to ensure metrics are maintained or improved
3. Test under network throttling to verify streaming behavior
4. Verify browser compatibility across Chrome, Firefox, Safari, and Edge
