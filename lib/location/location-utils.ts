/**
 * Location Utilities for Cyber Hand
 *
 * Provides utility functions for location validation,
 * formatting, and slug generation for SEO-friendly URLs.
 */
import { cache } from "react";

// List of valid locations (can be extended or fetched from API)
export const VALID_LOCATIONS = [
  "new-york",
  "lewis-center", // Spaces converted to hyphens for URL compatibility
  "los-angeles",
  "chicago",
  "san-francisco",
  "miami",
  "seattle",
  "austin",
  "boston",
  "denver",
  "atlanta",
  // Add other locations as needed
];

// Maps original city names to URL-friendly slugs
export const CITY_NAME_MAP: Record<string, string> = {
  "New York": "new-york",
  "Lewis Center": "lewis-center",
  "Los Angeles": "los-angeles",
  Chicago: "chicago",
  "San Francisco": "san-francisco",
  Miami: "miami",
  Seattle: "seattle",
  Austin: "austin",
  Boston: "boston",
  Denver: "denver",
  Atlanta: "atlanta",
};

/**
 * Validates if a location slug is potentially valid for our application
 * Uses React.cache() for deduplication of validation requests
 *
 * In this more permissive implementation, we consider a location valid if:
 * 1. It's in our predefined list (guaranteed valid)
 * 2. OR it meets basic format requirements for a location slug
 */
export const validateLocation = cache(async (location: string): Promise<boolean> => {
  if (!location) return false;

  // Normalize the input slug
  const normalizedSlug = location.toLowerCase();

  // If it's in our predefined list, it's definitely valid
  if (VALID_LOCATIONS.includes(normalizedSlug)) {
    return true;
  }

  // Otherwise, perform basic validation for a potential location slug:
  // - Must be at least 3 characters
  // - Must contain only alphanumeric characters and hyphens
  // - Must not contain consecutive hyphens
  // - Must start and end with an alphanumeric character
  return (
    normalizedSlug.length >= 3 &&
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(normalizedSlug) &&
    !normalizedSlug.includes("--")
  );
});

/**
 * Format a location slug into a human-readable display name
 * Example: "new-york" -> "New York"
 */
export function formatLocationName(locationSlug: string): string {
  if (!locationSlug) return "";

  return locationSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate a consistent location slug from a city name
 * Example: "New York" -> "new-york"
 */
export function generateLocationSlug(cityName: string): string {
  if (!cityName) return "";

  // First check if the city is in our predefined map
  if (CITY_NAME_MAP[cityName]) {
    return CITY_NAME_MAP[cityName];
  }

  // Otherwise, generate a slug based on the name
  return cityName
    .toLowerCase()
    .replace(/\s+/g, "-") // Convert spaces to hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove non-alphanumeric characters
}

/**
 * Type definition for location params in dynamic routes
 * Next.js 15 handles route params as Promises
 */
export interface LocationParams {
  params: Promise<{
    location: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Response from location validation and info retrieval
 */
export interface LocationInfo {
  isValid: boolean;
  displayName: string;
  originalSlug: string;
  normalizedSlug: string;
  country?: string;
  region?: string;
}

/**
 * Get comprehensive information about a location slug
 * Validates, normalizes, and formats the location for display
 */
export const getLocationInfo = cache(async (locationSlug: string): Promise<LocationInfo> => {
  if (!locationSlug) {
    return {
      isValid: false,
      displayName: "",
      originalSlug: "",
      normalizedSlug: "",
    };
  }

  // Normalize the slug (ensure proper format)
  const normalizedSlug = locationSlug
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Validate location
  const isValid = await validateLocation(normalizedSlug);

  // Default values for invalid locations
  if (!isValid) {
    return {
      isValid: false,
      displayName: formatLocationName(normalizedSlug), // Still format for display even if invalid
      originalSlug: locationSlug,
      normalizedSlug,
    };
  }

  // Format for display (e.g., "new-york" -> "New York")
  const displayName = formatLocationName(normalizedSlug);

  // For predefined locations, use our hardcoded region/country data
  let locationDetails = {};

  // Check if it's in our predefined mappings
  const predefinedDetails = {
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
  }[normalizedSlug];

  if (predefinedDetails) {
    // Use our predefined details if available
    locationDetails = predefinedDetails;
  } else {
    // For dynamic locations, provide US as default country
    // In a production environment, you could do a geocoding API lookup here
    locationDetails = {
      country: "US",
      region: "",
    };
  }

  return {
    isValid,
    displayName,
    originalSlug: locationSlug,
    normalizedSlug,
    ...locationDetails,
  };
});

/**
 * Get services available in a specific location
 * Uses cache() for request deduplication
 */
export const getServicesForLocation = cache(async (location: string) => {
  // Validate location before fetching
  const isValid = await validateLocation(location);
  if (!isValid) {
    // For invalid locations, still return a minimal data set rather than error
    // This avoids 500 errors and provides a fallback experience
    return {
      location: formatLocationName(location),
      services: [
        { id: "web-dev", name: "Web Development", isAvailable: true },
        { id: "design", name: "UI/UX Design", isAvailable: true },
        { id: "marketing", name: "Digital Marketing", isAvailable: true },
      ],
      specialties: ["General Business"],
    };
  }

  // In a real implementation, you would fetch from an API or database
  // For now we'll return mock data
  return {
    location: formatLocationName(location),
    services: [
      { id: "web-dev", name: "Web Development", isAvailable: true },
      { id: "design", name: "UI/UX Design", isAvailable: true },
      { id: "marketing", name: "Digital Marketing", isAvailable: location !== "denver" },
      {
        id: "consulting",
        name: "Tech Consulting",
        isAvailable: ["new-york", "san-francisco", "chicago"].includes(location),
      },
    ],
    specialties:
      location === "new-york"
        ? ["Fintech", "Media"]
        : location === "san-francisco"
          ? ["Startups", "Tech"]
          : location === "miami"
            ? ["Hospitality", "Real Estate"]
            : ["General Business"],
  };
});
