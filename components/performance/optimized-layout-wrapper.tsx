"use client";

/**
 * OptimizedLayoutWrapper Component
 * 
 * A high-performance layout wrapper that implements:
 * - CSS containment for better rendering performance
 * - Route-based code splitting
 * - Deferred hydration of non-critical components
 * - Performance monitoring
 * 
 * This is a client component because it handles runtime optimizations.
 */

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePerformanceMetrics, METRIC_NAMES } from '@/lib/performance/performance-metrics';
import { DeferredContent } from '@/lib/performance/deferred-loading';
import { CSS_CONTAINMENT_SELECTORS } from '@/lib/performance/critical-css';

interface OptimizedLayoutWrapperProps {
  /** The children to render */
  children: React.ReactNode;
  /** Whether this section is critical for LCP */
  isLCP?: boolean;
  /** Whether to apply CSS containment */
  containment?: boolean;
  /** Whether to defer hydration */
  deferHydration?: boolean;
  /** Additional classes to apply */
  className?: string;
  /** Unique identifier for performance tracking */
  id?: string;
}

/**
 * Performance-optimized layout wrapper component
 * 
 * @param props - Component properties 
 * @returns React component with performance optimizations
 */
export function OptimizedLayoutWrapper({
  children,
  isLCP = false,
  containment = true,
  deferHydration = false,
  className = '',
  id = 'optimized-section',
}: OptimizedLayoutWrapperProps) {
  const pathname = usePathname();
  const reportWebVitals = usePerformanceMetrics();
  
  // Track when this component is rendered for performance analysis
  useEffect(() => {
    if (isLCP) {
      // Report this component as a potential LCP element
      reportWebVitals({
        name: METRIC_NAMES.LCP_CANDIDATE,
        value: performance.now(),
        id: id,
      });
      
      // Mark the component as visible in the performance timeline
      if (typeof window.performance?.mark === 'function') {
        window.performance.mark(`visible-${id}`);
      }
    }
  }, [isLCP, id, reportWebVitals]);
  
  // Apply CSS containment classes using our standardized utility classes
  const containmentClass = containment ? (isLCP ? 'contain-section' : 'contain-interactive') : '';
  const lcpClass = isLCP ? 'lcp-container' : '';
  
  // Construct the final component
  const content = (
    <div 
      id={id}
      className={`${className} ${containmentClass} ${lcpClass}`}
      data-route={pathname}
      data-lcp={isLCP ? 'true' : 'false'}
    >
      {children}
      
      {/* CSS containment is now applied via utility classes */}
    </div>
  );
  
  // Apply deferred hydration if requested
  if (deferHydration && !isLCP) {
    return (
      <DeferredContent
        delay={100}
        loadOnlyWhenVisible={true}
        priority={isLCP ? 'high' : 'medium'}
        metricName="deferred-hydration"
        fallback={<div className={`${className} skeleton-loader`} aria-hidden="true" />}
      >
        {content}
      </DeferredContent>
    );
  }
  
  return content;
}

/**
 * Global CSS containment styles component
 * Adds CSS containment to appropriate elements for better rendering performance
 */
export function CSSContainmentStyles() {
  // Only include this component once in your app, ideally in the root layout
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* Apply CSS containment to appropriate elements using standardized classes */
      ${CSS_CONTAINMENT_SELECTORS.join(', ')} {
        /* These elements use the contain-interactive class */
      }
      
      /* Skeleton loader styling for deferred content */
      .skeleton-loader {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.05) 25%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0.05) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        min-height: 100px;
      }
      
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      
      /* Adding utility classes directly to elements in the DOM is preferred over these selectors */
      
      /* Above-the-fold optimizations - use contain-section instead */
      main > *:first-child {
        /* Use the contain-section class instead of inline styles */
      }
      
      /* Below-the-fold optimizations - use contain-card instead */
      .below-fold {
        /* Use the contain-card class instead of inline styles */
      }
    `}} />
  );
}
