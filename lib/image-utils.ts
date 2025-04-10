/**
 * Image Utilities
 *
 * Provides standardized image configuration, size presets, and helper functions
 * for optimized image delivery across the Cyber Hand website.
 */

/**
 * Standard responsive size presets for different image use cases
 * Follows the pattern: (max-width: breakpoint) size, ...
 */
export const IMAGE_SIZES = {
  // Responsive sizes based on common breakpoints
  responsive: {
    // Most common use case for general images
    default: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",

    // Full-width hero images
    hero: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw",

    // Half-width images on desktop, full on mobile
    halfWidth: "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 50vw",

    // Case study card images
    card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",

    // Team member or profile images
    portrait: "(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw",
  },

  // Standard fixed dimensions for common use cases
  fixed: {
    icon: { width: 48, height: 48 },
    thumbnail: { width: 300, height: 200 },
    card: { width: 600, height: 400 },
    hero: { width: 1200, height: 600 },
    portrait: { width: 400, height: 500 },
  },
};

/**
 * Generate a tiny SVG placeholder for use as blurDataURL
 * This creates a simple colored rectangle matching the dominant color
 *
 * @param color - Hex color code (defaults to neutral gray)
 * @returns Base64-encoded SVG data URL
 */
export function generateSvgPlaceholder(color: string = "#CBD5E1"): string {
  // Create a minimalistic SVG with the given color
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6" width="10" height="6">
    <rect width="10" height="6" fill="${color}" />
  </svg>`;

  // Encode the SVG as base64
  const toBase64 =
    typeof window === "undefined"
      ? (str: string) => Buffer.from(str).toString("base64")
      : (str: string) => window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

/**
 * Get appropriate image sizes attribute based on layout context
 *
 * @param variant - Image usage variant (hero, card, etc.)
 * @returns Appropriate sizes attribute string
 */
export function getImageSizes(variant: keyof typeof IMAGE_SIZES.responsive = "default"): string {
  return IMAGE_SIZES.responsive[variant] || IMAGE_SIZES.responsive.default;
}

/**
 * Determine if an image should be loaded with priority
 * Based on whether it might be the Largest Contentful Paint element
 *
 * @param variant - Image usage variant
 * @param position - Position on the page (1 = first image)
 * @returns Boolean indicating if image should have priority
 */
export function shouldPrioritize(variant: string, position: number = 0): boolean {
  // Hero images and the first visible card should be prioritized
  return variant === "hero" || (variant === "card" && position <= 1);
}

/**
 * Get a formatted image URL with quality and format parameters
 * Can be used with image CDNs or services
 *
 * @param baseUrl - Original image URL
 * @param options - Transform options
 * @returns Formatted image URL with transformation parameters
 */
export function getFormattedImageUrl(
  baseUrl: string,
  _options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpg" | "png";
  } = {}
): string {
  // This is a placeholder implementation
  // In a real app, this would integrate with your image CDN or service

  // For now, just return the original URL since Next.js Image handles optimization
  return baseUrl;
}
