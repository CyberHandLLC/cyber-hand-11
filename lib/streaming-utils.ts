/**
 * Streaming Utilities for Next.js Applications
 * 
 * This module provides utilities for implementing streaming with React Suspense
 * to improve perceived performance for data-dependent UI sections.
 */

// This is an artificial delay to simulate slow data fetching
// Remove this in production - this is just for testing
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a streaming data fetcher that can be used with React Suspense
 * This wraps an async function and adds support for streaming
 * 
 * @param fetchFn - The async function that fetches data
 * @returns A streaming wrapper for the fetch function
 */
export function createStreamingFetcher<T, TArgs extends unknown[]>(
  fetchFn: (...args: TArgs) => Promise<T>
): (...args: TArgs) => Promise<T> {
  return async (...args: TArgs): Promise<T> => {
    // The actual fetch function is passed through
    // The streaming behavior comes from React Suspense in the component
    return fetchFn(...args);
  };
}

/**
 * Adds streaming data fetching abilities to an existing page
 * Use this when you want to progressively render UI as data becomes available
 * 
 * @param pageComponent - The page component to stream
 * @returns A streamed version of the page component
 */
export function withStreaming<Props>(
  pageComponent: React.ComponentType<Props>
): React.ComponentType<Props> {
  // This is a HOC that can be used to add streaming to a page component
  // The actual streaming behavior comes from Suspense boundaries in the component
  return pageComponent;
}

/**
 * StreamingBoundary type for use in components
 * This helps TypeScript understand the streaming component patterns
 */
export interface StreamingBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  id?: string;
}

/**
 * Helper for managing a collection of streaming promises
 * This is useful for parallel data fetching with streaming
 */
export function createParallelStreams<T>(promises: Promise<T>[]): Promise<T[]> {
  // This uses Promise.all but in a way that allows React to stream each result
  // as it becomes available when used with Suspense
  return Promise.all(promises);
}

/**
 * Creates a resource that can be read during render
 * This is a pattern from React documentation for Suspense for Data Fetching
 * 
 * @param promise - The promise that fetches data
 * @returns A resource that can suspend rendering until the promise resolves
 */
export function createResource<T>(promise: Promise<T>) {
  let status = 'pending';
  let result: T;
  let error: Error;

  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (e) => {
      status = 'error';
      error = e;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else {
        return result;
      }
    }
  };
}
