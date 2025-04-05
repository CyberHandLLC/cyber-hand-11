"use client";

/**
 * Client Component Wrapper
 * Handles the interactive filtering logic for case studies
 */

import { useState, useEffect } from "react";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { CaseStudyCardServer } from "@/components/case-studies/case-study-card-server";
import { AnimatedElement } from "@/lib/animation-utils";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";

interface CaseStudiesClientWrapperProps {
  caseStudies: CaseStudyProps[];
  _industries: string[]; // Renamed to match parameter usage
}

export function CaseStudiesClientWrapper({ 
  caseStudies, 
  _industries // Prefixed with underscore as it's not currently used
}: CaseStudiesClientWrapperProps) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string | null>(null);
  const [filteredStudies, setFilteredStudies] = useState(caseStudies);
  
  // Listen for filter change events from the filter component
  useEffect(() => {
    const handleFilterChange = (event: CustomEvent<{ filter: string | null }>) => {
      setFilter(event.detail.filter);
    };
    
    // Add event listener with type assertion for CustomEvent
    document.addEventListener(
      'case-study-filter-change', 
      handleFilterChange as EventListener
    );
    
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener(
        'case-study-filter-change', 
        handleFilterChange as EventListener
      );
    };
  }, []);
  
  // Update filtered studies when filter changes
  useEffect(() => {
    if (filter === null) {
      setFilteredStudies(caseStudies);
    } else {
      const filtered = caseStudies.filter(study => study.industry === filter);
      setFilteredStudies(filtered);
    }
  }, [filter, caseStudies]);
  
  // If no studies match the filter
  if (filteredStudies.length === 0) {
    return (
      <AnimatedElement animation="fadeIn" className="text-center py-16">
        <p className={`text-lg ${getThemeStyle('text-secondary', theme)}`}>
          No case studies found matching your criteria.
        </p>
      </AnimatedElement>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Using the same staggered animation pattern as the original */}
      {filteredStudies.map((caseStudy, index) => (
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
    </div>
  );
}
