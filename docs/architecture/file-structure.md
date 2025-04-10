# Cyber Hand Website - File Structure Documentation

This document provides a comprehensive overview of the Cyber Hand website's file structure, organization principles, and key files. Use this as a reference for understanding the codebase architecture and for maintaining consistency in future development.

## Root Directory Structure

```
cyber-hand.com/
├── app/                  # Next.js 13+ App Router directory
│   ├── api/              # API route handlers
│   ├── case-studies/     # Case studies pages and components
│   ├── contact/          # Contact page
│   ├── get-started/      # Get Started page
│   ├── resources/        # Resources page
│   ├── services/         # Services page
│   ├── font.ts           # Font configuration
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Homepage component
│   └── performance-wrapper.tsx # Performance optimization wrapper
├── components/           # Shared React components
│   ├── case-studies/     # Case study-related components
│   ├── custom/           # Custom standalone components
│   ├── forms/            # Form components and validation
│   ├── layout/           # Layout components (header, footer)
│   ├── performance/      # Performance optimization components
│   ├── services/         # Service-related components
│   └── ui/               # UI components (buttons, cards, etc.)
├── data/                 # Data models and mock data
│   ├── case-studies.ts   # Case study data
│   └── services.ts       # Services data
├── docs/                 # Documentation files
│   ├── component-audit.md # Component audit and classification
│   ├── file-structure.md  # This file structure documentation
│   └── server-components.md # Server Components implementation guide
├── hooks/                # Custom React hooks
│   ├── use-progressive-image.ts # Progressive image loading hook (2.5 KB)
│   └── use-web-vitals.ts        # Web Vitals reporting hook (3.2 KB)
├── lib/                  # Utility functions and helpers
│   ├── actions/          # Server actions for mutations
│   │   ├── contact/      # Contact form actions
│   │   │   └── contact-form.ts  # Contact form actions (2.9 KB)
│   │   ├── case-studies/ # Case study actions
│   │   └── services/     # Services-related actions
│   ├── data/             # Data fetching and processing
│   ├── performance/      # Performance optimization utilities
│   │   ├── code-splitting.tsx    # Dynamic import utilities (2.3 KB)
│   │   ├── critical-css.ts       # Critical CSS extraction (3.0 KB)
│   │   ├── deferred-loading.tsx  # Prioritized component hydration (3.8 KB)
│   │   └── performance-metrics.ts # Performance monitoring (2.9 KB)
│   ├── animation-utils.tsx   # Animation utilities (2.9 KB)
│   ├── case-study-styles.ts  # Case study styling utilities (1.0 KB)
│   ├── image-utils.ts        # Image optimization utilities (3.6 KB)
│   ├── server-utils.ts       # Server-related utilities (1.6 KB)
│   ├── theme-context.tsx     # Theme context provider (1.5 KB)
│   ├── theme-utils.ts        # Theme utility functions (3.4 KB)
│   ├── utils.ts              # General utility functions (0.2 KB)
│   └── web-vitals.ts         # Web Vitals integration (3.6 KB)
├── public/               # Static assets
│   ├── images/           # Static images
│   └── styles/           # Static styles
├── scripts/              # Build and utility scripts
│   ├── commit-changes.ps1             # Git commit helper (6.3 KB)
│   └── download-case-study-images.js  # Image downloader (1.1 KB)
├── templates/            # Component templates
│   ├── client-component.tsx  # Client Component template (3.0 KB)
│   └── server-component.tsx  # Server Component template (3.3 KB)
├── tests/                # Test files
│   ├── components/       # Component tests
│   │   ├── forms/        # Form component tests
│   │   └── ui/           # UI component tests
│   ├── utils/            # Utility function tests
│   ├── jest.setup.js     # Jest setup configuration (1.7 KB)
│   └── jest-dom.d.ts     # Jest DOM type definitions (1.1 KB)
├── __mocks__/            # Jest mock files
│   ├── fileMock.js       # File mock for tests (0.1 KB)
│   ├── styleMock.js      # Style mock for tests (0.1 KB)
│   └── theme-context.js  # Theme context mock (0.4 KB)
├── .eslintrc.json        # ESLint configuration (1.1 KB)
├── .gitignore            # Git ignore rules (0.3 KB)
├── .prettierrc           # Prettier formatting rules (0.2 KB)
├── .windsurfrules        # Windsurf CSS rules (1.4 KB)
├── ARCHITECTURE.md       # Architecture documentation (7.6 KB)
├── jest.config.js        # Jest configuration (2.2 KB)
├── lighthouserc.js       # Lighthouse CI configuration (1.1 KB)
├── next.config.js        # Next.js configuration (2.8 KB)
├── next-env.d.ts         # Next.js type definitions (0.2 KB)
├── package.json          # Project dependencies (1.4 KB)
├── package-lock.json     # Dependency lock file (530.4 KB)
├── PLANNING.md           # Project planning document (11.3 KB)
├── postcss.config.js     # PostCSS configuration (0.1 KB)
├── tailwind.config.js    # Tailwind CSS configuration (1.4 KB)
├── TASK.md               # Task management document (11.2 KB)
├── tsconfig.json         # TypeScript configuration (1.2 KB)
└── tsconfig.jest.json    # TypeScript Jest configuration (0.3 KB)
```

