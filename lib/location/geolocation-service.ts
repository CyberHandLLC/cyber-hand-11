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
    throw {
      code: 0,
      message: 'Geolocation is not supported by this browser',
      type: 'UNSUPPORTED'
    } as GeolocationError;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
        
        reject({
          code: error.code,
          message: error.message,
          type: errorType
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Get city and region based on coordinates using reverse geocoding
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
    // Use a free, privacy-friendly geocoding service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      { headers: { 'Accept-Language': 'en' } }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    return {
      city: data.address.city || data.address.town || data.address.village || 'Unknown',
      region: data.address.state || data.address.county || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
    return { city: 'Unknown', region: 'Unknown' };
  }
}