# Geolocation Feature Documentation

This document details the geolocation implementation in the Cyber Hand website, covering the architecture, components, middleware integration, and usage patterns.

## Overview

The geolocation feature enables location-aware content and functionality based on the user's geographic location. It leverages Vercel Edge Network's geolocation capabilities to detect user location server-side, with proper user consent management and privacy controls.

## Architecture

The geolocation system follows a three-layer architecture:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                    Edge Layer                   │
│                  (Middleware)                   │
│  ┌─────────────────────────────────────────────┐│
│  │         Header Extraction & Setting         ││
│  └─────────────────────────────────────────────┘│
│                       │                          │
└───────────────────────┼──────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│                   Server Layer                  │
│  ┌─────────────────────────────────────────────┐│
│  │    Location Service & Server Components     ││
│  └─────────────────────────────────────────────┘│
│                       │                          │
└───────────────────────┼──────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│                   Client Layer                  │
│  ┌─────────────────────────────────────────────┐│
│  │      Context Provider & User Interface      ││
│  └─────────────────────────────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

### 1. Edge Layer (Middleware)

Middleware intercepts requests and extracts geolocation data from Vercel's headers, making it available to the application.

### 2. Server Layer (Location Service)

Server Components access location data through the Location Service, which provides helper functions for location-based logic.

### 3. Client Layer (Context & UI)

Client Components access location data through the Location Context Provider and handle user consent through the Location Consent component.

## Key Components

### Middleware (`middleware.ts`)

Extracts geolocation headers from Vercel Edge Network and sets them as request headers. In Next.js 15, middleware handling is more reliable and has better TypeScript support:

```typescript
// Middleware extracts Vercel geolocation headers and makes them available to the application
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Extract headers from Vercel Edge Network
  const country = request.headers.get('x-vercel-ip-country');
  const city = request.headers.get('x-vercel-ip-city');
  const region = request.headers.get('x-vercel-ip-country-region');
  const latitude = request.headers.get('x-vercel-ip-latitude');
  const longitude = request.headers.get('x-vercel-ip-longitude');
  
  // Safely decode URI components to handle special characters
  // Set standardized headers for application use
  if (country) response.headers.set('x-geo-country', safeDecodeURI(country));
  if (city) response.headers.set('x-geo-city', safeDecodeURI(city));
  if (region) response.headers.set('x-geo-region', safeDecodeURI(region));
  if (latitude) response.headers.set('x-geo-latitude', latitude);
  if (longitude) response.headers.set('x-geo-longitude', longitude);
  
  return response;
}
```

### Location Service (`lib/location/location-service.ts`)

Provides utilities for accessing geolocation data in Server Components:

```typescript
// Server-side utilities for working with geolocation data
export function getLocationData(): LocationData {
  // Access headers provided by middleware
  const headersList = headers();
  
  // Extract and parse location information
  const country = headersList.get('x-geo-country') || undefined;
  const city = headersList.get('x-geo-city') || undefined;
  // Additional header parsing...
  
  return {
    country,
    city,
    // Other location properties...
    isDetected: Boolean(country || city),
    lastUpdated: Date.now()
  };
}

// Helper functions for location-based logic
export function isInCountry(countryCode: string): boolean {
  const { country } = getLocationData();
  return country === countryCode;
}
```

### Location Context (`lib/location/location-context.tsx`)

Provides location data and management capabilities to Client Components:

```typescript
// Location data structure
export interface LocationData {
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  continent?: string;
  latitude?: number;
  longitude?: number;
  isDetected: boolean;
  lastUpdated: number;
}

// Context Provider for location data
export function LocationProvider({ children, initialLocation }: LocationProviderProps) {
  const [location, setLocation] = useState<LocationData>(initialLocation);
  
  // Functions to manage location data
  const overrideLocation = (newLocation: Partial<LocationData>) => {
    // Implementation details...
  };
  
  const resetLocation = () => {
    // Implementation details...
  };
  
  return (
    <LocationContext.Provider value={{ location, overrideLocation, resetLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
```

### Location Consent Component (`components/location/location-consent.tsx`)

Manages user consent for location-based features. This component follows Next.js 15's strict Client Component patterns:

```typescript
// Client Component directive at the top of the file
'use client';

// Strongly typed props with TypeScript
interface LocationConsentProps {
  className?: string;
}

// Client Component to manage user consent for location features
export function LocationConsent({ className }: LocationConsentProps) {
  const { location, overrideLocation } = useLocation();
  const [visible, setVisible] = useState(false);
  
  // Logic to determine when to show consent notification
  useEffect(() => {
    // Check for existing consent
    const hasConsent = document.cookie.includes('location-consent=true');
    const hasDenied = document.cookie.includes('location-consent=false');
    
    // Show in production regardless of detection state if no decision exists
    const isProduction = process.env.NODE_ENV === 'production';
    if ((!isProduction && location.isDetected && !hasConsent && !hasDenied) || 
        (isProduction && !hasConsent && !hasDenied)) {
      setVisible(true);
      
      // Auto-dismiss after timeout
      const timer = setTimeout(() => setVisible(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [location.isDetected]);
  
  // Handle user declining location use
  const handleDecline = () => {
    overrideLocation({
      isDetected: false,
      lastUpdated: Date.now()
    });
    setVisible(false);
  };
  
  if (!visible) return null;
  
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onDecline={handleDecline}
      cookieName="location-consent"
      expires={90} // Days
      style={{ /* Styles */ }}
    >
      {location.isDetected ? (
        <>We detect your location ({location.city ? `${location.city}, ` : ''}{location.country || 'Unknown'}) 
        to provide you with relevant content. Do you consent to this?</>
      ) : (
        <>We use location data to provide you with region-specific content. 
        Do you consent to this?</>
      )}
    </CookieConsent>
  );
}
```

