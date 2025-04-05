/**
 * StaticImage Component
 * 
 * A server component wrapper for static images that don't need client-side interactivity.
 * This follows the pattern of keeping most components as Server Components
 * and only using Client Components when necessary.
 */

import Image from "next/image";
import { getImageSizes, generateSvgPlaceholder } from "@/lib/image-utils";

export interface StaticImageProps {
  /** Source URL of the image */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional className for styling */
  className?: string;
  /** Width of the image */
  width?: number;
  /** Height of the image */
  height?: number;
  /** Set to true to fill its parent container */
  fill?: boolean;
  /** Image variant for sizing */
  variant?: 'default' | 'hero' | 'card' | 'halfWidth' | 'portrait';
  /** Quality of the image (1-100) */
  quality?: number;
  /** Whether this is a priority image (above the fold) */
  priority?: boolean;
  /** Placeholder color */
  placeholderColor?: string;
  /** Object fit style */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

/**
 * Static image component for server-rendered images
 * 
 * @param props - Component properties
 * @returns React component
 */
export function StaticImage({
  src,
  alt,
  className = "",
  width,
  height,
  fill = false,
  variant = 'default',
  quality = 85,
  priority = false,
  placeholderColor = "#1e293b",
  objectFit = "cover"
}: StaticImageProps) {
  // Generate sizes based on variant
  const sizes = getImageSizes(variant);
  
  // Generate SVG placeholder
  const blurDataURL = generateSvgPlaceholder(placeholderColor);
  
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      placeholder="blur"
      blurDataURL={blurDataURL}
      style={{ objectFit }}
    />
  );
}