## Key Directories Explained

### `/app` - Next.js App Router

The `/app` directory implements Next.js 13+ App Router architecture, following file-based routing conventions:

```
app/
├── api/                  # API route handlers
├── case-studies/         # Case studies pages and components
│   ├── [slug]/           # Dynamic route for individual case studies
│   │   └── page.tsx      # Individual case study page (3.2 KB)
│   ├── components/       # Case study components
│   │   ├── case-studies-client-wrapper.tsx  # Client wrapper (1.8 KB)
│   │   ├── case-studies-filter.tsx          # Filter component (2.3 KB)
│   │   ├── case-study-grid.tsx              # Grid display (2.7 KB)
│   │   └── dynamic-case-study-grid.tsx      # Dynamic loading grid (1.5 KB)
│   └── page.tsx          # Case studies listing page (2.1 KB)
├── contact/              # Contact page
│   ├── components/       # Contact page components
│   │   └── animated-contact-info.tsx        # Animated info display (2.4 KB)
│   └── page.tsx          # Contact page (2.5 KB)
├── get-started/          # Get Started page
│   └── page.tsx          # Get Started page (1.9 KB)
├── resources/            # Resources page
│   └── page.tsx          # Resources page (1.8 KB)
├── services/             # Services page
│   └── page.tsx          # Services page (2.6 KB)
├── font.ts               # Font configuration (0.4 KB)
├── globals.css           # Global styles (6.9 KB)
├── layout.tsx            # Root layout component (3.5 KB)
├── page.tsx              # Homepage component (3.2 KB)
└── performance-wrapper.tsx # Performance optimization wrapper (3.6 KB)
```

Each route directory typically contains:

- `page.tsx` - The main page component (Server Component by default)
- `layout.tsx` - Layout wrapper for the route (optional)
- `loading.tsx` - Loading UI (optional)
- `error.tsx` - Error UI (optional)
- `components/` - Route-specific components

### `/components` - Shared React Components

Reusable components organized by feature and purpose:

```
components/
├── case-studies/         # Case study-related components
│   ├── case-study-card-client.tsx  # Client-side case study card (2.8 KB)
│   ├── case-study-card-server.tsx  # Server-side case study card (2.3 KB)
│   ├── case-study-client-wrapper.tsx # Client boundary wrapper (1.6 KB)
│   ├── case-study-content.tsx      # Content display component (3.1 KB)
│   ├── case-study-header.tsx       # Header component (2.4 KB)
│   ├── case-study-image.tsx        # Optimized image component (2.7 KB)
│   ├── case-study-types.ts         # TypeScript definitions (1.2 KB)
│   └── common-elements.tsx         # Shared UI elements (1.9 KB)
├── custom/               # Custom standalone components
│   ├── case-study-card.tsx    # Legacy case study card (2.6 KB)
│   ├── circuit-effects.tsx    # Circuit animation effects (3.4 KB)
│   ├── cyber-logo.tsx         # Logo component (1.8 KB)
│   ├── navbar.tsx             # Navigation bar (3.7 KB)
│   ├── page-layout.tsx        # Page layout structure (2.9 KB)
│   ├── service-card.tsx       # Service card display (2.4 KB)
│   └── service-carousel.tsx   # Service carousel (3.2 KB)
├── forms/                # Form components and validation
│   ├── contact-form-client.tsx  # Client contact form (3.5 KB)
│   └── contact-form.tsx         # Server contact form wrapper (2.1 KB)
├── layout/               # Layout components (header, footer)
│   ├── page-layout-client.tsx   # Client layout wrapper (2.7 KB)
│   └── section-container.tsx    # Section container (1.5 KB)
├── performance/          # Performance optimization components
│   └── optimized-layout-wrapper.tsx  # Layout optimization wrapper (2.8 KB)
├── services/             # Service-related components
│   ├── service-card-client.tsx  # Client service card (2.6 KB)
│   ├── service-card-server.tsx  # Server service card (2.1 KB)
│   └── services-wrapper.tsx     # Services section wrapper (2.3 KB)
└── ui/                   # UI components (buttons, cards, etc.)
    ├── button.tsx            # Button component (2.2 KB)
    ├── form-elements.tsx     # Form input elements (3.1 KB)
    ├── icons.tsx             # Icon components (2.5 KB)
    ├── optimized-image.tsx   # Image with optimization (2.9 KB)
    └── static-image.tsx      # Static image component (1.8 KB)
```

