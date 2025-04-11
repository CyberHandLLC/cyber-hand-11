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
import { Skeleton } from "@/components/ui/skeleton";
import { ContentErrorBoundaryClient } from "@/components/ui/client/error-boundary-client";
import dynamic from "next/dynamic";

// Import loading components with dynamic import to maintain proper client/server separation
// Using fully resolved absolute path to fix module resolution
const LoadingWrapperClient = dynamic(
  () => import("../../app/components/ui/client/loading-wrapper-client").then(mod => mod.LoadingWrapperClient),
  { ssr: true }
);

/**
 * ResourcesContentSkeleton Component
 * Enhanced loading UI with spinner for resources content while it's loading
 */
function ResourcesContentSkeleton() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Main content loading spinner */}
      {/* We know the component accepts these props but TypeScript can't verify at compile time */}
      <LoadingWrapperClient 
        height="h-96" 
        label="Loading resources..." 
        spinnerSize={32}
      />
      
      {/* Additional action buttons loading state */}
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
          <ContentErrorBoundaryClient>
            <Suspense fallback={<ResourcesContentSkeleton />}>
              <ResourcesContent />
            </Suspense>
          </ContentErrorBoundaryClient>
        </SectionContainer>
      </section>
    </PageLayout>
  );
}
