# Component System Architecture

This document outlines the component architecture for the Cyber Hand website, detailing how components are organized, their relationships, and the patterns used throughout the application. This architecture follows Next.js 15.2.4 and React 19 best practices.

## Component Principles

Our component architecture follows these core principles:

1. **Server-First Rendering** - Server Components by default, Client Components only when necessary
2. **Single Responsibility** - Each component has a clear, focused purpose
3. **Composition over Inheritance** - Building complex UIs through component composition
4. **Type Safety** - TypeScript interfaces for all component props
5. **Modularity** - Each component file under 500 lines of code

## Component Types

The application distinguishes between several types of components:

### Server Components (Default)

- Render on the server with no client-side JavaScript
- Handle data fetching and main rendering
- Have direct access to server resources
- Do not include client-side interactivity

```tsx
// Example Server Component
import { cache } from 'react';
import { Suspense } from 'react';
import { FeatureSkeleton } from '../ui/skeletons';

// Data fetching using cache for deduplication
const getData = cache(async () => {
  const res = await fetch('/api/data');
  return res.json();
});

export default async function FeatureComponent() {
  // Fetch data directly in the component
  const data = await getData();
  
  return (
    <section>
      <h2>{data.title}</h2>
      <Suspense fallback={<FeatureSkeleton />}>
        <SubFeatureList items={data.items} />
      </Suspense>
    </section>
  );
}
```

### Client Components

- Include the `'use client'` directive at the top of the file
- Handle interactivity and browser-specific functionality
- Use React hooks for state and lifecycle management including React 19's new hooks
- Placed at leaf nodes of the component tree when possible
- Do not import Server Components (will cause a build error)
- Use the new Form component with useFormState for form handling

```tsx
// Example Client Component
'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/theme-context';

interface InteractiveFeatureProps {
  initialValue: number;
  onUpdate?: (value: number) => void;
}

export function InteractiveFeature({ initialValue, onUpdate }: InteractiveFeatureProps) {
  const [value, setValue] = useState(initialValue);
  const { theme } = useTheme();
  
  const handleClick = () => {
    const newValue = value + 1;
    setValue(newValue);
    if (onUpdate) onUpdate(newValue);
  };
  
  return (
    <button
      onClick={handleClick}
      className={theme === 'dark' ? 'btn-dark' : 'btn-light'}
    >
      Count: {value}
    </button>
  );
}

// Example of form handling with Next.js 15 Form component
'use client';

import { useFormState } from 'react-dom';
import { submitForm } from '@/app/actions'; // Server Action

export function ContactForm() {
  // Use the new useFormState hook with a Server Action
  const [state, formAction] = useFormState(submitForm, { success: false, errors: {} });
  
  return (
    <form action={formAction}>
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
      
      <button type="submit">Submit</button>
      
      {state.success && <p className="success">Form submitted successfully!</p>}
    </form>
  );
}
```

### Client Component Wrappers

- Special pattern for components that need client interactivity but are used in server contexts
- Prevents serialization errors by properly separating client and server code
- Uses dynamic imports for client-only features
- With Next.js 15's improved hydration error debugging, these patterns are even more important
- React 19's enhanced error messages help identify component serialization issues

```tsx
// InteractiveFeatureWrapper.tsx (Client Component)
'use client';

import { useState } from 'react';
import { InteractiveFeature, InteractiveFeatureProps } from './interactive-feature';

export function InteractiveFeatureWrapper(props: InteractiveFeatureProps) {
  const [state, setState] = useState<number>(props.initialValue);
  
  const handleUpdate = (newValue: number) => {
    setState(newValue);
    if (props.onUpdate) props.onUpdate(newValue);
  };
  
  return <InteractiveFeature {...props} onUpdate={handleUpdate} />;
}

// Usage in a Server Component
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicInteractiveFeature = dynamic(() => 
  import('./interactive-feature-wrapper').then(mod => mod.InteractiveFeatureWrapper),
  { ssr: false } // Optionally disable SSR for this component
);

export default function ServerPageComponent() {
  return (
    <div>
      <h1>Server Component</h1>
      <Suspense fallback={<div>Loading interactive feature...</div>}>
        <DynamicInteractiveFeature initialValue={0} />
      </Suspense>
    </div>
  );
}
```