Components are categorized as either Server or Client components following the principles in `docs/server-components.md`.

### `/lib` - Utilities and Helpers

Shared utilities and helper functions:

```
lib/
├── actions/              # Server actions for mutations
│   ├── contact/          # Contact form actions
│   │   └── contact-form.ts # Contact form actions (2.9 KB)
│   ├── case-studies/     # Case study actions
│   └── services/         # Services-related actions
├── data/                 # Data fetching and processing
│   └── fetch-utils.ts      # Data fetching utilities (2.3 KB)
├── performance/          # Performance optimization utilities
│   ├── code-splitting.tsx    # Dynamic import utilities (2.3 KB)
│   ├── critical-css.ts       # Critical CSS extraction (3.0 KB)
│   ├── deferred-loading.tsx  # Prioritized component hydration (3.8 KB)
│   └── performance-metrics.ts # Performance monitoring (2.9 KB)
├── animation-utils.tsx   # Animation utilities (2.9 KB)
├── case-study-styles.ts  # Case study styling utilities (1.0 KB)
├── image-utils.ts        # Image optimization utilities (3.6 KB)
├── server-utils.ts       # Server-related utilities (1.6 KB)
├── theme-context.tsx     # Theme context provider (1.5 KB)
├── theme-utils.ts        # Theme utility functions (3.4 KB)
├── use-web-vitals.ts     # Web Vitals hook (3.2 KB)
├── utils.ts              # General utility functions (0.2 KB)
└── web-vitals.ts         # Web Vitals integration (3.6 KB)
```

The `performance/` subdirectory contains specialized utilities for implementing the performance optimization strategies documented in `docs/server-components.md`.

### `/hooks` - Custom React Hooks

Reusable React hooks:

```
hooks/
├── use-progressive-image.ts # Progressive image loading hook (2.5 KB)
└── use-web-vitals.ts        # Web Vitals reporting hook (3.2 KB)
```

This hook provides progressive image loading functionality with blur-up technique, showing a small blurry placeholder while loading the full image. The hooks directory contains shared stateful logic that can be reused across components.

### `/docs` - Documentation

Project documentation:

```
docs/
├── component-audit.md    # Component audit and classification (4.7 KB)
├── file-structure.md     # This file structure documentation (10.3 KB)
└── server-components.md  # Server Components implementation guide (7.1 KB)
```

The documentation provides guidance on architectural patterns, implementation strategies, and component classification. These files are regularly updated to reflect the current state of the codebase.

### `/tests` - Testing

Test files organized by test type:

```
tests/
├── components/           # Component tests
│   ├── forms/            # Form component tests
│   │   └── contact-form.test.tsx  # Contact form tests (2.3 KB)
│   └── ui/               # UI component tests
│       ├── button.test.tsx         # Button tests (1.9 KB)
│       └── optimized-image.test.tsx # Image tests (2.1 KB)
├── utils/                # Utility function tests
│   ├── image-utils.test.ts         # Image utility tests (1.8 KB)
│   └── theme-utils.test.ts         # Theme utility tests (1.7 KB)
├── jest.setup.js         # Jest setup configuration (1.7 KB)
└── jest-dom.d.ts         # Jest DOM type definitions (1.1 KB)
```

Tests use Jest and React Testing Library following the patterns specified in project memories. Each component and utility function has corresponding test files that verify functionality, edge cases, and failure scenarios.

## Key Files Explained

### Configuration Files

- **`next.config.js`** (2.8 KB): Next.js configuration including:

  - Image optimization settings
  - Bundle analyzer configuration
  - Environment variable handling
  - Redirects and rewrites

- **`tailwind.config.js`** (1.4 KB): Tailwind CSS configuration including:

  - Custom theme colors
  - Font configuration
  - Extended utilities
  - Plugin configuration

- **`.eslintrc.json`** (1.1 KB): ESLint rules enforcing:

  - TypeScript best practices
  - React component patterns
  - Import ordering
  - Performance optimizations

- **`.prettierrc`** (0.2 KB): Prettier configuration for code formatting

- **`jest.config.js`** (2.2 KB): Jest testing configuration

- **`tsconfig.json`** (1.2 KB): TypeScript configuration

