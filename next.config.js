/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude backup directory from build process
  distDir: ".next",
  // Exclude directories from file tracing (moved from experimental per Next.js 15.2.4)
  outputFileTracingExcludes: {
    "*": [
      "./backup/**/*",
      "./mcp-servers/**/*",
      "./docs/**/*.md"
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    // Optimize image breakpoints for responsive design
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // This ensures that we can properly work with the Shadcn-UI components
  transpilePackages: [],

  // Security headers with relaxed CSP for Next.js compatibility
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Allow necessary content for Next.js to function properly
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Next.js
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' blob: data: https://images.unsplash.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' ws: wss: https://vitals.vercel-insights.com",
              "frame-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
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
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
      };

      // Enable tree shaking
      config.optimization.usedExports = true;
    }
    
    // Exclude MCP server files and test directories from build
    config.externals = config.externals || [];
    config.externals.push({
      'mcp-servers': 'mcp-servers'
    });
    
    // Add rule to ignore MCP server files
    config.module.rules.push({
      test: /mcp-servers/,
      loader: 'ignore-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
