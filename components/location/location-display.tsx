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
    // Direct browser geolocation API call to ensure prompt appears
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success handler
        async (position) => {
          console.log('Browser geolocation success:', position.coords);
          // After we get permission, update through our context system
          await requestLocationPermission();
        },
        // Error handler
        (error) => {
          console.error('Browser geolocation error:', error);
          alert('Could not access your location. Please check your browser settings and try again.');
        },
        // Options
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
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
        {/* Use button instead of Button component to ensure native browser behaviors */}
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
          onClick={handleRequestLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? 'Loading...' : 'Allow Location Access'}
        </button>
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
          <div className="text-sm text-gray-300 space-y-1">
            {locationData.city !== 'Unknown' && (
              <p>
                <span className="opacity-75">Location:</span> {locationData.city}, {locationData.region}
              </p>
            )}
            
            {/* Always show coordinates when available, regardless of city/region availability */}
            {locationData.latitude && locationData.longitude && (
              <p>
                <span className="opacity-75">Coordinates:</span> {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
              </p>
            )}
            
            {/* Show IP information - check if it exists without requiring isIpBased flag */}
            {locationData.ip ? (
              <div className="mt-1 pt-1 border-t border-gray-700 text-xs">
                <p>
                  <span className="text-amber-400/70">
                    {locationData.isIpBased ? "Fallback Method:" : "Debug Info:"}
                  </span> 
                  {locationData.isIpBased ? "IP-based location" : "Network details"}
                </p>
                <p>
                  <span className="opacity-75">IP:</span> {locationData.ip}
                  {locationData.ipVersion && (
                    <span className="ml-2 text-xs bg-gray-800/80 text-amber-400 px-1.5 py-0.5 rounded">
                      {locationData.ipVersion}
                      {locationData.ipVersion === 'IPv6' && (
                        <span className="ml-1 text-[10px] text-green-400">(preferred)</span>
                      )}
                    </span>
                  )}
                </p>
                {locationData.ipProvider && (
                  <p>
                    <span className="opacity-75">Network:</span> {locationData.ipProvider}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-1 pt-1 border-t border-gray-700 text-xs text-amber-400/70">
                <p>IP information not available</p>
                <p>Try refreshing or using the location debugger tool</p>
              </div>
            )}
            
            {/* Only show this message when we have neither location nor coordinates and no specific error */}
            {locationData.city === 'Unknown' && (!locationData.latitude || !locationData.longitude) && !locationData.error && (
              <p>Location information not available</p>
            )}
            
            {/* Display any specific error messages */}
            {locationData.error && (
              <div className="mt-2 text-amber-500 text-xs">
                <div className="whitespace-pre-line">{locationData.error}</div>
                {locationData.error.includes('POSITION_UNAVAILABLE') && (
                  <div className="mt-1 pt-1 border-t border-gray-700 text-gray-400">
                    <p className="text-xs">Try using a different browser or device.</p>
                  </div>
                )}
              </div>
            )}
          </div>
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