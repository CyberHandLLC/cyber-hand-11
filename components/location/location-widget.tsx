'use client';

/**
 * Location Widget Component
 * 
 * A pre-styled wrapper around the LocationDisplay component that can be easily
 * added to pages with a consistent look and feel.
 * 
 * @file components/location/location-widget.tsx
 */

import React from 'react';
import { LocationDisplay, LocationDisplayProps } from './location-display';

export interface LocationWidgetProps extends LocationDisplayProps {
  title?: string;
  subtitle?: string;
}

export function LocationWidget({ 
  title = 'Your Location', 
  subtitle = 'Personalized content based on your location',
  className = '',
  ...props 
}: LocationWidgetProps) {
  return (
    <div className={`bg-gray-800/30 rounded-lg p-4 border border-gray-700 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium mb-1 text-white">{title}</h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-400 mb-3">{subtitle}</p>
      )}
      <LocationDisplay className="bg-gray-900/50" {...props} />
    </div>
  );
}