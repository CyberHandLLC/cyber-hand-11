"use client";

import { useState } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { CaseStudyCard } from "@/components/custom/case-study-card";
import { caseStudies } from "@/data/case-studies";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement, StaggeredGroup } from "@/lib/animation-utils";

export default function CaseStudiesPage() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string | null>(null);
  
  // Get unique industries for filter
  const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
  
  // Filter case studies based on selection
  const filteredCaseStudies = filter 
    ? caseStudies.filter(cs => cs.industry === filter)
    : caseStudies;
  
  return (
    <PageLayout>
      <SectionContainer className="py-24 px-4 md:px-6">
        <AnimatedElement animation="fadeInUp" className="text-center max-w-3xl mx-auto mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${getThemeStyle('text-primary', theme)}`}>
            Case Studies
          </h1>
          <p className={`text-lg ${getThemeStyle('text-secondary', theme)}`}>
            See how we've helped businesses like yours achieve digital success through innovative solutions and strategic expertise.
          </p>
        </AnimatedElement>
        
        {/* Filter buttons */}
        {industries.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === null 
                  ? 'bg-cyan-500 text-white' 
                  : `${getThemeStyle('bg-secondary', theme)} ${getThemeStyle('text-secondary', theme)}`
              }`}
            >
              All
            </button>
            {industries.map(industry => (
              <button
                key={industry}
                onClick={() => setFilter(industry)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  filter === industry 
                    ? 'bg-cyan-500 text-white' 
                    : `${getThemeStyle('bg-secondary', theme)} ${getThemeStyle('text-secondary', theme)}`
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        )}
        
        {/* Case study grid */}
        <StaggeredGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((caseStudy, index) => (
            <CaseStudyCard 
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
            />
          ))}
        </StaggeredGroup>
        
        {/* Empty state */}
        {filteredCaseStudies.length === 0 && (
          <div className="text-center py-16">
            <p className={`text-lg ${getThemeStyle('text-secondary', theme)}`}>
              No case studies found matching your criteria.
            </p>
          </div>
        )}
      </SectionContainer>
    </PageLayout>
  );
}
