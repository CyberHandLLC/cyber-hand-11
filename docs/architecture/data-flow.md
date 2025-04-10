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

For data fetching functions, we use React's `cache()` function to deduplicate requests and implement parallel data fetching when appropriate. Note that Next.js 15.2.4 introduced an opt-in caching model for `fetch()` calls that requires explicit configuration:

```tsx
// lib/products.ts
import { cache } from "react";
import { type Product } from "@/types";

/**
 * React's cache() function ensures this request is deduplicated
 * when called multiple times in the component tree during a single render
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  const res = await fetch("https://api.example.com/products", {
    // Next.js 15.2.4 requires explicit opt-in for caching
    next: { 
      revalidate: 60, // Cache for 60 seconds
      tags: ['products'] // Tag for targeted revalidation
    }
  });
  
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
});
```

### Explicit Caching Model in Next.js 15.2.4

Next.js 15.2.4 changed to an opt-in caching model for `fetch()`. Caching is no longer automatic but requires explicit configuration:

```tsx
// Cached for 60 seconds with time-based revalidation
fetch(url, { next: { revalidate: 60 } })

// Cached indefinitely until manually revalidated via tags
fetch(url, { next: { tags: ['collection'] } })

// Cached between page refreshes only (force-cache)
fetch(url, { cache: 'force-cache' })

// Never cached (no-store)
fetch(url, { cache: 'no-store' })
```

To revalidate tagged data, use the revalidateTag function:

```tsx
// In a Server Action or Route Handler
import { revalidateTag } from 'next/cache';

export async function updateProduct() {
  'use server';
  // Update data
  await db.product.update(...);
  
  // Revalidate all fetches with this tag
  revalidateTag('products');
}
```

### Parallel Data Fetching

To prevent waterfalls, we fetch data in parallel using Promise.all:

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch data in parallel
  const [user, products, orders] = await Promise.all([
    getUser(),
    getProducts(),
    getOrders()
  ]);

  return (
    <Dashboard 
      user={user}
      products={products}
      orders={orders}
    />
  );
}
```

### Client-Side Data Fetching

While we prefer Server Components for data fetching, some scenarios require client-side data fetching:

- Real-time data with WebSockets/SSE
- User-specific data post-authentication
- Polling for updates
- Data that depends on client-side user interactions

For these cases, we use the SWR pattern:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function UserDashboard() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/user-data")
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {userData?.name}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Server Actions

For data mutations, we use Server Actions following Next.js 15.2.4 best practices:

```tsx
// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Strong schema validation for form data
const productSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  description: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  // Validate form data with zod schema
  const rawData = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    description: formData.get("description") || "",
  };

  try {
    const data = productSchema.parse(rawData);
    
    // Get authenticated user from session
    const supabase = createServerActionClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Unauthorized");
    }
    
    // Insert product into database
    const { error } = await supabase.from("products").insert({
      ...data,
      user_id: session.user.id,
    });
    
    if (error) throw new Error(error.message);
    
    // Revalidate relevant paths to update UI
    revalidatePath("/products");
    
    // Redirect to products page
    redirect("/products");
  } catch (error) {
    // Handle validation errors
    return { 
      error: error instanceof Error ? error.message : "Failed to create product"
    };
  }
}
```

### Data Revalidation Strategies

We implement multiple revalidation strategies based on the data type:

1. **Time-based revalidation** - For data that changes predictably
2. **On-demand revalidation** - For data updated through user actions
3. **Tag-based revalidation** - For related data that should update together

```tsx
// Implementing tag-based revalidation
export async function publishArticle(formData: FormData) {
  'use server';
  
  const article = await db.article.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    }
  });
  
  // Revalidate multiple tags at once
  revalidateTag('articles');
  revalidateTag(`article-${article.id}`);
  revalidateTag('sitemap');
  
  return true; // Placeholder
}
```

### API Route Handlers in Next.js 15.2.4

Next.js 15.2.4 introduces improved Route Handlers with better Promise handling and type safety:

```tsx
// app/api/products/route.ts
export async function GET(request: Request) {
  // URL and SearchParams handling
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Type-safe responses
  try {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    return Response.json(
      { error: 'Internal error' }, 
      { status: 500 }
    );
  }
}

