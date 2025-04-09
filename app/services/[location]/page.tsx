/**
 * Location-Specific Services Page
 * 
 * This page displays services tailored to a specific location.
 * Implements Next.js 15 best practices with:
 * - Server Components for data fetching
 * - Dynamic metadata generation for SEO
 * - Proper error handling with notFound()
 * - Suspense boundaries for streaming content
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getLocationData } from '@/lib/location/location-service';
import { PageLayout, SectionContainer } from '@/components/custom/page-layout';
import { getLocationInfo, VALID_LOCATIONS } from '@/lib/location';
import { services } from '@/data/services';
import { ServicesGrid, ServicesMobile, ServicesCTA } from '../components';
import { HeadingSkeleton, TextSkeleton, CardGridSkeleton, Skeleton } from '@/components/ui/skeleton';
import { ContentErrorBoundary } from '@/app/components/error-boundary';
import type { Metadata } from 'next';

// Skeleton components reused from services/page.tsx
function ServicesGridSkeleton() {
  return <CardGridSkeleton count={5} columns={3} className="mb-12" />;
}

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
 * Location Banner Component
 * Shows a notice when viewing a different location than detected
 */
function LocationBanner({
  currentLocation,
  detectedLocation
}: {
  currentLocation: string;
  detectedLocation?: string;
}) {
  // Only show banner if viewing a different location than detected
  if (!detectedLocation || currentLocation.toLowerCase() === detectedLocation.toLowerCase()) {
    return null;
  }

  return (
    <div className="bg-blue-900/30 border border-blue-800/50 p-4 rounded-lg my-8 text-center">
      <p>
        You&apos;re viewing services for <strong>{currentLocation}</strong>, but we detected you&apos;re in <strong>{detectedLocation}</strong>.{' '}
        <a
          href={`/services/${detectedLocation.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          View services for {detectedLocation}
        </a>
      </p>
    </div>
  );
}

/**
 * Generate metadata for SEO
 * Following Next.js 15 dynamic route patterns
 */
type Params = {
  location: string;
};

export async function generateMetadata({
  params
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  // In Next.js 15, params are wrapped in a Promise that must be awaited
  const { location } = await params;
  const locationInfo = await getLocationInfo(location);

  if (!locationInfo.isValid) {
    return {
      title: 'Services | Cyber Hand',
      description: 'Explore our digital agency services. Web development, UI/UX design, and digital marketing solutions.'
    };
  }

  const { displayName } = locationInfo;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com';

  return {
    title: `Services in ${displayName} | Cyber Hand`,
    description: `Explore our digital agency services tailored for ${displayName}. Web development, UI/UX design, and digital marketing solutions.`,
    alternates: {
      canonical: `${siteUrl}/services/${location}`,
    },
    openGraph: {
      title: `Services in ${displayName} | Cyber Hand`,
      description: `Explore our digital agency services tailored for ${displayName}. Web development, UI/UX design, and digital marketing solutions.`,
      url: `${siteUrl}/services/${location}`,
      siteName: 'Cyber Hand',
      locale: 'en_US',
      type: 'website',
    }
  };
}

/**
 * Main page component for location-specific services
 * Following Next.js 15 dynamic route patterns with Promise-based params
 */
export default async function LocationServicesPage({
  params
}: {
  params: Promise<Params>
}) {
  // In Next.js 15, params are wrapped in a Promise that must be awaited
  const { location } = await params;

  // Get location info - our new implementation treats most locations as valid
  const locationInfo = await getLocationInfo(location);

  // Format the location for display
  const { displayName } = locationInfo;

  // Get user's actual location from headers for comparison
  const userLocation = getLocationData();

  // Page metadata
  const title = `Our Digital Services in ${displayName}`;
  const subtitle = `Choose from our range of digital marketing and web services to elevate your online presence in ${displayName}. All plans include regular updates and dedicated support.`;

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

        {/* Location Banner - only show for detected locations */}
        {userLocation.city && userLocation.city !== displayName && (
          <LocationBanner
            currentLocation={displayName}
            detectedLocation={userLocation.city}
          />
        )}
        
        {/* Show a note for dynamically generated location pages */}
        {!VALID_LOCATIONS.includes(location.toLowerCase()) && (
          <div className="bg-amber-900/30 border border-amber-800/50 p-4 rounded-lg my-4">
            <p className="text-sm">
              This is a dynamically generated location page. Our services are available in {displayName} and most other locations.
            </p>
          </div>
        )}
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

        {/* Location-Specific Content */}
        <div className="my-16 p-8 rounded-xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30">
          <h2 className="text-2xl font-bold mb-4">Tailored Solutions for {displayName}</h2>
          <p className="text-gray-300 mb-4">
            Our team understands the unique digital landscape of {displayName}. We&apos;ve worked with numerous local businesses
            to help them establish a strong online presence and reach their target audience effectively.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Local SEO optimization specifically for {displayName} businesses</li>
            <li>Performance tuning for regional network conditions</li>
            <li>Compliance with local regulations and standards</li>
            <li>Integration with popular local payment and delivery services</li>
          </ul>
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
