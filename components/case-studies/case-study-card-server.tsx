/**
 * Server Component version of the Case Study Card
 *
 * This component handles the static rendering of case study data,
 * while delegating interactive elements to a client component.
 *
 * Benefits:
 * - Server-side rendering of content for better SEO
 * - Reduced client-side JavaScript
 * - Improved performance for non-interactive elements
 */

import Image from "next/image";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { CaseStudyCardClient } from "@/components/case-studies/case-study-card-client";

interface CaseStudyCardServerProps {
  caseStudy: CaseStudyProps;
  index: number;
}

export function CaseStudyCardServer({ caseStudy, index }: CaseStudyCardServerProps) {
  // Server components can't use hooks or browser APIs
  // We use a simpler implementation without animations or theme context
  // Those will be added by the client wrapper if needed

  // The server component should match the styling of the original component
  // but without the client-side dependencies (useTheme, animations)
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-800/75 dark:bg-gray-900/60 border border-gray-700/30 shadow-lg h-full flex flex-col transition-colors duration-300">
      {/* Image container with overlay */}
      <div className="relative w-full pt-[56.25%]">
        {" "}
        {/* 16:9 aspect ratio */}
        {caseStudy.imageUrl && (
          <Image
            src={caseStudy.imageUrl}
            alt={caseStudy.clientName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2} // Prioritize loading the first two images
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {/* Industry badge */}
        <div className="absolute top-4 left-4 bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30">
          {caseStudy.industry}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-white">{caseStudy.title}</h3>

        <p className="text-sm mb-4 text-gray-300">
          {caseStudy.challenge.substring(0, 120)}
          {caseStudy.challenge.length > 120 ? "..." : ""}
        </p>

        {/* Results preview */}
        <div className="mt-auto">
          <div className="text-sm font-semibold mb-2 text-gray-200">Key Results:</div>

          <ul className="text-sm space-y-1 mb-4 text-gray-300">
            {caseStudy.results.slice(0, 2).map((result, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 mr-2"></span>
                {result.length > 60 ? `${result.substring(0, 60)}...` : result}
              </li>
            ))}
          </ul>

          {/* Pass control to client component for interactive parts */}
          <CaseStudyCardClient slug={caseStudy.slug || caseStudy.id} />
        </div>
      </div>
    </div>
  );
}
