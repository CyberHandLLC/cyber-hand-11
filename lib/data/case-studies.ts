/**
 * Case Studies data fetching module
 * 
 * This module uses React's cache() function to optimize data fetching
 * for server components. The data fetching logic is separated from the
 * component rendering logic for better maintainability.
 */

import { cache } from 'react';
import { CaseStudyProps } from '@/components/custom/case-study-card';
import { fetchWithCache } from '@/lib/server-utils';

// Import static data for fallback during build
import { caseStudies as mockCaseStudies } from '@/data/case-studies';

/**
 * Cache time for case studies data (24 hours in seconds)
 */
const CACHE_TIME = 60 * 60 * 24;

/**
 * Check if code is running in a build/production environment
 */
const isServerBuild = process.env.NODE_ENV === 'production' && typeof window === 'undefined';

/**
 * Fetch all case studies with caching
 * This function is cached by React and will only run once per request
 * regardless of how many components call it
 */
export const getCaseStudies = cache(async (): Promise<CaseStudyProps[]> => {
  // During build, use mock data to avoid API calls
  if (isServerBuild) {
    return mockCaseStudies;
  }
  
  try {
    // In development or runtime, attempt to fetch from API
    // Construct a proper absolute URL for the API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const apiUrl = new URL('/api/case-studies', baseUrl).toString();
    
    return fetchWithCache(apiUrl, { 
      revalidate: CACHE_TIME,
      tags: ['case-studies']
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    // Fallback to mock data in case of error
    return mockCaseStudies;
  }
});

/**
 * Fetch a single case study by slug with caching
 */
export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudyProps | null> => {
  // During build, use mock data to avoid API calls
  if (isServerBuild) {
    return mockCaseStudies.find(study => study.slug === slug) || null;
  }
  
  try {
    // In development or runtime, attempt to fetch from API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const apiUrl = new URL(`/api/case-studies/${slug}`, baseUrl).toString();
    
    return fetchWithCache(apiUrl, {
      revalidate: CACHE_TIME,
      tags: ['case-studies', `case-study-${slug}`]
    });
  } catch (error) {
    console.error(`Error fetching case study with slug ${slug}:`, error);
    // Fallback to mock data in case of error
    return mockCaseStudies.find(study => study.slug === slug) || null;
  }
});

/**
 * Get related case studies based on industry or services
 */
export const getRelatedCaseStudies = cache(async (
  currentStudyId: string, 
  industry: string,
  limit: number = 3
): Promise<CaseStudyProps[]> => {
  try {
    // Fetch all case studies
    const allCaseStudies = await getCaseStudies();
    
    // Filter out the current case study and find related ones
    return allCaseStudies
      .filter(study => study.id !== currentStudyId && study.industry === industry)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related case studies:', error);
    
    // Fallback to mock data filtering in case of error
    if (isServerBuild) {
      return mockCaseStudies
        .filter(study => study.id !== currentStudyId && study.industry === industry)
        .slice(0, limit);
    }
    
    return []; // Return empty array in case of error
  }
});
