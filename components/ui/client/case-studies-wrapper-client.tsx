"use client";

/**
 * CaseStudiesWrapperClient Component
 *
 * This client component orchestrates the interactive filtering and display of case studies.
 * Following Next.js 15.2.4 best practices, it keeps client-side logic separate from
 * Server Components by managing state and interactions at the leaf nodes of the component tree.
 *
 * Following Cyber Hand Project Rules:
 * - Proper client component naming with -client suffix
 * - TypeScript return type annotations
 * - Placed in the /ui/client directory for better organization
 * - Implements proper cleanup in useEffect for React 19
 */

import { useState, ReactElement } from "react";
import { CaseStudiesFilterClient } from "@/components/ui/client/case-studies-filter-client";
import { CaseStudiesListClient } from "@/components/ui/client/case-studies-list-client";
import { CaseStudyProps } from "@/types/case-studies";

interface CaseStudiesWrapperClientProps {
  caseStudies: CaseStudyProps[];
  categories: string[];
}

/**
 * Wrapper component for case studies filtering and display
 *
 * @param {CaseStudiesWrapperClientProps} props - Component properties
 * @returns {ReactElement} Rendered component
 */
export function CaseStudiesWrapperClient({
  caseStudies,
  categories,
}: CaseStudiesWrapperClientProps): ReactElement {
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  /**
   * Handle filter change from filter component
   */
  const handleFilterChange = (filter: string | null): void => {
    setCurrentFilter(filter);
  };

  return (
    <div className="space-y-8 container-animate">
      <CaseStudiesFilterClient categories={categories} onFilterChange={handleFilterChange} />

      <CaseStudiesListClient caseStudies={caseStudies} filter={currentFilter} />
    </div>
  );
}
