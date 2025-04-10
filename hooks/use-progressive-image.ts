"use client";

/**
 * useProgressiveImage Hook
 *
 * A hook for implementing progressive image loading using the "blur-up" technique.
 * This hook helps to:
 * 1. Immediately show a small, blurry placeholder image
 * 2. Load the full-size image in the background
 * 3. Smoothly transition between the placeholder and full image once loaded
 *
 * This is particularly effective for large hero or background images.
 */

import { useState, useEffect } from "react";

/**
 * Custom hook for progressive image loading
 *
 * @param src - The URL of the main high-quality image
 * @param placeholderSrc - The URL of a small, blurry placeholder image (optional)
 * @param options - Additional options for loading behavior
 * @returns Object containing loading state and current src to display
 */
export function useProgressiveImage(
  src: string,
  placeholderSrc?: string,
  options?: {
    /** Delay in ms before starting to load the main image (useful for deprioritizing offscreen images) */
    delay?: number;
    /** Callback when the main image has finished loading */
    onLoad?: () => void;
    /** Custom error handling function */
    onError?: (error: Error) => void;
  }
) {
  // State to track image loading
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Set up effect to handle image loading
  useEffect(() => {
    // Optional delay before starting to load the main image
    const timer = setTimeout(() => {
      if (!src) return;

      // Create new image object to preload the image
      const img = new Image();

      // Set up load and error handlers
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
        if (options?.onLoad) options.onLoad();
      };

      img.onerror = (e) => {
        const err = new Error(`Failed to load image: ${src}`);
        setError(err);
        if (options?.onError) options.onError(err);
        console.error("Image loading error:", err);
      };

      // Start loading the image
      img.src = src;
    }, options?.delay || 0);

    // Clean up on unmount
    return () => clearTimeout(timer);
  }, [src, options]);

  // Return current state for component use
  return {
    src: imgSrc,
    isLoaded,
    error,
    // Convenient boolean for components to use
    isLoading: !isLoaded && !error,
  };
}
