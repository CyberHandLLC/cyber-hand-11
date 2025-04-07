/**
 * Case Studies Loading UI Component
 * 
 * This component provides a skeleton UI for the case studies page
 * while the main content is loading. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states and uses the standardized
 * skeleton component library for consistent UX.
 */

import { HeadingSkeleton, TextSkeleton, CardGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function CaseStudiesLoading() {
  return (
    <div className="py-24 px-4 md:px-6">
      {/* Static header placeholder */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <HeadingSkeleton level={1} width="50%" className="mx-auto" />
        <TextSkeleton width="75%" className="mx-auto" />
      </div>
      
      {/* Filter placeholder */}
      <Skeleton className="h-12 mb-8" aria-label="Loading filters..." />
      
      {/* Grid placeholder using standardized card grid skeleton */}
      <CardGridSkeleton count={6} columns={3} aria-label="Loading case studies..." />
    </div>
  );
}
