"use client";

/**
 * Client-side Providers Component
 *
 * Wraps the application with various context providers.
 * This component should be imported in your root layout.
 */

import React, { ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme-context";
import type { LocationData } from "@/lib/location";

// Import context to create local provider
import { createContext, useState } from "react";
// Remove unused imports completely rather than trying to prefix them

// Define proper type for LocationContext instead of using 'any'
interface LocationContextType {
  location: LocationData;
}

// Re-create provider to avoid import issues
const LocationContext = createContext<LocationContextType | null>(null);

// Simple provider wrapper matching the original API
function LocationProvider({
  children,
  initialLocation,
}: {
  children: ReactNode;
  initialLocation: LocationData;
}) {
  const [location] = useState(initialLocation);
  return <LocationContext.Provider value={{ location }}>{children}</LocationContext.Provider>;
}

// Interface for providers props with location data
interface ProvidersProps {
  children: ReactNode;
  locationData: LocationData;
}

/**
 * Client Component: Application Providers
 * Wraps the application with all context providers.
 */
export function Providers({ children, locationData }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LocationProvider initialLocation={locationData}>{children}</LocationProvider>
    </ThemeProvider>
  );
}
