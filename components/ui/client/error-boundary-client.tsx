"use client";

/**
 * Error Boundary Client Components
 *
 * These components provide standardized error boundaries for use throughout the application.
 * Each component encapsulates the react-error-boundary functionality in a client component
 * to prevent serialization issues when used in Server Components.
 *
 * Following the Cyber Hand Project Rules for error handling:
 * - Implement error boundaries to contain failures
 * - Provide proper fallback UIs for different contexts
 * - Support React 19 streaming patterns
 */

import { ReactNode, ReactElement } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Standard Error Fallback Component
 */
export function StandardErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps): ReactElement {
  return (
    <div className="py-4 px-6 rounded-lg bg-red-900/20 border border-red-800/40 text-center my-4">
      <h3 className="text-lg font-semibold mb-2 text-red-200">Something went wrong</h3>
      <p className="text-sm text-red-100/80 mb-3">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-800/40 hover:bg-red-800/60 rounded-md text-sm transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * Content Error Boundary - General purpose error boundary for content sections
 */
export function ContentErrorBoundaryClient({ children }: { children: ReactNode }): ReactElement {
  return (
    <ReactErrorBoundary
      FallbackComponent={StandardErrorFallback}
      onReset={(): void => {
        // Optional: Any reset logic here
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Form Error Boundary - Specialized for form sections
 */
export function FormErrorBoundaryClient({ children }: { children: ReactNode }): ReactElement {
  return (
    <ReactErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }: ErrorFallbackProps): ReactElement => (
        <div className="rounded-lg border border-red-700/50 p-8 bg-red-900/20 text-center">
          <h3 className="text-lg font-semibold mb-3 text-red-200">Form Error</h3>
          <p className="text-sm text-red-100/80 mb-4">
            {error.message || "There was a problem loading the form"}
          </p>
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-red-800/40 hover:bg-red-800/60 rounded-md text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Section Error Boundary - For major page sections
 */
export function SectionErrorBoundaryClient({ children }: { children: ReactNode }): ReactElement {
  return (
    <ReactErrorBoundary FallbackComponent={StandardErrorFallback}>{children}</ReactErrorBoundary>
  );
}

/**
 * API Error Boundary - For API data loading errors
 */
export function ApiErrorBoundaryClient({ children }: { children: ReactNode }): ReactElement {
  return (
    <ReactErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }: ErrorFallbackProps): ReactElement => (
        <div className="rounded-lg border border-amber-700/50 p-6 bg-amber-900/10 text-center">
          <h3 className="text-lg font-semibold mb-3 text-amber-200">Data Loading Error</h3>
          <p className="text-sm text-amber-100/80 mb-4">
            {error.message || "There was a problem loading data from the API"}
          </p>
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-amber-800/40 hover:bg-amber-800/60 rounded-md text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}
