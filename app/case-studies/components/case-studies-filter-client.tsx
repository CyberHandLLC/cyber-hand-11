"use client";

/**
 * Client Component for industry filtering
 * This component handles the interactive filtering UI
 * Renamed to follow naming convention with -client suffix
 */

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";

interface CaseStudiesFilterProps {
  industries: string[];
}

export function CaseStudiesFilterClient({ industries }: CaseStudiesFilterProps) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<string | null>(null);

  // Emit a custom event when filter changes for other components to listen
  const handleFilterChange = (newFilter: string | null) => {
    setFilter(newFilter);

    // Create and dispatch a custom event with the selected filter
    const event = new CustomEvent("case-study-filter-change", {
      detail: { filter: newFilter },
    });
    document.dispatchEvent(event);
  };

  // Only render filter UI if there are multiple industries
  if (industries.length <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      <button
        onClick={() => handleFilterChange(null)}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          filter === null
            ? "bg-cyan-500 text-white"
            : `${getThemeStyle("bg-secondary", theme)} ${getThemeStyle("text-secondary", theme)}`
        }`}
        aria-pressed={filter === null}
      >
        All
      </button>
      {industries.map((industry) => (
        <button
          key={industry}
          onClick={() => handleFilterChange(industry)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            filter === industry
              ? "bg-cyan-500 text-white"
              : `${getThemeStyle("bg-secondary", theme)} ${getThemeStyle("text-secondary", theme)}`
          }`}
          aria-pressed={filter === industry}
        >
          {industry}
        </button>
      ))}
    </div>
  );
}

// Export the legacy name for backward compatibility during migration
export { CaseStudiesFilterClient as CaseStudiesFilter };
