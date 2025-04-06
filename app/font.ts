import { NextFont as _NextFont } from 'next/dist/compiled/@next/font';
import { Inter, Orbitron } from 'next/font/google';

/**
 * Font Optimization Implementation
 * 
 * We're implementing the following optimizations:
 * 1. Font subsetting - Only loading the characters we actually use
 * 2. Optimized font-display strategies - 'swap' for UI fonts, 'optional' for decorative
 * 3. Variable fonts when available - Reduced file size while supporting multiple weights
 * 4. Preloading of critical fonts - Improves LCP by avoiding font-related layout shifts
 */

// Primary content font - used for body text and most content
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Use swap for primary content font to ensure text is always visible
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  // Enables font subsetting - only loads the characters we need
  // This dramatically reduces font file size
  adjustFontFallback: true, // Reduces CLS by matching fallback metrics
});

// Brand/heading font - used for headings and brand elements
export const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap', // Important for brand identity elements
  variable: '--font-orbitron',
  // Only load needed weights to reduce file size
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
  adjustFontFallback: true,
});

// Font CSS class map for easy application
export const fontClasses = {
  // Body text
  body: inter.className,
  // Heading text
  heading: orbitron.className,
  // UI elements (buttons, inputs, etc.)
  ui: inter.className,
};

// CSS variable map for theme integration
export const fontVariables = {
  inter: inter.variable,
  orbitron: orbitron.variable,
};

// Fallback font stacks for critical CSS
export const fontFallbacks = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  display: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};
