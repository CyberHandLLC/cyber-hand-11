"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CyberLogo } from "@/components/custom/cyber-logo";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { getThemeStyle } from "@/lib/theme-utils";
import { useTheme } from "@/lib/theme-context";
import { AnimatedElement } from "@/lib/animation-utils";
import { Suspense } from 'react';

// Define types for circuit elements
interface CircuitLineProps {
  width: string;
  animation: string;
  position: {
    top: string;
    left: string;
  };
}

interface GlowingDotProps {
  animation: string;
  position: {
    top: string;
    left: string;
  };
}

// Lazy-loaded circuit components for better performance
const CircuitEffects = dynamic(() => import('@/components/custom/circuit-effects').then(mod => mod.CircuitEffects), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-5 opacity-30 pointer-events-none" />
});

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate content being fully loaded
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGetStarted = () => {
    router.push("/get-started");
  };

  const handleLearnMore = () => {
    router.push("/services");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-circuit-bg">
      {/* Background image with priority loading */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 z-0" 
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Content container */}
      <div className="relative z-20 px-4 py-16 sm:px-6 lg:px-8 w-full max-w-4xl text-center">
        {/* CyberHand Logo with priority */}
        <CyberLogo size="md" className="mb-6 animate-fade-in" />

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8 animate-fade-in">
          <span className="cyber-gradient-text">
            Next-Gen Digital Agency
          </span>
        </h1>

        {/* Button container */}
        <div className="inline-flex flex-wrap gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 animate-fade-in-delayed">
          <Button 
            variant="primary" 
            size="md"
            onClick={handleGetStarted}
            className="min-w-[120px] sm:min-w-[140px]"
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            size="md"
            onClick={handleLearnMore}
            className="min-w-[120px] sm:min-w-[140px]"
          >
            Learn More
          </Button>
        </div>

        {/* Circuit elements loaded after initial content */}
        {isLoaded && (
          <Suspense fallback={null}>
            <CircuitEffects />
          </Suspense>
        )}
      </div>
    </main>
  );
}
