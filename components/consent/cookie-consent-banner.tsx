'use client';

/**
 * Cookie Consent Banner Component
 * 
 * GDPR-compliant cookie consent banner that allows users to
 * manage their cookie preferences.
 * 
 * @file components/consent/cookie-consent-banner.tsx
 */

import React, { useEffect, useState } from 'react';
import { 
  ConsentPreferences,
  ConsentStatus, 
  ConsentType, 
  DEFAULT_CONSENT,
  getConsentPreferences, 
  saveConsentPreferences
} from '@/lib/cookies/cookie-manager';
import { Button } from '@/components/ui/button';

/**
 * Cookie Consent Banner Component
 * Handles display and management of cookie consent
 */
export function CookieConsentBanner() {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_CONSENT);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = getConsentPreferences();
    setPreferences(savedPreferences);
    
    // If user has already interacted with consent, don't show the banner
    setHasInteracted(
      savedPreferences.analytics !== ConsentStatus.PENDING ||
      savedPreferences.marketing !== ConsentStatus.PENDING
    );
  }, []);
  
  // Handle toggling a specific consent type
  const handleToggleConsent = (type: ConsentType) => {
    setPreferences(prev => {
      // Skip if it's essential (always granted)
      if (type === ConsentType.ESSENTIAL) return prev;
      
      const newStatus = prev[type] === ConsentStatus.GRANTED 
        ? ConsentStatus.DENIED 
        : ConsentStatus.GRANTED;
      

      
      return {
        ...prev,
        [type]: newStatus
      };
    });
  };
  
  // Handle accepting all cookies
  const handleAcceptAll = () => {
    const newPreferences = {
      ...preferences,
      [ConsentType.ANALYTICS]: ConsentStatus.GRANTED,
      [ConsentType.MARKETING]: ConsentStatus.GRANTED,
    };
    
    setPreferences(newPreferences);
    saveConsentPreferences(newPreferences);
    setHasInteracted(true);
    

  };
  
  // Handle declining all non-essential cookies
  const handleDeclineAll = () => {
    const newPreferences = {
      ...preferences,
      [ConsentType.ANALYTICS]: ConsentStatus.DENIED,
      [ConsentType.MARKETING]: ConsentStatus.DENIED,
    };
    
    setPreferences(newPreferences);
    saveConsentPreferences(newPreferences);
    setHasInteracted(true);
    

  };
  
  // Handle saving preferences
  const handleSavePreferences = () => {
    saveConsentPreferences(preferences);
    setHasInteracted(true);
    setShowAdvancedSettings(false);
    

  };
  
  // Skip rendering if user has already interacted
  if (hasInteracted) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 shadow-lg text-white p-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Simple consent banner */}
        {!showAdvancedSettings ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Cookie & Location Consent</h2>
              <p className="text-sm text-gray-300 mb-2">
                We use cookies to enhance your browsing experience and provide personalized services. 
                With your permission, we can also access your approximate location to show relevant content.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Button 
                onClick={() => setShowAdvancedSettings(true)}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                Customize
              </Button>
              <Button 
                onClick={handleDeclineAll}
                variant="secondary"
                size="sm"
                className="whitespace-nowrap"
              >
                Decline All
              </Button>
              <Button 
                onClick={handleAcceptAll}
                variant="primary"
                size="sm"
                className="whitespace-nowrap"
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Advanced settings
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Cookie & Location Preferences</h2>
              <p className="text-sm text-gray-300 mb-4">
                Customize your cookie and data preferences below. Essential cookies are required for the site to function properly.
              </p>
            </div>
            
            {/* Consent toggle options */}
            <div className="space-y-3 mb-4">
              {/* Essential cookies (always enabled) */}
              <div className="flex items-center justify-between p-3 border border-gray-700 rounded-md bg-gray-800/50">
                <div>
                  <h3 className="font-medium">Essential Cookies</h3>
                  <p className="text-xs text-gray-400">Required for the website to function properly.</p>
                </div>
                <div className="h-6 px-2 py-1 rounded bg-cyan-600/30 text-cyan-400 text-xs font-medium">
                  Always On
                </div>
              </div>
              
              {/* Analytics cookies */}
              <div className="flex items-center justify-between p-3 border border-gray-700 rounded-md bg-gray-800/50">
                <div>
                  <h3 className="font-medium">Analytics</h3>
                  <p className="text-xs text-gray-400">Help us understand how visitors interact with our website.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={preferences[ConsentType.ANALYTICS] === ConsentStatus.GRANTED}
                    onChange={() => handleToggleConsent(ConsentType.ANALYTICS)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              
              {/* Marketing cookies */}
              <div className="flex items-center justify-between p-3 border border-gray-700 rounded-md bg-gray-800/50">
                <div>
                  <h3 className="font-medium">Marketing</h3>
                  <p className="text-xs text-gray-400">Used to track visitors across websites to display relevant advertisements.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={preferences[ConsentType.MARKETING] === ConsentStatus.GRANTED}
                    onChange={() => handleToggleConsent(ConsentType.MARKETING)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              

            </div>
            
            {/* Footer buttons */}
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={() => setShowAdvancedSettings(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSavePreferences}
                variant="primary"
                size="sm"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
        
        {/* Privacy policy link */}
        <div className="mt-3 text-xs text-center text-gray-400">
          <p>
            By using this website, you agree to our{' '}
            <a href="/privacy-policy" className="text-cyan-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}