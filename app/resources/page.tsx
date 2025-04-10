/**
 * Resources Page - Server Component with Client Component Islands
 *
 * This page leverages Next.js 15's built-in streaming capabilities with:
 * - The page itself as a Server Component
 * - Static content rendered immediately
 * - Interactive elements isolated to Client Components
 * - Optimized Suspense boundaries for progressive streaming
 * - Integration with route-level loading.tsx for initial loading state
 * - Standardized skeleton components for consistent loading experience
 * - Comprehensive error boundaries for graceful error recovery
 */

import { Suspense } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { ResourcesContent } from "./components/resources-content";
import { HeadingSkeleton, TextSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ContentErrorBoundary } from "@/app/components/error-boundary";

/**
 * ResourcesContentSkeleton Component
 * Standardized skeleton UI for resources content while it's loading
 */
function ResourcesContentSkeleton() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <HeadingSkeleton level={1} width="60%" className="mx-auto mb-6" />
      <div className="w-24 h-1 bg-gray-700 mx-auto mb-8"></div>
      <TextSkeleton width="90%" className="mx-auto mb-8" />

      <div className="rounded-lg border border-gray-800/30 bg-gray-900/30 p-8 mb-12">
        <div className="flex items-center justify-center mb-6">
          <Skeleton className="w-12 h-12 rounded-full mr-4" />
          <HeadingSkeleton level={2} width="40%" />
        </div>

        <div className="space-y-4 text-left mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start">
              <Skeleton className="w-2 h-2 rounded-full mt-2 mr-3" animationDelay={`${i * 0.1}s`} />
              <TextSkeleton className="w-11/12" animationDelay={`${i * 0.1}s`} />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <TextSkeleton width="70%" className="mx-auto mb-4" />
          <Skeleton className="h-10 w-40 mx-auto rounded-md" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" animationDelay="0.15s" />
      </div>
    </div>
  );
}

/**
 * Export metadata for SEO
 */
export const metadata = {
  title: "Resources | Cyber Hand",
  description:
    "Access our comprehensive library of digital marketing and web development resources to help grow your business.",
};

/**
 * Resources page component showing upcoming resources
 * Implements Next.js 15 streaming patterns with Server and Client Components
 */
export default function ResourcesPage() {
  return (
    <PageLayout className="bg-gradient-to-b from-[#0c1117] to-[#0c1117] min-h-screen">
      {/* Hero section with coming soon messaging */}
      <section className="py-24 md:py-32 pb-32">
        <SectionContainer>
          <ContentErrorBoundary>
            <Suspense fallback={<ResourcesContentSkeleton />}>
              <ResourcesContent />
            </Suspense>
          </ContentErrorBoundary>
        </SectionContainer>
      </section>
    </PageLayout>
  );
}
