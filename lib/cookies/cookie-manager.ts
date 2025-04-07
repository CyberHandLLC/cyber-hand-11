/**
 * Cookie Manager
 * 
 * Utilities for managing cookies with proper typing and GDPR compliance.
 * Encapsulates cookie operations for consistent behavior across the application.
 * 
 * @module lib/cookies/cookie-manager
 */

import { setCookie, getCookie } from 'cookies-next';
import type { OptionsType } from 'cookies-next';

/**
 * Cookie consent types for different functionalities
 */
export enum ConsentType {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
}

/**
 * Cookie consent status values
 */
export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
}

/**
 * Interface representing user's consent preferences
 */
export interface ConsentPreferences {
  [ConsentType.ESSENTIAL]: ConsentStatus;
  [ConsentType.ANALYTICS]: ConsentStatus;
  [ConsentType.MARKETING]: ConsentStatus;
  lastUpdated: number;
}

/**
 * Default consent with only essential cookies enabled
 */
export const DEFAULT_CONSENT: ConsentPreferences = {
  [ConsentType.ESSENTIAL]: ConsentStatus.GRANTED, // Essential cookies are always granted
  [ConsentType.ANALYTICS]: ConsentStatus.PENDING,
  [ConsentType.MARKETING]: ConsentStatus.PENDING,
  lastUpdated: Date.now(),
};

// Cookie name
const CONSENT_COOKIE = 'cyberhand-cookie-consent';

// Cookie options with secure settings
const cookieOptions: OptionsType = {
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

/**
 * Get user's consent preferences
 * 
 * @returns {ConsentPreferences} User's consent settings
 */
export function getConsentPreferences(): ConsentPreferences {
  try {
    const consentCookie = getCookie(CONSENT_COOKIE);
    if (!consentCookie) {
      return DEFAULT_CONSENT;
    }
    
    return JSON.parse(String(consentCookie)) as ConsentPreferences;
  } catch (error) {
    console.error('Error parsing consent cookie:', error);
    return DEFAULT_CONSENT;
  }
}

/**
 * Save user's consent preferences
 * 
 * @param {ConsentPreferences} preferences - User's consent settings
 * @returns {boolean} Success status
 */
export function saveConsentPreferences(preferences: ConsentPreferences): boolean {
  try {
    const updatedPreferences = {
      ...preferences,
      lastUpdated: Date.now(),
    };
    
    setCookie(CONSENT_COOKIE, JSON.stringify(updatedPreferences), cookieOptions);
    return true;
  } catch (error) {
    console.error('Error saving consent cookie:', error);
    return false;
  }
}

/**
 * Check if user has consented to a specific feature
 * 
 * @param {ConsentType} type - Type of consent to check
 * @returns {boolean} True if consent is granted
 */
export function hasConsent(type: ConsentType): boolean {
  const preferences = getConsentPreferences();
  return preferences[type] === ConsentStatus.GRANTED;
}

/**
 * Update consent for a specific feature
 * 
 * @param {ConsentType} type - Consent type to update
 * @param {ConsentStatus} status - New consent status
 * @returns {boolean} Success status
 */
export function updateConsent(type: ConsentType, status: ConsentStatus): boolean {
  const preferences = getConsentPreferences();
  
  // Essential cookies can't be denied
  if (type === ConsentType.ESSENTIAL && status !== ConsentStatus.GRANTED) {
    return false;
  }
  
  // Update preference
  const updatedPreferences = { 
    ...preferences,
    [type]: status,
  };
  
  return saveConsentPreferences(updatedPreferences);
}




