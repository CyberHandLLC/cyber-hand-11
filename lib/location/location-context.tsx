"use client";

/**
 * Location Context
 *
 * Provides location data and control for the application.
 * Handles server-detected location and client-side overrides.
 */

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Location data interface
export interface LocationData {
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  continent?: string;
  latitude?: number;
  longitude?: number;
  isDetected: boolean;
  lastUpdated: number;
}

// Context type definition
export interface LocationContextType {
  // Current location state
  location: LocationData;

  // Methods to control location
  overrideLocation: (newLocation: Partial<LocationData>) => void;
  resetLocation: () => void;

  // Additional properties
  isLoading: boolean;
  hasOverride: boolean;
}

// Default values when no location is detected
const DEFAULT_LOCATION: LocationData = {
  isDetected: false,
  lastUpdated: Date.now(),
};

// Storage key for persisting overrides
const LOCATION_OVERRIDE_KEY = "location-override";

// Create context with default values
const LocationContext = createContext<LocationContextType>({
  location: DEFAULT_LOCATION,
  overrideLocation: () => {},
  resetLocation: () => {},
  isLoading: false,
  hasOverride: false,
});

/**
 * Location Provider Component
 *
 * Wraps children with location context and handles:
 * - Initial server-detected location
 * - Client-side location overrides
 * - Persistence of location preferences
 */
export function LocationProvider({
  children,
  initialLocation,
}: {
  children: ReactNode;
  initialLocation: LocationData;
}) {
  // State for tracking location data
  const [location, setLocation] = useState<LocationData>(initialLocation);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasOverride, setHasOverride] = useState<boolean>(false);

  // Effect to load any saved location override on component mount
  useEffect(() => {
    try {
      // Check for saved location override
      const savedOverride = localStorage.getItem(LOCATION_OVERRIDE_KEY);

      if (savedOverride) {
        // Parse saved override
        const parsedOverride = JSON.parse(savedOverride) as LocationData;

        // Apply override
        setLocation(parsedOverride);
        setHasOverride(true);
      }
    } catch (error) {
      console.error("Error loading location override:", error);
    } finally {
      // Finish loading regardless of outcome
      setIsLoading(false);
    }
  }, [initialLocation]);

  /**
   * Override detected location with user-specified location
   * Persists override to localStorage
   */
  const overrideLocation = (newLocation: Partial<LocationData>) => {
    const updatedLocation: LocationData = {
      ...location,
      ...newLocation,
      isDetected: false,
      lastUpdated: Date.now(),
    };

    // Update state
    setLocation(updatedLocation);
    setHasOverride(true);

    // Persist override
    try {
      localStorage.setItem(LOCATION_OVERRIDE_KEY, JSON.stringify(updatedLocation));
    } catch (error) {
      console.error("Error saving location override:", error);
    }
  };

  /**
   * Reset to server-detected location
   * Removes override from localStorage
   */
  const resetLocation = () => {
    // Restore original detected location
    setLocation(initialLocation);
    setHasOverride(false);

    // Remove persisted override
    try {
      localStorage.removeItem(LOCATION_OVERRIDE_KEY);
    } catch (error) {
      console.error("Error removing location override:", error);
    }
  };

  // Context value
  const contextValue: LocationContextType = {
    location,
    overrideLocation,
    resetLocation,
    isLoading,
    hasOverride,
  };

  return <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>;
}

/**
 * Hook for accessing location data and controls
 */
export function useLocation() {
  const context = useContext(LocationContext);

  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }

  return context;
}
