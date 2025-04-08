# Code Standards & Best Practices

This document outlines the coding standards and best practices for the Cyber Hand website, aligned with Next.js 15's official recommendations. Following these guidelines ensures consistency, maintainability, and high quality throughout the codebase.

## TypeScript Standards

### Type Safety

- **Use explicit types** - Avoid `any` type; use proper interfaces and type definitions
- **Prefix unused variables** with underscore (e.g., `_unusedVar`)
- **Create interfaces** for component props and data structures
- **Export types** that are used across multiple files
- **Use type guards** for runtime type checking

```typescript
// ❌ Avoid
const data: any = fetchData();
function Component(props: any) { ... }

// ✅ Preferred
interface DataType {
  id: string;
  title: string;
  items: string[];
}

interface ComponentProps {
  data: DataType;
  onAction?: (id: string) => void;
}

const data: DataType = fetchData();
function Component({ data, onAction }: ComponentProps) { ... }
```

### File Organization

- **Keep files under 500 lines** - Split larger files into smaller, focused modules
- **Group related functionality** in the same directory
- **Use descriptive file names** that reflect the component's purpose
- **Use kebab-case** for file names (e.g., `user-profile.tsx`)
- **Use camelCase** for variable and function names
- **Use PascalCase** for component names, interfaces, and types

## React & Next.js Patterns

### Component Structure

- **Server vs. Client Components**
  - Default to Server Components for all components (Next.js App Router uses Server Components by default)
  - Use Client Components only when browser APIs or client-side interactivity is required
  - Add `'use client'` directive at the top of client component files
  - Keep Client Components at the leaf nodes of the component tree to minimize client-side JavaScript
  - Ensure you're not importing Server Components into Client Components (causes a build error)

```typescript
// server-component.tsx (Server Component - default, no directive needed)
export default function ServerComponent() {
  return <div>Server rendered content</div>;
}

// client-component.tsx
'use client';
import { useState } from 'react';

export default function ClientComponent() {
  const [count, setState] = useState(0);
  return <button onClick={() => setState(count + 1)}>Count: {count}</button>;
}
```

- **Client Component Wrappers**
  - Use wrapper components to prevent serialization errors
  - Create dedicated client wrappers for components that need interactivity

```typescript
// interactive-feature-wrapper.tsx (Client Component)
'use client';
import { useState } from 'react';
import { InteractiveFeature } from './interactive-feature';

export function InteractiveFeatureWrapper(props) {
  const [state, setState] = useState(initialState);
  return <InteractiveFeature {...props} state={state} setState={setState} />;
}

// interactive-feature.tsx (Components that can be shared)
export function InteractiveFeature({ state, setState, ...props }) {
  // Implementation
}
```

### Data Fetching

- **Fetch data on the server** whenever possible (closer to your data source)
- **Use React's cache() for deduplication** to avoid duplicate requests
- **Implement parallel data fetching** to avoid waterfalls
  - Start fetch requests before they're awaited
  - Use Promise.all() for parallel fetch requests
- **Handle errors gracefully** with proper error boundaries
- **Use suspense boundaries** around data-dependent UI for streaming
- **Prefer static rendering** when possible for better performance
- **Use dynamic rendering** when you need request-time information

```typescript
// Example of server-side data fetching with caching
import { cache } from 'react';

// Use cache() to deduplicate requests
export const getItem = cache(async (id: string): Promise<Item> => {
  // Next.js extends fetch with automatic caching and revalidation controls
  const res = await fetch(`/api/items/${id}`, {
    // Optional: Control caching behavior
    next: { revalidate: 3600 } // Revalidate every hour
    // Or use { cache: 'no-store' } for dynamic data
  });
  if (!res.ok) throw new Error('Failed to fetch item');
  return res.json();
});

// Parallel data fetching to prevent waterfalls
async function Page({ params }: { params: { id: string } }) {
  // Start fetch requests eagerly - this initiates them in parallel
  const itemPromise = getItem(params.id);
  const relatedItemsPromise = getRelatedItems(params.id);
  
  // Wait for both to complete
  const [item, relatedItems] = await Promise.all([
    itemPromise, 
    relatedItemsPromise
  ]);
  
  return <ItemDisplay item={item} relatedItems={relatedItems} />;
}
```

