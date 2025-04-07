/**
 * Case Studies List Skeleton Components
 * 
 * This file contains skeleton loading components specifically for the case studies list page.
 * These components provide a consistent loading experience with proper animation
 * and accessibility attributes.
 * 
 * @file app/case-studies/components/case-studies-list-skeleton.tsx
 * @module CaseStudies
 */

import React from 'react';

/**
 * FilterSkeleton Component
 * Renders a loading placeholder for the filter controls
 */
export function CaseStudiesFilterSkeleton() {
  return (
    <div 
      className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8" 
      aria-busy="true"
      aria-live="polite"
    />
  );
}

/**
 * GridSkeleton Component
 * Renders a grid of placeholder cards while case studies are loading
 */
export function CaseStudiesGridSkeleton() {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64 animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * CaseStudiesHeaderSkeleton
 * Placeholder for case studies page header while loading
 */
export function CaseStudiesHeaderSkeleton() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md w-1/2 mx-auto mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-md w-3/4 mx-auto animate-pulse"></div>
    </div>
  );
}