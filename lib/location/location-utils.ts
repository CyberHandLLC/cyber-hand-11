/**
 * Location Utilities
 * 
 * Helper functions for working with location data throughout the application.
 * These utilities help maintain clean separation between data fetching and presentation.
 * 
 * @file lib/location/location-utils.ts
 */

import { getConsentPreferences, ConsentType, ConsentStatus } from '../cookies/cookie-manager';

/**
 * Calculates the distance between two coordinates using the Haversine formula
 * 
 * @param {number} lat1 - Latitude of the first point
 * @param {number} lon1 - Longitude of the first point
 * @param {number} lat2 - Latitude of the second point
 * @param {number} lon2 - Longitude of the second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Converts degrees to radians
 * 
 * @param {number} deg - Degrees to convert
 * @returns {number} Converted value in radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

/**
 * Formats a distance value with proper units
 * 
 * @param {number} distance - Distance in kilometers
 * @param {boolean} useImperial - Whether to use imperial units (miles)
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance: number, useImperial = false): string {
  if (useImperial) {
    const miles = distance * 0.621371;
    return miles < 1 
      ? `${Math.round(miles * 5280)} ft` 
      : `${miles.toFixed(1)} mi`;
  } else {
    return distance < 1 
      ? `${Math.round(distance * 1000)} m` 
      : `${distance.toFixed(1)} km`;
  }
}

/**
 * Checks if location consent is granted
 * 
 * @returns {boolean} Whether location consent is granted
 */
export function isLocationConsentGranted(): boolean {
  const preferences = getConsentPreferences();
  return preferences[ConsentType.LOCATION] === ConsentStatus.GRANTED;
}

/**
 * Determines if a particular resource should be shown based on location settings
 * 
 * @param {boolean} isLocationSpecific - Whether the resource is location-specific
 * @returns {boolean} Whether the resource should be shown
 */
export function shouldShowBasedOnLocation(isLocationSpecific: boolean): boolean {
  // If the content isn't location-specific, always show it
  if (!isLocationSpecific) return true;
  
  // If it is location-specific, only show if consent is granted
  return isLocationConsentGranted();
}

/**
 * Sorts an array of items by distance from the user's location
 * 
 * @param {Array<T>} items - Array of items to sort
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude 
 * @param {Function} getCoords - Function to extract coordinates from an item
 * @returns {Array<T>} Sorted array
 */
export function sortByDistance<T>(
  items: T[], 
  userLat: number, 
  userLng: number,
  getCoords: (item: T) => { lat: number; lng: number }
): T[] {
  return [...items].sort((a, b) => {
    const coordsA = getCoords(a);
    const coordsB = getCoords(b);
    
    const distanceA = calculateDistance(userLat, userLng, coordsA.lat, coordsA.lng);
    const distanceB = calculateDistance(userLat, userLng, coordsB.lat, coordsB.lng);
    
    return distanceA - distanceB;
  });
}