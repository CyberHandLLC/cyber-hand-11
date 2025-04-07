"use client";

/**
 * Application-level performance optimization wrapper
 * 
 * This component applies performance optimizations at the root level:
 * - Performance monitoring using Web Vitals
 * - Standardized CSS containment through utility classes
 * - Resource loading optimization
 */

import React, { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';
// CSS containment is now handled through utility classes in globals.css

interface PerformanceWrapperProps {
  children: React.ReactNode;
}

/**
 * Client component that handles application-level performance optimizations
 */
export function PerformanceWrapper({ children }: PerformanceWrapperProps) {
  // Initialize web vitals reporting
  useEffect(() => {
    reportWebVitals();
  }, []);

  // Detect idle time to load non-critical resources
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const loadNonCriticalResources = () => {
        // Note: CSS is now consolidated in globals.css
        // No need to load separate non-critical CSS files
        
        // Preload below-fold images
        const belowFoldImages = document.querySelectorAll('img[data-below-fold="true"]');
        belowFoldImages.forEach(img => {
          if (img instanceof HTMLImageElement) {
            img.loading = 'lazy';
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
          }
        });
      };
      
      // Use requestIdleCallback to load non-critical resources during browser idle time
      window.requestIdleCallback(loadNonCriticalResources, { timeout: 2000 });
    }
  }, []);

  return (
    <>
      {children}
      {/* CSS containment is now applied via utility classes directly in component JSX */}
      
      {/* Add performance monitoring markers */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Mark the first paint for the document
            if (window.performance && window.performance.mark) {
              window.performance.mark('first-paint');
              
              // Create performance observer for Core Web Vitals
              if (PerformanceObserver) {
                try {
                  // LCP observer
                  new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    if (lastEntry) {
                      console.log('[Web Vitals] LCP:', lastEntry.startTime);
                    }
                  }).observe({type: 'largest-contentful-paint', buffered: true});
                  
                  // CLS observer
                  new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    let clsValue = 0;
                    entries.forEach(entry => {
                      if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                      }
                    });
                    console.log('[Web Vitals] CLS:', clsValue);
                  }).observe({type: 'layout-shift', buffered: true});
                } catch (e) {
                  console.error('[Web Vitals]', e);
                }
              }
            }
          `,
        }}
      />
    </>
  );
}
