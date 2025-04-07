/**
 * Enhanced Case Studies Data Fetching
 * 
 * This module provides optimized data fetching utilities for case studies
 * using Next.js 15's built-in streaming capabilities with React Server Components.
 */

import { cache } from 'react';
import { CaseStudyProps } from '@/components/custom/case-study-card';
import { getCaseStudies, getCaseStudyBySlug } from './case-studies';

/**
 * Batch fetch case studies with streaming support
 * This allows for progressive loading of multiple case studies when used with Suspense
 * 
 * @param slugs - Array of case study slugs to fetch
 * @returns Promise resolving to an array of case study data
 */
export const getBatchCaseStudies = cache(async (
  slugs: string[]
): Promise<(CaseStudyProps | null)[]> => {
  // Create individual promises for each case study
  const promises = slugs.map(slug => getCaseStudyBySlug(slug));
  
  // Using Promise.all with Suspense in the component will allow
  // React to stream the UI as each promise resolves
  return Promise.all(promises);
});

/**
 * Get featured case studies with automatic streaming support
 * Uses a sorting criteria to determine featured status
 * 
 * @param limit - Maximum number of featured case studies to return
 * @returns Promise resolving to an array of featured case studies
 */
export const getFeaturedCaseStudies = cache(async (
  limit: number = 3
): Promise<CaseStudyProps[]> => {
  const allCaseStudies = await getCaseStudies();
  
  // Sort by some criteria to determine "featured" status
  return allCaseStudies
    .sort((a, b) => (b.id > a.id ? 1 : -1)) // Sort by id as a proxy for recency
    .slice(0, limit); // Take the first few as "featured"
});

/**
 * Get paginated case studies with automatic streaming support
 * 
 * @param page - Page number to retrieve (starting from 1)
 * @param pageSize - Number of case studies per page
 * @returns Promise resolving to pagination result object
 */
export const getPaginatedCaseStudies = cache(async (
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
