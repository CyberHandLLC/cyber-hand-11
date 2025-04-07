'use client';

/**
 * IP Debug Client Component
 * 
 * A client component that tests the IP-based location API
 * and displays the results, with debug information.
 * 
 * @file app/ip-debug/ip-debug-client.tsx
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface IPLocationData {
  city: string;
  region: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  ip: string;
  ipProvider?: string;
  isIpBased: boolean;
  error?: string;
  responseTimeMs?: number;
}

export function IPDebugClient() {
  const [ipData, setIpData] = useState<IPLocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const testIpLocation = async () => {
    setIsLoading(true);
    setError(null);
    setRawResponse(null);
    
    try {
      const startTime = Date.now();
      const response = await fetch('/api/ip-location');
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Get the raw text response first
      const rawText = await response.clone().text();
      setRawResponse(rawText);
      
      // Then try to parse as JSON
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      let data: IPLocationData;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        throw new Error(`Failed to parse API response as JSON: ${parseError}`);
      }
      
      setIpData({
        ...data,
        responseTimeMs: responseTime
      } as IPLocationData);
    } catch (error: any) {
      setError(error?.message || 'Failed to get IP location data');
      console.error('IP debug error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Button 
          onClick={testIpLocation}
          disabled={isLoading}
          className="px-6"
        >
          {isLoading ? 'Testing...' : 'Test IP Location'}
        </Button>
        
        <div className="text-sm text-gray-400 pt-1">
          Directly tests the IP-based location API without using browser geolocation
        </div>
      </div>
      
      {/* Results Display */}
      {ipData && !error && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Your IP Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 bg-gray-900/60 p-4 rounded-md">
            <div>
              <span className="text-gray-400 text-sm">IP Address:</span>
              <div className="font-mono text-cyan-300">{ipData.ip}</div>
            </div>
            
            {ipData.ipProvider && (
              <div>
                <span className="text-gray-400 text-sm">Network Provider:</span>
                <div>{ipData.ipProvider}</div>
              </div>
            )}
            
            <div>
              <span className="text-gray-400 text-sm">City:</span>
              <div>{ipData.city || 'Unknown'}</div>
            </div>
            
            <div>
              <span className="text-gray-400 text-sm">Region:</span>
              <div>{ipData.region || 'Unknown'}</div>
            </div>
            
            {ipData.country && (
              <div>
                <span className="text-gray-400 text-sm">Country:</span>
                <div>{ipData.country}</div>
              </div>
            )}
            
            {ipData.latitude && ipData.longitude && (
              <div className="col-span-full">
                <span className="text-gray-400 text-sm">Coordinates:</span>
                <div className="font-mono">
                  {ipData.latitude.toFixed(6)}, {ipData.longitude.toFixed(6)}
                </div>
              </div>
            )}
            
            {ipData.responseTimeMs && (
              <div className="col-span-full mt-2 border-t border-gray-700 pt-2">
                <span className="text-gray-400 text-sm">Response Time:</span>
                <div className="font-mono text-xs">{ipData.responseTimeMs}ms</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Show raw response for debugging */}
      {rawResponse && (
        <div className="mt-4">
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-400 hover:text-white font-mono text-xs py-1">
              View Raw API Response
            </summary>
            <div className="mt-2 p-3 bg-black/60 rounded overflow-x-auto">
              <pre className="text-gray-300 text-xs font-mono">{rawResponse}</pre>
            </div>
          </details>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800/50 rounded-md text-red-400">
          <h3 className="font-medium mb-2">Error</h3>
          <p className="text-sm">{error}</p>
          {rawResponse && (
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer hover:text-white">View Raw Response</summary>
              <pre className="mt-2 p-2 bg-black/40 rounded overflow-x-auto">{rawResponse}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}