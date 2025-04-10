/**
 * Critical CSS Utilities
 *
 * This module provides utilities for optimizing CSS loading performance:
 * 1. Identifies critical CSS for above-the-fold content
 * 2. Implements preloading strategies for key stylesheets
 * 3. Provides utility functions for CSS containment
 */

/**
 * Critical CSS class names that should always be included in the initial CSS payload
 * These are essential for above-the-fold UI components
 */
export const CRITICAL_CSS_CLASSES = [
  // Layout classes
  "container",
  "flex",
  "flex-col",
  "items-center",
  "justify-between",
  "grid",
  "grid-cols-1",
  "grid-cols-2",
  "gap-4",
  "gap-8",
  "p-4",
  "px-4",
  "py-6",
  "mx-auto",
  "my-8",

  // Typography classes
  "text-xl",
  "text-2xl",
  "text-3xl",
  "font-bold",
  "font-medium",
  "text-white",
  "text-gray-200",
  "text-gray-800",
  "dark:text-white",

  // Component specific critical classes for hero sections
  "bg-primary",
  "bg-secondary",
  "rounded-lg",
  "shadow-md",

  // Theme-related critical classes
  "dark",
  "light",
  "theme-blue",
  "theme-cyan",

  // Animation classes for initial page load
  "animate-fade-in",
  "animate-slide-up",
  "animate-pulse",

  // Navigation critical classes
  "sticky",
  "top-0",
  "z-50",
  "nav-link",
  "nav-active",
];

/**
 * CSS property values that should use containment for better performance
 * https://developer.mozilla.org/en-US/docs/Web/CSS/contain
 */
export const CSS_CONTAINMENT_SELECTORS = [
  // Cards and grid items that have fixed dimensions
  ".card",
  ".service-card",
  ".grid-item",
  ".case-study-card",

  // Fixed size image containers
  '.image-container[data-fixed-size="true"]',
  ".aspect-ratio-box",

  // Layout sections with fixed dimensions
  ".fixed-section",
  ".stats-grid > div",

  // Components with heavy animations
  '[data-animation="true"]',
];

/**
 * Generate a style tag with instructions for applying standardized CSS containment utility classes
 *
 * @returns String containing CSS comments to guide developers on utility class usage
 */
export function generateContainmentCSS(): string {
  return `
    /* 📝 NOTE: Direct containment CSS has been replaced with standardized utility classes. 
       Instead of using this generated CSS, apply these utility classes directly: 
       
       - Card components:        'contain-card'
       - Layout sections:        'contain-section'
       - Navigation elements:    'contain-nav'
       - Media containers:       'contain-media'
       - Interactive components: 'contain-interactive'
       - Fixed-size elements:    'contain-fixed'
       - Offscreen content:      'contain-offscreen'
       
       Documentation in: docs/CSS-CONSOLIDATION.md 
    */

    /* Element-specific mapping recommendations */
    ${CSS_CONTAINMENT_SELECTORS.map((selector) => `/* ${selector} → add 'contain-interactive' class */`).join("\n    ")}
    /* .fixed-layout-section → add 'contain-section' class */
    /* .offscreen-content → add 'contain-offscreen' class */
    /* .fixed-size-element → add 'contain-fixed' class */
    /* .isolated-component → add 'contain-strict' class */
  `;
}

/**
 * Class names that should be preloaded in the document head
 * to avoid flash of unstyled content
 */
export const PRELOAD_STYLESHEETS = [
  // Note: critical.css has been consolidated into globals.css
  "/styles/fonts.css",
];

/**
 * Generate preload link tags for critical stylesheets
 *
 * @returns Array of preload link objects for Next.js Head component
 */
export function generatePreloadLinks() {
  return PRELOAD_STYLESHEETS.map((href) => ({
    rel: "preload",
    href,
    as: "style",
    crossOrigin: "anonymous",
  }));
}
