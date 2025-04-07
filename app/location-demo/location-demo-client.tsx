'use client';

/**
 * Location Demo Client Component
 * 
 * Demonstrates the functionality of the location opt-in system with
 * cookie consent, showing how to integrate the LocationDisplay component
 * and how users can interact with location permissions.
 * 
 * @file app/location-demo/location-demo-client.tsx
 */

import React, { useState } from 'react';
import { LocationDisplay } from '@/components/location/location-display';
import { LocationDebugger } from '@/components/location/location-debugger';
import { useLocation } from '@/lib/location/location-context';
import { 
  ConsentType, 
  getConsentPreferences, 
  ConsentStatus, 
  // Prefixing with underscore to satisfy ESLint
  updateConsent as _updateConsent 
} from '@/lib/cookies/cookie-manager';
import Link from 'next/link';

export function LocationDemoClient() {
  const { requestLocationPermission, clearLocationPermission, isLocationAllowed: _isLocationAllowed } = useLocation();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(
    getConsentPreferences()[ConsentType.LOCATION]
  );

  // Function to update consent status display
  const refreshConsentStatus = () => {
    setConsentStatus(getConsentPreferences()[ConsentType.LOCATION]);
  };

  // Handle consenting to location tracking with direct browser API call
  const handleConsent = () => {
    // Direct browser prompt that will definitely show the permission dialog
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success handler
        async (position) => {
          console.log('Got browser location:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // After direct permission granted, use our system
          await requestLocationPermission();
          refreshConsentStatus();
        },
        // Error handler
        (error) => {
          console.error('Browser location error:', error);
          alert('Location permission denied or unavailable. Please check your browser settings.');
        }
      );
    } else {
      alert('Your browser does not support geolocation');
    }
  };

  // Handle revoking location consent
  const handleRevokeConsent = () => {
    clearLocationPermission();
    refreshConsentStatus();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Integration Example */}
      <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Location Display Example</h2>
        <p className="text-gray-300 mb-6">
          This component displays your location information once you&apos;ve granted permission:
        </p>
        
        <LocationDisplay className="max-w-md mx-auto" />
      </section>

      {/* Consent Management Section */}
      <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Manage Location Consent</h2>
        <p className="text-gray-300 mb-4">
          Current consent status: 
          <span className={`font-medium ml-2 ${
            consentStatus === ConsentStatus.GRANTED 
              ? 'text-green-400' 
              : consentStatus === ConsentStatus.DENIED 
                ? 'text-red-400' 
                : 'text-yellow-400'
          }`}>
            {consentStatus === ConsentStatus.GRANTED 
              ? 'GRANTED' 
              : consentStatus === ConsentStatus.DENIED 
                ? 'DENIED' 
                : 'PENDING'}
          </span>
        </p>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={handleConsent}
            disabled={consentStatus === ConsentStatus.GRANTED}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              consentStatus === ConsentStatus.GRANTED 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Grant Location Permission
          </button>
          
          <button
            onClick={handleRevokeConsent}
            disabled={consentStatus !== ConsentStatus.GRANTED}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              consentStatus !== ConsentStatus.GRANTED 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Revoke Location Permission
          </button>
        </div>
      </section>

      {/* Privacy Information */}
      <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Privacy Information</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            Location data is only stored in your browser with your explicit consent. 
            We don&apos;t share this information with third parties.
          </p>
          <p>
            You can manage your cookie and location preferences at any time by clicking 
            &quot;Customize&quot; in the cookie consent banner that appears at the bottom of the page.
          </p>
          <p>
            For more information about how we handle your data, please read our{' '}
            <Link href="/privacy-policy" className="text-cyan-400 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </section>
      
      {/* Debugging Section */}
      <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 border-yellow-500/50">
        <h2 className="text-xl font-semibold mb-4">Location Debugging Tools</h2>
        <p className="text-gray-300 mb-4">
          Use this tool to directly test browser geolocation and API functionality. This can help diagnose issues with the location services.
        </p>
        <LocationDebugger />
        <p className="text-xs text-gray-400 mt-2">
          Note: This debugging tool bypasses the consent system and directly tests browser capabilities and API responses.
        </p>
      </section>

      {/* Developer Guide */}
      <section className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Developer Guide</h2>
        <div className="space-y-4">
          <p className="text-gray-300">
            To integrate location services in your components, import and use the following:
          </p>
          <div className="bg-gray-900 rounded-md p-4 overflow-x-auto text-sm font-mono">
            <pre>{`import { useLocation } from '@/lib/location/location-context';
import { LocationDisplay } from '@/components/location/location-display';

// Access location context
const { 
  locationData, 
  isLocationAllowed,
  requestLocationPermission 
} = useLocation();

// Or use the ready-made display component
<LocationDisplay showRequestButton={true} />`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}