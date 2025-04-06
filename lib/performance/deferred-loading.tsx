"use client";

/**
 * Deferred Loading Utilities
 * 
 * This module provides utilities for deferring the loading of non-critical UI components.
 * It helps improve initial page load performance by:
 * 1. Delaying non-critical component hydration until after the page is interactive
 * 2. Implementing prioritized loading based on viewport visibility
 * 3. Tracking loading metrics for performance analysis
 */

import React, { useEffect, useState } from 'react';
import { usePerformanceMetrics, METRIC_NAMES } from '@/lib/performance/performance-metrics';

/**
 * Options for deferred loading
 */
interface DeferredLoadingOptions {
  /** Delay in milliseconds before loading (default: 0) */
  delay?: number;
  /** Whether to load only when the component is visible in viewport */
  loadOnlyWhenVisible?: boolean;
  /** Priority level for loading (higher loads sooner) */
  priority?: 'low' | 'medium' | 'high';
  /** Performance metric name for tracking */
  metricName?: string;
}

/**
 * Custom hook for deferred loading of non-critical components
 * 
 * @param options - Configuration options
 * @returns Boolean indicating if the component should render
 */
export function useDeferredLoading(options: DeferredLoadingOptions = {}) {
  const {
    delay = 0,
    loadOnlyWhenVisible = false,
    priority = 'medium',
    metricName,
  } = options;
  
  const [shouldRender, setShouldRender] = useState(false);
  const reportWebVitals = usePerformanceMetrics();
  
  useEffect(() => {
    // Track start time for performance metrics
    const startTime = performance.now();
    
    // Calculate actual delay based on priority
    const priorityDelay = 
      priority === 'high' ? Math.max(0, delay - 100) :
      priority === 'low' ? delay + 500 :
      delay;
    
    // Function to start rendering
    const startRendering = () => {
      setShouldRender(true);
      
      // Report metrics if requested
      if (metricName) {
        const loadTime = performance.now() - startTime;
        reportWebVitals({
          name: metricName || METRIC_NAMES.DEFERRED_HYDRATION,
          value: loadTime,
          id: 'deferred-loading'
        });
      }
    };
    
    // Handle visibility-based loading
    if (loadOnlyWhenVisible) {
      // Set up intersection observer to detect when element is visible
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          
          if (entry.isIntersecting) {
            // If visible, wait for the delay then render
            setTimeout(startRendering, priorityDelay);
            observer.disconnect();
          }
        },
        { threshold: 0.1 } // 10% visibility triggers the load
      );
      
      // Need to have a ref to the parent element
      const container = document.getElementById('deferred-container');
      if (container) {
        observer.observe(container);
      } else {
        // If no container, fall back to timeout-based loading
        setTimeout(startRendering, priorityDelay);
      }
      
      return () => observer.disconnect();
    } else {
      // Simple timeout-based deferred loading
      const timeoutId = setTimeout(startRendering, priorityDelay);
      return () => clearTimeout(timeoutId);
    }
  }, [delay, loadOnlyWhenVisible, priority, metricName, reportWebVitals]);
  
  return shouldRender;
}

/**
 * Wrapper component for deferred loading of children
 */
export function DeferredContent({
  children,
  id = 'deferred-container',
  fallback,
  ...options
}: DeferredLoadingOptions & {
  children: React.ReactNode;
  id?: string;
  fallback?: React.ReactNode;
}) {
  const shouldRender = useDeferredLoading(options);
  
  return (
    <div id={id}>
      {shouldRender ? children : fallback || null}
    </div>
  );
}
