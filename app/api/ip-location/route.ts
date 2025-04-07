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
    // Extract IP address from request headers (supports both IPv4 and IPv6)
    const forwardedFor = request.headers.get('x-forwarded-for');
    let allIps = forwardedFor ? forwardedFor.split(',').map(ip => ip.trim()) : ['unknown'];
    
    // Find IPv6 address if available (prioritize IPv6 over IPv4 for accuracy)
    let ip = 'unknown';
    let isIpv6 = false;
    
    // First check if any IPv6 addresses are available (they contain colons)
    const ipv6Addresses = allIps.filter(addr => addr.includes(':'));
    if (ipv6Addresses.length > 0) {
      // Use the first IPv6 address
      ip = ipv6Addresses[0];
      isIpv6 = true;
    } else {
      // Fall back to IPv4 if no IPv6 is available
      ip = allIps[0];
      isIpv6 = false;
    }
    
    console.log(`Client IP detected: ${ip} (${isIpv6 ? 'IPv6 (preferred)' : 'IPv4'})`);
    const ipVersion = isIpv6 ? 'IPv6' : 'IPv4';
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
    
    // Choose the optimal service based on IP version
    // IPv6 addresses provide more accurate geolocation data when using an IPv6-optimized service
    let locationServiceUrl = '';
    
    if (isIpv6) {
      // For IPv6, use ipinfo.io with the specific IP address
      // IPv6 addresses are more accurate and have higher precision geolocation
      locationServiceUrl = `https://ipinfo.io/json`;
      console.error('Using IPv6-optimized geolocation (higher accuracy)');
    } else {
      // For IPv4, use the standard service
      locationServiceUrl = `https://ipinfo.io/json`;
      console.error('Using IPv4 geolocation');
    }
    
    // Make the request to the appropriate service
    const response = await fetch(locationServiceUrl);
    
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
    
    // Determine accuracy level based on IP version and data quality
    const accuracyLevel = isIpv6 ? 'high' : 'medium';
    const accuracyRadius = isIpv6 ? 1000 : 5000; // Estimated accuracy radius in meters
    
    return NextResponse.json({
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      latitude,
      longitude,
      country: data.country || 'Unknown',
      isIpBased: true,
      ip: ip,
      ipVersion: ipVersion,
      ipProvider: data.org || 'Unknown',
      accuracy: {
        level: accuracyLevel,
        radiusMeters: accuracyRadius,
        preferred: isIpv6
      }
    });
  } catch (error) {
    console.error('IP location error:', error);
    return NextResponse.json(
      { error: 'Could not determine location from IP.' },
      { status: 500 }
    );
  }
}