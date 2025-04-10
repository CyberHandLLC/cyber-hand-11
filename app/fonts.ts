/**
 * Font Optimization System (Next.js 15.2.4+)
 *
 * Implements Next.js 15 best practices for font optimization:
 * - Self-hosted Google Fonts via next/font
 * - Automatic size-adjust metrics for fallback fonts
 * - Font subsetting for reduced payload
 * - Variable fonts with minimal bundle size
 * - Strategic font display settings
 */
import { Inter, Orbitron } from "next/font/google";

// Primary content font - used for body text and UI elements
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

// Brand/heading font - used for headlines and key brand elements
export const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700"],
  fallback: ["Arial", "Helvetica Neue", "sans-serif"],
  adjustFontFallback: true,
});

// Font class mapping for component-level application
export const fontClasses = {
  body: inter.className,
  heading: orbitron.className,
  ui: inter.className,
};

// CSS variable mapping for global application via layout
export const fontVariables = {
  inter: inter.variable,
  orbitron: orbitron.variable,
};

// Helper type for strongly typed font classes
export type FontClassName = keyof typeof fontClasses;
