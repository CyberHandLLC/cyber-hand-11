/**
 * Streaming Case Studies Data Fetching
 * 
 * This module extends the case-studies.ts module to add streaming capabilities.
 * It implements React's streaming pattern for improved perceived performance.
 */

import { cache } from 'react';
import { CaseStudyProps } from '@/components/custom/case-study-card';
import { getCaseStudies, getCaseStudyBySlug } from './case-studies';
import { createResource } from '@/lib/streaming-utils';

/**
 * Creates a streaming resource for case studies
 * This allows React to render UI progressively as data becomes available
 */
export function createCaseStudiesStream() {
  return createResource(getCaseStudies());
}

/**
 * Creates a streaming resource for a single case study
 */
export function createCaseStudyStream(slug: string) {
  return createResource(getCaseStudyBySlug(slug));
}

/**
 * Batch fetch case studies with streaming support
 * This allows for progressive loading of multiple case studies
 * 
 * @param slugs - Array of case study slugs to fetch
 * @returns Array of case study data
 */
export const getStreamingBatchCaseStudies = cache(async (
  slugs: string[]
): Promise<(CaseStudyProps | null)[]> => {
  // Create individual promises for each case study
  const promises = slugs.map(slug => getCaseStudyBySlug(slug));
  
  // Using Promise.all with Suspense in the component will allow
  // React to stream the UI as each promise resolves
  return Promise.all(promises);
});

/**
 * Get featured case studies with streaming support
 * Uses a tag or quality criteria to determine featured status
 */
export const getStreamingFeaturedCaseStudies = cache(async (
  limit: number = 3
): Promise<CaseStudyProps[]> => {
  const allCaseStudies = await getCaseStudies();
  
  // Filter to select featured case studies based on available criteria
  // Since featured is not in the type, we use another property as criteria (e.g., most recent)
  return allCaseStudies
    // Sort by some criteria to determine "featured" status
    .sort((a, b) => (b.id > a.id ? 1 : -1)) // Sort by id as a proxy for recency
    .slice(0, limit); // Take the first few as "featured"
});

/**
 * Get paginated case studies with streaming support
 */
export const getStreamingPaginatedCaseStudies = cache(async (
  page: number = 1,
  pageSize: number = 6
): Promise<{
  caseStudies: CaseStudyProps[];
  totalPages: number;
  currentPage: number;
}> => {
  const allCaseStudies = await getCaseStudies();
  
  const startIndex = (page - 1) * pageSize;
  const paginatedCaseStudies = allCaseStudies.slice(startIndex, startIndex + pageSize);
  
  return {
    caseStudies: paginatedCaseStudies,
    totalPages: Math.ceil(allCaseStudies.length / pageSize),
    currentPage: page,
  };
});
