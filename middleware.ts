/**
 * Next.js Middleware
 * 
 * This middleware runs before each request and handles:
 * - Edge geolocation detection (automatically provided by Vercel in production)
 * - Development mode geolocation mocking
 * - Location consent checking
 * - Supabase auth session management (future integration)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define extended request type with geolocation properties from Vercel
interface GeoData {
  city?: string;
  country?: string;
  countryRegion?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
}

// Extend NextRequest type for Vercel deployment
interface ExtendedNextRequest extends NextRequest {
  geo?: GeoData;
}

// Note: We don't import from location-server.ts in middleware
// because middleware runs in a different environment than server components

export async function middleware(request: ExtendedNextRequest) {
  const response = NextResponse.next();
  
  // Get geolocation data from the request object (only populated in Vercel production)
  const { geo } = request;
  
  // Process geolocation data based on environment
  if (geo) {
    // We have real geolocation data from Vercel's edge network
    // Log in development only for verification (this case only happens on Vercel preview deploys)
    if (process.env.NODE_ENV === 'development') {
      console.error('Edge geolocation detected:', geo);
    }
    
    // Add key geolocation data to response headers
    if (geo.country) response.headers.set('x-geo-country', geo.country);
    if (geo.city) response.headers.set('x-geo-city', geo.city);
    if (geo.region) response.headers.set('x-geo-region', geo.region);
    if (geo.latitude) response.headers.set('x-geo-latitude', geo.latitude.toString());
    if (geo.longitude) response.headers.set('x-geo-longitude', geo.longitude.toString());
  } else if (process.env.NODE_ENV === 'development') {
    // In local development, provide mock geolocation data for testing
    console.error('Using mock geolocation data in development environment');
    
    // Set mock values for development testing
    // These values won't appear in production unless geo is undefined on Vercel
    response.headers.set('x-geo-country', 'US');
    response.headers.set('x-geo-city', 'San Francisco');
    response.headers.set('x-geo-region', 'CA');
    response.headers.set('x-geo-latitude', '37.7749');
    response.headers.set('x-geo-longitude', '-122.4194');
  }
  
  // Extract location consent cookie
  const locationConsent = request.cookies.get('location-consent');
  
  // Set a request header with the consent status for use in components
  // This makes it easy to access in both client and server components
  if (locationConsent) {
    try {
      const parsedConsent = JSON.parse(locationConsent.value || '{}');
      
      // Add consent status to request headers for use in server components
      response.headers.set('x-location-consent-status', parsedConsent.consentStatus);
    } catch (error) {
      console.error('Error parsing location consent cookie:', error);
    }
  } else {
    // No consent cookie found, mark as 'prompt' in headers
    response.headers.set('x-location-consent-status', 'prompt');
  }
  
  return response;
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /robots.txt (common static files)
     */
    '/((?!api|_next|static|favicon.ico|robots.txt).*)',
  ],
};