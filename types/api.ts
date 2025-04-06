/**
 * API Type Definitions
 * 
 * This file contains type definitions for API requests and responses
 * used across the Cyber Hand website.
 */

/**
 * Contact Form Types
 */
export type FormResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/**
 * Server Cache Types
 */
export type CacheOptions = {
  revalidate?: number; // Seconds
  tags?: string[];
};

/**
 * Performance Metric Types
 */
export interface CustomPerformanceMetric {
  /** Unique identifier for the metric */
  id: string;
  /** Name of the metric */
  name: string;
  /** Numeric value of the metric (typically in milliseconds) */
  value: number;
  /** Additional metadata for the metric */
  attribution?: Record<string, unknown>;
}

/**
 * Dynamic Import Types
 */
export interface DynamicImportOptions {
  ssr?: boolean;
  loading?: React.ComponentType;
  error?: React.ComponentType<{
    error: Error;
    reset: () => void;
  }>;
  suspense?: boolean;
  loadingTimeout?: number;
}

/**
 * Deferred Loading Types
 */
export interface DeferredLoadingOptions {
  priority?: 'high' | 'medium' | 'low';
  delay?: number; // milliseconds
  timeout?: number; // milliseconds
  fallback?: React.ReactNode;
}