### Location Consent Wrapper (`components/location/location-consent-wrapper.tsx`)

Client component wrapper to handle dynamic imports and prevent hydration issues:

```typescript
// Client Component wrapper for LocationConsent
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the LocationConsent component
const DynamicLocationConsent = dynamic(
  () => import('./location-consent').then(mod => mod.LocationConsent),
  { ssr: false } // Disable SSR to prevent hydration mismatch
);

// Wrapper component with Suspense for dynamic loading
export function LocationConsentWrapper() {
  return (
    <Suspense fallback={null}>
      <DynamicLocationConsent />
    </Suspense>
  );
}
```

## Data Flow

The geolocation feature follows this data flow:

1. **Edge Network (Vercel)** detects user location based on IP address
2. **Middleware** extracts location data from headers and standardizes them
3. **Location Service** reads standardized headers in Server Components
4. **Location Context Provider** initializes with server-detected location
5. **Location Consent Component** manages user preferences
6. **Application Components** use the location data for personalization

## Implementation Patterns

### Server-Side Location Logic

Server Components can use location data through helper functions:

```tsx
import { isInCountry, getFormattedLocation } from '@/lib/location/location-service';

export default function WelcomeSection() {
  // Check if user is in a specific country
  const isUS = isInCountry('US');
  
  // Get a formatted string of the user's location
  const locationString = getFormattedLocation();
  
  return (
    <section>
      <h1>Welcome{isUS ? ' from the United States!' : '!'}</h1>
      <p>You appear to be visiting from {locationString}</p>
      {/* Content tailored to location */}
    </section>
  );
}
```

### Client-Side Location Access

Client Components can access location data through the Context Hook:

```tsx
'use client';

import { useLocation } from '@/lib/location/location-context';

export function LocalizedContent() {
  const { location } = useLocation();
  
  return (
    <div>
      {location.isDetected ? (
        <p>Content tailored for {location.city || location.country || 'your region'}</p>
      ) : (
        <p>Default content for all regions</p>
      )}
    </div>
  );
}
```

### User Location Override

Allow users to manually override their detected location:

```tsx
'use client';

import { useLocation } from '@/lib/location/location-context';

export function LocationSelector() {
  const { location, overrideLocation, resetLocation } = useLocation();
  
  return (
    <div>
      <h3>Your Location: {location.country || 'Unknown'}</h3>
      
      <button onClick={() => overrideLocation({ country: 'US', city: 'New York' })}>
        Set to US
      </button>
      
      <button onClick={() => overrideLocation({ country: 'GB', city: 'London' })}>
        Set to UK
      </button>
      
      <button onClick={resetLocation}>
        Reset to Detected Location
      </button>
    </div>
  );
}
```

## Privacy Considerations

The geolocation implementation includes several privacy features:

1. **User Consent** - Location data is only used with explicit user consent via the consent banner
2. **Server-Side Processing** - Location detection happens server-side, minimizing client exposure
3. **Minimal Data Storage** - Only necessary location data is stored in cookies
4. **Clear Override Controls** - Users can override or reset their location at any time
5. **Cookie Expiration** - Location consent cookie expires after 90 days

## Configuration Options

The geolocation feature can be configured through:

1. **Environment Variables**:
   - `NEXT_PUBLIC_DISABLE_GEOLOCATION`: Set to 'true' to disable all geolocation features
   - `NEXT_PUBLIC_MOCK_LOCATION`: Set to a country code for testing (development only)

2. **Middleware Configuration**:
   - Edit `middleware.ts` to modify which headers are extracted and set

3. **Consent Settings**:
   - Modify `AUTO_DISMISS_TIMEOUT` in `location-consent.tsx` to change notification behavior
   - Update cookie expiration period in the CookieConsent component

## Testing Approach

### Local Development Testing

For local testing with mock location data:

1. Set the `NEXT_PUBLIC_MOCK_LOCATION` environment variable in `.env.local`:
   ```
   NEXT_PUBLIC_MOCK_LOCATION=US
   ```

2. Use the `/api/geo-debug` endpoint to verify location detection

### Production Testing

1. Deploy to Vercel to access real geolocation data
2. Use the Vercel Preview environment to test with real IP-based location detection
3. Test the consent banner behavior on various devices
4. Verify location override functionality persists across sessions

## Debugging

A debugging endpoint is available at `/api/geo-debug` to view all detected location data. In Next.js 15, Route Handlers are no longer cached by default, which is ideal for debugging endpoints like this:

```typescript
// app/api/geo-debug/route.ts
export async function GET(request: Request) {
  const location = getLocationData();
  
  // In Next.js 15, this route is dynamic by default (not cached)
  // No need to specify export const dynamic = 'force-dynamic'
  
  return Response.json({
    detected: location,
    headers: Object.fromEntries([...request.headers]),
    timestamp: new Date().toISOString() // Always fresh
  });
}

// For production endpoints that should be cached:
// export const dynamic = 'force-static';
// export const revalidate = 3600; // Revalidate every hour

```

## Best Practices

1. **Always use Server Components** for initial location detection
2. **Respect user consent** and privacy preferences
3. **Provide clear feedback** on what location was detected
4. **Handle missing data gracefully** - not all location fields may be available
5. **Test across regions** to ensure localization works properly
6. **Monitor usage** of location-based features to identify issues

## Related Documentation

- [Location Provider Integration](../architecture/component-system.md)
- [Middleware Documentation](../architecture/data-flow.md)
- [Server Components](./server-components.md)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
