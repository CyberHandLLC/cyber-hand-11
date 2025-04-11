/**
 * Case Studies Skeleton Components
 *
 * Centralized skeleton components for case studies following Next.js 15.2.4
 * best practices and React 19 optimization patterns.
 */

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CardGridSkeletonProps {
  count?: number;
  columns?: number;
  cardHeight?: string;
  className?: string;
}

/**
 * FilterSkeleton Component
 * Renders a loading placeholder for the filter controls
 */
export function FilterSkeleton() {
  return (
    <div className="h-12 flex justify-center">
      <Skeleton className="w-64 h-10" />
    </div>
  );
}

/**
 * CardGridSkeleton Component
 * Renders a grid of placeholder cards
 */
export function CardGridSkeleton({
  count = 6,
  columns = 3,
  cardHeight = "h-64",
  className = "",
}: CardGridSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8 ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg overflow-hidden ${cardHeight}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * HeadingSkeleton Component
 * Renders a placeholder for page headers
 */
export function HeadingSkeleton() {
  return (
    <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
      <Skeleton className="h-10 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </div>
  );
}

/**
 * DetailsSkeleton Component
 * Renders a placeholder for detailed content sections
 */
export function DetailsSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-80 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-11/12" />
      </div>
    </div>
  );
}
