# System Architecture Reference

> This document provides a comprehensive reference for the Cyber Hand website architecture. It consolidates information from multiple architecture documents and serves as the definitive guide to understanding the system design, following Next.js 15.2.4 best practices.

## Table of Contents

1. [Architectural Principles](#architectural-principles)
2. [System Layers](#system-layers)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [File Structure](#file-structure)
6. [Server Components Implementation](#server-components-implementation)
7. [Performance Architecture](#performance-architecture)
8. [Error Handling](#error-handling)
9. [Security Architecture](#security-architecture)
10. [Deployment Architecture](#deployment-architecture)

## Architectural Principles

The Cyber Hand website follows these core architectural principles:

1. **Server-first Approach** - Leveraging Next.js 15.2.4's React Server Components for optimal performance
2. **Component Modularity** - Breaking down UI into focused, reusable components
3. **Separation of Concerns** - Clear boundaries between data fetching, UI rendering, and client interactivity
4. **Progressive Enhancement** - Core functionality works without JavaScript, enhanced with interactive features
5. **Type Safety** - TypeScript throughout the entire codebase
6. **Mobile-first Design** - Responsive design that starts with mobile and scales up
7. **Accessibility by Default** - WCAG compliance baked into the component design
8. **Performance Budget** - Strict adherence to performance metrics
9. **Security First** - Following security best practices from the foundation

## System Layers

The architecture consists of the following layers:

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────┐     ┌─────────────┐    │
│  │             │     │             │    │
│  │  UI Layer   │     │  Data Layer │    │
│  │             │     │             │    │
│  └─────────────┘     └─────────────┘    │
│          │                 │            │
│          ▼                 ▼            │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │          Business Logic             ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                     │                    │
│                     ▼                    │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │    Infrastructure & Utilities       ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### 1. UI Layer

The UI Layer consists of React components organized into a component hierarchy:

- **Page Components** (`app/` directory) - Top-level container components for routes
- **Feature Components** (`components/` directory) - Domain-specific components for features
- **UI Components** (`components/ui/` directory) - Generic, reusable UI elements

Components follow a clear hierarchy, with parent components passing data to children through props.

### 2. Data Layer

The Data Layer handles data fetching and state management:

- **Server Components** fetch data on the server using the `fetch` API and `cache()` function
- **Context Providers** manage global state like theme, location, etc.
- **Data Utilities** provide helper functions for data transformation and validation
- **Supabase Integration** handles database operations and real-time features

### 3. Business Logic

The Business Logic layer contains application-specific logic:

- **Server Actions** handle form submissions and mutations
- **Utility Functions** process business data and implement domain rules
- **Service Modules** implement specific business capabilities

### 4. Infrastructure & Utilities

The foundational layer provides cross-cutting concerns:

- **Configuration** - Environment variables and application settings
- **Optimization Utilities** - Performance enhancement helpers
- **Error Handling** - Error boundaries and error logging
- **Middleware** - Request/response processing

## Component Architecture

The component architecture follows a consistent pattern:

```
├── Page Component (Container)
│   ├── Layout Components
│   │   ├── Feature Components
│   │   │   ├── UI Components
```

With clear separation between:

- **Server Components** - Data fetching and main rendering
- **Client Components** - Interactive elements and client-side state
- **"use client" directive** only used when necessary for interactivity

### Component Classification Guidelines

#### Server Components

- Page layout components
- Data display components
- SEO-critical content
- Static UI elements
- Navigation structure (non-interactive parts)

#### Client Components

- Interactive UI elements (buttons, forms, etc.)
- Components that use React hooks
- Animation containers
- Components that use browser-only APIs
- State management wrappers

For more details on components, see [Component System](./component-system.md).

## Data Flow

Data flows through the application as follows:

### Server-side Data Fetching

- Server Components fetch data during the rendering process
- Data is fetched in parallel where possible to minimize waterfalls
- Results are cached using React's cache() function
- Dynamic data uses `cache: 'no-store'` to bypass caching
- Explicit opt-in for caching in Route Handlers with `dynamic = 'force-static'`

### Client-side State Management

- React Context provides global state to components
- useState/useReducer/useFormState manage local component state
- Server/Client boundary is carefully managed to prevent serialization issues
- Enhanced React 19 hooks for state management

### User Input Handling

- Form submissions leverage Server Actions for processing
- Next.js 15's enhanced security for Server Actions prevents unauthorized invocation
- Built-in Form component for improved form handling
- Client-side validation provides immediate feedback
- Optimistic UI updates improve perceived performance

For more details, see [Data Flow](./data-flow.md).

## File Structure

The project follows a structured organization:

```
cyber-hand.com/
├── app/                  # Next.js App Router directory
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
├── data/                 # Data models and mock data
├── docs/                 # Documentation files
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── public/               # Static assets
├── scripts/              # Build and utility scripts
└── [Configuration files] # Various config files
```

For a detailed file structure breakdown, see [File Structure](./file-structure.md).

## Server Components Implementation

The project leverages React Server Components (RSC) following specific patterns:

### Data Fetching Pattern

Using React's built-in `cache()` function for efficient data fetching:

```typescript
// lib/data/case-studies.ts
import { cache } from "react";

export const getCaseStudies = cache(async () => {
  // Fetch data here
  return data;
});
```

### Component Boundaries Pattern

Splitting components into server and client parts:

```tsx
// Server Component
import { ClientPart } from "./component-name-client";

export function ServerComponent({ data }) {
  return (
    <div>
      <h1>Static Content</h1>
      <ClientPart interactiveProps={data} />
    </div>
  );
}
```

```tsx
// Client Component
"use client";

export function ClientPart({ interactiveProps }) {
  // Interactive logic with hooks
  return <button onClick={...}>Interactive Element</button>;
}
```

For more details, see [Server Components](./server-components.md).

## Performance Architecture

Performance is architected with:

### Bundle Optimization

- Code splitting via dynamic imports
- Tree shaking to eliminate unused code
- Server Components to reduce client-side JavaScript

### Rendering Optimization

- Streaming with Suspense boundaries
- Progressive hydration of client components
- CSS containment for improved layout performance

### Resource Optimization

- Image optimization with Next.js Image component
- Font optimization with preloading and variable fonts
- CSS optimization with critical path rendering

### Monitoring and Measurement

- Web Vitals tracking for Core Web Vitals
- Custom performance metrics for application-specific measurements
- Build-time bundle analysis

For performance-specific strategies, see the [Performance](../performance/) documents.

## Error Handling

Error handling is implemented with multiple strategies:

1. **Error Boundaries** - Client components that catch and display errors
2. **try/catch Blocks** - For handling synchronous errors in server components
3. **Error.js Files** - For route-level error handling
4. **Graceful Degradation** - Ensuring partial content is displayed even if some components fail
5. **Improved Hydration Errors** - React 19's enhanced debugging for hydration mismatches
6. **Error Recovery** - Built-in mechanisms for recovering from errors without full page refreshes

## Security Architecture

Security measures include:

1. **Content Security Policy** - Restrictive CSP headers via Next.js config
2. **Input Validation** - Validation on both client and server
3. **CSRF Protection** - Built into Server Actions
4. **XSS Prevention** - Auto-escaping in React and proper data handling
5. **Authentication** - Secure authentication flow with Supabase Auth
6. **Authorization** - Row-level security in Supabase
7. **Environment Variables** - Secure management of sensitive configuration
8. **Dependency Scanning** - Regular audits of dependencies

## Deployment Architecture

The application is deployed on Vercel with:

1. **CI/CD Pipeline** - Automated testing and deployment
2. **Preview Deployments** - Per-branch preview environments
3. **Edge Functions** - Global distribution for API routes
4. **CDN Integration** - Optimized asset delivery
5. **Monitoring** - Real-time error tracking and performance monitoring
6. **Environment Separation** - Development, staging, and production environments

## Related Documentation

For specific implementation details, refer to:

- [Component System](./component-system.md)
- [Data Flow](./data-flow.md)
- [File Structure](./file-structure.md)
- [Server Components](./server-components.md)
- [Dependency Tracking](./dependency-tracking.md)
