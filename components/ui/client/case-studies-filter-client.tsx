"use client";

/**
 * CaseStudiesFilterClient Component
 *
 * This client component handles interactive filtering of case studies.
 * It's isolated as a Client Component to keep client-side interactivity
 * separate from Server Components, following Next.js 15.2.4 best practices.
 *
 * Following Cyber Hand Project Rules:
 * - Proper client component naming with -client suffix
 * - TypeScript return type annotations
 * - Placed in the /ui/client directory for better organization
 */

import { useState, useEffect, ReactElement } from "react";
import { useTheme } from "@/lib/theme-context";
import { Badge } from "@/components/ui/badge";
import { getThemeStyle } from "@/lib/theme-utils";

interface CaseStudiesFilterClientProps {
  categories: string[];
  onFilterChange: (filter: string | null) => void;
  className?: string;
}

/**
 * Component for filtering case studies by category
 *
 * @param {CaseStudiesFilterClientProps} props - Component properties
 * @returns {ReactElement} Rendered component
 */
export function CaseStudiesFilterClient({
  categories,
  onFilterChange,
  className = "",
}: CaseStudiesFilterClientProps): ReactElement {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      // Any cleanup needed for future extensions
    };
  }, []);

  /**
   * Handle filter selection
   */
  const handleFilterClick = (category: string): void => {
    const newFilter = category === selectedFilter ? null : category;
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);

    // Accessibility: Announce filter change to screen readers
    const filterAnnouncement = document.getElementById("filter-announcement");
    if (filterAnnouncement) {
      filterAnnouncement.textContent = newFilter
        ? `Filtered by ${newFilter}`
        : "All filters cleared";
    }
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedFilter === category ? "primary" : "outline"}
            className={`cursor-pointer px-3 py-1 ${
              selectedFilter === category
                ? getThemeStyle("bg-primary", theme)
                : getThemeStyle("bg-secondary hover:bg-primary-hover", theme)
            }`}
            onClick={() => handleFilterClick(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
      {/* Accessibility: Screen reader announcement */}
      <div id="filter-announcement" className="sr-only" aria-live="polite" aria-atomic="true"></div>
    </div>
  );
}