## Component Hierarchy

The component hierarchy follows a clear structure:

```
├── Layout Components
│   ├── Page Components
│   │   ├── Section Components
│   │   │   ├── Feature Components
│   │   │   │   ├── UI Components
```

### Layout Components

- Define the overall structure of the application
- Implement global UI elements like navigation and footer
- Handle responsive layout adjustments
- Example: `RootLayout`, `PageLayout`

### Page Components

- Correspond to routes in the application
- Orchestrate data fetching and section composition
- Implement page-specific metadata
- Example: `HomePage`, `CaseStudyPage`

### Section Components

- Represent major sections of a page
- Combine multiple feature components into cohesive units
- Implement section-specific styling
- Example: `HeroSection`, `ServicesSection`

### Feature Components

- Implement specific features or domain concepts
- Handle feature-specific logic and state
- Example: `CaseStudyCard`, `ServiceFeature`

### UI Components

- Reusable, generic UI elements
- Focus on presentation and interaction
- Highly reusable across the application
- Example: `Button`, `Card`, `Skeleton`

## Component Organization

Components are organized in the directory structure as follows:

```
/components
├── /case-studies        # Case study domain components
├── /custom              # Application-specific components
├── /location            # Geolocation related components
└── /ui                  # Generic UI components
    ├── /inputs
    ├── /layout
    ├── /navigation
    ├── /feedback
    └── /skeletons       # Loading state components
```

Each component has a consistent file organization:

```
/component-name
├── component-name.tsx           # Main component implementation
├── component-name.module.css    # Component-specific styles (if needed)
├── component-name.types.ts      # TypeScript interfaces (for complex components)
└── component-name.test.tsx      # Component tests
```

## Component Composition Patterns

The application uses several composition patterns:

### Composition through Props

```tsx
// Server Component parent passing data to children
async function Parent() {
  // In Next.js 15, GET Route Handlers aren't cached by default
  // Explicitly opt-in to caching if needed
  const data = await fetchData();
  return <Child data={data} />;
}
```

### Composition through Children

```tsx
// Wrapper component that accepts and renders children
// TypeScript with React 19 - proper typing for children
function Container({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>;
}

// Usage
<Container>
  <Child1 />
  <Child2 />
</Container>
```

### Composition through Suspense

```tsx
// Next.js 15 best practice for loading states
function ProductPage({ id }: { id: string }) {
  return (
    <div>
      <h1>Product Details</h1>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={id} />
      </Suspense>
      
      <h2>Related Products</h2>
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts productId={id} />
      </Suspense>
    </div>
  );
}
```

### Composition with Server Actions

```tsx
// Server action defined separately - Next.js 15 pattern
'use server';
export async function submitData(formData: FormData) {
  // Process form data
  return { success: true };
}

// Client component using the server action
'use client';
import { useFormState } from 'react-dom';
import { submitData } from './actions';

export function DataForm() {
  const [state, formAction] = useFormState(submitData, {});
  return <form action={formAction}>...</form>;
}
```

## Component Testing

Components are tested using Jest and React Testing Library with a focus on:

- Behavior over implementation details
- Accessibility
- User interactions
- Component composition

```tsx
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Component Documentation

Components should be documented with:

- JSDoc comments for the component and its props
- Examples of usage
- Notes about state management or side effects
- Accessibility considerations

```tsx
/**
 * Button component that follows the design system guidelines.
 * 
 * @param variant - The visual style of the button
 * @param size - The size of the button
 * @param children - The content of the button
 * @param onClick - Function called when the button is clicked
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}: ButtonProps) {
  // Implementation
}
```

## Related Documentation

For more information on specific component areas, see:

- [Server Components](../features/server-components.md)
- [Geolocation Components](../features/geolocation.md)
- [Streaming Implementation](../features/streaming.md)
- [Component Update Template](../templates/component-template.md)
