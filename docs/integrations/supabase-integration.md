# Supabase Integration Guide

> This document provides comprehensive guidance on Supabase integration patterns in the Cyber Hand website. It follows best practices from both Next.js 15.2.4 and Supabase for efficient and secure database integration.

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Setup and Configuration](#setup-and-configuration)
3. [Database Schema](#database-schema)
4. [Data Access Patterns](#data-access-patterns)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [Server Components Integration](#server-components-integration)
7. [Performance Optimization](#performance-optimization)
8. [Deployment Considerations](#deployment-considerations)
9. [Security Best Practices](#security-best-practices)
10. [Troubleshooting](#troubleshooting)

## Integration Overview

Supabase provides the backend database and authentication infrastructure for the Cyber Hand website. Key features used include:

- **PostgreSQL Database**: For structured content storage
- **Row-Level Security (RLS)**: For secure data access controls
- **Supabase Auth**: For authentication (when applicable)
- **Realtime Functionality**: For live updates (when applicable)
- **Storage**: For file uploads and management (when applicable)

## Setup and Configuration

### Environment Variables

The following environment variables are used for Supabase integration:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> # Only used in secure server-side contexts
```

### Supabase Client Setup

We use two client initialization approaches:

#### 1. Server-Side Client (for Server Components)

```typescript
// lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
```

#### 2. Client-Side Client (for Client Components)

```typescript
// lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## Database Schema

Our Supabase database follows this schema design:

### Content Tables

| Table        | Description                | Primary Data                                             |
| ------------ | -------------------------- | -------------------------------------------------------- |
| services     | Main services offered      | title, description, slug, image_url                      |
| case_studies | Case study portfolio items | title, description, client, industry, image_url, content |
| locations    | Service locations          | name, slug, coordinates, service_availability            |
| testimonials | Client testimonials        | client_name, role, content, rating                       |
| team_members | Team information           | name, title, bio, image_url, skills                      |

### Supporting Tables

| Table               | Description              | Primary Data                                     |
| ------------------- | ------------------------ | ------------------------------------------------ |
| categories          | Content categorization   | name, slug, description                          |
| industries          | Industry classifications | name, slug, description                          |
| contact_submissions | Contact form submissions | name, email, message, service_interest, location |

## Data Access Patterns

### Server Components Data Fetching

For Server Components, we use React's `cache()` function to optimize data fetching:

```typescript
// lib/data/services.ts
import { cache } from "react";
import { createServerClient } from "@/lib/supabase/server";

export const getServices = cache(async () => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(`Error fetching services: ${error.message}`);

  return data;
});
```

### Parallel Data Fetching

Next.js 15 allows parallel data fetching in Server Components:

```typescript
// app/services/page.tsx
import { getServices } from '@/lib/data/services'
import { getLocations } from '@/lib/data/locations'

export default async function ServicesPage() {
  // These data fetches happen in parallel
  const [services, locations] = await Promise.all([
    getServices(),
    getLocations()
  ])

  // Render with data
  return (/* ... */)
}
```

### Server Actions for Data Mutations

We use Server Actions for form submissions and data mutations:

```typescript
// lib/actions/contact-form.ts
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Form validation schema
const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  service: z.string().optional(),
  location: z.string().optional(),
});

export async function submitContactForm(formData: FormData) {
  // Validate form data
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    service: formData.get("service"),
    location: formData.get("location"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  try {
    const supabase = createServerClient();

    const { error } = await supabase.from("contact_submissions").insert([data]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { error: "Failed to submit form. Please try again." };
  }
}
```

## Authentication and Authorization

### Row-Level Security (RLS) Policies

We implement Row-Level Security (RLS) policies in Supabase for secure data access:

```sql
-- Example RLS policy for protected content
CREATE POLICY "Public content is viewable by everyone"
ON content
FOR SELECT
USING (is_public = true);

-- Example RLS policy for authenticated users
CREATE POLICY "Authenticated users can view their own data"
ON user_data
FOR SELECT
USING (auth.uid() = user_id);
```

### Authentication Implementation

For authenticated sections of the site, we use Supabase Auth:

```typescript
// lib/auth/supabase-auth.ts
import { createBrowserClient } from "@/lib/supabase/client";

export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const supabase = createBrowserClient();
  return await supabase.auth.signOut();
}
```

## Server Components Integration

### Type-Safe Database Access

We leverage TypeScript for type-safe database access:

```typescript
// types/supabase.ts
export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: number;
          created_at: string;
          title: string;
          description: string;
          slug: string;
          image_url: string;
          display_order: number;
        };
        Insert: {
          title: string;
          description: string;
          slug: string;
          image_url: string;
          display_order?: number;
        };
        Update: {
          title?: string;
          description?: string;
          slug?: string;
          image_url?: string;
          display_order?: number;
        };
      };
      // Additional table types...
    };
  };
};
```

### Optimizing Data Transfer

For Server Components, we optimize data transfer by:

1. Selecting only needed columns
2. Using filtering on the server
3. Implementing pagination where appropriate

```typescript
// Example of optimized data fetching
export async function getCaseStudiesByIndustry(industrySlug: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("case_studies")
    .select("id, title, summary, image_url, slug, industries!inner(slug)")
    .eq("industries.slug", industrySlug)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw new Error(`Error fetching case studies: ${error.message}`);

  return data;
}
```

## Performance Optimization

### Caching Strategy

We implement a multi-tiered caching strategy:

1. **React Cache** - Using `cache()` for request deduplication
2. **Next.js Fetch Cache** - Explicit caching control with `fetch` options
3. **Supabase Caching** - Optimized query patterns

```typescript
// Example of cache configuration
export const getServiceBySlug = cache(async (slug: string) => {
  const supabase = createServerClient();

  const { data, error } = await supabase.from("services").select("*").eq("slug", slug).single();

  if (error) throw new Error(`Error fetching service: ${error.message}`);

  return data;
});
```

### Query Optimization

We optimize Supabase queries by:

1. Creating appropriate indexes in Postgres
2. Using joins instead of multiple queries
3. Implementing efficient filtering

### Connection Pooling

For production, we use connection pooling to improve performance:

```typescript
// lib/supabase/server.ts with pool configuration
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-connection-pool": "true", // Enable connection pooling
        },
      },
    }
  );
}
```

## Deployment Considerations

### Environment Configuration

Different environments (development, staging, production) use separate Supabase projects:

| Environment | Supabase Project   | Purpose                   |
| ----------- | ------------------ | ------------------------- |
| Development | cyber-hand-dev     | Local development         |
| Staging     | cyber-hand-staging | Testing before production |
| Production  | cyber-hand-prod    | Live website              |

### CI/CD Integration

Our CI/CD pipeline includes database migration and schema validation:

1. Schema changes are version controlled
2. Migrations are applied automatically in CI/CD
3. Type generation is automated

## Security Best Practices

### Protecting Sensitive Data

1. **Environment Variables** - Sensitive keys stored as environment variables
2. **Service Role** - Service role key only used in secure server contexts
3. **RLS Policies** - Row-level security for all tables
4. **Data Validation** - Input validation on both client and server

### SQL Injection Prevention

We prevent SQL injection by:

1. Using parameterized queries (default in Supabase)
2. Avoiding raw SQL where possible
3. Validating and sanitizing all inputs

```typescript
// Safe query with parameters
const { data } = await supabase.from("services").select("*").eq("id", serviceId); // Parameterized, safe from SQL injection
```

## Troubleshooting

### Common Issues and Solutions

1. **Authentication Issues**

   - Check environment variables
   - Verify cookie settings
   - Inspect network requests

2. **Performance Problems**

   - Review query patterns
   - Check for missing indexes
   - Validate caching configuration

3. **Type Errors**
   - Regenerate Supabase types
   - Check for schema changes
   - Verify interface consistency

### Debugging Tools

1. **Supabase Dashboard** - Query monitoring and logs
2. **Postgres Explain** - Query performance analysis
3. **Next.js Server Actions Debugging** - Network tab inspection

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 15 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [TypeScript-Supabase Integration](https://supabase.com/docs/guides/api/generating-types)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
