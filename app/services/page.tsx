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

import { Suspense } from 'react';
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { services } from "@/data/services";
import { ServicesGrid, ServicesMobile, ServicesCTA } from "./components";
import { HeadingSkeleton, TextSkeleton, CardGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ContentErrorBoundary } from "@/app/components/error-boundary";

/**
 * Services Grid Loading Skeleton
 */
function ServicesGridSkeleton() {
  return <CardGridSkeleton count={5} columns={3} className="mb-12" />;
}

/**
 * Services Mobile Loading Skeleton
 */
function ServicesMobileSkeleton() {
  return (
    <div className="space-y-4 mb-12">
      <HeadingSkeleton level={3} width="60%" className="mx-auto" />
      <div className="bg-gray-900/30 p-4 rounded-lg h-56"></div>
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton 
            key={i} 
            className="w-2 h-2 rounded-full" 
            animationDelay={`${i * 0.1}s`} 
          />
        ))}
      </div>
    </div>
  );
}

/**
 * CTA Section Loading Skeleton
 */
function CTASkeleton() {
  return (
    <div className="mt-16 p-8 rounded-xl bg-gray-900/30 border border-gray-800/50 text-center">
      <HeadingSkeleton level={2} width="50%" className="mx-auto mb-4" />
      <TextSkeleton width="70%" className="mx-auto mb-6" />
      <Skeleton className="h-10 w-32 mx-auto" />
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
  const subtitle = "Choose from our range of digital marketing and web services to elevate your online presence. All plans include regular updates and dedicated support.";
  

  return (
    <PageLayout>
      {/* Hero section with title */}
      <SectionContainer className="pt-20 lg:pt-28 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-gray-300 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-16">
          {subtitle}
        </p>
      </SectionContainer>
      
      <SectionContainer>
        {/* Desktop Service Grid with ErrorBoundary and Suspense */}
        <div className="hidden md:block">
          <ContentErrorBoundary>
            <Suspense fallback={<ServicesGridSkeleton />}>
              <ServicesGrid services={services} />
            </Suspense>
          </ContentErrorBoundary>
        </div>
        
        {/* Mobile Service Carousel with ErrorBoundary and Suspense */}
        <div className="md:hidden">
          <ContentErrorBoundary>
            <Suspense fallback={<ServicesMobileSkeleton />}>
              <ServicesMobile services={services} />
            </Suspense>
          </ContentErrorBoundary>
        </div>
        
        {/* CTA Section with ErrorBoundary and Suspense */}
        <ContentErrorBoundary>
          <Suspense fallback={<CTASkeleton />}>
            <ServicesCTA />
          </Suspense>
        </ContentErrorBoundary>
      </SectionContainer>
    </PageLayout>
  );
}