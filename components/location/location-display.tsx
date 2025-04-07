'use client';

/**
 * Location Display Component
 * 
 * Displays the user's current location and allows requesting location
 * permission if not already granted.
 * 
 * @file components/location/location-display.tsx
 */

import React from 'react';
import { useLocation } from '@/lib/location/location-context';
import { Button } from '@/components/ui/button';

export interface LocationDisplayProps {
  className?: string;
  showRequestButton?: boolean;
}

export function LocationDisplay({ 
  className = '', 
  showRequestButton = true 
}: LocationDisplayProps) {
  const { 
    locationData, 
    isLocationAllowed, 
    requestLocationPermission,
    refreshLocation,
    browserSupportsGeolocation,
    isLoadingLocation
  } = useLocation();
  
  const handleRequestLocation = async () => {
    await requestLocationPermission();
  };
  
  const handleRefreshLocation = async () => {
    await refreshLocation();
  };
  
  // We'll use useEffect to check browser support to avoid hydration errors
  const [isBrowserReady, setIsBrowserReady] = React.useState(false);
  
  React.useEffect(() => {
    setIsBrowserReady(true);
  }, []);
  
  // Handle case where browser doesn't support geolocation, but only on the client
  // to avoid hydration mismatches
  if (isBrowserReady && !browserSupportsGeolocation) {
    return (
      <div className={`rounded-md bg-gray-800/50 border border-gray-700 p-4 ${className}`}>
        <p className="text-sm text-gray-300">
          Your browser doesn&apos;t support geolocation.
        </p>
      </div>
    );
  }
  
  // Only show request button client-side to avoid hydration errors
  if (isBrowserReady && !isLocationAllowed && showRequestButton) {
    return (
      <div className={`rounded-md bg-gray-800/50 border border-gray-700 p-4 ${className}`}>
        <p className="text-sm text-gray-300 mb-3">
          Allow location access to see personalized content.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={handleRequestLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? 'Loading...' : 'Allow Location Access'}
        </Button>
      </div>
    );
  }
  
  // Only check error status client-side to avoid hydration errors
  if (isBrowserReady && isLocationAllowed && locationData.error) {
    return (
      <div className={`rounded-md bg-gray-800/50 border border-gray-700 p-4 ${className}`}>
        <p className="text-sm text-red-400 mb-3">
          {locationData.error}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? 'Loading...' : 'Try Again'}
        </Button>
      </div>
    );
  }
  
  // Create skeleton/placeholder UI for initial render to avoid hydration mismatches
  if (!isBrowserReady) {
    return (
      <div className={`rounded-md bg-gray-800/50 border border-gray-700 p-4 ${className}`}>
        <div className="animate-pulse flex space-x-2 items-center text-gray-400">
          <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  // Display location if permission is granted and data is available
  return (
    <div className={`rounded-md bg-gray-800/50 border border-gray-700 p-4 ${className}`}>
      {isLoadingLocation ? (
        <div className="animate-pulse flex space-x-2 items-center text-gray-400">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Getting your location...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Your Location</span>
          </div>
          <p className="text-sm text-gray-300">
            {locationData.city === 'Unknown' 
              ? 'Location information not available' 
              : `${locationData.city}, ${locationData.region}`
            }
          </p>
          {isLocationAllowed && (
            <Button
              variant="link"
              size="sm"
              onClick={handleRefreshLocation}
              className="mt-2 px-0 text-cyan-400 hover:text-cyan-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh Location
            </Button>
          )}
        </>
      )}
    </div>
  );
}