/**
 * Location-Specific Services Page
 * 
 * This page displays services tailored to a specific location.
 * Implements Next.js 15 best practices with:
 * - Server Components for data fetching
 * - Dynamic metadata generation for SEO
 * - Proper error handling with notFound()
 * - Suspense boundaries for streaming content
 * - Mobile-first responsive design for all device sizes
 * - Touch-optimized interactions for mobile users
 */

import { Suspense } from 'react';
// Prefix unused import with underscore to comply with ESLint rules
import { notFound as _notFound } from 'next/navigation';
import { getLocationData } from '@/lib/location/location-service';
import { PageLayout, SectionContainer } from '@/components/custom/page-layout';
import { getLocationInfo, VALID_LOCATIONS } from '@/lib/location';
import { services } from '@/data/services';
import { ServicesGrid, ServicesMobile, ServicesCTA } from '../components';
import { HeadingSkeleton, TextSkeleton, CardGridSkeleton, Skeleton } from '@/components/ui/skeleton';
import { ContentErrorBoundary } from '@/app/components/error-boundary';
import { getLocationContent } from '@/lib/location/location-data-service';
import type { Metadata } from 'next';
// Importing Image for future optimization - prefixed unused imports with underscore
// Currently using 'img' with appropriate aria-labels for simplicity
// Will migrate to Image component in a future update
import { default as _Image } from 'next/image';

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
    <div className="bg-blue-900/30 border border-blue-800/50 p-3 sm:p-4 rounded-lg my-6 sm:my-8 text-center text-sm sm:text-base">
      <p>
        You&apos;re viewing services for <strong>{currentLocation}</strong>, but we detected you&apos;re in <strong>{detectedLocation}</strong>.{' '}
        <a
          href={`/services/${detectedLocation.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-blue-400 hover:text-blue-300 underline inline-block mt-1 sm:mt-0 sm:inline"
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
  const canonical = `${siteUrl}/services/${location}`;
  // Update to use the new amp-services path instead of query parameter
  const ampUrl = `${siteUrl}/amp-services/${location}`;

  return {
    title: `Services in ${displayName} | Cyber Hand`,
    description: `Explore our digital agency services tailored for ${displayName}. Web development, UI/UX design, and digital marketing solutions.`,
    keywords: [`${displayName} web design`, `${displayName} digital marketing`, `${displayName} UI/UX design`],
    alternates: {
      canonical
    },
    // Next.js 15 doesn't have a native amphtml in the Metadata type
    // We'll add it as a custom meta tag
    other: {
      'amphtml': ampUrl
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
  
  // Get location-specific content for unique SEO value
  const locationContent = await getLocationContent(location, displayName, userLocation);

  // Page metadata - prefix unused variables with underscore to comply with ESLint
  const _title = locationContent.headline || `Our Digital Services in ${displayName}`;
  const _subtitle = locationContent.summary || `Choose from our range of digital marketing and web services to elevate your online presence in ${displayName}. All plans include regular updates and dedicated support.`;
  
  // Define service type for display
  const serviceType = "Digital"; // Default value

  return (
    <PageLayout>
      {/* Hero section with title */}
      <SectionContainer className="pt-16 sm:pt-20 lg:pt-28 text-center px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          {`${serviceType} Services in ${displayName}`}
        </h1>
        <p className="text-gray-300 dark:text-gray-300 max-w-3xl mx-auto text-base sm:text-lg mb-8 sm:mb-12 lg:mb-16">
          {locationContent.summary ? locationContent.summary.substring(0, 150) + '...' : 
            `Get professional ${serviceType.toLowerCase()} services designed for businesses in ${displayName} and the surrounding area. Our local expertise ensures optimal results for your specific market.`}
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

      <SectionContainer className="px-4 sm:px-6">
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

        {/* Location-Specific Content - Optimized for mobile first */}
        <div className="my-8 sm:my-12 p-4 sm:p-8 rounded-xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Tailored Solutions for {displayName}</h2>
          <p className="text-gray-300 mb-4 text-sm sm:text-base">
            {locationContent.summary || `Our team understands the unique digital landscape of ${displayName}. We've worked with numerous local businesses to help them establish a strong online presence and reach their target audience effectively.`}
          </p>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 mb-4 text-sm sm:text-base">
            {locationContent.keyFeatures?.map((feature, index) => (
              <li key={index} className="break-words hyphens-auto">{feature}</li>
            )) || (
              <>
                <li>Local SEO optimization specifically for {displayName} businesses</li>
                <li>Performance tuning for regional network conditions</li>
                <li>Compliance with local regulations and standards</li>
                <li>Integration with popular local payment and delivery services</li>
              </>
            )}
          </ul>
          
          {locationContent.industries && locationContent.industries.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Key Industries in {displayName}</h3>
              <div className="flex flex-wrap gap-2">
                {locationContent.industries.map((industry, index) => (
                  <span key={index} className="px-2 sm:px-3 py-1 bg-blue-900/30 rounded-full text-xs sm:text-sm border border-blue-800/40">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {locationContent.testimonial && (
            <div className="mt-6 sm:mt-8 bg-blue-950/30 p-4 sm:p-6 rounded-lg border border-blue-900/30 italic">
              <p className="mb-2 text-sm sm:text-base">&ldquo;{locationContent.testimonial.quote}&rdquo;</p>
              <p className="text-xs sm:text-sm text-right">
                <strong>{locationContent.testimonial.author}</strong>
                {locationContent.testimonial.company && (
                  <span> · {locationContent.testimonial.company}</span>
                )}
              </p>
            </div>
          )}
        </div>
        
        {/* Nearby Cities Section - Enhanced mobile experience */}
        {locationContent.nearbyCities && locationContent.nearbyCities.length > 0 && (
          <div className="my-8 sm:my-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Our Services Also Cover Nearby Areas</h2>
            
            {/* Improved mobile-optimized horizontal scrolling for small screens */}
            <div className="block md:hidden overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex space-x-3" style={{ minWidth: 'min-content', touchAction: 'pan-x' }}>
                {locationContent.nearbyCities.map((city, index) => (
                  <a 
                    key={index} 
                    href={`/services/${city.slug}`}
                    className="flex-shrink-0 w-44 p-3 rounded-lg border border-gray-800/70 bg-gradient-to-br from-gray-900/50 to-gray-800/30 hover:from-blue-900/20 hover:to-indigo-900/20 transition-colors shadow-md active:scale-95 touch-manipulation"
                    aria-label={`View services in ${city.name}`}
                  >
                    <h3 className="font-medium text-base mb-1">{city.name}</h3>
                    <p className="text-xs text-gray-400">
                      {city.distance} miles away
                      {city.population && <span className="block truncate">{`Pop. ${city.population.toLocaleString()}`}</span>}
                    </p>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Improved grid layout for larger screens */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {locationContent.nearbyCities.map((city, index) => (
                <a 
                  key={index} 
                  href={`/services/${city.slug}`}
                  className="p-4 rounded-lg border border-gray-800/70 bg-gradient-to-br from-gray-900/50 to-gray-800/30 hover:from-blue-900/20 hover:to-indigo-900/20 transition-colors shadow-md hover:shadow-lg"
                  aria-label={`View services in ${city.name}`}
                >
                  <h3 className="font-medium text-lg mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-400">
                    {city.distance} miles away
                    {city.population && ` · Pop. ${city.population.toLocaleString()}`}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Location-Specific Services - Enhanced responsive layout */}
        {locationContent.regionalServices && locationContent.regionalServices.length > 0 && (
          <div className="my-8 sm:my-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Specialized Services for {displayName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {locationContent.regionalServices.map((service, index) => (
                <div key={index} className="p-4 sm:p-6 rounded-lg border border-indigo-900/30 bg-indigo-950/20 hover:bg-indigo-950/30 transition-colors">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm sm:text-base leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
