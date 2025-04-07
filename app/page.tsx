/**
 * Homepage - Server Component Entry Point
 * 
 * This page implements Next.js 15 streaming best practices:
 * - Main page is a Server Component for improved rendering
 * - Interactive elements isolated to Client Components
 * - Appropriate Suspense boundaries for progressive streaming
 * - Integration with route-level loading.tsx for initial loading state
 * - Standardized skeleton components for consistent loading experience
 * - Error boundaries for graceful error handling
 * - SEO optimized with metadata and structured data
 */

import { Suspense } from 'react';
import { CyberLogo } from "@/components/custom/cyber-logo";
import { HomepageButtons } from "./components/homepage-buttons";
import { CircuitEffectsWrapper } from "./components/circuit-effects-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentErrorBoundary } from "@/app/components/error-boundary";
import { createMetadata } from "@/lib/seo/metadata";
import { WebPageSchema } from "@/lib/seo/structured-data";
import { trackPageView } from "@/lib/analytics/geolocation-tracker";

/**
 * Static Hero Content Component - Server Component
 * Does not depend on data fetching, interactive elements, or client state
 */
function HomeHero() {
  return (
    <div className="text-center">
      {/* CyberHand Logo */}
      <CyberLogo size="md" className="mb-6 animate-fade-in" />

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8 animate-fade-in">
        <span className="cyber-gradient-text">
          Next-Gen Digital Agency
        </span>
      </h1>
    </div>
  );
}

/**
 * CircuitEffectsSkeleton Component
 * Standardized placeholder while circuit effects are loading
 */
function CircuitEffectsSkeleton() {
  return (
    <div className="absolute inset-0 z-5 opacity-10 pointer-events-none" aria-hidden="true">
      {/* Simple placeholder for circuit effects */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className="absolute h-px bg-cyan-500/20"
          pulse={false}
          style={{
            width: `${50 + i * 20}px`,
            top: `${20 + i * 25}%`,
            left: `${10 + i * 15}%`,
            opacity: 0.3,
            transform: 'rotate(45deg)',
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
    </div>
  );
}

/**
 * Button Skeleton Component
 * Standardized placeholder for homepage buttons
 */
function ButtonsSkeleton() {
  return (
    <div className="inline-flex flex-wrap gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
      <Skeleton className="h-10 w-32 bg-cyan-500/30 rounded" />
      <Skeleton 
        className="h-10 w-32 bg-gray-700/30 border border-gray-700/50 rounded"
        animationDelay="0.15s"
      />
    </div>
  );
}

/**
 * Generate metadata for the homepage
 */
export const metadata = createMetadata({
  // No title specified = uses the default from layout.tsx
  description: "CyberHand is a next-generation digital agency specializing in cutting-edge web development, design, and digital marketing services.",
  keywords: ['digital agency', 'web development', 'UI/UX design', 'digital marketing', 'CyberHand'],
  // Homepage gets canonical without trailing slash
  canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com',
});

/**
 * Home Page - Main Component
 * Server Component that delegates interactive elements to Client Components
 * Now enhanced with standardized skeleton components, error boundaries, and SEO optimization
 */
export default function Home() {
  // Track page view with server-side geolocation data
  // Geolocation is captured by middleware and passed via request headers
  trackPageView('/', 'homepage_view');
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-circuit-bg">
      {/* Structured data for the homepage */}
      <WebPageSchema
        title="CyberHand | Next-Gen Digital Agency"
        description="CyberHand is a next-generation digital agency specializing in cutting-edge web development, design, and digital marketing services."
        url="/"
        datePublished="2023-01-01"
        dateModified={new Date().toISOString()}
        imageUrl="/images/og-image.jpg"
      />
      {/* Background layers */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Content container */}
      <div className="relative z-20 px-4 py-16 sm:px-6 lg:px-8 w-full max-w-4xl text-center">
        {/* Static hero content rendered immediately */}
        <HomeHero />

        {/* Interactive buttons in a Client Component with error boundary */}
        <ContentErrorBoundary>
          <Suspense fallback={<ButtonsSkeleton />}>
            <HomepageButtons />
          </Suspense>
        </ContentErrorBoundary>

        {/* Circuit effects with appropriate Suspense boundary and error handling */}
        <ContentErrorBoundary>
          <Suspense fallback={<CircuitEffectsSkeleton />}>
            <CircuitEffectsWrapper />
          </Suspense>
        </ContentErrorBoundary>
        

      </div>
    </main>
  );
}
