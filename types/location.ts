/**
 * Location Types
 * 
 * Types related to user location data and consent management.
 */

/**
 * User's geolocation coordinates
 */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

/**
 * Location consent status options
 */
export type LocationConsentStatus = 'granted' | 'denied' | 'pending' | 'prompt';

/**
 * User location preferences stored in cookies/database
 */
export interface LocationPreferences {
  consentStatus: LocationConsentStatus;
  consentTimestamp: number;
  lastLocation?: GeoCoordinates;
  lastUpdated?: number;
  shouldPromptAgain?: boolean;
}

/**
 * Location request options
 */
export interface LocationRequestOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  promptIfDenied?: boolean;
}