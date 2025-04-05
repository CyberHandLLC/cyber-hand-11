# React Server Components Implementation Guide

This document outlines our approach to implementing React Server Components (RSC) in the Cyber Hand website. It serves as a reference for maintaining consistency across the codebase.

## Core Principles

1. **Server-First Rendering**: Default to Server Components for all non-interactive UI and data fetching
2. **Client Component Boundaries**: Only use Client Components for interactive UI elements
3. **Efficient Data Fetching**: Use React's `cache()` for optimized server-side data fetching
4. **Component Splitting**: Split complex components into Server and Client parts

## Implementation Patterns

### Data Fetching Pattern

We use React's built-in `cache()` function for efficient data fetching in Server Components:

```typescript
// lib/data/case-studies.ts
import { cache } from 'react';

export const getCaseStudies = cache(async () => {
  // Fetch data here
  return data;
});
```

Benefits:
- Automatic deduplication of data fetching
- Results are cached for the duration of a request
- Improves performance by eliminating redundant fetches

### Component Boundaries Pattern

For components that need both server rendering and client interactivity, we split them into two parts:

1. **Server Component**: Handles data fetching and static rendering
   - Filename: `component-name-server.tsx`
   - Contains main UI structure and passes data to client parts

2. **Client Component**: Handles interactive elements
   - Filename: `component-name-client.tsx`
   - Starts with `"use client";` directive
   - Only includes interactive elements

Example:

```tsx
// Server Component
import { ClientPart } from './component-name-client';

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

### Page Implementation Pattern

Pages should follow this structure:

```tsx
// Server Component Page
import { Suspense } from 'react';
import { ClientPart } from './components/client-part';

export default async function Page() {
  // Server-side data fetching
  const data = await getData();
  
  return (
    <main>
      {/* Static content rendered on server */}
      <h1>Page Title</h1>
      
      {/* Client component boundary with suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <ClientPart data={data} />
      </Suspense>
    </main>
  );
}
```

## Component Classification Guidelines

### Server Components
- Page layout components
- Data display components
- SEO-critical content
- Static UI elements
- Navigation structure (non-interactive parts)

### Client Components
- Interactive UI elements (buttons, forms, etc.)
- Components that use React hooks
- Animation containers
- Components that use browser-only APIs
- State management wrappers

## Optimization Techniques

1. **Suspense Boundaries**: Use Suspense to prevent the entire page from blocking on data fetching
2. **Parallel Data Fetching**: Start multiple data fetches in parallel when possible
3. **Streaming**: Use streaming responses for large data sets
4. **Component-level Caching**: Cache component-specific data with appropriate revalidation strategies

## Transitioning Existing Components

When converting existing components:

1. Remove the `"use client";` directive from components that don't need it
2. Extract interactive parts into separate Client Components
3. Update data fetching to use the `cache()` pattern
4. Use proper error boundaries and suspense for better UX

## Common Pitfalls

1. **Mixing Concerns**: Don't mix data fetching and interactive state in the same component
2. **Over-clientization**: Don't make entire components client components when only small parts need interactivity
3. **Props Serialization**: Remember that props passed from Server to Client Components must be serializable
4. **Missing Suspense**: Always wrap Client Components that depend on data in Suspense boundaries
