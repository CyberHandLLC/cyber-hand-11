/**
 * IP-based Geolocation API Route
 * 
 * This is a fallback method for browsers that block the standard geolocation API.
 * It uses the IP address to provide a less accurate but more reliable location.
 * 
 * @file app/api/ip-location/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limiting to prevent abuse
const RATE_LIMIT = 10; // requests per minute
const ipRequests = new Map<string, { count: number, timestamp: number }>();

export async function GET(request: NextRequest) {
  try {
    // Rate limiting - In Next.js the IP is in the headers or connection info
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const now = Date.now();
    const requestData = ipRequests.get(ip);
    
    // Clean up old requests (older than 1 minute)
    if (requestData && now - requestData.timestamp > 60000) {
      ipRequests.delete(ip);
    }
    
    // Check if IP is rate limited
    if (requestData && requestData.count >= RATE_LIMIT && now - requestData.timestamp < 60000) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Update rate limit counter
    ipRequests.set(ip, {
      count: (requestData?.count || 0) + 1,
      timestamp: requestData?.timestamp || now
    });
    
    // Use ipinfo.io service to get IP-based location
    // This is a free service with a limit of 1000 requests per day
    // We'll use the public API without authentication for simplicity
    // Production apps might want to use an API key for higher limits
    const response = await fetch(`https://ipinfo.io/json`);
    
    if (!response.ok) {
      console.error('IP lookup failed:', await response.text());
      return NextResponse.json(
        { error: 'Failed to get location from IP address.' },
        { status: 500 }
      );
    }
    
    const data = await response.json();
    
    // Parse the location data
    // Format from ipinfo.io response: "loc": "37.3860,-122.0840"
    let latitude = 0;
    let longitude = 0;
    
    if (data.loc && data.loc.includes(',')) {
      const [lat, lng] = data.loc.split(',');
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    }
    
    return NextResponse.json({
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      latitude,
      longitude,
      country: data.country || 'Unknown',
      isIpBased: true
    });
  } catch (error) {
    console.error('IP location error:', error);
    return NextResponse.json(
      { error: 'Could not determine location from IP.' },
      { status: 500 }
    );
  }
}