/**
 * Font Optimization Utilities
 * 
 * This file contains utilities for optimizing font loading and rendering performance.
 * It implements subsetting, fallbacks, and display strategies to improve Core Web Vitals.
 */

// We use a custom interface to avoid TypeScript errors with NextFont's internal properties
interface FontInfo {
  variable?: string;
  className?: string;
  style?: Record<string, any>;
}

/**
 * Generates a fallback font stack for optimal font display
 * Uses size-adjust and other properties to reduce layout shift
 * 
 * @param primaryFont - The primary font name
 * @param category - The font category (serif, sans-serif, monospace, etc.)
 * @returns CSS variable declaration for the font fallback stack
 */
export function getFallbackFontStack(primaryFont: string, category: 'serif' | 'sans-serif' | 'monospace' | 'cursive' | 'fantasy'): string {
  // System font stacks by category
  const fallbacks = {
    'sans-serif': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
    'monospace': 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    'cursive': 'cursive',
    'fantasy': 'fantasy'
  };

  return `${primaryFont}, ${fallbacks[category]}`;
}

/**
 * Creates CSS for optimizing font loading
 * Uses Font Loading API when available with fallbacks
 * 
 * @param fontNames - Array of font names to optimize
 * @returns CSS string for font optimization
 */
export function createFontLoadingOptimization(fontNames: string[]): string {
  return `
    /* Font loading optimization */
    @supports (font-display: swap) {
      ${fontNames.map(font => `
        @font-face {
          font-family: '${font}';
          font-display: swap;
        }
      `).join('')}
    }
  `;
}

/**
 * Extracts font properties from NextFont objects for debugging
 * and verification of font optimization settings
 * 
 * @param fonts - Object containing NextFont instances
 * @returns Font optimization info for logging
 */
export function getNextFontInfo(fonts: Record<string, any>): Record<string, FontInfo> {
  // Safely extract properties that might be private/internal
  return Object.entries(fonts).reduce((acc, [name, font]) => {
    // Extract safely even if properties are not directly accessible
    // Most font properties are exposed through the object
    acc[name] = {
      variable: font.variable || null,
      className: font.className || null,
      style: font.style || {},
    };
    return acc;
  }, {} as Record<string, FontInfo>);
}

/**
 * Generates preload link tags for critical fonts
 * 
 * @param fontUrls - Array of critical font URLs to preload
 * @returns Array of preload tags as strings
 */
export function generateFontPreloadTags(fontUrls: string[]): string[] {
  return fontUrls.map(url => 
    `<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin="anonymous" />`
  );
}

/**
 * Dynamically applies size-adjust properties to reduce CLS
 * during font loading. This helps maintain layout stability
 * when switching between fallback and web fonts.
 * 
 * @param fontName - The name of the font to optimize
 * @returns CSS for size adjustments
 */
export function createSizeAdjustOptimization(fontName: string): string {
  // Font-specific size-adjust values based on common metrics
  // These should be adjusted based on actual font metrics for best results
  const sizeAdjustments: Record<string, number> = {
    'Inter': 0.94,
    'Orbitron': 1.05,
    // Add more fonts as needed
  };

  const adjustment = sizeAdjustments[fontName] || 1;
  
  return `
    /* Size-adjust optimization for ${fontName} */
    .using-${fontName.toLowerCase()}-fallback {
      font-family: system-ui, sans-serif;
      font-size-adjust: ${adjustment};
      letter-spacing: -0.02em;
    }
  `;
}
