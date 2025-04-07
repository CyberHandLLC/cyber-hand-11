/**
 * Location Demo Page
 * 
 * Demonstrates the location opt-in functionality with cookie consent.
 * 
 * @file app/location-demo/page.tsx
 */

import React from 'react';
import { Metadata } from 'next';
import { LocationDemoClient } from './location-demo-client';

export const metadata: Metadata = {
  title: 'Location Services Demo | CyberHand',
  description: 'Demonstration of location-based services with GDPR-compliant opt-in',
};

export default function LocationDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Location Services Demo
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            This page demonstrates how our location opt-in system works with cookie consent.
            Your privacy is important to us, and you have full control over your data.
          </p>
        </div>
        
        <LocationDemoClient />
      </div>
    </main>
  );
}