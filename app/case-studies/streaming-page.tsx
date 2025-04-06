/**
 * Streaming Case Studies Page Implementation
 * 
 * This file demonstrates streaming for larger data-dependent UI sections
 * using React 19 and Next.js 15 features. This implementation shows how to:
 * 
 * 1. Use React Suspense for progressive UI rendering
 * 2. Implement streaming at various levels of the component tree
 * 3. Handle data fetching with streaming resources
 * 4. Improve perceived performance for users
 */

import { Suspense } from 'react';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { CaseStudiesFilter } from "./components/case-studies-filter";
import { StreamingCaseStudyGrid } from "./components/streaming-case-study-grid";
import { createCaseStudiesStream, getStreamingPaginatedCaseStudies } from "@/lib/data/streaming-case-studies";

// Static metadata export
export const metadata = {
  title: 'Case Studies | CyberHand',
  description: 'Explore how we\'ve helped businesses achieve digital success through innovative solutions and strategic expertise.',
};

// Header component that renders immediately
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

// Industry filters component with its own suspense boundary
function IndustryFilters() {
  // This function will use React suspense to wait for industries
  const caseStudiesResource = createCaseStudiesStream();
  
  // This will suspend rendering until case studies are available
  const caseStudies = caseStudiesResource.read();
  
  // Get unique industries for filter - done on the server
  const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
  
  return <CaseStudiesFilter industries={industries} />;
}

// Case studies with streaming implementation
function StreamingCaseStudiesWithData({ page = 1 }: { page?: number }) {
  // This is an async Server Component that will stream its content
  const fetchCaseStudies = async () => {
    // Get paginated case studies
    const { caseStudies, totalPages, currentPage } = await getStreamingPaginatedCaseStudies(page, 6);
    return { caseStudies, totalPages, currentPage };
  };
  
  // This component implicitly uses suspense because it's async
  const CaseStudiesContent = async () => {
    const { caseStudies } = await fetchCaseStudies();
    return <StreamingCaseStudyGrid caseStudies={caseStudies} />;
  };
  
  return (
    <div className="case-studies-streaming-container">
      <Suspense fallback={
        <div className="text-center py-8">
          <div className="animate-pulse h-8 w-36 bg-gray-200 rounded mx-auto mb-12"></div>
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
      }>
        <CaseStudiesContent />
      </Suspense>
    </div>
  );
}

/**
 * Main streaming page component
 * Demonstrates Next.js 15 streaming with React Server Components
 */
export default function StreamingCaseStudiesPage() {
  return (
    <PageLayout>
      <SectionContainer className="py-24 px-4 md:px-6">
        {/* Header renders immediately - no suspense needed */}
        <CaseStudiesHeader />
        
        {/* Industry filters with suspense boundary */}
        <Suspense fallback={<div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8"></div>}>
          <IndustryFilters />
        </Suspense>
        
        {/* Main case studies content with streaming */}
        <StreamingCaseStudiesWithData />
      </SectionContainer>
    </PageLayout>
  );
}
