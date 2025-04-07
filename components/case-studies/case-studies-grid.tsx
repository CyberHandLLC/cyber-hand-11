/**
 * CaseStudiesGrid Component
 * 
 * A server component that renders a grid of case study cards.
 * Designed to work with the metadata and SEO improvements.
 */

import { CaseStudyCardServer } from "@/components/case-studies/case-study-card-server";

// Import the CaseStudyProps interface to ensure type consistency
import { CaseStudyProps } from "@/components/custom/case-study-card";

interface CaseStudiesGridProps {
  /** Array of case studies to display */
  caseStudies: CaseStudyProps[];
  /** Optional className for styling */
  className?: string;
}

/**
 * Grid component for displaying case study cards
 * 
 * @param props - Component properties
 * @returns React component
 */
export function CaseStudiesGrid({ caseStudies, className = "" }: CaseStudiesGridProps) {
  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 contain-section ${className}`}
      id="case-studies-grid"
    >
      {caseStudies.map((caseStudy, index) => (
        <div 
          key={caseStudy.id || caseStudy.slug} 
          className="h-full transform transition-transform hover:-translate-y-2 duration-300 contain-card"
          style={{ animationDelay: `${index * 0.1}s` }}
          data-aos="fade-up"
        >
          <CaseStudyCardServer 
            caseStudy={caseStudy}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}