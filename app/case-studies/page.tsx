/**
 * Case Studies Index Page
 * 
 * This is the main entry point for viewing all case studies.
 * Uses Next.js 15 streaming with appropriate Suspense boundaries
 * and standardized skeleton components for a consistent loading experience.
 */

import { Suspense } from 'react';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { Skeleton, CardGridSkeleton } from "@/components/ui/skeleton";
import { caseStudies } from "@/data/case-studies";
import { createMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema, WebPageSchema } from "@/lib/seo/structured-data";
import { CaseStudiesFilter } from "./components/case-studies-filter";
import { CaseStudyCardServer } from "@/components/case-studies/case-study-card-server";

/**
 * Generate metadata for the case studies index page
 */
export const metadata = createMetadata({
  title: "Case Studies",
  description: "Explore our portfolio of successful client projects and digital transformations across various industries.",
  keywords: ['case studies', 'portfolio', 'client projects', 'success stories', 'digital transformation'],
  canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com'}/case-studies`,
});

// Removed unused components CaseStudiesHeaderSkeleton and CaseStudiesHeader
// as we're now using inline elements in the main component

/**
 * Main Case Studies Page Component
 */
export default function CaseStudiesPage() {
  // Extract unique industries for filtering using Array.reduce to be compatible with current TS config
  const industries = caseStudies
    .map(study => study.industry)
    .filter((industry, index, self) => self.indexOf(industry) === index)
    .sort();
  
  return (
    <PageLayout className="bg-gradient-to-b from-[#0c1117] to-[#0c1117] min-h-screen">
      {/* Add structured data */}
      <WebPageSchema
        title="Case Studies - CyberHand"
        description="Explore our portfolio of successful client projects and digital transformations across various industries."
        url="/case-studies"
        datePublished="2023-01-01"
        dateModified={new Date().toISOString()}
        imageUrl="/images/case-studies-hero.jpg"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Case Studies', url: '/case-studies' },
        ]}
      />
      
      {/* Hero section with title and description - exact same structure as services page */}
      <SectionContainer className="pt-20 lg:pt-28 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Case Studies
        </h1>
        <p className="text-gray-300 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-16">
          Explore our portfolio of successful client projects across various industries.
          Each case study showcases our approach, solutions, and the results we achieved.
        </p>
      </SectionContainer>
      
      {/* Filter component properly centered - only visible if multiple industries exist */}
      {industries.length > 1 && (
        <SectionContainer className="mb-10">
          <Suspense fallback={<div className="h-12 flex justify-center"><Skeleton className="w-64 h-10" /></div>}>
            <div className="flex justify-center">
              <CaseStudiesFilter industries={industries} />
            </div>
          </Suspense>
        </SectionContainer>
      )}
      
      {/* Main case studies grid - structured like services page */}
      <SectionContainer className="pb-20">
        <Suspense fallback={<CardGridSkeleton count={6} columns={3} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {caseStudies.map((caseStudy, index) => (
              <div key={caseStudy.id} className="transform transition-transform hover:-translate-y-2 duration-300">
                <CaseStudyCardServer caseStudy={caseStudy} index={index} />
              </div>
            ))}
          </div>
        </Suspense>
      </SectionContainer>
    </PageLayout>
  );
}