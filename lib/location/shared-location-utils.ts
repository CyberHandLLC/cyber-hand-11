/**
 * Shared Location Utilities
 *
 * This file contains utilities that work in both App Router and Pages Router
 * for consistent location handling across the application.
 *
 * These utilities are safe to import in both contexts without
 * causing serialization errors or client/server boundary issues.
 */

import { VALID_LOCATIONS, CITY_NAME_MAP } from "./location-utils";

// Types shared between App Router and Pages Router
export type SharedLocationInfo = {
  displayName: string;
  originalSlug: string;
  normalizedSlug: string;
  country?: string;
  region?: string;
  isValid: boolean;
};

// Map of cities to their regions for structured data
export const LOCATION_REGIONS: Record<string, { country: string; region: string }> = {
  "new-york": { country: "US", region: "NY" },
  "lewis-center": { country: "US", region: "OH" },
  "los-angeles": { country: "US", region: "CA" },
  chicago: { country: "US", region: "IL" },
  "san-francisco": { country: "US", region: "CA" },
  miami: { country: "US", region: "FL" },
  seattle: { country: "US", region: "WA" },
  austin: { country: "US", region: "TX" },
  boston: { country: "US", region: "MA" },
  denver: { country: "US", region: "CO" },
  atlanta: { country: "US", region: "GA" },
};

/**
 * Format a location slug into a display name
 * e.g., "new-york" -> "New York"
 */
export function formatLocationName(slug: string): string {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Normalize a location slug to ensure consistent format
 * e.g., "New York" -> "new-york"
 */
export function normalizeLocationSlug(location: string): string {
  if (!location) return "";

  return location
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Simple validation function that works in both App and Pages router
 * without React cache() dependencies
 */
export function isValidLocationSlug(location: string): boolean {
  if (!location) return false;
  const normalizedSlug = normalizeLocationSlug(location);

  // Accept predefined locations and reasonably formatted slugs
  return (
    VALID_LOCATIONS.includes(normalizedSlug) ||
    (normalizedSlug.length >= 3 && /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(normalizedSlug))
  );
}

/**
 * Get basic location info - safe for Pages Router
 */
export function getSharedLocationInfo(locationSlug: string): SharedLocationInfo {
  if (!locationSlug) {
    return {
      isValid: false,
      displayName: "",
      originalSlug: "",
      normalizedSlug: "",
    };
  }

  // Normalize the slug
  const normalizedSlug = normalizeLocationSlug(locationSlug);

  // Check validity
  const isValid = isValidLocationSlug(normalizedSlug);

  // Get display name
  let displayName = "";

  // Check if we have a special mapping for this slug
  if (CITY_NAME_MAP[normalizedSlug]) {
    displayName = CITY_NAME_MAP[normalizedSlug];
  } else {
    // Otherwise format the slug into a display name
    displayName = formatLocationName(normalizedSlug);
  }

  // Get regional data if available
  const regionData = LOCATION_REGIONS[normalizedSlug] || { country: "US", region: "" };

  return {
    isValid,
    displayName,
    originalSlug: locationSlug,
    normalizedSlug,
    ...regionData,
  };
}

/**
 * Generate AMP URL for a location
 */
export function getAmpLocationUrl(location: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com";
  return `${siteUrl}/services/${normalizeLocationSlug(location)}?amp=1`;
}
