"use client";

/**
 * OptimizedImage Component
 * 
 * A standardized image component built on Next.js Image with best practices for:
 * - Responsive sizing
 * - WebP/AVIF format delivery
 * - Lazy loading
 * - Blur placeholders
 * - Art direction
 * 
 * This is a client component because it handles dynamic loading state
 * and progressive enhancement.
 */

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface OptimizedImageProps {
  /** Source URL of the image */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional className for the container */
  className?: string;
  /** Set to true for LCP images above the fold */
  priority?: boolean;
  /** Width in pixels (not needed if fill=true) */
  width?: number;
  /** Height in pixels (not needed if fill=true) */
  height?: number;
  /** Set to true to fill its parent container */
  fill?: boolean;
  /** Responsive sizes attribute, defaults to 100vw */
  sizes?: string;
  /** Image quality (1-100), defaults to 85 */
  quality?: number;
  /** Base64 blur data URL for placeholder */
  blurDataURL?: string;
  /** Placeholder type, either 'blur' or 'empty' */
  placeholder?: "blur" | "empty";
  /** Optional CSS object position property */
  objectPosition?: string;
  /** Optional object fit style */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Function to call when the image is fully loaded */
  onLoad?: () => void;
}

/**
 * OptimizedImage component with performance best practices
 * 
 * @param props - Component properties (see OptimizedImageProps)
 * @returns React component
 */
export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  width,
  height,
  fill = false,
  sizes = "100vw",
  quality = 85,
  blurDataURL,
  placeholder,
  objectPosition,
  objectFit = "cover",
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle image load complete
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        fill ? "w-full h-full" : "",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        className={cn(
          `transition-opacity duration-500 ${objectFit ? `object-${objectFit}` : ""}`,
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ objectPosition }}
        priority={priority}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        {...props}
      />

      {/* Show placeholder until image loads */}
      {!isLoaded && !priority && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
