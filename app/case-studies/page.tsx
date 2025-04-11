/**
 * Case Studies Index Page
 *
 * This is the main entry point for viewing all case studies.
 * Uses Next.js 15 streaming with appropriate Suspense boundaries
 * and standardized skeleton components for a consistent loading experience.
 */

import { Suspense } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";
import { createMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSchema, WebPageSchema } from "@/lib/seo/structured-data";
import { CaseStudiesWrapperClient } from "@/components/ui/client/case-studies-wrapper-client";
import {
  ContentErrorBoundaryClient,
} from "@/components/ui/client/error-boundary-client";
import dynamic from "next/dynamic";

// Import loading components with dynamic import to maintain proper client/server separation
// Using fully resolved absolute path to fix module resolution
const LoadingWrapperClient = dynamic(
  () => import("../../app/components/ui/client/loading-wrapper-client").then(mod => mod.LoadingWrapperClient),
  { ssr: true }
);

// For future use (prefixed with underscore per Cyber Hand coding standards)
// import { Skeleton } from "@/components/ui/skeleton";
// import { CardGridSkeleton } from "@/components/ui/skeleton/case-studies-skeletons";
// import { CaseStudyCardServer } from "@/components/case-studies/case-study-card-server";
// import { SectionErrorBoundaryClient } from "@/components/ui/client/error-boundary-client";

/**
 * Generate metadata for the case studies index page
 */
export const metadata = createMetadata({
  title: "Case Studies",
  description:
    "Explore our portfolio of successful client projects and digital transformations across various industries.",
  keywords: [
    "case studies",
    "portfolio",
    "client projects",
    "success stories",
    "digital transformation",
  ],
  canonicalUrl: `/case-studies`, // Use relative URL to avoid hardcoding domain
});

// Removed unused components CaseStudiesHeaderSkeleton and CaseStudiesHeader
// as we're now using inline elements in the main component

/**
 * Main Case Studies Page Component
 */
export default function CaseStudiesPage() {
  // Extract unique industries for filtering using Array methods
  const industries = caseStudies
    .map((study) => study.industry)
    .filter((industry, index, self) => self.indexOf(industry) === index)
    .sort();

  return (
    <PageLayout className="bg-gradient-to-b from-[#0c1117] to-[#0c1117] min-h-screen">
      {/* Add structured data */}
      {WebPageSchema({
        title: "Case Studies - CyberHand",
        description: "Explore our portfolio of successful client projects and digital transformations across various industries.",
        url: "/case-studies",
        datePublished: "2023-01-01",
        dateModified: new Date().toISOString(),
        imageUrl: "/images/case-studies-hero.jpg"
      })}
      {BreadcrumbSchema({
        items: [
          { name: "Home", url: "/" },
          { name: "Case Studies", url: "/case-studies" },
        ]
      })}

      {/* Hero section with title and description - exact same structure as services page */}
      <SectionContainer className="pt-20 lg:pt-28 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Case Studies</h1>
        <p className="text-gray-300 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-16">
          Explore our portfolio of successful client projects across various industries. Each case
          study showcases our approach, solutions, and the results we achieved.
        </p>
      </SectionContainer>

      {/* Case Studies Wrapper with filtering and list display */}
      <SectionContainer className="mb-10">
        <ContentErrorBoundaryClient>
          <Suspense fallback={
            <div className="w-full py-8">
              {/* We know the component accepts these props but TypeScript can't verify at compile time */}
              <LoadingWrapperClient 
                height="h-96" 
                label="Loading case studies..." 
                spinnerSize={36}
              />
            </div>
          }>
            <CaseStudiesWrapperClient caseStudies={caseStudies} categories={industries} />
          </Suspense>
        </ContentErrorBoundaryClient>
      </SectionContainer>

      {/* Bottom spacing and additional information */}
      <SectionContainer className="pb-20">
        <div className="text-center text-gray-400 text-sm">
          <p>Explore our complete portfolio of case studies above</p>
          <p className="mt-2">
            Each case study showcases our approach to solving unique client challenges
          </p>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}
