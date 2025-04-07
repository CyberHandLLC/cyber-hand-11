'use client';

/**
 * Location Context Provider
 * 
 * Provides location data and location consent management
 * throughout the application with memory-optimized state management.
 * 
 * @module lib/location/location-context
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { 
  getCurrentPosition, 
  getLocationFromCoordinates, 
  isGeolocationSupported, 
  type GeolocationError,
  // Using underscore prefix for unused types per coding standard
  type GeolocationPosition as _GeolocationPosition 
} from './geolocation-service';
import { 
  ConsentStatus, 
  ConsentType, 
  // Using underscore prefix for unused imports per coding standard
  getConsentPreferences as _getConsentPreferences, 
  getLocationData, 
  hasConsent, 
  storeLocationData, 
  updateConsent 
} from '../cookies/cookie-manager';

interface LocationData {
  city: string;
  region: string;
  loading: boolean;
  error: string | null;
}

interface LocationContextType {
  // Location data
  locationData: LocationData;
  
  // Location consent status
  isLocationAllowed: boolean;
  
  // Consent actions
  requestLocationPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
  
  // Location actions
  clearLocationPermission: () => void;
  
  // Status
  browserSupportsGeolocation: boolean;
  isLoadingLocation: boolean;
}

const defaultLocationData: LocationData = {
  city: 'Unknown',
  region: 'Unknown',
  loading: false,
  error: null
};

// Create the context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider props interface
interface LocationProviderProps {
  children: React.ReactNode;
  autoRequest?: boolean;
}

// Provider component
export function LocationProvider({ children, autoRequest = true }: LocationProviderProps) {
  // Check if browser supports geolocation
  const browserSupportsGeolocation = isGeolocationSupported();
  
  // State for location data
  const [locationData, setLocationData] = useState<LocationData>(defaultLocationData);
  
  // State for location permission
  const [isLocationAllowed, setIsLocationAllowed] = useState<boolean>(
    hasConsent(ConsentType.LOCATION)
  );
  
  // State for loading state
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  
  /**
   * Refresh location data
   * Using useCallback to avoid recreating this function on every render
   */
  const refreshLocation = useCallback(async (): Promise<void> => {
    if (!isLocationAllowed || !browserSupportsGeolocation) {
      return;
    }
    
    setIsLoadingLocation(true);
    setLocationData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Get current position
      const position = await getCurrentPosition();
      
      // Get location name from coordinates
      const locationInfo = await getLocationFromCoordinates(
        position.latitude,
        position.longitude
      );
      
      // Update state
      setLocationData({
        city: locationInfo.city,
        region: locationInfo.region,
        loading: false,
        error: null
      });
      
      // Store in cookie
      storeLocationData(locationInfo);
    } catch (error) {
      // Handle errors
      const geoError = error as GeolocationError;
      let errorMessage = 'Error getting location';
      
      if (geoError.type === 'PERMISSION_DENIED') {
        errorMessage = 'Location permission denied by browser';
        // User has denied permission in browser, update our consent
        updateConsent(ConsentType.LOCATION, ConsentStatus.DENIED);
        setIsLocationAllowed(false);
      } else if (geoError.type === 'POSITION_UNAVAILABLE') {
        errorMessage = 'Location information is unavailable';
      } else if (geoError.type === 'TIMEOUT') {
        errorMessage = 'Location request timed out';
      } else if (geoError.type === 'UNSUPPORTED') {
        errorMessage = 'Geolocation is not supported by this browser';
      }
      
      setLocationData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    } finally {
      setIsLoadingLocation(false);
    }
  }, [isLocationAllowed, browserSupportsGeolocation]);
  
  /**
   * Request location permission and get location if granted
   */
  const requestLocationPermission = async (): Promise<boolean> => {
    // Update the consent status
    const success = updateConsent(ConsentType.LOCATION, ConsentStatus.GRANTED);
    
    if (success) {
      setIsLocationAllowed(true);
      // Get location data now that we have permission
      await refreshLocation();
      return true;
    }
    
    return false;
  };
  
  /**
   * Clear location permission
   */
  const clearLocationPermission = () => {
    updateConsent(ConsentType.LOCATION, ConsentStatus.DENIED);
    setIsLocationAllowed(false);
    setLocationData(defaultLocationData);
  };
  
  // Load location data from cookies on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasConsent(ConsentType.LOCATION)) {
      const savedLocation = getLocationData();
      if (savedLocation) {
        setLocationData({
          ...savedLocation,
          loading: false,
          error: null
        });
      } else if (autoRequest) {
        // If we have consent but no data, try to get location data
        // Only auto-request if the flag is set to true
        refreshLocation();
      }
    }
    // We intentionally omit autoRequest and refreshLocation from dependencies
    // because we only want this effect to run once on mount
  }, []);
  
  // Context value
  const contextValue: LocationContextType = {
    locationData,
    isLocationAllowed,
    requestLocationPermission,
    refreshLocation,
    clearLocationPermission,
    browserSupportsGeolocation,
    isLoadingLocation
  };
  
  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook to use the location context
export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  
  return context;
}