"use client";

/**
 * Location Example Component
 * 
 * Client component wrapper for the location widget.
 * This component demonstrates the location opt-in system in a real-world context.
 */

import React from 'react';
import { LocationWidget } from '@/components/location/location-widget';

interface LocationExampleProps {
  className?: string;
}

/**
 * Client component wrapper for displaying location functionality
 */
export function LocationExample({ className }: LocationExampleProps) {
  return (
    <div className={`w-full max-w-xl mx-auto mt-8 px-4 ${className || ''}`}>
      <div className="backdrop-blur-sm bg-black/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center text-white mb-4">
          Location Services
        </h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          Allow location access to see personalized content and services near you.
        </p>
        <LocationWidget 
          title="Your Current Location"
          subtitle="We only access your location with your explicit permission"
        />
      </div>
    </div>
  );
}