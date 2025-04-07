"use client";

/**
 * CaseStudyGrid Component
 * 
 * A grid layout for displaying case study cards.
 * This component is code-split from the main bundle to improve initial load time.
 */

import { CaseStudyProps } from "@/components/custom/case-study-card";
import { CaseStudyCardServer } from "@/components/case-studies/case-study-card-server";
import { AnimatedElement } from "@/lib/animation-utils";
import { OptimizedLayoutWrapper } from "@/components/performance/optimized-layout-wrapper";

interface CaseStudyGridProps {
  /** Array of case studies to display */
  caseStudies: CaseStudyProps[];
}

/**
 * Grid component for displaying case study cards
 * 
 * @param props - Component properties
 * @returns React component
 */
export function CaseStudyGrid({ caseStudies }: CaseStudyGridProps) {
  return (
    <OptimizedLayoutWrapper
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mx-auto"
      containment={false}
      id="case-study-grid"
      deferHydration={false} // We want this to hydrate immediately once loaded
    >
      {caseStudies.map((caseStudy, index) => (
        <AnimatedElement 
          key={caseStudy.id} 
          animation="fadeInUp"
          delay={index * 0.1}
          className="h-full transform transition-transform hover:-translate-y-2 duration-300"
        >
          <CaseStudyCardServer 
            caseStudy={caseStudy}
            index={index}
          />
        </AnimatedElement>
      ))}
    </OptimizedLayoutWrapper>
  );
}
