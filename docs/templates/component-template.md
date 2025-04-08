# Component Template

> This template provides a standardized structure for creating new components in the Cyber Hand project. Follow this guide to ensure consistency, maintainability, and adherence to our Next.js 15 best practices.

## Component Details

| Field | Description |
|-------|-------------|
| **Name** | [PascalCase name of the component] |
| **Type** | [Server Component / Client Component] |
| **Location** | [Path where the component will live] |
| **Purpose** | [Brief description of the component's purpose] |
| **Dependencies** | [List of dependencies or related components] |
| **Author** | [Your name] |
| **Date** | [Creation date] |

## Component Requirements

- [ ] Component meets a specific UI/UX need
- [ ] Component follows the design system
- [ ] Component handles appropriate accessibility concerns
- [ ] Component has proper TypeScript types
- [ ] Server/Client component decision has been justified (default to Server Components)
- [ ] Data fetching follows Next.js recommended patterns (fetch in Server Components)
- [ ] Component structure follows recommended composition patterns
- [ ] Component avoids common anti-patterns (like Server Components with client-only features)

## Server or Client Component?

In Next.js 15, components are **Server Components by default**. This aligns with the recommended "server-first" approach from the Next.js team.

### When to use Server Components (default):
- Data fetching: Move data fetching closer to the data source
- Security: Keep sensitive data and logic on the server
- Caching: Rendered results can be cached and reused
- Performance optimization: Reduce client-side JavaScript
- Static rendering: Components with content that doesn't change often
- SEO: Content that needs to be indexed by search engines

### When to use Client Components (add `'use client'` directive):
- Interactivity: Components that use event listeners (`onClick`, etc.)
- State management: Components that use React state (`useState`, `useReducer`)
- Effects and lifecycles: Components that use effects (`useEffect`, `useLayoutEffect`)
- Browser APIs: Components that need access to browser-only APIs
- Custom hooks: Components using hooks that depend on state or effects
- Class components: Legacy class components that extend React.Component

### Component Nesting and Boundaries:
- Remember that once you add `'use client'`, all imported components and their children become part of the client bundle
- Try to push the `'use client'` directive as deep as possible in your component tree
- Create Client Component wrappers around interactive parts of your UI, keeping most logic in Server Components

## Component Structure

### Server Component Example

```tsx
// components/[category]/[component-name].tsx

import { OptimizedImage } from '@/components/ui/optimized-image';
import { formatDate } from '@/lib/utils';
import type { ComponentProps } from '@/types';

interface ExampleComponentProps {
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
}

/**
 * ExampleComponent - [Brief description]
 * 
 * This component [describe what it does and when to use it]
 * 
 * @example
 * <ExampleComponent 
 *   title="Example Title"
 *   description="This is an example description"
 *   date="2025-01-01"
 * />
 */
export function ExampleComponent({
  title,
  description,
  date,
  imageUrl,
}: ExampleComponentProps) {
  // Any server-side logic or data transformation goes here
  const formattedDate = date ? formatDate(date) : null;
  
  return (
    <div className="example-component">
      <h2 className="text-xl font-bold">{title}</h2>
      {imageUrl && (
        <OptimizedImage
          src={imageUrl}
          alt={`Image for ${title}`}
          width={400}
          height={300}
          className="my-4 rounded-lg"
        />
      )}
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
      {formattedDate && (
        <time dateTime={date} className="text-sm text-gray-500">
          {formattedDate}
        </time>
      )}
    </div>
  );
}
```

### Client Component Example

```tsx
// components/[category]/[component-name].tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ComponentProps } from '@/types';

interface InteractiveComponentProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

/**
 * InteractiveComponent - [Brief description]
 * 
 * This client component [describe what it does and when to use it]
 * 
 * @example
 * <InteractiveComponent 
 *   initialCount={5}
 *   onCountChange={(count) => console.log(`New count: ${count}`)}
 * />
 */
export function InteractiveComponent({
  initialCount = 0,
  onCountChange,
}: InteractiveComponentProps) {
  const [count, setCount] = useState(initialCount);
  
  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  };
  
  return (
    <div className="interactive-component p-4 border rounded-lg">
      <p className="text-lg font-medium">Current count: {count}</p>
      <Button 
        onClick={handleIncrement}
        className="mt-2"
      >
        Increment
      </Button>
    </div>
  );
}
```

## Best Practices Checklist

- [ ] Keep components focused on a single responsibility
- [ ] Use Server Components by default, Client Components only when necessary
- [ ] Include comprehensive TypeScript types (no `any`)
- [ ] Add detailed JSDoc comments
- [ ] Optimize for performance (memoization if needed)
- [ ] Ensure proper accessibility attributes
- [ ] Use consistent naming conventions:
  - PascalCase for component names
  - camelCase for props and functions
  - kebab-case for CSS classes
- [ ] Apply semantic HTML where appropriate
- [ ] Keep components under 500 lines of code
- [ ] Extract complex logic to custom hooks or utility functions
- [ ] Add examples in JSDoc comments

## Related Documentation

- [Code Standards](/docs/getting-started/code-standards.md)
- [Component System](/docs/architecture/component-system.md)
- [Accessibility Guide](/docs/guides/accessibility.md)

## Component Review Criteria

When reviewing a component, consider:

1. **Functionality**: Does it correctly implement all requirements?
2. **Reusability**: Is it designed to be reused where appropriate?
3. **Maintainability**: Is the code clear, well-documented, and easy to maintain?
4. **Performance**: Is it optimized for performance?
5. **Accessibility**: Does it follow accessibility best practices?
6. **Type Safety**: Does it have comprehensive TypeScript types?
7. **Separation of Concerns**: Is it appropriately sized and focused?
