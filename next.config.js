/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // This ensures that we can properly work with the Shadcn-UI components
  transpilePackages: [],
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle
  
  // Experimental features for improved performance
  experimental: {
    optimizeCss: true,        // Optimize CSS
    optimizePackageImports: ['framer-motion'], // Reduce bundle size for specific packages
  },
  
  // Configure webpack for better performance
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
