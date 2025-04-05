"use client";

/**
 * CaseStudyImage Component
 * 
 * A specialized image component for case study images with:
 * - Art direction based on usage context (hero, card, detail)
 * - Responsive sizing appropriate for case study layouts
 * - Proper loading priorities for LCP optimization
 * - Placeholder handling for improved UX
 */

import React from "react";
import { OptimizedImage, type OptimizedImageProps } from "@/components/ui/optimized-image";
import { 
  getImageSizes, 
  generateSvgPlaceholder, 
  shouldPrioritize,
} from "@/lib/image-utils";

export interface CaseStudyImageProps extends Omit<OptimizedImageProps, 'sizes' | 'blurDataURL'> {
  /** Usage variant affects sizing, priority and art direction */
  variant: 'hero' | 'card' | 'detail' | 'thumbnail';
  /** Visual position in viewport (used for priority calculation) */
  position?: number;
  /** Optional dominant color for placeholder */
  placeholderColor?: string;
  /** Optional aspect ratio override (e.g. "16/9", "1/1") */
  aspectRatio?: string;
}

/**
 * Specialized image component for case studies
 * 
 * @param props - Component properties (see CaseStudyImageProps)
 * @returns React component
 */
export function CaseStudyImage({
  src,
  alt,
  variant = 'detail',
  position = 0,
  fill = true,
  className = "",
  placeholderColor = "#1e293b", // Default dark color matching brand
  aspectRatio,
  objectFit = "cover",
  width,
  height,
  ...props
}: CaseStudyImageProps) {
  // Determine optimal sizing strategy based on variant
  const sizes = getImageSizes(
    variant === 'hero' ? 'hero' : 
    variant === 'card' ? 'card' : 
    variant === 'thumbnail' ? 'portrait' : 
    'default'
  );
  
  // Determine if this image should be prioritized (LCP optimization)
  const priority = shouldPrioritize(variant, position);
  
  // Generate SVG placeholder with the dominant color
  const blurDataURL = generateSvgPlaceholder(placeholderColor);
  
  // Apply aspect ratio if specified
  const containerStyle = aspectRatio ? { 
    aspectRatio, 
    width: '100%'
  } : undefined;
  
  return (
    <div 
      className={`${variant === 'hero' ? 'w-full' : ''} ${className}`}
      style={containerStyle}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        priority={priority}
        fill={fill}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        objectFit={objectFit}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
}
