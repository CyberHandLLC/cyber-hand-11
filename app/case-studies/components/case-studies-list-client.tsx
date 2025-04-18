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

import { useState, useEffect } from "react";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { CaseStudyCardServer } from "@/components/case-studies/case-study-card-server";
import { useTheme } from "@/lib/theme-context";

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
      setFilteredStudies(caseStudies.filter((study) => study.industry === activeFilter));
    } else {
      setFilteredStudies(caseStudies);
    }

    // No cleanup needed for this effect as it doesn't create any subscriptions or timers
  }, [caseStudies, activeFilter]);

  // Listen for filter changes from URL or filter components
  useEffect(() => {
    // Get the current URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const industryParam = searchParams.get("industry");

    if (industryParam && _industries.includes(industryParam)) {
      setActiveFilter(industryParam);
    }

    // Set up URL change listener for React 19 compliance
    const handleUrlChange = () => {
      const newParams = new URLSearchParams(window.location.search);
      const newIndustryParam = newParams.get("industry");

      if (newIndustryParam && _industries.includes(newIndustryParam)) {
        setActiveFilter(newIndustryParam);
      } else if (!newIndustryParam && activeFilter) {
        setActiveFilter(null);
      }
    };

    // Add event listener for popstate (browser navigation)
    window.addEventListener("popstate", handleUrlChange);

    // Cleanup function to remove event listener when component unmounts
    // This prevents memory leaks in React 19 concurrency mode
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [_industries, activeFilter]);

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredStudies.map((caseStudy, index) => (
          <div
            key={caseStudy.id}
            className="h-full transform transition-transform hover:-translate-y-2 duration-300"
          >
            <CaseStudyCardServer caseStudy={caseStudy} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
