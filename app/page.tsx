"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from 'react';

// UI Components
import { Button } from "@/components/ui/button";
import { CyberLogo } from "@/components/custom/cyber-logo";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";

// Utilities
import { getThemeStyle } from "@/lib/theme-utils";
import { useTheme } from "@/lib/theme-context";
import { AnimatedElement } from "@/lib/animation-utils";

// Types for circuit elements
interface CircuitLineProps {
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
const CircuitEffects = dynamic(
  () => import('@/components/custom/circuit-effects').then(mod => mod.CircuitEffects), 
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-5 opacity-30 pointer-events-none" />
  }
);

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate content being fully loaded
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <PageLayout>
      {/* Hero section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Circuit effects */}
        <CircuitEffects />
        
        {/* Background with dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-1" />
        
        {/* Content container */}
        <SectionContainer className="relative z-10 py-16 flex-grow flex flex-col items-center justify-center">
          <AnimatedElement 
            animation="fadeInUp"
            className="text-center"
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <CyberLogo size="lg" className="w-24 h-24 md:w-32 md:h-32" />
            </div>
            
            {/* Main heading with gradient text */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Digital Solutions for the Modern Age
            </h1>
            
            {/* Supporting text */}
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              We craft stunning websites, implement powerful SEO strategies, and deliver comprehensive digital marketing solutions to help your business thrive online.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => router.push('/services')}
                className="px-8"
              >
                Explore Services
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/contact')}
                className="px-8 border-white/20 hover:bg-white/10"
              >
                Get in Touch
              </Button>
            </div>
          </AnimatedElement>
        </SectionContainer>
        
        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/70 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-scroll-down mt-2" />
          </div>
        </div>
      </div>
      
      {/* Services overview section would go here */}
      
      {/* Recent work section would go here */}
      
      {/* Contact CTA section would go here */}
    </PageLayout>
  );
}
