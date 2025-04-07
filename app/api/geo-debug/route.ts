/**
 * Geolocation Debug API Route
 * 
 * This API route helps diagnose issues with geolocation in Vercel deployments.
 * It directly accesses the geo property from the request object and returns
 * detailed information about the environment and available data.
 */

import { NextRequest, NextResponse } from 'next/server';

// Mark as Edge runtime to ensure geolocation access
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Directly access geo data from request (only available in production on Vercel)
    // We use type assertion since TypeScript doesn't know about Vercel extensions
    const geo = (request as any).geo || null;
    
    // Create debug response with all available information
    return NextResponse.json({
      // Geolocation data
      geo: geo,
      hasGeo: Boolean(geo),
      
      // Headers info (all request headers sent by client)
      headers: Object.fromEntries(request.headers),
      
      // Environment info
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isVercel: process.env.VERCEL === '1',
        vercelEnv: process.env.VERCEL_ENV || 'unknown',
      },
      
      // Request details
      url: request.url,
      method: request.method,
      
      
      // Helper info
      timestamp: new Date().toISOString(),
      tips: [
        "Geolocation requires Vercel Pro or Enterprise plan",
        "Edge runtime declaration (edge) is required in middleware",
        "Geolocation data is not available in local development",
        "Check Vercel dashboard logs for more information"
      ]
    });
  } catch (error) {
    // If anything goes wrong, return error information
    return NextResponse.json(
      { 
        error: 'Error getting geolocation data',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
