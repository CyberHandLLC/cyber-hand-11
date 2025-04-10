# System Architecture Overview

This document provides a high-level overview of the Cyber Hand website architecture, explaining how the different components work together. It reflects the latest Next.js 15.2.4 and React 19 architectural patterns.

## Architectural Principles

The Cyber Hand website follows these core architectural principles:

1. **Server-first Approach** - Leveraging Next.js 15's React Server Components for optimal performance
2. **Component Modularity** - Breaking down UI into focused, reusable components
3. **Separation of Concerns** - Clear boundaries between data fetching, UI rendering, and client interactivity
4. **Progressive Enhancement** - Core functionality works without JavaScript, enhanced with interactive features
5. **Type Safety** - TypeScript throughout the entire codebase

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

## Data Flow

Data flows through the application as follows:

1. **Server-side Data Fetching**:

   - Server Components fetch data during the rendering process
   - Data is fetched in parallel where possible to minimize waterfalls
   - Results are cached using React's cache() function
   - Dynamic data uses `cache: 'no-store'` to bypass caching
   - Explicit opt-in for caching in Route Handlers with `dynamic = 'force-static'`

2. **Client-side State Management**:

   - React Context provides global state to components
   - useState/useReducer/useFormState manage local component state
   - Server/Client boundary is carefully managed to prevent serialization issues
   - Enhanced React 19 hooks for state management

3. **User Input Handling**:
   - Form submissions leverage Server Actions for processing
   - Next.js 15's enhanced security for Server Actions prevents unauthorized invocation
   - Built-in Form component for improved form handling
   - Client-side validation provides immediate feedback
   - Optimistic UI updates improve perceived performance

## Next.js 15 Implementation

Next.js 15.2.4 features are utilized throughout the architecture:

1. **App Router** - Directory-based routing with layouts and nested routes
2. **React Server Components** - Server rendering with streaming capabilities (default in App Router)
3. **Server Actions** - Form handling without API endpoints with enhanced security
4. **React 19 Features** - Utilizing the latest React capabilities including improved Suspense
5. **Streaming & Suspense** - Progressive loading with fallback UI
6. **Edge Runtime** - Middleware for geolocation and personalization
7. **Updated Caching Model** - Explicit opt-in for caching in Route Handlers and optimized Router Cache
8. **New Form Component** - Using the built-in Form component with useFormState hook

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

## Streaming Implementation

The streaming architecture leverages React Suspense:

1. **Page-level Streaming** - Using layout.js and loading.js for route transitions
2. **Component-level Streaming** - Using Suspense boundaries around data-dependent components
3. **Skeleton Components** - Standardized loading states with consistent visual design

## Error Handling Architecture

Error handling is implemented with multiple strategies:

1. **Error Boundaries** - Client components that catch and display errors
2. **try/catch Blocks** - For handling synchronous errors in server components
3. **Error.js Files** - For route-level error handling
4. **Graceful Degradation** - Ensuring partial content is displayed even if some components fail
5. **Improved Hydration Errors** - React 19's enhanced debugging for hydration mismatches
6. **Error Recovery** - Built-in mechanisms for recovering from errors without full page refreshes

## Performance Architecture

Performance is architected with:

1. **Bundle Optimization** - Code splitting, tree shaking, and dynamic imports
2. **Image Optimization** - Using Next.js Image component with WebP/AVIF formats
3. **Font Optimization** - Preloading, subsetting, and variable fonts
4. **Core Web Vitals Focus** - Layout stability, interactivity optimization, and content loading

## Security Architecture

Security measures include:

1. **Content Security Policy** - Restrictive CSP headers via Next.js config
2. **Input Validation** - Validation on both client and server
3. **CSRF Protection** - Built into Server Actions
4. **XSS Prevention** - Auto-escaping in React and proper data handling

## Related Documentation

For more specific details, see:

- [Component System](./component-system.md) - Detailed component relationships
- [Data Flow](./data-flow.md) - Comprehensive data flow documentation
- [File Structure](./file-structure.md) - Directory organization guide
- [Dependency Map](./dependency-map.md) - Component dependencies and relationships
