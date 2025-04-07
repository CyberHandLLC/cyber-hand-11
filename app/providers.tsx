"use client";

/**
 * Client-side Providers Component
 * 
 * Wraps the application with various context providers.
 * This component should be imported in your root layout.
 */

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import { LocationProvider } from '@/lib/location/location-context';
import type { LocationData } from '@/lib/location/location-context';

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
      <LocationProvider initialLocation={locationData}>
        {children}
      </LocationProvider>
    </ThemeProvider>
  );
}