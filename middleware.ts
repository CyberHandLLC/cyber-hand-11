/**
 * Next.js Middleware
 * 
 * This middleware runs before each request and handles:
 * - Edge geolocation detection (automatically provided by Vercel in production)
 * - Development mode geolocation mocking
 * - Location consent checking
 * - Supabase auth session management (future integration)
 */

// Mark this file as using the Edge Runtime - required for geolocation on Vercel
export const runtime = 'experimental-edge';

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
  // Get URL and pathname for routing decisions
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Create base response
  let response = NextResponse.next();
  
  // Extract Vercel's geolocation headers
  // These are available on all Vercel plans when using the Edge runtime
  const country = request.headers.get('x-vercel-ip-country');
  const city = request.headers.get('x-vercel-ip-city');
  const region = request.headers.get('x-vercel-ip-country-region');
  const latitude = request.headers.get('x-vercel-ip-latitude');
  const longitude = request.headers.get('x-vercel-ip-longitude');
  const timezone = request.headers.get('x-vercel-ip-timezone');
  const continent = request.headers.get('x-vercel-ip-continent');
  
  // Safe decode function to handle URL-encoded values
  const safeDecodeURI = (value: string | null): string | null => {
    if (!value) return null;
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return value; // Return original if decoding fails
    }
  };
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Geolocation from headers:', {
      country, city, region, latitude, longitude, timezone, continent
    });
  }

  // Process geolocation data based on environment
  if (country || city) {
    // We have real geolocation data from Vercel's edge network
    // Add standardized geo headers for our components to use, with proper decoding
    if (country) response.headers.set('x-geo-country', country);
    if (city) response.headers.set('x-geo-city', safeDecodeURI(city) || '');
    if (region) response.headers.set('x-geo-region', safeDecodeURI(region) || '');
    if (latitude) response.headers.set('x-geo-latitude', latitude || '');
    if (longitude) response.headers.set('x-geo-longitude', longitude || '');
    if (timezone) response.headers.set('x-geo-timezone', safeDecodeURI(timezone) || '');
    if (continent) response.headers.set('x-geo-continent', continent || '');
  } else {
    // As a fallback, always check raw Vercel headers even when high-level 'country' is missing
    // This makes our geo detection more robust on all Vercel plans
    const rawCountry = request.headers.get('x-vercel-ip-country');
    const rawCity = request.headers.get('x-vercel-ip-city');
    
    if (rawCountry || rawCity) {
      console.error('Using raw Vercel IP headers for geolocation');
      
      // Set geo headers from raw Vercel headers
      if (rawCountry) response.headers.set('x-geo-country', rawCountry);
      if (rawCity) response.headers.set('x-geo-city', safeDecodeURI(rawCity) || '');
      if (request.headers.get('x-vercel-ip-country-region')) 
        response.headers.set('x-geo-region', safeDecodeURI(request.headers.get('x-vercel-ip-country-region')) || '');
      if (request.headers.get('x-vercel-ip-latitude'))
        response.headers.set('x-geo-latitude', request.headers.get('x-vercel-ip-latitude') || '');
      if (request.headers.get('x-vercel-ip-longitude'))
        response.headers.set('x-geo-longitude', request.headers.get('x-vercel-ip-longitude') || '');
      if (request.headers.get('x-vercel-ip-timezone'))
        response.headers.set('x-geo-timezone', safeDecodeURI(request.headers.get('x-vercel-ip-timezone')) || '');
      if (request.headers.get('x-vercel-ip-continent'))
        response.headers.set('x-geo-continent', request.headers.get('x-vercel-ip-continent') || '');
    } else if (process.env.NODE_ENV === 'development') {
      // In local development, provide mock geolocation data for testing
      console.error('Using mock geolocation data in development environment');
      
      // Set mock values for development testing
      response.headers.set('x-geo-country', 'US');
      response.headers.set('x-geo-city', 'San Francisco');
      response.headers.set('x-geo-region', 'CA');
      response.headers.set('x-geo-latitude', '37.7749');
      response.headers.set('x-geo-longitude', '-122.4194');
      response.headers.set('x-geo-timezone', 'America/Los_Angeles');
      response.headers.set('x-geo-continent', 'NA');
    }
  }
  
  // Extract location consent cookie
  const locationConsent = request.cookies.get('location-consent');
  
  // Set a request header with the consent status for use in components
  // This makes it easy to access in both client and server components
  let consentStatus = 'prompt';
  if (locationConsent) {
    try {
      const parsedConsent = JSON.parse(locationConsent.value || '{}');
      consentStatus = parsedConsent.consentStatus;
      
      // Add consent status to request headers for use in server components
      response.headers.set('x-location-consent-status', consentStatus);
    } catch (error) {
      console.error('Error parsing location consent cookie:', error);
    }
  } else {
    // No consent cookie found, mark as 'prompt' in headers
    response.headers.set('x-location-consent-status', 'prompt');
  }
  
  // Handle dynamic route redirection for location-based content
  // Only redirect if we have both consent and a city
  if (pathname === '/services' && 
      consentStatus === 'granted' && 
      city && city.trim() !== '') {
    
    try {
      // Create slug from city name
      const citySlug = safeDecodeURI(city)
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') || '';
      
      // Only redirect if we have a valid city slug
      if (citySlug && citySlug !== 'undefined' && citySlug !== 'null') {
        // Create URL for location-specific services page
        const locationUrl = new URL(`/services/${citySlug}`, request.url);
        
        // Preserve any query parameters
        request.nextUrl.searchParams.forEach((value, key) => {
          locationUrl.searchParams.set(key, value);
        });
        
        // Redirect to location-specific page
        return NextResponse.redirect(locationUrl);
      }
    } catch (error) {
      console.error('Error redirecting to location-specific page:', error);
    }
  }
  
  return response;
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * 
     * This simpler pattern ensures middleware runs on all page routes
     * while still excluding static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};