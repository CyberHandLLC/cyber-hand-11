'use client';

/**
 * Consent Providers
 * 
 * Wraps the application with all consent-related providers,
 * including location consent.
 * 
 * @file providers/consent-providers.tsx
 */

import React from 'react';
import { LocationProvider } from '@/lib/location/location-context';
import { CookieConsentBanner } from '@/components/consent/cookie-consent-banner';

export interface ConsentProvidersProps {
  children: React.ReactNode;
}

/**
 * Provides consent-related context providers to the application
 */
export function ConsentProviders({ children }: ConsentProvidersProps) {
  return (
    <LocationProvider>
      {children}
      <CookieConsentBanner />
    </LocationProvider>
  );
}