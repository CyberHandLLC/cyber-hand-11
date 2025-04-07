/**
 * Location Service
 * 
 * Server-side utilities for working with geolocation data.
 * Extracts location information from headers set by middleware.
 */

import type { LocationData } from './location-context';

// Default location when no data is available
const DEFAULT_LOCATION: LocationData = {
  isDetected: false,
  lastUpdated: Date.now()
};

// Import the headers function type instead of the actual import
// This avoids issues with RSC boundaries
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

/**
 * Get location data from request headers (Server Component Only)
 * Uses the headers() API at the component level to ensure proper typing
 * 
 * @returns Location data from request headers
 */
export function getLocationData(): LocationData {
  // Instead of dynamic imports, we'll directly use Next.js headers() function
  // and handle the server/client differences properly
  let headersList: ReadonlyHeaders | { get(name: string): string | null } = {
    get: (_name: string): string | null => null
  };

  try {
    // Only import and use headers() on the server
    if (typeof window === 'undefined') {
      // Need to use eval to prevent bundling issues
      // This is a Next.js-specific pattern for server components
      // eslint-disable-next-line no-eval
      const { headers } = eval("require('next/headers')");
      headersList = headers();
    }
    
    // Extract geolocation headers
    const country = headersList.get('x-geo-country') || undefined;
    const city = headersList.get('x-geo-city') || undefined;
    const region = headersList.get('x-geo-region') || undefined;
    const timezone = headersList.get('x-geo-timezone') || undefined;
    const continent = headersList.get('x-geo-continent') || undefined;
    
    // Parse coordinate headers if present
    const latValue = headersList.get('x-geo-latitude');
    const longValue = headersList.get('x-geo-longitude');
    
    const latitude = latValue ? parseFloat(latValue) : undefined;
    const longitude = longValue ? parseFloat(longValue) : undefined;
    
    // Return the parsed location data
    return {
      country,
      city,
      region,
      timezone,
      continent,
      latitude,
      longitude,
      isDetected: Boolean(country || city),
      lastUpdated: Date.now()
    };
  } catch (_error) {
    console.error('Error getting location from headers');
    return DEFAULT_LOCATION;
  }
}

/**
 * Server Component helper to check if a user is in a specific country
 * Uses dynamic import to ensure proper headers() API usage
 */
export function isInCountry(countryCode: string): boolean {
  try {
    const { country } = getLocationData();
    return country === countryCode;
  } catch (_error) {
    return false;
  }
}

/**
 * Server Component helper to check if a user is in a specific region/state
 * Uses dynamic import to ensure proper headers() API usage
 */
export function isInRegion(regionCode: string): boolean {
  try {
    const { region } = getLocationData();
    return region === regionCode;
  } catch (_error) {
    return false;
  }
}

/**
 * Server Component helper to check if a user is in a specific continent
 */
export function isInContinent(continentCode: string): boolean {
  try {
    const { continent } = getLocationData();
    return continent === continentCode;
  } catch (_error) {
    return false;
  }
}

/**
 * Server Component helper to format the user's location as a string
 * Example: "San Francisco, CA, US"
 */
export function getFormattedLocation(): string {
  try {
    const { city, region, country } = getLocationData();
    
    if (!city && !region && !country) {
      return 'Unknown Location';
    }
    
    const parts: string[] = [];
    if (city) parts.push(city);
    if (region) parts.push(region);
    if (country) parts.push(country);
    
    return parts.join(', ');
  } catch (_error) {
    return 'Unknown Location';
  }
}
