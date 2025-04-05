/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // This ensures that we can properly work with the Shadcn-UI components
  transpilePackages: [],
  
  // Content Security Policy
  async headers() {
    // Determine if we're in development or production
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDev
              ? [
                  // Development CSP - more permissive for hot reloading and debugging
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "img-src 'self' blob: data: https://images.unsplash.com",
                  "font-src 'self' https://fonts.gstatic.com",
                  "connect-src 'self' ws: https://vitals.vercel-insights.com",
                  "frame-src 'self'"
                ].join('; ')
              : [
                  // Production CSP - more restrictive
                  "default-src 'self'",
                  "script-src 'self'", // No unsafe-inline in production
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Inline styles still needed
                  "img-src 'self' blob: data: https://images.unsplash.com",
                  "font-src 'self' https://fonts.gstatic.com",
                  "connect-src 'self' https://vitals.vercel-insights.com",
                  "frame-src 'self'"
                ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle
  
  // Configure webpack for better performance
  // Module path aliases already set in tsconfig.json
  // Next.js automatically reads these from tsconfig.json
  
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only
    if (!dev && !isServer) {
      // Split chunks more aggressively for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
      };
      
      // Enable tree shaking
      config.optimization.usedExports = true;
    }
    
    return config;
  },
};

module.exports = nextConfig;
