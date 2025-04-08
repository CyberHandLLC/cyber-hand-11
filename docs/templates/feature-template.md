# Feature Template

> This template provides a standardized structure for implementing new features in the Cyber Hand project. Follow this guide to ensure consistency, maintainability, and adherence to Next.js 15 best practices.

## Feature Overview

| Field | Description |
|-------|-------------|
| **Name** | [Feature name] |
| **Route Path** | [URL path for the feature, e.g., /features/example] |
| **Priority** | [High/Medium/Low] |
| **Dependencies** | [List of dependencies or related features] |
| **Required Components** | [Components needed for this feature] |
| **Author** | [Your name] |
| **Target Completion** | [Target date] |

## Feature Requirements

- [ ] Feature aligns with project goals
- [ ] Feature follows the Next.js 15 App Router architecture
- [ ] Feature implements streaming for data-dependent UI
- [ ] Feature leverages Server Components for data fetching
- [ ] Feature handles accessibility requirements
- [ ] Feature optimizes for Core Web Vitals
- [ ] Feature includes proper SEO metadata

## Implementation Structure

```
app/
└── [feature-name]/
    ├── page.tsx             # Main Server Component page
    ├── layout.tsx           # Optional layout for feature
    ├── loading.tsx          # Loading UI with skeleton components
    ├── error.tsx            # Error handling component
    ├── not-found.tsx        # Not found page (if needed)
    ├── actions.ts           # Server Actions for data mutations
    ├── api/                 # Optional API routes for external clients
    │   └── route.ts         # API Route Handler for REST APIs
    └── components/          # Feature-specific components
        ├── [component1].tsx # Server Components (default)
        ├── [component2].tsx # Keep each under 500 lines
        └── client/          # Client Components directory
            └── [interactive].tsx # Client Components with 'use client'
lib/
└── [feature-name]/         # Feature-specific utils/services
    ├── types.ts            # TypeScript types for the feature
    ├── api.ts              # API functions for data fetching
    ├── utils.ts            # Utility functions
    └── constants.ts        # Feature-specific constants
ui/
└── [feature-name]/         # Shared UI components for the feature
    ├── skeleton.tsx        # Skeleton loading components
    └── error-fallback.tsx  # Error fallback components
```
```

## Implementation Steps

1. **Plan the Feature**: Outline the components and data flow
2. **Create Basic Structure**: Set up the directory structure following App Router conventions
3. **Define TypeScript Types**: Create type definitions for the feature data models
4. **Implement Data Fetching**: Create server-side data fetching functions with proper caching
5. **Build Server Components**: Implement the main UI with Server Components
6. **Structure Streaming Strategy**: Plan Suspense boundaries for optimal streaming
7. **Create Loading States**: Implement loading.tsx with skeleton components
8. **Add Error Handling**: Implement error.tsx and component-level error boundaries
9. **Handle Not Found States**: Implement not-found.tsx for non-existent data
10. **Add Client Interactivity**: Create Client Components only where needed
11. **Implement Server Actions**: Add secure server-side data mutations
12. **Add Accessibility Features**: Ensure keyboard navigation and ARIA attributes
13. **Optimize Performance**: Review for Core Web Vitals optimization
14. **Add SEO Metadata**: Implement metadata using Next.js 15 Metadata API
15. **Add Documentation**: Update necessary documentation

## Server Component Page Example

```tsx
// app/[feature-name]/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { Feature } from './components/feature';
import { FeatureSkeleton } from './components/feature-skeleton';
import { ContentErrorBoundary } from '@/components/error-boundary';

// Static or dynamic metadata
export const metadata: Metadata = {
  title: 'Feature Name | Cyber Hand',
  description: 'Description of the feature',
};

// Or use generateMetadata for dynamic metadata:
// export async function generateMetadata({ params }): Promise<Metadata> { ... }

export default function FeaturePage() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Feature Name</h1>
      
      {/* Static content renders immediately */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">About This Feature</h2>
        <p>Static descriptive content about this feature...</p>
      </section>
      
      {/* Dynamic content streams in with proper error handling */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dynamic Content</h2>
        <ContentErrorBoundary>
          <Suspense fallback={<FeatureSkeleton />}>
            <Feature />
          </Suspense>
        </ContentErrorBoundary>
      </section>
    </main>
  );
}
```

## Loading State Example

```tsx
// app/[feature-name]/loading.tsx
import { SkeletonHeader, SkeletonText, SkeletonCard } from '@/components/ui/skeleton';

