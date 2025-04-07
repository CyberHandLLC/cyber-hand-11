import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";
import { CaseStudyClientWrapper } from "@/components/case-studies/case-study-client-wrapper";
import { createCaseStudyMetadata } from "@/lib/seo/metadata";
import { ArticleSchema, BreadcrumbSchema } from "@/lib/seo/structured-data";

/**
 * CaseStudyNotFound Component
 * Displayed when a case study is not found
 */
function CaseStudyNotFound() {
  return (
    <PageLayout>
      <SectionContainer className="py-24">
        <div className="text-center">
          <p>Case study not found</p>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}

import { HeadingSkeleton, TextSkeleton, ImageSkeleton, SectionSkeleton, CardGridSkeleton } from "@/components/ui/skeleton";

/**
 * CaseStudyDetailSkeleton Component
 * Skeleton UI for the case study detail page while it's loading.
 * Uses standardized skeleton components for consistency across the app.
 */
function CaseStudyDetailSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="py-8">
        <HeadingSkeleton level={1} width="75%" className="max-w-xl" />
        <TextSkeleton width="50%" className="max-w-md" />
      </div>
      
      {/* Main content */}
      <div className="py-8 space-y-8">
        <SectionSkeleton />
        
        <div className="space-y-4">
          <HeadingSkeleton level={3} width="25%" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageSkeleton height="200px" />
            <ImageSkeleton height="200px" />
          </div>
        </div>
      </div>
      
      {/* Related section */}
      <div className="py-8">
        <HeadingSkeleton level={3} width="25%" className="mb-6" />
        <CardGridSkeleton count={3} columns={3} />
      </div>
    </div>
  );
}

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
 * ErrorBoundary for case study page
 * Provides a fallback UI when errors occur during data fetching or rendering
 */
function CaseStudyErrorFallback({ error }: { error: Error }) {
  return (
    <PageLayout>
      <SectionContainer className="py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || "There was an error loading this case study."}
          </p>
          <Link href="/case-studies" className="text-primary hover:underline">
            Return to all case studies
          </Link>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}

/**
 * Generate metadata for the case study page
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = caseStudies.find(cs => cs.id === slug || cs.slug === slug);
  
  if (!caseStudy) {
    return {};
  }
  
  return createCaseStudyMetadata(caseStudy);
}

/**
 * Main Case Study Page component - Server Component
 * Uses Next.js 15 streaming with a single Suspense boundary for better performance
 * and consistent error handling
 */
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await and destructure params
  const { slug } = await params;
  
  // Find case study data for structured data
  const caseStudy = caseStudies.find(cs => cs.id === slug || cs.slug === slug);
  
  return (
    <ErrorBoundary fallback={<CaseStudyErrorFallback error={new Error("Failed to load case study")} />}>
      <PageLayout>
        {/* Add structured data if we have a valid case study */}
        {caseStudy && (
          <>
            <ArticleSchema
              title={caseStudy.title}
              description={caseStudy.challenge}
              url={`/case-studies/${slug}`}
              imageUrl={caseStudy.imageUrl || '/images/case-studies/default.jpg'}
              datePublished={new Date().toISOString()}
              dateModified={new Date().toISOString()}
              authorName="CyberHand Team"
              category={caseStudy.industry}
              tags={[caseStudy.industry, 'case study', 'project', ...caseStudy.services]}
            />
            <BreadcrumbSchema 
              items={[
                { name: 'Home', url: '/' },
                { name: 'Case Studies', url: '/case-studies' },
                { name: caseStudy.title, url: `/case-studies/${slug}` }
              ]}
            />
          </>
        )}
        
        <Suspense fallback={<CaseStudyDetailSkeleton />}>
          <CaseStudyContent slug={slug} />
        </Suspense>
      </PageLayout>
    </ErrorBoundary>
  );
}
