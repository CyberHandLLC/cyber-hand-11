'use client';

/**
 * Location Debugger Component
 * 
 * A development component to directly access and display raw geolocation data
 * for debugging location services issues.
 * 
 * @file components/location/location-debugger.tsx
 */

import React, { useState } from 'react';

export function LocationDebugger() {
  interface DebugInfo {
    browserSupport: boolean;
    permissionState: string;
    coordinates: {
      latitude: number;
      longitude: number;
      accuracy: number;
    } | null;
    error: string | null;
    apiResponse: any | null;
    apiError?: string;
    timestamp: string | null;
  }

  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    browserSupport: false,
    permissionState: 'unknown',
    coordinates: null,
    error: null,
    apiResponse: null,
    timestamp: null
  });

  const getDirectBrowserLocation = () => {
    setDebugInfo((prev: DebugInfo) => ({ 
      ...prev, 
      timestamp: new Date().toISOString(),
      error: null 
    }));

    if (typeof window === 'undefined') {
      setDebugInfo((prev: DebugInfo) => ({ 
        ...prev, 
        error: 'Not running in browser environment' 
      }));
      return;
    }

    // Check browser support
    if (!window.navigator.geolocation) {
      setDebugInfo((prev: DebugInfo) => ({ 
        ...prev, 
        browserSupport: false,
        error: 'Geolocation API not supported in this browser'
      }));
      return;
    }

    setDebugInfo((prev: DebugInfo) => ({ ...prev, browserSupport: true }));

    // Check permission state if available (modern browsers)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          setDebugInfo((prev: DebugInfo) => ({ ...prev, permissionState: result.state }));
        })
        .catch(err => {
          console.error('Permission check error:', err);
        });
    }

    // Try to get location directly
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        setDebugInfo((prev: DebugInfo) => ({ 
          ...prev, 
          coordinates: coords,
          error: null
        }));

        // Try the API route
        fetch(`/api/geocode?lat=${coords.latitude}&lng=${coords.longitude}`)
          .then(res => res.json())
          .then(data => {
            setDebugInfo((prev: DebugInfo) => ({ 
              ...prev, 
              apiResponse: data
            }));
          })
          .catch(err => {
            setDebugInfo((prev: DebugInfo) => ({ 
              ...prev, 
              apiError: String(err)
            }));
          });
      },
      (error) => {
        setDebugInfo((prev: DebugInfo) => ({ 
          ...prev, 
          error: `Error code: ${error.code}, Message: ${error.message}`
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="p-4 border border-gray-700 bg-gray-800/50 rounded-md my-4">
      <h3 className="text-lg font-semibold mb-3 text-white">Location Debugger</h3>
      
      <button 
        onClick={getDirectBrowserLocation}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Test Direct Browser Location
      </button>
      
      <div className="mt-4 text-sm font-mono overflow-x-auto bg-gray-900/70 p-3 rounded-md text-gray-300">
        <div><span className="text-cyan-400">Browser Supports Geolocation:</span> {String(debugInfo.browserSupport)}</div>
        <div><span className="text-cyan-400">Permission State:</span> {debugInfo.permissionState}</div>
        <div><span className="text-cyan-400">Timestamp:</span> {debugInfo.timestamp || 'Not tested'}</div>
        
        {debugInfo.error && (
          <div className="text-red-400 mt-2">
            <span className="text-red-300">Error:</span> {debugInfo.error}
          </div>
        )}
        
        {debugInfo.coordinates && (
          <div className="mt-2">
            <div className="text-green-400">Coordinates obtained:</div>
            <div className="pl-2">
              <div><span className="text-gray-400">Latitude:</span> {debugInfo.coordinates.latitude}</div>
              <div><span className="text-gray-400">Longitude:</span> {debugInfo.coordinates.longitude}</div>
              <div><span className="text-gray-400">Accuracy:</span> {debugInfo.coordinates.accuracy}m</div>
            </div>
          </div>
        )}
        
        {debugInfo.apiResponse && (
          <div className="mt-2">
            <div className="text-green-400">API Response:</div>
            <div className="pl-2">
              <pre>{JSON.stringify(debugInfo.apiResponse, null, 2)}</pre>
            </div>
          </div>
        )}
        
        {debugInfo.apiError && (
          <div className="text-red-400 mt-2">
            <span className="text-red-300">API Error:</span> {debugInfo.apiError}
          </div>
        )}
      </div>
    </div>
  );
}