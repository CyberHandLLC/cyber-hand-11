/**
 * IP Location Debug Page
 * 
 * A direct interface to test and view the IP-based location system,
 * primarily for debugging issues with Brave Browser and other privacy-focused browsers.
 * 
 * @file app/ip-debug/page.tsx
 */

import { Metadata } from 'next';
import { IPDebugClient } from './ip-debug-client';

export const metadata: Metadata = {
  title: 'IP Location Debug - Cyber Hand',
  description: 'Debug tool for IP-based location services',
};

export default function IPDebugPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">IP Location Debugging</h1>
      
      <section className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">IP-Based Location Test</h2>
        <p className="text-gray-300 mb-6">
          This tool directly tests your IP-based location without using the browser&apos;s 
          Geolocation API. This is useful for debugging location issues in privacy-focused 
          browsers like Brave that may block the standard location API.
        </p>
        
        <IPDebugClient />
      </section>
      
      <section className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">About IP-Based Location</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            IP-based location uses your network address to estimate your physical location.
            It&apos;s less accurate than GPS but more reliable across different browsers.
          </p>
          <p>
            <strong>Privacy Notice:</strong> Your IP address is only used to determine your 
            location. It is not stored on our servers beyond the current session and is not 
            shared with any third parties.
          </p>
          <div className="mt-6 p-4 bg-gray-700/30 rounded border border-gray-600 text-sm">
            <h3 className="font-medium mb-2">Common Issues with Browser Location</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Brave Browser:</strong> Has multiple layers of privacy protection 
                that can block location access even when permissions are granted.
              </li>
              <li>
                <strong>VPN Services:</strong> May interfere with accurate location detection.
              </li>
              <li>
                <strong>Private Browsing/Incognito:</strong> Often restricts location access.
              </li>
              <li>
                <strong>Browser Extensions:</strong> Privacy extensions can block location requests.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}