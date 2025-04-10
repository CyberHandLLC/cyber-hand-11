/**
 * Location Module Index
 *
 * Central export point for all location-related utilities and types
 * to maintain clean imports throughout the application.
 */

// Import and re-export essential types
import type { LocationData } from "./location-context";
export type { LocationData };

// Re-export functionality from location utils
export {
  VALID_LOCATIONS,
  validateLocation,
  formatLocationName,
  generateLocationSlug as cityNameToSlug,
  generateLocationSlug as slugToCityName, // This is essentially the same function in reverse
  validateLocation as isValidLocationSlug,
  getLocationInfo,
  type LocationParams,
  type LocationInfo,
} from "./location-utils";

// Export location service functions
export {
  getLocationData,
  getLocationFromHeaders,
  getLiteLocationFromHeaders,
} from "./location-service";

// Define the context type
export interface LocationContextType {
  location: LocationData;
  overrideLocation: (newLocation: Partial<LocationData>) => void;
  resetLocation: () => void;
  isLoading: boolean;
  hasOverride: boolean;
}

// Note: LocationProvider and useLocation should be imported directly from location-context.tsx
// when used in components as they are client components with 'use client' directive

// Define a type alias for location slugs
export type LocationSlug = string;
