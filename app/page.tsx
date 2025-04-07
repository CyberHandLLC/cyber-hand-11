/**
 * Homepage - Server Component Entry Point
 * 
 * This page implements Next.js 15 streaming best practices:
 * - Main page is a Server Component for improved rendering
 * - Interactive elements isolated to Client Components
 * - Appropriate Suspense boundaries for progressive streaming
 * - Integration with route-level loading.tsx for initial loading state
 */

import { Suspense } from 'react';
import { CyberLogo } from "@/components/custom/cyber-logo";
import { HomepageButtons } from "./components/homepage-buttons";
import { CircuitEffectsWrapper } from "./components/circuit-effects-wrapper";

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
 * Placeholder while circuit effects are loading
 */
function CircuitEffectsSkeleton() {
  return (
    <div className="absolute inset-0 z-5 opacity-10 pointer-events-none">
      {/* Simple placeholder for circuit effects */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div 
          key={i}
          className="absolute h-px bg-cyan-500/20"
          style={{
            width: `${50 + i * 20}px`,
            top: `${20 + i * 25}%`,
            left: `${10 + i * 15}%`,
            opacity: 0.3,
            transform: 'rotate(45deg)'
          }}
        ></div>
      ))}
    </div>
  );
}

/**
 * Home Page - Main Component
 * Server Component that delegates interactive elements to Client Components
 */
export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-circuit-bg">
      {/* Background layers */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Content container */}
      <div className="relative z-20 px-4 py-16 sm:px-6 lg:px-8 w-full max-w-4xl text-center">
        {/* Static hero content rendered immediately */}
        <HomeHero />

        {/* Interactive buttons in a Client Component */}
        <Suspense fallback={
          <div className="inline-flex flex-wrap gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
            <div className="h-10 w-32 bg-cyan-500/30 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-700/30 border border-gray-700/50 rounded animate-pulse"></div>
          </div>
        }>
          <HomepageButtons />
        </Suspense>

        {/* Circuit effects with appropriate Suspense boundary */}
        <Suspense fallback={<CircuitEffectsSkeleton />}>
          <CircuitEffectsWrapper />
        </Suspense>
      </div>
    </main>
  );
}