### Suspense & Streaming

- **Implement Suspense boundaries** strategically for progressive loading
- **Create standardized skeleton components** for consistent loading states
- **Ensure fallback UI matches final content dimensions** to prevent layout shifts
- **Use loading.js files** for route-level loading indicators
- **Break down components** into smaller chunks to optimize streaming
- **Use streaming for long data fetches** to improve UX
- **Consider the waterfall effect** when positioning Suspense boundaries
- **Apply Suspense selectively** to prevent blocking the entire UI

```tsx
// Page with Suspense boundaries for optimal streaming
import { Suspense } from 'react';
import { ItemSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';

export default function ItemPage({ params }: { params: { id: string } }) {
  return (
    <div className="layout">
      {/* Wrap data-fetching components in Suspense */}
      <Suspense fallback={<ItemSkeleton />}>
        <ItemDetail id={params.id} />
      </Suspense>
      
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar relatedTo={params.id} />
      </Suspense>
    </div>
  );
}

// In a separate loading.js file (route level loading UI)
export default function Loading() {
  // This UI is shown for the entire route segment during loading
  return (
    <div className="full-page-loading">
      <PageSkeleton />
    </div>
  );
}
```

## Performance Standards

- **Core Web Vitals targets**:
  - Largest Contentful Paint (LCP): < 2.5s
  - Total Blocking Time (TBT): < 200ms
  - Cumulative Layout Shift (CLS): < 0.1
  
- **JavaScript bundle size**: < 300KB for initial load
- **Initial page load**: < 3s on 3G connections

### Performance Techniques

- **Use Next.js Image component** for automatic optimization
- **Implement code splitting** with dynamic imports
- **Optimize font loading** with proper font display strategies
- **Minimize layout shifts** by reserving space for dynamic content
- **Use the `webVitals` function** to monitor performance in production

## Styling Standards

- **Use CSS Modules + CSS Variables** for component styling
- **Follow mobile-first responsive design** principles
- **Use theme-based styling** with centralized CSS variables
- **Implement proper dark mode support** with theme context

```css
/* Example of theme-based CSS variables */
:root {
  --color-primary: #0070f3;
  --color-text: #333;
  --color-background: #fff;
}

[data-theme='dark'] {
  --color-primary: #3694ff;
  --color-text: #f0f0f0;
  --color-background: #111;
}
```

## Quality Verification

- **Manual verification** for utility functions and hooks
- **UI verification** for component interactions
- **End-to-end verification** for critical user flows
- **Verify both light and dark themes** where relevant

