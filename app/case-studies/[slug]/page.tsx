import { Suspense } from 'react';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";
import { CaseStudyClientWrapper } from "@/components/case-studies/case-study-client-wrapper";

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

/**
 * HeaderSkeleton Component
 * Skeleton UI for the case study header while it's loading
 */
function HeaderSkeleton() {
  return (
    <div className="py-8">
      <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-6 w-3/4 max-w-xl"></div>
      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8 w-1/2 max-w-md"></div>
    </div>
  );
}

/**
 * ContentSkeleton Component
 * Skeleton UI for the case study content while it's loading
 */
function ContentSkeleton() {
  return (
    <div className="py-8 space-y-8">
      <div className="space-y-4">
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/4"></div>
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-5/6"></div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * RelatedSkeleton Component
 * Skeleton UI for related case studies while they're loading
 */
function RelatedSkeleton() {
  return (
    <div className="py-8">
      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/4 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="h-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
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