export default function FeatureLoading() {
  return (
    <div className="animate-pulse space-y-8 py-12">
      <SkeletonHeader />
      <div className="space-y-4">
        <SkeletonText width="70%" />
        <SkeletonText width="90%" />
        <SkeletonText width="60%" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
```

## Server Actions Example

```tsx
// app/[feature-name]/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Data validation schema
const FormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/**
 * Server Action for form submission
 * Uses explicit typings and validation with Zod
 * Next.js 15 will automatically create a secure ID for this action
 */
export async function submitForm(formData: FormData) {
  // Convert FormData to a plain object
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };
  
  // Validate the data
  const result = FormSchema.safeParse(rawData);
  
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  
  try {
    // Security check (example)
    // Always implement proper authorization for Server Actions
    // if (!isAuthorized()) {
    //   return { success: false, errors: { form: ['Unauthorized access'] } };
    // }
    
    // Process the validated data
    const savedData = await saveFormSubmission(result.data);
    
    // Revalidate the page to reflect changes
    revalidatePath('/feature-name');
    
    // Optional: Redirect after submission
    // redirect(`/feature-name/thank-you/${savedData.id}`);
    
    return { success: true, data: savedData };
  } catch (error) {
    // Log error server-side but don't expose details to client
    console.error('Form submission error:', error);
    
    return { 
      success: false, 
      errors: { form: ['Failed to submit. Please try again.'] } 
    };
  }
}

// Internal function to save data
async function saveFormSubmission(data: z.infer<typeof FormSchema>) {
  // Implementation details for saving data
  // Return saved data
  return { id: 'generated-id', ...data };
}
```

## Feature Component Example

```tsx
// app/[feature-name]/components/feature.tsx
import { getFeatureData } from '@/lib/feature-name/api';
import { FeatureItem } from './feature-item';
import type { FeatureData } from '@/lib/feature-name/types';

export async function Feature() {
  // Data fetching in Server Component
  const data = await getFeatureData();
  
  return (
    <div className="feature-container">
      <div className="feature-content">
        {data.map((item: FeatureData) => (
          <FeatureItem 
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
```

## Interactive Component Example

```tsx
// app/[feature-name]/components/interactive-element.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitForm } from '../actions';

export function InteractiveElement() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="interactive-element">
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Details' : 'Show Details'}
      </Button>
      
      {isOpen && (
        <div className="mt-4 p-4 border rounded">
          <p>Additional details or interactive content...</p>
        </div>
      )}
    </div>
  );
}
```

## Data Fetching Example

```tsx
// lib/[feature-name]/api.ts
import { cache } from 'react';
import type { FeatureData } from './types';

/**
 * Use React's cache for request deduplication
 * This helps prevent redundant requests when a function is called
 * multiple times in a React component tree
 */
export const getFeatureData = cache(async (): Promise<FeatureData[]> => {
  // Fetch from API or database
  const response = await fetch('https://api.example.com/feature-data', {
    // Next.js 15 fetch options for caching
    next: {
      // Explicit opt-in to caching with revalidation period
      // Note: in Next.js 15, you must explicitly opt-in to caching
      revalidate: 60, // Revalidate every 60 seconds
      // tags: ['feature-data'], // Optional: for targeted revalidation
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch feature data: ${response.statusText}`);
  }
  
  return response.json();
});

/**
 * Fetch parallel data for a specific page
 * Using Promise.all for concurrent fetching
 */
export async function getFeaturePageData(): Promise<{ 
  mainData: FeatureData[],
  relatedData: FeatureData[],
}> {
  // Start fetches in parallel
  const mainDataPromise = getFeatureData();
  const relatedDataPromise = getRelatedFeatureData();
  
  // Wait for both to complete
  const [mainData, relatedData] = await Promise.all([
    mainDataPromise,
    relatedDataPromise,
  ]);
  
  return { mainData, relatedData };
}

/**
 * Get a specific feature item by ID
 * Handles 404 gracefully for the not-found pattern
 */
export async function getFeatureItemById(id: string): Promise<FeatureData | null> {
  // Fetch specific item
  const response = await fetch(`https://api.example.com/feature-data/${id}`, {
    next: { revalidate: 60 },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null; // For handling with notFound() in the route
    }
    throw new Error(`Failed to fetch feature item: ${response.statusText}`);
  }
  
  return response.json();
}

// Helper function for the example above
async function getRelatedFeatureData(): Promise<FeatureData[]> {
  const response = await fetch('https://api.example.com/related-features', {
    next: { revalidate: 60 },
  });
  
  if (!response.ok) {
    return []; // Return empty array on error rather than failing
  }
  
  return response.json();
}
```

## TypeScript Types Example

```tsx
// lib/[feature-name]/types.ts
export interface FeatureData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  category: FeatureCategory;
  metadata: FeatureMetadata;
}

export type FeatureCategory = 'type1' | 'type2' | 'type3';

export interface FeatureMetadata {
  sortOrder: number;
  isPublished: boolean;
  tags: string[];
}

export interface FeatureContextType {
  items: FeatureData[];
  selectedItem: string | null;
  setSelectedItem: (id: string | null) => void;
}
```

## Best Practices Checklist

- [ ] Follow the server-first approach: Server Components for data fetching
- [ ] Use Client Components only at leaf nodes where interactivity is needed
- [ ] Implement streaming with Suspense boundaries for data-dependent UI
- [ ] Create standard loading UI with skeleton components
- [ ] Add proper error handling and recovery mechanisms
- [ ] Optimize data fetching with React's cache() and parallel requests
- [ ] Use Next.js 15's Form component for form handling where appropriate
- [ ] Implement SEO metadata using Next.js Metadata API
- [ ] Ensure accessibility compliance (ARIA attributes, keyboard navigation)
- [ ] Maintain performance budget (LCP < 2.5s, TBT < 200ms, CLS < 0.1)
- [ ] Keep all files under 500 lines of code
- [ ] Use proper TypeScript types (avoid any)
- [ ] Document all public functions and components

## Related Documentation

- [Code Standards](/docs/getting-started/code-standards.md)
- [Component Template](/docs/templates/component-template.md)
- [Streaming Guide](/docs/features/streaming.md)
- [Accessibility Guide](/docs/guides/accessibility.md)
- [SEO Guide](/docs/guides/seo.md)

## Feature Review Criteria

When reviewing a feature implementation, consider:

1. **Architecture**: Does it follow the Next.js 15 App Router architecture?
2. **Performance**: Does it implement streaming and optimize for Core Web Vitals?
3. **Accessibility**: Does it follow accessibility best practices?
4. **SEO**: Does it implement proper metadata and structured data?
5. **Code Quality**: Is the code clean, well-documented, and maintainable?
6. **Type Safety**: Does it have comprehensive TypeScript types?
7. **Testing**: Has the feature been manually verified across browsers and devices?