```typescript
// Example component structure with accessibility attributes
'use client';

import { useState } from 'react';

export function Button({ 
  children, 
  onClick, 
  className,
  'aria-label': ariaLabel,
  ...props
}) {
  // Implementation with proper accessibility attributes
  return (
    <button
      className={`btn ${className || ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Accessibility Standards

- **Ensure WCAG 2.1 AA compliance** throughout the application
- **Use semantic HTML elements** whenever possible
- **Implement proper ARIA attributes** when needed 
- **Ensure keyboard navigability** for all interactive elements
- **Test with screen readers** during development
- **Use Next.js Image component** with proper alt text
- **Implement focus management** for interactive components
- **Ensure sufficient color contrast** in both light and dark themes
- **Test with reduced motion preferences** for animations

```tsx
// Example of accessible interactive component
'use client';

import { useState } from 'react';

export function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="accordion">
      <button
        className="accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
      >
        {title}
        <span className="icon">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      <div 
        id="accordion-content"
        className="accordion-content"
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}
```

## Documentation Standards

- **Add JSDoc comments** to functions and components
- **Document complex logic** with inline comments
- **Update documentation** when making significant changes
- **Include examples** for reusable components

```typescript
/**
 * Fetches data with automatic caching and revalidation
 * 
 * @param url - The URL to fetch from
 * @param options - Additional fetch options
 * @returns The fetched data
 * 
 * @example
 * ```ts
 * const data = await fetchWithCache('/api/products');
 * ```
 */
export async function fetchWithCache<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  // Implementation
}
```

## Code Review Checklist

Before submitting a pull request, ensure your code:

1. ✅ Follows TypeScript best practices with proper types
2. ✅ Maintains or improves current performance metrics
3. ✅ Uses Server Components by default, Client Components only when needed
4. ✅ Implements proper error handling and loading states with Suspense
5. ✅ Uses parallel data fetching where appropriate to prevent waterfalls
6. ✅ Meets accessibility standards
7. ✅ Has appropriate tests for both server and client components
8. ✅ Updates documentation when needed
9. ✅ Maintains or improves Lighthouse scores (Performance > 90, Accessibility > 90)
10. ✅ Properly uses React hooks in Client Components with proper dependencies
11. ✅ Minimizes client-side JavaScript bundle size
12. ✅ Implements proper authentication and authorization in Server Actions
13. ✅ Uses the new Form component for form submissions where appropriate
14. ✅ Explicitly opts into caching for Route Handlers when needed
15. ✅ Follows Next.js 15's Route Handler conventions (no default caching)

### Server Actions for Mutations

Server Actions are used for data mutations with enhanced security in Next.js 15:

```tsx
// Example of a Server Action for form submission
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Data validation schema
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Next.js 15 enables better type safety with server actions
export async function submitContactForm(formData: FormData) {
  // Convert FormData to a plain object
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };
  
  // Validate the data
  const result = ContactFormSchema.safeParse(rawData);
  
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  
  try {
    // Process the validated data
    const data = await saveContactSubmission(result.data);
    
    // Revalidate the page to reflect changes
    revalidatePath('/contact');
    
    // Optional: Redirect after successful submission
    // redirect(`/contact/thank-you/${data.id}`);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      errors: { form: ['Failed to submit the form. Please try again.'] } 
    };
  }
}
```

### Form Component with Server Actions

Next.js 15 introduces the official Form component with built-in integration for Server Actions:

```tsx
// In a Client Component
'use client';

// Import the Form component and useFormState hook
import { useFormState } from 'react-dom';
import { Form } from 'next/form';
import { submitContactForm } from './actions';

export function ContactForm() {
  // Initialize form state with the server action and initial state
  const [state, formAction] = useFormState(submitContactForm, { success: false });
  
  return (
    <Form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />
        {state.errors?.name && <p className="error">{state.errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
        {state.errors?.email && <p className="error">{state.errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required />
        {state.errors?.message && <p className="error">{state.errors.message}</p>}
      </div>
      
      <button type="submit">Submit</button>
      
      {state.success && <p className="success">Thank you for your message!</p>}
    </Form>
  );
}
```

### Enhanced Security for Server Actions

Next.js 15 significantly improves Server Action security with:

1. **Secure Action IDs** - Next.js creates encrypted, non-deterministic IDs for Server Actions that are periodically recalculated between builds. These IDs are used to allow the client to reference and call Server Actions securely.

2. **Dead Code Elimination** - Unused Server Actions are automatically removed from the client bundle during build, preventing public access by third parties.

3. **Hash-based Verification** - Prevents unauthorized invocation of Server Actions with cryptographic verification.

4. **Improved CSRF Protection** - Additional safeguards against cross-site request forgery attacks built into the form submission process.

5. **Content Security Policy Support** - Better integration with CSP rules for enhanced security.

```tsx
// app/actions.js
'use server'
 
// This action IS used in our application, so Next.js
// will create a secure ID to allow the client to call it
export async function updateUserAction(formData) {
  // Implementation
}
 
// This action is NOT used anywhere, so Next.js will
// automatically remove it during build and not create a public endpoint
export async function unusedAction(formData) {
  // This code will be eliminated during build
}
```

> **Important**: Even with these security enhancements, treat Server Actions like public HTTP endpoints and implement proper authentication and authorization checks.
