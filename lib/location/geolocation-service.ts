/**
 * Geolocation Service
 * 
 * A utility service for handling browser geolocation with proper error handling
 * and TypeScript typing. Implements best practices for location privacy and consent.
 * 
 * @module lib/location/geolocation-service
 */

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
  type: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED';
}

/**
 * Checks if geolocation is supported in the current browser
 * 
 * @returns {boolean} True if geolocation is supported
 */
export function isGeolocationSupported(): boolean {
  return typeof window !== 'undefined' && 'geolocation' in navigator;
}

/**
 * Get user's current position with a Promise-based API
 * 
 * @returns {Promise<GeolocationPosition>} A promise that resolves with the position
 */
export async function getCurrentPosition(): Promise<GeolocationPosition> {
  if (!isGeolocationSupported()) {
    console.error('Geolocation API not supported by this browser');
    throw {
      code: 0,
      message: 'Geolocation is not supported by this browser',
      type: 'UNSUPPORTED'
    } as GeolocationError;
  }

  return new Promise((resolve, reject) => {
    console.log('Requesting user location from browser...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Successfully received coordinates:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorType: GeolocationError['type'] = 'POSITION_UNAVAILABLE';
        
        switch (error.code) {
          case 1:
            errorType = 'PERMISSION_DENIED';
            break;
          case 2:
            errorType = 'POSITION_UNAVAILABLE';
            break;
          case 3:
            errorType = 'TIMEOUT';
            break;
        }
        
        console.error('Geolocation error:', { code: error.code, message: error.message, type: errorType });
        
        reject({
          code: error.code,
          message: error.message,
          type: errorType
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 8000, // Increased timeout for slower connections
        maximumAge: 60000 // Allow cached positions up to 1 minute old
      }
    );
  });
}

/**
 * Get city and region based on coordinates using reverse geocoding
 * Uses our server-side API route to avoid CORS and rate limiting issues
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<{city: string, region: string}>} Location data
 */
export async function getLocationFromCoordinates(
  latitude: number, 
  longitude: number
): Promise<{city: string, region: string}> {
  try {
    console.log(`Calling geocode API with lat=${latitude}, lng=${longitude}`);
    
    // Use our server-side API instead of direct external service calls
    // This solves CORS issues, handles rate limits, and adds caching
    const response = await fetch(
      `/api/geocode?lat=${latitude}&lng=${longitude}`,
      { cache: 'no-store' } // Prevent caching to ensure fresh data
    );
    
    if (!response.ok) {
      // If our API fails, get the error details
      const errorData = await response.json().catch(() => ({}));
      console.error('Geocoding API error:', errorData);
      throw new Error(errorData.message || 'Geocoding service unavailable');
    }
    
    // Parse the response from our API
    const data = await response.json();
    console.log('Geocoding API response:', data);
    
    // Ensure we have city and region, with fallbacks
    return {
      city: data.city || 'Unknown',
      region: data.region || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
    return { city: 'Unknown', region: 'Unknown' };
  }
}