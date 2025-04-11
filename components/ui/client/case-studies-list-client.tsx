"use client";

/**
 * CaseStudiesListClient Component
 *
 * This client component handles the display of filtered case studies.
 * It's isolated as a Client Component to handle interactivity and state
 * while maintaining Server Components for data fetching.
 *
 * Following Cyber Hand Project Rules:
 * - Proper client component naming with -client suffix
 * - TypeScript return type annotations for functions
 * - Implements proper cleanup in useEffect hooks for React 19
 * - Placed in the /ui/client directory for better organization
 */

import { useState, useEffect, ReactElement } from "react";
import { useTheme } from "@/lib/theme-context";
import { CaseStudyProps } from "@/types/case-studies";
import { CaseStudyCardServer } from "@/components/case-studies/case-study-card-server";
import { getThemeStyle } from "@/lib/theme-utils";

interface CaseStudiesListClientProps {
  caseStudies: CaseStudyProps[];
  filter: string | null;
  className?: string;
}

/**
 * Component for displaying filtered case studies
 *
 * @param {CaseStudiesListClientProps} props - Component properties
 * @returns {ReactElement} Rendered component
 */
export function CaseStudiesListClient({
  caseStudies,
  filter,
  className = "",
}: CaseStudiesListClientProps): ReactElement {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [filteredStudies, setFilteredStudies] = useState<CaseStudyProps[]>(caseStudies);

  // Filter case studies when filter changes
  useEffect(() => {
    if (filter) {
      setFilteredStudies(caseStudies.filter((study) => study.categories.includes(filter)));
    } else {
      setFilteredStudies(caseStudies);
    }
  }, [filter, caseStudies]);

  // Add a small delay before showing content for smoother animations
  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    // Clean up timeout to prevent memory leaks in React 19 concurrency mode
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className} 
        ${isLoaded ? "opacity-100" : "opacity-0"} 
        transition-opacity duration-300`}
    >
      {filteredStudies.length > 0 ? (
        filteredStudies.map((study, index) => (
          <CaseStudyCardServer key={study.slug || study.id} caseStudy={study} index={index} />
        ))
      ) : (
        <div
          className={`col-span-full text-center p-10 rounded-lg ${getThemeStyle(
            "border border-gray-800/50 bg-gray-900/30",
            theme
          )}`}
        >
          <h3 className="text-xl font-semibold mb-2">No case studies found</h3>
          <p className="text-gray-400">
            No case studies matching the selected filter were found. Try selecting a different
            category.
          </p>
        </div>
      )}
    </div>
  );
}
