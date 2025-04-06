/**
 * Performance Logging Service
 * 
 * A dedicated service for logging performance metrics in production.
 * This service provides:
 * - Batched logging to reduce network requests
 * - Configurable sampling rate
 * - Filtering capabilities
 * - Integration with analytics services
 */

import { CustomPerformanceMetric } from '@/types/api';
import { METRIC_NAMES } from './performance-metrics';

interface LoggerOptions {
  /** How often to send batched metrics (ms) */
  batchInterval?: number;
  /** What percentage of sessions to sample (0-1) */
  sampleRate?: number;
  /** Filter function to determine which metrics to log */
  shouldLogMetric?: (metric: CustomPerformanceMetric) => boolean;
  /** Whether to also log to console in production */
  consoleLog?: boolean;
  /** Custom endpoint for sending metrics */
  endpoint?: string;
}

class PerformanceLogger {
  private metrics: CustomPerformanceMetric[] = [];
  private options: Required<LoggerOptions>;
  private timer: NodeJS.Timeout | null = null;
  private isEnabled: boolean;

  constructor(options: LoggerOptions = {}) {
    // Default options
    this.options = {
      batchInterval: options.batchInterval || 5000, // 5 seconds
      sampleRate: options.sampleRate || 0.1, // 10% of sessions
      shouldLogMetric: options.shouldLogMetric || (() => true),
      consoleLog: options.consoleLog || false,
      endpoint: options.endpoint || '/api/performance/log'
    };

    // Only enable logging based on sampling rate
    this.isEnabled = Math.random() < this.options.sampleRate;
    
    // Initialize batch processing if enabled
    if (this.isEnabled && typeof window !== 'undefined') {
      this.startBatchProcessing();

      // Ensure metrics are sent before page unload
      window.addEventListener('beforeunload', () => this.sendMetrics());
    }
  }

  /**
   * Log a performance metric
   */
  public logMetric(metric: CustomPerformanceMetric): void {
    // Skip logging if disabled or filtered out
    if (!this.isEnabled || !this.options.shouldLogMetric(metric)) {
      return;
    }

    // Add to metrics batch
    this.metrics.push(metric);

    // Optional console logging
    if (this.options.consoleLog) {
      console.warn(`[Performance] ${metric.name}: ${metric.value}ms`);
    }
  }

  /**
   * Clear all pending metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Start batch processing timer
   */
  private startBatchProcessing(): void {
    this.timer = setInterval(() => {
      this.sendMetrics();
    }, this.options.batchInterval);
  }

  /**
   * Stop batch processing timer
   */
  public stopBatchProcessing(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Send batched metrics to the server
   */
  private async sendMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = []; // Clear the queue

    try {
      // Only send in production
      if (process.env.NODE_ENV === 'production') {
        const response = await fetch(this.options.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metrics: metricsToSend,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
          // Use keepalive to ensure the request completes even if page unloads
          keepalive: true,
        });

        if (!response.ok) {
          console.error('Failed to send performance metrics:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error sending performance metrics:', error);
      
      // Put the metrics back in the queue if sending failed
      this.metrics = [...metricsToSend, ...this.metrics];
    }
  }
}

// Default filters for common metric categories
export const metricFilters = {
  // Only log core web vitals
  coreWebVitalsOnly: (metric: CustomPerformanceMetric) => {
    const coreMetrics = [
      METRIC_NAMES.LCP,
      METRIC_NAMES.FID, 
      METRIC_NAMES.CLS,
      METRIC_NAMES.INP
    ];
    return coreMetrics.includes(metric.name as typeof coreMetrics[number]);
  },
  
  // Log all metrics but filter out frequent ones to reduce volume
  production: (metric: CustomPerformanceMetric) => {
    // Always log core web vitals
    const coreMetrics = [METRIC_NAMES.LCP, METRIC_NAMES.FID, METRIC_NAMES.CLS, METRIC_NAMES.INP];
    if (coreMetrics.includes(metric.name as typeof coreMetrics[number])) {
      return true;
    }
    
    // For high-frequency metrics, only log poor performance
    if (metric.name === METRIC_NAMES.DYNAMIC_IMPORT && metric.value < 500) {
      return false;
    }
    
    return true;
  }
};

// Singleton instance with production settings
let loggerInstance: PerformanceLogger | null = null;

/**
 * Create or get the performance logger instance
 */
export function createPerformanceLogger(options: LoggerOptions = {}): PerformanceLogger {
  if (!loggerInstance) {
    // Production default settings
    const productionDefaults: LoggerOptions = {
      batchInterval: 10000, // 10 seconds
      sampleRate: 0.1,      // 10% of users
      shouldLogMetric: metricFilters.production,
      consoleLog: false
    };
    
    // Development default settings
    const developmentDefaults: LoggerOptions = {
      batchInterval: 5000,  // 5 seconds
      sampleRate: 1.0,      // 100% of users
      shouldLogMetric: () => true,
      consoleLog: true
    };
    
    // Use environment-specific defaults
    const defaults = process.env.NODE_ENV === 'production' 
      ? productionDefaults 
      : developmentDefaults;
      
    // Create the instance with merged options
    loggerInstance = new PerformanceLogger({
      ...defaults,
      ...options
    });
  }
  
  return loggerInstance;
}
