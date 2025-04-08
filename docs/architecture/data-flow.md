# Data Flow Architecture

This document outlines how data flows through the Cyber Hand application, explaining the patterns used for data fetching, state management, and data persistence.

## Core Data Flow Principles

1. **Server-First Data Fetching** - Prioritize fetching data on the server with React Server Components
2. **Parallel Data Fetching** - Fetch data in parallel to prevent waterfalls
3. **Data Deduplication** - Use `cache()` function to avoid duplicate requests
4. **Progressive Loading** - Implement Suspense boundaries for improved UX during data fetching
5. **Type Safety** - Use TypeScript interfaces for all data structures

## Data Flow Patterns

### Server Component Data Fetching

Our primary data fetching pattern utilizes Server Components with `async/await` syntax. This approach:

- Moves data fetching to the server, closer to the data source
- Eliminates client-server waterfalls
- Prevents sensitive credentials from being exposed to the client
- Reduces client-side JavaScript bundle size
- Enables proper caching and revalidation strategies

According to Next.js 15 best practices, we fetch data directly in Server Components:

```tsx
// app/products/page.tsx
export default async function ProductsPage() {
  // Fetch data directly inside the component
  const products = await getProducts();
  
  return (
    <div className="products-container">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductList products={products} />
    </div>
  );
}
```

For data fetching functions, we use React's `cache()` function to deduplicate requests and implement parallel data fetching when appropriate:

```tsx
// lib/products.ts
import { cache } from 'react';
import { type Product } from '@/types';

/**
 * React's cache() function ensures this request is deduplicated
 * when called multiple times in the component tree during a single render
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  const res = await fetch('https://api.example.com/products', {
    // Next.js 15 requires explicit opt-in to caching
    next: { 
      revalidate: 60, // Revalidate every 60 seconds
      tags: ['products'], // For targeted revalidation with revalidateTag()
    },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  
  return res.json();
});

/**
 * Example of parallel data fetching to prevent waterfalls
 */
export async function getProductPageData(productId: string) {
  // Start both fetches in parallel
  const productPromise = getProductById(productId);
  const recommendationsPromise = getRecommendedProducts(productId);
  
  // Wait for both to complete
  const [product, recommendations] = await Promise.all([
    productPromise,
    recommendationsPromise,
  ]);
  
  return { product, recommendations };
}
```

### Server Actions for Data Mutations

For form submissions and data mutations, we use Server Actions as introduced in Next.js 15. Server Actions provide secure, server-side mutation capabilities with built-in security enhancements:

```tsx
// app/actions.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Data validation schema using Zod
const ProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.number().positive('Price must be positive'),
  description: z.string().optional(),
});

/**
 * Server Action for creating a new product
 * Next.js 15 automatically creates secure IDs for Server Actions
 * and implements CSRF protection
 */
export async function createProduct(formData: FormData) {
  // Type-safe data extraction and validation
  const rawData = {
    name: formData.get('name'),
    price: Number(formData.get('price')),
    description: formData.get('description') || '',
  };
  
  // Validate using Zod
  const validation = ProductSchema.safeParse(rawData);
  
  if (!validation.success) {
    return { 
      success: false, 
      errors: validation.error.flatten().fieldErrors 
    };
  }
  
  try {
    // Security check (authorization)
    const isAuthorized = await checkUserPermission('create:product');
    if (!isAuthorized) {
      return { success: false, errors: { _form: ['Not authorized'] } };
    }
    
    // Save to database with validated data
    const newProduct = await db.products.create(validation.data);
    
    // Revalidation strategies for cache invalidation
    revalidatePath('/products'); // Path-based revalidation
    revalidateTag('products');   // Tag-based revalidation
    
    // Optionally redirect after success
    // redirect(`/products/${newProduct.id}`);
    
    return { success: true, data: newProduct };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { 
      success: false, 
      errors: { _form: ['Failed to create product. Please try again.'] } 
    };
  }
}

// Helper function for permission check
async function checkUserPermission(permission: string): Promise<boolean> {
  // Implementation would check user session/token permissions
  return true; // Placeholder
}
```

### Client-Side Data Fetching

We use client-side data fetching only in these specific scenarios:

1. When data depends on client-side user interactions
2. For frequently changing data that doesn't need SEO indexing
3. For user-specific data that requires client credentials
4. For data that depends on browser-only APIs

