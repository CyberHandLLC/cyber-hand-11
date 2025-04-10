/**
 * Font Optimization Implementation (Next.js 15.2.4+)
 *
 * Follows Next.js 15 best practices for font optimization:
 * 1. Automatic font optimization with next/font to eliminate CLS
 * 2. Zero external network requests using self-hosted Google Fonts
 * 3. Automatic fallback font generation with size-adjust metrics
 * 4. Font subsetting for reduced file size and improved loading
 * 5. Variable fonts for multiple weights with minimal file size impact
 * 6. Strategic font-display settings (swap for all critical text)
 */
import { Inter, Orbitron } from "next/font/google";

// Primary content font - used for body text and most UI elements
export const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Ensures text is always visible during font loading
  variable: "--font-inter",
  // Next.js 15 automatically applies proper size-adjust to fallbacks
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  // This enables Next.js to automatically calculate size-adjust values
  // to match fallback fonts to the actual font metrics, reducing CLS
  adjustFontFallback: true,
});

// Brand/heading font - used for headlines and key brand elements
export const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap", // Brand identity should be visible immediately
  variable: "--font-orbitron",
  // Only load specific weights we actually use to reduce bundle size
  weight: ["400", "500", "600", "700"],
  // Next.js 15 automatically applies proper size-adjust to fallbacks
  fallback: ["Arial", "Helvetica Neue", "sans-serif"],
  adjustFontFallback: true,
});

/**
 * Font utility exports for use throughout the application
 */

// Font class mapping for component-level application
export const fontClasses = {
  // Body text class
  body: inter.className,
  // Heading text class
  heading: orbitron.className,
  // UI elements class (buttons, inputs, etc.)
  ui: inter.className,
};

// CSS variable mapping for global application via layout
export const fontVariables = {
  inter: inter.variable,
  orbitron: orbitron.variable,
};

// Helper type for strongly typed font classes
export type FontClassName = keyof typeof fontClasses;

// We no longer need explicit fallback stacks as Next.js 15 handles this
// automatically with the adjustFontFallback option
