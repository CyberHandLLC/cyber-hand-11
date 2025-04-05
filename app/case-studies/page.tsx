/**
 * Case Studies Page - Server Component
 * 
 * This approach uses React Server Components to: 
 * - Fetch data on the server
 * - Render static content on the server
 * - Only send interactive filtering UI to the client
 */

import { Suspense } from 'react';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
// Removed unused import: CaseStudyCardServer
import { getCaseStudies } from "@/lib/data/case-studies";
import { CaseStudiesFilter } from "./components/case-studies-filter";
import { CaseStudiesClientWrapper } from "./components/case-studies-client-wrapper";

// Metadata for the page
export const metadata = {
  title: 'Case Studies | CyberHand',
  description: 'Explore how we&apos;ve helped businesses achieve digital success through innovative solutions and strategic expertise.',
};

/**
 * Server Component - Main page function
 * This demonstrates the async data fetching pattern in RSC
 */
export default async function CaseStudiesPage() {
  // Fetch case studies data on the server
  // This uses the React cache() mechanism for efficient data fetching
  const caseStudies = await getCaseStudies();
  
  // Get unique industries for filter - done on the server
  const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
  
  return (
    <PageLayout>
      <SectionContainer className="py-24 px-4 md:px-6">
        {/* Static header content rendered entirely on the server */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-dark">
            Case Studies
          </h1>
          <p className="text-lg text-secondary-dark">
            See how we&apos;ve helped businesses like yours achieve digital success through innovative solutions and strategic expertise.
          </p>
        </div>
        
        {/* Client component boundary for interactive filtering */}
        <Suspense fallback={<div className="text-center">Loading filters...</div>}>
          <CaseStudiesFilter industries={industries} />
        </Suspense>
        
        {/* Client wrapper component to handle filtered display */}
        <Suspense fallback={<div className="text-center py-8">Loading case studies...</div>}>
          <CaseStudiesClientWrapper 
            caseStudies={caseStudies} 
            _industries={industries}
          />
        </Suspense>
      </SectionContainer>
    </PageLayout>
  );
}
