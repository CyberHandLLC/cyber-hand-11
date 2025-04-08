# Development Environment Setup Guide

This guide will help you set up your development environment for working on the Cyber Hand website project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 18.17.0 or later (LTS recommended)
- **npm** or **yarn** - Latest stable version
- **Git** - For version control
- **VSCode** (recommended) - With extensions for TypeScript and ESLint

## Initial Setup

### 1. Clone the Repository

```bash
git clone [repository-url]
cd cyber-hand.com
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For development with geolocation features, additional environment variables may be needed. See the [Geolocation Documentation](../features/geolocation.md) for details.

#### Next.js 15 Configuration Options

You can customize the Next.js 15 behavior by editing `next.config.js`. Key options for Next.js 15 include:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Control client router cache behavior (Next.js 15 feature)
  experimental: {
    // Override default staleTime of 0 for Page segments
    staleTimes: {
      // Values in seconds
      dynamic: 0,    // Default in Next.js 15 (changed from 30)
      static: 300,   // 5 minutes
      loading: 300,  // 5 minutes
    },
  },
  
  // TypeScript configuration file support (Next.js 15 feature)
  // You can use next.config.ts instead of next.config.js
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy for Next.js 15 with enhanced Server Actions security
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Next.js
              // Other CSP directives...
            ].join('; ')
          },
          // Other security headers...
        ]
      }
    ];
  },
};

module.exports = nextConfig;
```

## Development Workflow

### Starting the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Running Tests

```bash
# Run all tests
npm run test
# or
yarn test

# Run tests in watch mode during development
npm run test:watch
# or
yarn test:watch

# Run tests with coverage report
npm run test:coverage
# or
yarn test:coverage
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint
# or
yarn lint

# Type check with TypeScript
npx tsc --noEmit
```

## Production Build

To create a production build locally:

```bash
npm run build
# or
yarn build

# Start the production server
npm run start
# or
yarn start
```

### Next.js 15 Build Optimizations

Next.js 15 includes several build optimizations that are enabled by default:

1. **React Server Components Optimization** - Improved bundling for RSC
2. **Enhanced Static Generation** - Faster static site generation
3. **Server Components Hot Module Replacement** - Faster refresh during development
4. **Turbopack** - Stable for development mode (enable with `--turbo` flag)

You can enable Turbopack for faster development:

```bash
# Enable Turbopack in development
npm run dev -- --turbo
# or
yarn dev --turbo
```

### Self-hosting Configuration

For self-hosting, Next.js 15 includes improved support. Update your `next.config.js`:

```js
const nextConfig = {
  // Configure output for self-hosting
  output: 'standalone',
  
  // For a specific base path
  basePath: '/my-base-path', // If needed
  
  // For trailing slash support
  trailingSlash: true, // If needed
};
```

## VSCode Configuration

For the optimal development experience, we recommend configuring VSCode with:

1. **ESLint Extension** - For real-time linting feedback (supports ESLint 9)
2. **Prettier Extension** - For code formatting
3. **Tailwind CSS IntelliSense** - For CSS class suggestions

Add this to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.experimental.useFlatConfig": true
}
```

### ESLint Configuration for Next.js 15

Next.js 15 supports ESLint 9 with the flat config format. Create an `.eslintrc.json` file:

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    // React 19 and Next.js 15 specific rules
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "warn",
    
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_" 
    }],
    
    // General code quality
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

## Troubleshooting

### Common Issues

1. **Module not found errors** - Ensure all dependencies are installed with `npm install`
2. **TypeScript errors** - Run `npx tsc --noEmit` to see detailed type errors
3. **Build failures** - Check for lint errors with `npm run lint`
4. **Hydration errors** - Look for mismatches between server and client rendering
5. **Server Actions errors** - Check Server Action function signatures and ensure they're properly tagged
6. **Caching inconsistencies** - Next.js 15 uses new caching defaults; explicitly set caching behavior
7. **Form component issues** - Ensure you're using the latest patterns for the new Form component

#### Debugging Hydration Errors

React 19 provides improved debugging for hydration errors. You can identify issues by:

```bash
# Enable detailed error reporting in development
NEXT_DEBUG_HYDRATION=1 npm run dev
```

#### Route Handler Caching

In Next.js 15, GET Route Handlers are no longer cached by default. If you see unexpected dynamic behavior, you may need to explicitly set caching:

```typescript
// Force static rendering
export const dynamic = 'force-static';

// Or with revalidation
export const revalidate = 60; // Seconds
```

### Clearing Cache

If you encounter unexplainable issues, try:

```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force
```

## Next Steps

Once your environment is set up:

1. Read the [Code Standards](./code-standards.md) documentation
2. Review the [Architecture Overview](../architecture/system-overview.md)
3. Look at existing components to understand patterns and styles
