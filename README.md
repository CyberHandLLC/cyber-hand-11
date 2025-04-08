# Cyber Hand Website

> A modern, high-performance website built with Next.js 15, React 19, and TypeScript, focusing on exceptional user experience, accessibility, and SEO.

## Project Overview

The Cyber Hand website is a cutting-edge digital presence designed using Next.js 15's App Router architecture with a strong focus on performance, accessibility, and SEO. The project leverages React Server Components, streaming, and modern web optimization techniques to deliver an exceptional user experience.

### Key Features

- **React Server Components** - Server-first rendering approach with client components at leaf nodes
- **Streaming Implementation** - Progressive page rendering for improved perceived performance
- **Enhanced Security** - Server Actions with secure hash-based verification and CSRF protection
- **Form Component** - Next.js 15's built-in Form component with useFormState for improved form handling
- **Updated Caching Model** - Explicit opt-in for Route Handler caching and optimized client router cache
- **Edge Rendering** - Vercel Edge functions for geolocation and personalization features
- **Performance Optimization** - Core Web Vitals focused enhancements (LCP, TBT, CLS)
- **Responsive Design** - Mobile-first approach with responsive adaptations for all screen sizes
- **Type Safety** - TypeScript throughout with strict typing and interfaces
- **Accessibility** - WCAG compliance with proper ARIA attributes and keyboard navigation
- **SEO Enhancement** - Structured data, metadata optimization, and semantic HTML

## Quick Start Guide

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Development Environment Setup

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd cyber-hand.com
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
# or
yarn build
```

## Documentation Structure

The project documentation is organized as follows:

### Root-level Strategy Documents

- [ARCHITECTURE.md](ARCHITECTURE.md) - File structure and component relationships
- [PLANNING.md](PLANNING.md) - Development strategy and technical decisions
- [TASK.md](TASK.md) - Implementation tasks and progress tracking

### Getting Started

- [Project Overview](/docs/getting-started/project-overview.md) - Introduction to the project and principles
- [Setup Guide](/docs/getting-started/setup-guide.md) - Environment setup instructions
- [Code Standards](/docs/getting-started/code-standards.md) - Next.js 15 & TypeScript best practices

### Architecture Documentation

- [System Overview](/docs/architecture/system-overview.md) - High-level architecture explanation
- [Component System](/docs/architecture/component-system.md) - Component organization and patterns
- [Data Flow](/docs/architecture/data-flow.md) - How data moves through the application

### Feature Documentation

- [Geolocation](/docs/features/geolocation.md) - Edge middleware and location-based features
- [Streaming](/docs/features/streaming.md) - Comprehensive Next.js 15 streaming guide
- [Server Components](/docs/architecture/server-components.md) - Server component implementation patterns

### Development Guides

- [Accessibility](/docs/guides/accessibility.md) - WCAG compliance and assistive technology support
- [SEO](/docs/guides/seo.md) - Search optimization with Next.js 15 Metadata API

### Performance and Optimization

- [Performance Monitoring](/docs/performance/monitoring.md) - Core Web Vitals tracking
- [Font Optimization](/docs/performance/font-optimization-guide.md) - Typography performance strategies

### Component Structure

- [Component Audit](/docs/components/audit.md) - Inventory of current components
- [Update Workflow](/docs/components/update-template.md) - Component change management
- [Dependency Tracking](/docs/architecture/dependency-tracking.md) - Component relationship mapping

### Development Templates

- [Component Template](/docs/templates/component-template.md) - Standard template for new components
- [Feature Template](/docs/templates/feature-template.md) - Standard template for new features
- [Update Checklist](/docs/templates/update-checklist.md) - Process for updating existing components

## Key Technologies and Patterns

### Core Framework

- **Next.js 15.2.4** - App Router, Edge Runtime, Image Optimization
  - Updated Caching Model - Explicit opt-in for caching in Route Handlers
  - Enhanced Security - Hash-based verification for Server Actions
  - Form Component - Built-in form handling with useFormState hook
  - TypeScript Config Support - next.config.ts support
- **React 19** - Server Components, Suspense, use hooks
  - Improved Hydration Error Debugging
  - Enhanced Suspense Implementation
  - New Form and Input Handling Capabilities
- **TypeScript** - Type-safe development with interfaces and strict typing

### UI and Styling

- **CSS Modules + CSS Variables** - Component-scoped styling with theme support
- **Tailwind** - Utility-first CSS framework for rapid styling
- **Framer Motion** - Animation library for interactive UI elements

### State Management

- **React Context** - Theme, location, and application state
- **React Hooks** - Custom hooks for shared logic
- **Server Actions** - Form handling and data mutations
- **Form Component** - React's useFormState hook integration

### Performance Optimization

- **Next.js Image** - Automatic image optimization and WebP/AVIF conversion
- **Dynamic Imports** - Code splitting for optimal loading
- **Suspense Boundaries** - Strategic loading states with skeletons

### Quality and Validation

- **ESLint 9** - Code quality enforcement with flat config support
- **TypeScript 5.8** - Enhanced type checking and validation
- **Lighthouse** - Performance monitoring and metrics
- **Turbopack** - Stable integration for faster development
- **Manual Verification** - Standardized review process

## Project Structure

```
cyber-hand.com/
├── app/                      # Next.js app directory (pages and routes)
├── components/               # Reusable React components
│   ├── case-studies/         # Case studies specific components
│   ├── custom/               # Site-specific custom components
│   ├── location/             # Geolocation related components
│   └── ui/                   # Generic UI components
├── data/                     # Data files that populate the site
├── lib/                      # Utility libraries and helpers
├── public/                   # Static assets
└── docs/                     # Project documentation
```

## Development Principles

1. **Server-first Rendering** - Use React Server Components by default, client components only when needed
2. **Component Modularity** - Keep files under 500 lines, organize by feature
3. **Performance Budget** - < 3s initial load (3G), < 300KB JS bundle
4. **Accessibility First** - ARIA attributes, keyboard navigation, semantic HTML
5. **Progressive Enhancement** - Core functionality works without JS, enhanced with interaction
6. **Explicit Caching** - Opt-in to caching in Route Handlers when appropriate
7. **Security-first Development** - Authentication and authorization for all Server Actions
8. **Type-safe API Contracts** - Strong typing for all server-client communication

## Deployment

The site is deployed on Vercel with the following pipeline:

1. Continuous integration via GitHub Actions
2. Automated testing and linting on pull requests
3. Preview deployments for every pull request
4. Production deployments from the main branch

## Contributing

1. Read the [ARCHITECTURE.md](ARCHITECTURE.md) and [PLANNING.md](PLANNING.md) documents
2. Follow the code style and organization patterns
3. Ensure all TypeScript files use proper typing without 'any'
4. Maintain or improve current Lighthouse scores
5. Verify functionality in different network conditions
6. Add/update documentation for significant changes

## License

[License information]
