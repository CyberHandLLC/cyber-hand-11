/**
 * Geocoding API Route
 * 
 * Server-side API route for reverse geocoding (coordinates to location names).
 * This route proxies requests to OpenStreetMap's Nominatim service, handling
 * CORS, rate limits, and caching appropriately for Vercel deployment.
 * 
 * @file app/api/geocode/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// Cache successful responses for 30 days
const CACHE_DURATION = 60 * 60 * 24 * 30;

/**
 * GET handler for reverse geocoding
 * Accepts lat/lng parameters and returns city and region
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  
  // Validate required parameters
  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing latitude or longitude parameters' },
      { status: 400 }
    );
  }

  try {
    // Format for consistent caching
    const formattedLat = parseFloat(lat).toFixed(4);
    const formattedLng = parseFloat(lng).toFixed(4);
    
    // Use OpenStreetMap Nominatim API server-side to avoid CORS/rate limiting issues
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formattedLat}&lon=${formattedLng}&zoom=10`,
      { 
        headers: { 
          'Accept-Language': 'en',
          // Important: Set a proper User-Agent per OSM policy
          'User-Agent': 'CyberHand Website (https://cyber-hand.com)' 
        },
        // Cache successful responses with Vercel Edge Network
        next: { 
          revalidate: CACHE_DURATION 
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding service error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract location data, providing fallbacks for each field
    return NextResponse.json({
      city: data.address?.city || 
            data.address?.town || 
            data.address?.village || 
            data.address?.hamlet ||
            'Unknown',
      region: data.address?.state || 
              data.address?.county || 
              data.address?.region ||
              'Unknown'
    }, {
      headers: {
        // Set appropriate cache headers
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`
      }
    });
  } catch (error) {
    console.error('Error in geocoding API:', error);
    
    return NextResponse.json(
      { error: 'Failed to get location information', message: String(error) },
      { status: 500 }
    );
  }
}