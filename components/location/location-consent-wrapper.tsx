'use client';

/**
 * Location Consent Wrapper Component
 * 
 * Client Component wrapper for LocationConsent to handle dynamic imports
 * This follows the Next.js 15 pattern of isolating client-side logic
 */

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR to prevent hydration mismatches
const LocationConsentComponent = dynamic(
  () => import('./location-consent').then(mod => mod.LocationConsent),
  { ssr: false }
);

/**
 * Client Component: LocationConsentWrapper
 * Used to isolate client-side functionality and dynamic imports
 */
export function LocationConsentWrapper() {
  return (
    <Suspense fallback={null}>
      <LocationConsentComponent />
    </Suspense>
  );
}
