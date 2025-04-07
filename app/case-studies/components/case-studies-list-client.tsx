"use client";

/**
 * Case Studies List Client Component
 * 
 * This component handles the interactive elements of the case studies list page.
 * It provides filtering, sorting, and display of case studies with proper client-side
 * interactivity while maintaining the server-fetched data.
 * 
 * @file app/case-studies/components/case-studies-list-client.tsx
 * @module CaseStudies
 */

import { useState, useEffect } from 'react';
import { CaseStudyProps } from '@/components/custom/case-study-card';
import { CaseStudyGrid } from '@/app/case-studies/components/case-study-grid';
import { useTheme } from '@/lib/theme-context';

interface CaseStudiesListClientProps {
  caseStudies: CaseStudyProps[];
  _industries: string[];
}

export function CaseStudiesListClient({ caseStudies, _industries }: CaseStudiesListClientProps) {
  const [filteredStudies, setFilteredStudies] = useState<CaseStudyProps[]>(caseStudies);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { theme: _theme } = useTheme();
  
  // Reset filtered studies when case studies change
  useEffect(() => {
    if (activeFilter) {
      setFilteredStudies(caseStudies.filter(study => study.industry === activeFilter));
    } else {
      setFilteredStudies(caseStudies);
    }
  }, [caseStudies, activeFilter]);
  
  // Listen for filter changes from URL or filter components
  useEffect(() => {
    // Get the current URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const industryParam = searchParams.get('industry');
    
    if (industryParam && _industries.includes(industryParam)) {
      setActiveFilter(industryParam);
    }
  }, [_industries]);
  
  return (
    <div className="mt-8">
      <CaseStudyGrid caseStudies={filteredStudies} />
    </div>
  );
}