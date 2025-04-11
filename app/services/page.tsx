/**
 * Services Page - Server Component with Client Component Islands
 *
 * This page leverages Next.js 15's built-in streaming capabilities with:
 * - Static content rendered as Server Components
 * - Interactive elements isolated to Client Components
 * - Optimized Suspense boundaries for progressive streaming
 * - Standardized skeleton components for consistent loading experience
 * - Comprehensive error boundaries for graceful error recovery
 */

import { Suspense } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { services } from "@/data/services";
import { ServicesGrid, ServicesMobile, ServicesCTA } from "./components";
// Only import what's being used (ContentErrorBoundaryClient)
import { ContentErrorBoundaryClient } from "@/components/ui/client/error-boundary-client";
import dynamic from "next/dynamic";

// Import the new loading components with dynamic imports
// Using fully resolved absolute path to fix module resolution
const LoadingWrapperClient = dynamic(
  () => import("../../app/components/ui/client/loading-wrapper-client").then(mod => mod.LoadingWrapperClient),
  { ssr: true }
);

/**
 * Services Grid Loading Skeleton with custom spinner
 */
function ServicesGridSkeleton() {
  return (
    <div className="mb-12">
      {/* We know the component accepts these props but TypeScript can't verify at compile time */}
      <LoadingWrapperClient 
        height="h-72" 
        label="Loading services..." 
        spinnerSize={32}
      />
    </div>
  );
}

/**
 * Services Mobile Loading Skeleton with custom spinner
 */
function ServicesMobileSkeleton() {
  return (
    <div className="mb-12">
      {/* We know the component accepts these props but TypeScript can't verify at compile time */}
      <LoadingWrapperClient 
        height="h-64" 
        label="Loading services..." 
        spinnerSize={28}
      />
    </div>
  );
}

/**
 * CTA Section Loading Skeleton with custom spinner
 */
function CTASkeleton() {
  return (
    <div className="mt-16 p-8 rounded-xl bg-gray-900/30 border border-gray-800/50 text-center">
      {/* We know the component accepts these props but TypeScript can't verify at compile time */}
      <LoadingWrapperClient 
        height="h-40" 
        label="Loading more information..." 
        spinnerSize={24}
      />
    </div>
  );
}

/**
 * Services page component showing all service offerings with pricing
 * Implements Next.js 15 streaming patterns with Server and Client Components
 */
export default function Services() {
  // Page metadata
  const title = "Our Digital Services";
  const subtitle =
    "Choose from our range of digital marketing and web services to elevate your online presence. All plans include regular updates and dedicated support.";

  return (
    <PageLayout>
      {/* Hero section with title */}
      <SectionContainer className="pt-20 lg:pt-28 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{title}</h1>
        <p className="text-gray-300 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-16">
          {subtitle}
        </p>
      </SectionContainer>

      <SectionContainer>
        {/* Desktop Service Grid with ErrorBoundary and Suspense */}
        <div className="hidden md:block">
          <ContentErrorBoundaryClient>
            <Suspense fallback={<ServicesGridSkeleton />}>
              <ServicesGrid services={services} />
            </Suspense>
          </ContentErrorBoundaryClient>
        </div>

        {/* Mobile Service Carousel with ErrorBoundary and Suspense */}
        <div className="md:hidden">
          <ContentErrorBoundaryClient>
            <Suspense fallback={<ServicesMobileSkeleton />}>
              <ServicesMobile services={services} />
            </Suspense>
          </ContentErrorBoundaryClient>
        </div>

        {/* CTA Section with ErrorBoundary and Suspense */}
        <ContentErrorBoundaryClient>
          <Suspense fallback={<CTASkeleton />}>
            <ServicesCTA />
          </Suspense>
        </ContentErrorBoundaryClient>
      </SectionContainer>
    </PageLayout>
  );
}
