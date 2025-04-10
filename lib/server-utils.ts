/**
 * Server-side utilities for data fetching and caching
 * Use these functions in Server Components for efficient data access
 */

import { cache } from "react";

/**
 * Cache configuration types
 */
export type CacheOptions = {
  /** Time to cache in seconds */
  revalidate?: number;
  /** Tags for cache invalidation */
  tags?: string[];
};

/**
 * Enhanced fetch with caching capabilities
 * This builds on Next.js's fetch with cache capabilities but adds type safety
 */
export const fetchWithCache = cache(
  async <T = Record<string, unknown>>(
    url: string,
    options?: RequestInit & CacheOptions
  ): Promise<T> => {
    const { revalidate, tags, ...fetchOptions } = options || {};

    const response = await fetch(url, {
      ...fetchOptions,
      next: {
        revalidate,
        tags,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
);

/**
 * Generic data fetcher with error handling and TypeScript support
 * Caches the result of the data fetching function based on its arguments
 */
export const cachedDataFetch = cache(
  async <T = Record<string, unknown>>(
    fetchFn: () => Promise<T>,
    errorMessage = "Failed to fetch data"
  ): Promise<T> => {
    try {
      return await fetchFn();
    } catch (error) {
      // Log error to a proper monitoring service in production
      // Use a structured logging approach for better debugging
      throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);