- **`tsconfig.jest.json`** (0.3 KB): TypeScript configuration specific to Jest

- **`postcss.config.js`** (0.1 KB): PostCSS configuration for CSS processing

- **`lighthouserc.js`** (1.1 KB): Lighthouse CI configuration for performance testing

### Documentation Files

- **`ARCHITECTURE.md`**: High-level architecture documentation covering:

  - Technology stack
  - Design patterns
  - State management approach
  - Data flow strategy

- **`PLANNING.md`**: Project planning including:

  - Feature roadmap
  - Implementation status
  - Architectural decisions
  - Component organization

- **`TASK.md`**: Task tracking including:
  - Current tasks
  - Completed tasks
  - Discovered tasks
  - Prioritization

## Performance Optimization Structure

The performance optimization implementation follows a structured approach:

1. **Root Level Integration**:

   - `app/performance-wrapper.tsx` (3.6 KB): Applied at the root layout level to provide global optimizations
   - Intercepts and manages all page transitions and initial loads
   - Coordinates performance metric reporting

2. **Dedicated Performance Utilities**:

   - `lib/performance/`: Contains specialized utilities for different optimization strategies
     - `code-splitting.tsx` (2.3 KB): Dynamic import utilities with error handling
     - `critical-css.ts` (3.0 KB): Critical CSS extraction and management
     - `deferred-loading.tsx` (3.8 KB): Prioritized component hydration system
     - `performance-metrics.ts` (2.9 KB): Custom performance tracking
   - `components/performance/`: Houses performance-focused component implementations
     - `optimized-layout-wrapper.tsx` (2.8 KB): Layout optimization wrapper

3. **CSS Optimization**:

   - Critical CSS extraction for above-the-fold content
   - CSS containment strategies for layout isolation (`contain: content` attribute)
   - Deferred loading for non-critical styles using browser idle time
   - Font optimization with preloading for key fonts

4. **JavaScript Optimization**:

   - Code splitting via Next.js dynamic imports
   - Component-level lazy loading with skeleton placeholders
   - Deferred hydration for non-critical UI components
   - Error boundaries for fault tolerance and graceful degradation
   - React Server Components to reduce client-side JavaScript

5. **Monitoring and Reporting**:
   - Web Vitals integration via `web-vitals.ts` (3.6 KB) for Core Web Vitals monitoring
   - Component-level performance tracking with the `useReportWebVitals` hook from `/hooks/use-web-vitals.ts`
   - Custom performance metrics for application-specific measurements
   - Development vs. production reporting differentiation
   - Structured logging format for easier analysis

## Implementation Patterns

The codebase follows several key implementation patterns:

### Server Component Pattern

```tsx
// Server Component
export default async function ExamplePage() {
  // Server-side data fetching
  const data = await fetchData();

  return (
    <main>
      <h1>Example Page</h1>
      <ServerRenderedContent data={data} />

      {/* Client boundary with Suspense */}
      <Suspense fallback={<LoadingUI />}>
        <ClientInteractiveComponent initialData={data} />
      </Suspense>
    </main>
  );
}
```

### Dynamic Import Pattern

```tsx
// Client Component with Dynamic Import
"use client";

import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("@/components/heavy-component"), {
  loading: () => <SkeletonLoader />,
  ssr: false,
});

export function DynamicComponentWrapper(props) {
  return <DynamicComponent {...props} />;
}
```

### Progressive Enhancement Pattern

```tsx
// Server Component that provides progressive enhancement
export default function ProgressiveComponent() {
  return (
    <div>
      {/* Base functionality that works without JS */}
      <ServerRenderedContent />

      {/* Enhanced functionality with JS */}
      <Suspense fallback={<div>Loading enhanced features...</div>}>
        <ClientEnhancement />
      </Suspense>
    </div>
  );
}
```

## Testing Structure

The testing implementation follows a structured approach with:

1. **Component Tests**:

   - Unit tests for isolated component behavior
   - Snapshot tests for UI consistency
   - Interaction tests for user events

2. **Integration Tests**:

   - Tests for component interactions
   - Data flow validation
   - API integration verification

3. **Utility Tests**:
   - Unit tests for utility functions
   - Edge case handling
   - Type safety validation

## Conclusion

This document provides a comprehensive overview of the Cyber Hand website's file structure and organization. By following the patterns and principles outlined here, we can maintain a consistent and maintainable codebase as the project evolves.

For specific implementation guidance, refer to:

- `docs/server-components.md` for Server Components patterns
- `docs/component-audit.md` for component classification
- `PLANNING.md` for feature implementation status
- `TASK.md` for current development priorities