According to Next.js 15 best practices, client-side fetching should be minimized and only used when necessary:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/user/profile');
        
        if (!res.ok) {
          throw new Error(`Failed to fetch user profile: ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (isMounted) {
          setUserData(data);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchUserData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);
  
  if (isLoading) {
    return <UserProfileSkeleton />;
  }
  
  if (error) {
    return <ErrorDisplay message={error} retry={() => setIsLoading(true)} />;
  }
  
  if (!userData) {
    return <div>No profile data available</div>;
  }
  
  return (
    <div className="user-profile-container">
      <h1 className="text-2xl font-semibold mb-4">{userData.name}'s Profile</h1>
      {/* User profile details */}
    </div>
  );
}
```

### Route Handler Data Flow

For external APIs and third-party integrations, we use Route Handlers that serve as API endpoints. In Next.js 15, Route Handlers have updated caching behavior where you must explicitly opt-in to caching:

```tsx
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkApiAuth } from '@/lib/auth';

// Schema for product validation
const ProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.number().positive('Price must be positive'),
  description: z.string().optional(),
});

/**
 * GET handler for products API
 * Note: In Next.js 15, Route Handlers are NOT cached by default
 * You must explicitly opt-in to caching if desired
 */
export async function GET(request: Request) {
  try {
    // Example: Parse search params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Example: You can use conditional caching based on parameters
    // const cacheOption = category ? 'no-store' : { next: { revalidate: 60 } };
    
    // Fetch products with optional filtering
    const products = await db.products.findMany({
      where: category ? { category } : undefined,
    });
    
    return NextResponse.json(products, {
      status: 200,
      headers: {
        // Optional caching headers
        'Cache-Control': 'max-age=0, s-maxage=60',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating products
 * This is dynamic (not cached) by default in Next.js 15
 */
export async function POST(request: Request) {
  try {
    // Authentication and authorization check
    const authResult = await checkApiAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    
    // Parse and validate the request body
    const rawData = await request.json();
    const validation = ProductSchema.safeParse(rawData);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    // Create the product with validated data
    const product = await db.products.create({
      data: validation.data,
      select: { id: true, name: true, price: true, createdAt: true },
    });
    
    return NextResponse.json(product, { 
      status: 201,
      headers: {
        // Set appropriate header for created resource
        'Location': `/api/products/${product.id}`
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

## Data Caching Strategies

The application uses several caching strategies aligned with Next.js 15's updated caching model:

### Caching Strategy

Our caching strategy in Next.js 15 balances performance and freshness. Note that Next.js 15 has changed the default caching behavior - you must explicitly opt-in to caching:

### Server Component Fetch Caching

In Next.js 15, fetch requests in Server Components are **NOT cached by default**. We explicitly enable caching when needed:

```tsx
// No caching (default in Next.js 15)
fetch('https://api.example.com/data')

// Cached with revalidation every 60 seconds (explicit opt-in)
fetch('https://api.example.com/data', { next: { revalidate: 60 } })

// Cached until manually revalidated via tags
fetch('https://api.example.com/data', { next: { tags: ['products'] } })

// Force dynamic (though this is already the default in Next.js 15)
fetch('https://api.example.com/data', { cache: 'no-store' })
```

### Manual Revalidation Methods

To manually revalidate cached data, we use one of these methods in Server Actions or Route Handlers:

```tsx
// In a Server Action or Route Handler
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate a specific path
revalidatePath('/products');

// Revalidate all fetch requests with a specific tag
revalidateTag('products');
```

### Route Handler Caching

In Next.js 15, Route Handlers are also **NOT cached by default**. To enable caching in a Route Handler:

```tsx
export async function GET() {
  // Explicitly opt in to caching
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  return Response.json(data);
}
```

### React Cache

The `cache()` function for request deduplication remains an important pattern:

```tsx
// Example of React's cache() function for request deduplication
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  const res = await fetch(`https://api.example.com/users/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch user ${id}`);
  return res.json();
});
```

## Related Documentation

For more detailed information, refer to:

- [Server Components](../features/server-components.md)
- [Geolocation](../features/geolocation.md)
- [Dependency Map](./dependency-map.md)
- [Server Actions Documentation](https://nextjs.org/docs/app/api-reference/functions/server-actions)
