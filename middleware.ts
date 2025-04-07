/**
 * Next.js Middleware
 * 
 * This middleware runs before each request and handles:
 * - Location consent checking
 * - Supabase auth session management (future integration)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Note: We don't import from location-server.ts in middleware
// because middleware runs in a different environment than server components

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Extract location consent cookie
  const locationConsent = request.cookies.get('location-consent');
  
  // Set a request header with the consent status for use in components
  // This makes it easy to access in both client and server components
  if (locationConsent) {
    try {
      const parsedConsent = JSON.parse(locationConsent.value);
      
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