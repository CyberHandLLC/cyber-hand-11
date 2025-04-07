/**
 * Case Studies Page - Server Component
 * 
 * This implementation leverages Next.js 15's built-in streaming capabilities with:
 * - Async Server Components for data fetching
 * - Optimized Suspense boundaries for progressive loading
 * - Parallel data streaming with component-level suspense
 * - Integration with route-level loading.js for initial loading state
 */

import { Suspense } from 'react';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { getCaseStudies } from "@/lib/data/case-studies";
import { CaseStudiesFilter } from "./components/case-studies-filter";
import { CaseStudiesClientWrapper } from "./components/case-studies-client-wrapper";

// Metadata for the page
export const metadata = {
  title: 'Case Studies | CyberHand',
  description: 'Explore how we&apos;ve helped businesses achieve digital success through innovative solutions and strategic expertise.',
};

/**
 * CaseStudiesHeader Component
 * Static content that doesn't depend on data fetching
 */
function CaseStudiesHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-dark">
        Case Studies
      </h1>
      <p className="text-lg text-secondary-dark">
        See how we&apos;ve helped businesses like yours achieve digital success through innovative solutions and strategic expertise.
      </p>
    </div>
  );
}

/**
 * FilterSkeleton Component
 * Skeleton UI for filters while they're loading
 */
function FilterSkeleton() {
  return (
    <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8" />
  );
}

/**
 * GridSkeleton Component
 * Skeleton UI for case studies grid while it's loading
 */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64 animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Async component for filters
 * This allows for parallel data fetching with streaming
 */
async function CaseStudiesFiltersSection() {
  // Data fetching happens directly in this async Server Component
  const caseStudies = await getCaseStudies();
  const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
  
  return <CaseStudiesFilter industries={industries} />;
}

/**
 * Async component for case study content
 * This allows for parallel data fetching with streaming
 */
async function CaseStudiesContentSection() {
  // Data fetching happens directly in this async Server Component
  const caseStudies = await getCaseStudies();
  
  // Extract industries for the required _industries prop
  const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
  
  return <CaseStudiesClientWrapper 
    caseStudies={caseStudies} 
    _industries={industries} 
  />;
}

/**
 * Main page component
 * Orchestrates the layout and streaming with appropriate Suspense boundaries
 */
export default function CaseStudiesPage() {
  return (
    <PageLayout>
      <SectionContainer className="py-24 px-4 md:px-6">
        {/* Static header renders immediately (no Suspense needed) */}
        <CaseStudiesHeader />
        
        {/* Filter section streams in with appropriate fallback */}
        <Suspense fallback={<FilterSkeleton />}>
          <CaseStudiesFiltersSection />
        </Suspense>
        
        {/* Case studies content streams in with appropriate fallback */}
        <Suspense fallback={<GridSkeleton />}>
          <CaseStudiesContentSection />
        </Suspense>
      </SectionContainer>
    </PageLayout>
  );
}
