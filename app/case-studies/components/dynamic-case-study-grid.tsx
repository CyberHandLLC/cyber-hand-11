"use client";

/**
 * Dynamic Case Study Grid Component
 * 
 * A dynamically imported version of the case study grid component.
 * This uses code splitting to avoid loading the case study grid 
 * until it's needed, improving initial page load performance.
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { CaseStudyProps } from '@/components/custom/case-study-card';

interface DynamicCaseStudyGridProps {
  caseStudies: CaseStudyProps[];
}

// Use Next.js built-in dynamic import with loading state
const DynamicCaseStudyGrid = dynamic(
  () => import('@/app/case-studies/components/case-study-grid').then(mod => mod.CaseStudyGrid),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Generate placeholder loading cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="p-4 animate-pulse bg-card rounded-md min-h-[300px]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="h-40 bg-muted rounded-md mb-4"></div>
            <div className="h-6 bg-muted rounded-md w-2/3 mb-3"></div>
            <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
            <div className="h-4 bg-muted rounded-md w-5/6"></div>
          </div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

/**
 * Wrapper component for dynamically imported CaseStudyGrid
 * 
 * @param props - Component properties 
 * @returns Dynamically loaded case study grid
 */
export function DynamicCaseStudyGridWrapper({ caseStudies }: DynamicCaseStudyGridProps) {
  return <DynamicCaseStudyGrid caseStudies={caseStudies} />;
}