// Cleaner POST handling with structured data
export async function POST(request: Request) {
  try {
    // Structured data parsing with zod
    const body = await request.json();
    const data = productSchema.parse(body);
    
    const product = await db.product.create({ data });
    
    // Headers and status in one response
    return Response.json(product, { 
      status: 201,
      headers: {
        'Location': `/api/products/${product.id}`
      }
    });
  } catch (error) {
    // Error handling
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 400 }
    );
  }
}
```

### Edge Runtime for Geolocation

For location-aware features, our application correctly uses the Edge runtime in middleware and API routes:

```tsx
// middleware.ts or app/api/geo/route.ts

// Required for geolocation access on Vercel
export const runtime = "experimental-edge";

// Extended request type with Vercel geolocation
interface VercelGeoRequest extends Request {
  geo?: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
  }
}

// Edge API route with geolocation access
export async function GET(request: Request) {
  const geoRequest = request as VercelGeoRequest;
  const geo = geoRequest.geo || null;
  
  // Use geolocation data
  return Response.json({
    location: geo?.city ? `${geo.city}, ${geo.region}` : 'Unknown',
    detected: Boolean(geo)
  });
}
```

Key implementation requirements:
1. Middleware must be marked with `export const runtime = "experimental-edge"` 
2. All geolocation-dependent routes must use Edge runtime
3. Development mocking must be implemented for local testing
4. Proper type extensions must be used for the Vercel request object

### Authentication Data Flow

Our authentication flow using Supabase follows these steps:

```typescript
// Cached data fetching with proper auth checks
const getClientData = cache(async () => {
  const supabase = createServerComponentClient({ cookies });
  
  // Session check handled by middleware and RLS
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      name,
      email,
      created_at,
      service_requests(id, status, service_type),
      subscriptions(id, status, current_period_end)
    `);
  
  if (error) throw new Error(error.message);
  return data;
});
```

### Service Request Flow

Service requests follow this data flow pattern:

```typescript
// Server action for submitting service request
export async function submitServiceRequest(formData: FormData) {
  'use server';
  
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  
  // Validate input with Zod
  const data = serviceRequestSchema.parse({
    serviceType: formData.get('serviceType'),
    details: formData.get('details'),
    clientId: session.user.id
  });
  
  // Store in Supabase with proper RLS
  const { error } = await supabase
    .from('service_requests')
    .insert(data);
  
  if (error) throw new Error(error.message);
  
  // Revalidate affected paths
  revalidatePath('/dashboard/services');
  
  // Trigger notifications
  await sendNotification({
    type: 'service_request',
    userId: session.user.id
  });
}
```

### Payment Processing Flow

The payment flow follows these steps:

1. **Initiate Payment** - Server Action creates Stripe Checkout Session
2. **Process Payment** - Client redirected to Stripe Checkout
3. **Handle Webhook** - Stripe webhook notifies server of payment status
4. **Update Database** - Server updates subscription status in Supabase
5. **Notify Client** - Real-time notification via Supabase Realtime

### Admin Data Access Pattern

Admin dashboard implements specialized data access patterns:

```typescript
// Cached data fetching for admin dashboard with proper RLS
const getClientData = cache(async () => {
  const supabase = createServerComponentClient({ cookies });
  
  // Session check handled by middleware and RLS
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      name,
      email,
      created_at,
      service_requests(id, status, service_type),
      subscriptions(id, status, current_period_end)
    `);
  
  if (error) throw new Error(error.message);
  return data;
});
```

## Related Documentation

For more detailed information, refer to:

- [Server Components](../features/server-components.md)
- [Geolocation](../features/geolocation.md)
- [Dependency Map](./dependency-map.md)
- [Server Actions Documentation](https://nextjs.org/docs/app/api-reference/functions/server-actions)
- [Next.js 15.2.4 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)