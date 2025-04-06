/**
 * Streaming Case Study Grid Component
 * 
 * This component implements Next.js streaming for progressively rendering
 * case studies as data becomes available. This improves perceived performance
 * by allowing the page to render incrementally.
 */

import React, { Suspense } from 'react';
import { CaseStudyProps } from '@/components/custom/case-study-card';
import { DynamicCaseStudyGridWrapper } from './dynamic-case-study-grid';

// Loading skeleton component
function CaseStudyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Generate placeholder loading cards */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index} 
          className="p-4 animate-pulse bg-card rounded-md min-h-[300px]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="h-40 bg-muted rounded-md mb-4"></div>
          <div className="h-6 bg-muted rounded-md w-2/3 mb-3"></div>
          <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
          <div className="h-4 bg-muted rounded-md w-5/6"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Individual case study loader component
 * This allows each case study to stream in independently
 */
function IndividualCaseStudyLoader({ study }: { study: CaseStudyProps }) {
  // This component could have its own suspense boundary if data needs to be fetched per study
  return (
    <div className="case-study-item">
      <DynamicCaseStudyGridWrapper caseStudies={[study]} />
    </div>
  );
}

/**
 * Streams case studies in batches for better user experience
 */
function BatchedCaseStudyLoader({ 
  studies, 
  batchSize = 3 
}: { 
  studies: CaseStudyProps[],
  batchSize?: number 
}) {
  // Split studies into batches for progressive rendering
  const batches = [];
  for (let i = 0; i < studies.length; i += batchSize) {
    batches.push(studies.slice(i, i + batchSize));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Render each batch with its own suspense boundary */}
      {batches.map((batch, batchIndex) => (
        <React.Fragment key={`batch-${batchIndex}`}>
          {batch.map((study) => (
            <Suspense key={study.id} fallback={
              <div className="p-4 animate-pulse bg-card rounded-md min-h-[300px]">
                <div className="h-40 bg-muted rounded-md mb-4"></div>
                <div className="h-6 bg-muted rounded-md w-2/3 mb-3"></div>
                <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
              </div>
            }>
              <IndividualCaseStudyLoader study={study} />
            </Suspense>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Main streaming case study grid component
 */
export function StreamingCaseStudyGrid({ 
  caseStudies 
}: { 
  caseStudies: CaseStudyProps[] 
}) {
  return (
    <div className="streaming-case-study-grid">
      <Suspense fallback={<CaseStudyGridSkeleton />}>
        <BatchedCaseStudyLoader studies={caseStudies} />
      </Suspense>
    </div>
  );
}

/**
 * Paginated streaming case study grid
 */
export function PaginatedStreamingCaseStudyGrid({
  caseStudies,
  currentPage,
  totalPages,
  onPageChange
}: {
  caseStudies: CaseStudyProps[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="streaming-paginated-grid">
      <StreamingCaseStudyGrid caseStudies={caseStudies} />
      
      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
