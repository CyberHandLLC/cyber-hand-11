'use client';

/**
 * Consent Providers
 * 
 * Wraps the application with consent-related providers.
 * 
 * @file providers/consent-providers.tsx
 */

import React from 'react';
import { CookieConsentBanner } from '@/components/consent/cookie-consent-banner';

export interface ConsentProvidersProps {
  children: React.ReactNode;
}

/**
 * Provides consent-related context providers to the application
 */
export function ConsentProviders({ children }: ConsentProvidersProps) {
  return (
    <>
      {children}
      <CookieConsentBanner />
    </>
  );
}