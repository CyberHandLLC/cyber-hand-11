# Dependency Tracking System

This document provides a structured approach to tracking component and utility relationships across the Cyber Hand website. It helps ensure that when one file is updated, all dependent files are also reviewed and updated as needed.

## Purpose

As our application grows in complexity, it's crucial to:

1. **Track Dependencies**: Understand which files depend on each other
2. **Document Relationships**: Maintain clear documentation of component hierarchies
3. **Prevent Stale Code**: Ensure updates to one component trigger updates to dependent components
4. **Enforce Consistency**: Maintain consistent patterns across the codebase
5. **Performance Monitoring**: Track which components use performance utilities
6. **Type Safety**: Ensure type definitions are updated with component changes
7. **Testing Coverage**: Maintain alignment between components and their tests

## Core Components and Their Dependents

### Layout System

| Component                | Location                                              | Dependents                  | Last Updated |
| ------------------------ | ----------------------------------------------------- | --------------------------- | ------------ |
| `PageLayout`             | `components/custom/page-layout.tsx`                   | All app pages (`app/*.tsx`) | 2025-04-05   |
| `SectionContainer`       | `components/custom/page-layout.tsx`                   | All page sections           | 2025-04-05   |
| `PageLayoutClient`       | `components/layout/page-layout-client.tsx`            | `PageLayout`                | 2025-04-05   |
| `OptimizedLayoutWrapper` | `components/performance/optimized-layout-wrapper.tsx` | `PageLayout`                | 2025-04-05   |
| `Navbar`                 | `components/navigation/navbar.tsx`                    | `PageLayout`                | 2025-04-02   |
| `Footer`                 | `components/navigation/footer.tsx`                    | `PageLayout`                | 2025-04-02   |

### Location System

| Component                | Location                                           | Dependents                          | Last Updated |
| ------------------------ | -------------------------------------------------- | ----------------------------------- | ------------ |
| `LocationProvider`       | `lib/location/location-context.tsx`                | `app/providers.tsx`                 | 2025-04-07   |
| `LocationService`        | `lib/location/location-service.ts`                 | `app/layout.tsx`, Server Components | 2025-04-07   |
| `LocationConsent`        | `components/location/location-consent.tsx`         | `location-consent-wrapper.tsx`      | 2025-04-07   |
| `LocationConsentWrapper` | `components/location/location-consent-wrapper.tsx` | `app/page.tsx`                      | 2025-04-07   |

### UI Components

| Component        | Location                                | Dependents                      | Last Updated |
| ---------------- | --------------------------------------- | ------------------------------- | ------------ |
| `Button`         | `components/ui/button.tsx`              | Form components, CTAs           | 2025-04-03   |
| `FormElements`   | `components/ui/form-elements.tsx`       | `contact-form-client.tsx`       | 2025-04-03   |
| `Icons`          | `components/ui/icons.tsx`               | Multiple components             | 2025-04-03   |
| `OptimizedImage` | `components/ui/optimized-image.tsx`     | Image-heavy components          | 2025-04-05   |
| `StaticImage`    | `components/ui/static-image.tsx`        | Static content sections         | 2025-04-03   |
| `Card`           | `components/ui/card.tsx`                | Case study cards, service cards | 2025-04-03   |
| `Input`          | `components/ui/input.tsx`               | All form components             | 2025-04-03   |
| `CaseStudyCard`  | `components/custom/case-study-card.tsx` | Case studies page               | 2025-04-04   |
| `ServiceCard`    | `components/custom/service-card.tsx`    | Services page                   | 2025-04-04   |

### Middleware

| Middleware   | Location        | Dependents                                    | Last Updated |
| ------------ | --------------- | --------------------------------------------- | ------------ |
| `middleware` | `middleware.ts` | All pages, `lib/location/location-service.ts` | 2025-04-07   |

### Performance Utilities

| Utility                  | Location                                              | Dependents                    | Last Updated |
| ------------------------ | ----------------------------------------------------- | ----------------------------- | ------------ |
| `PerformanceMetrics`     | `lib/performance/performance-metrics.ts`              | Performance dashboard, logger | 2025-04-06   |
| `PerformanceLogger`      | `lib/performance/performance-logger.ts`               | App layout for production     | 2025-04-06   |
| `PerformanceDashboard`   | `components/performance/performance-dashboard.tsx`    | App layout for development    | 2025-04-06   |
| `CodeSplitting`          | `lib/performance/code-splitting.tsx`                  | Dynamic component imports     | 2025-04-05   |
| `CriticalCSS`            | `lib/performance/critical-css.ts`                     | Root layout                   | 2025-04-05   |
| `DeferredLoading`        | `lib/performance/deferred-loading.tsx`                | Non-critical components       | 2025-04-05   |
| `OptimizedLayoutWrapper` | `components/performance/optimized-layout-wrapper.tsx` | Page layouts                  | 2025-04-05   |
| `DynamicImportUtils`     | `lib/dynamic-import-utils.tsx`                        | Dynamic component imports     | 2025-04-05   |

### Server Actions

| Action               | Location                              | Dependents                                    | Last Updated |
| -------------------- | ------------------------------------- | --------------------------------------------- | ------------ |
| `ContactFormActions` | `lib/actions/contact/contact-form.ts` | `contact-form-client.tsx`, `contact-form.tsx` | 2025-04-06   |
| `CaseStudyActions`   | `lib/actions/case-studies/*.ts`       | Case study components                         | -            |
| `ServiceActions`     | `lib/actions/services/*.ts`           | Service components                            | -            |

### Server Actions

| Action                   | Location                              | Dependents                                    | Last Updated |
| ------------------------ | ------------------------------------- | --------------------------------------------- | ------------ |
| `ContactFormActions`     | `lib/actions/contact/contact-form.ts` | `contact-form-client.tsx`, `contact-form.tsx` | 2025-04-06   |
| `CaseStudyActions`       | `lib/actions/case-studies/*.ts`       | Case study components                         | 2025-04-06   |
| `ServiceActions`         | `lib/actions/services/*.ts`           | Service components                            | 2025-04-06   |
| `UserPreferencesActions` | `lib/actions/user/preferences.ts`     | Settings components                           | 2025-04-05   |

### API Routes

| Route                        | Location                                  | Consumers               | Last Updated |
| ---------------------------- | ----------------------------------------- | ----------------------- | ------------ |
| `api/geo-debug`              | `app/api/geo-debug/route.ts`              | Debugging tools         | 2025-04-07   |
| `api/placeholder/[category]` | `app/api/placeholder/[category]/route.ts` | Various page components | 2025-04-05   |
| `api/analytics`              | `app/api/analytics/route.ts`              | Analytics components    | 2025-04-05   |
| `api/feedback`               | `app/api/feedback/route.ts`               | Feedback form           | 2025-04-05   |

### Data Fetching Utilities

| Utility              | Location                   | Dependents                                     | Last Updated |
| -------------------- | -------------------------- | ---------------------------------------------- | ------------ |
| `ServerUtils`        | `lib/server-utils.ts`      | All data fetching components, API routes       | 2025-04-06   |
| `CaseStudiesFetcher` | `lib/data/case-studies.ts` | Case study pages, `/api/case-studies/*` routes | 2025-04-06   |
| `ServicesFetcher`    | `lib/data/services.ts`     | Service pages, `/api/services/*` routes        | 2025-04-04   |
| `ServerActions`      | `lib/server-actions.ts`    | API routes, server-side rendering              | 2025-04-06   |

### Type Definitions

| Type File             | Location                                      | Dependents                               | Last Updated |
| --------------------- | --------------------------------------------- | ---------------------------------------- | ------------ |
| `components.ts`       | `types/components.ts`                         | UI and custom components                 | 2025-04-06   |
| `case-studies.ts`     | `types/case-studies.ts`                       | Case study components and pages          | 2025-04-06   |
| `services.ts`         | `types/services.ts`                           | Service components and pages             | 2025-04-06   |
| `api.ts`              | `types/api.ts`                                | API routes and data fetching             | 2025-04-06   |
| `case-study-types.ts` | `components/case-studies/case-study-types.ts` | Legacy types, being migrated to `/types` | 2025-04-04   |

## Update Checklist Template

When making significant changes to a component or utility, use this checklist to ensure all dependent files are reviewed and updated as needed:

```markdown
## [Component/Utility Name] Update Checklist

**Date of Update**: YYYY-MM-DD
**Developer**: Your Name

### Changes Made

- [ ] Describe change 1
- [ ] Describe change 2

### Files Updated

- [ ] Primary file: `path/to/file.tsx`
- [ ] Dependent file: `path/to/dependent1.tsx`
- [ ] Dependent file: `path/to/dependent2.tsx`

### Tests Affected

- [ ] `tests/path/to/test1.tsx`
- [ ] `tests/path/to/test2.tsx`

### Documentation Updated

- [ ] Component documentation
- [ ] Type definitions
- [ ] This dependency tracking file

### Performance Impact Assessment

- [ ] Bundle size effect: [Increased/Decreased/No change] (specify size if applicable)
- [ ] Core Web Vitals impact: [LCP/FID/CLS/INP] (specify expected change)
- [ ] Server-side rendering time: [Increased/Decreased/No change]
- [ ] Client-side hydration time: [Increased/Decreased/No change]

### Browser & Device Compatibility

- [ ] Cross-browser tested: [List browsers]
- [ ] Mobile responsiveness verified
- [ ] Touch interactions tested (if applicable)
- [ ] High-DPI/Retina display support

### Accessibility Considerations

- [ ] Contrast requirements met
- [ ] Screen reader compatibility
- [ ] Keyboard navigation supported
- [ ] ARIA attributes properly implemented
- [ ] Focus management verified
```

## Data Fetching Patterns

The application uses various Next.js 15 data fetching patterns:

| Pattern                             | Description                               | Used In                                                  | Last Updated |
| ----------------------------------- | ----------------------------------------- | -------------------------------------------------------- | ------------ |
| `generateStaticParams`              | Static generation of dynamic routes       | `case-studies/[slug]/page.tsx`, `services/[id]/page.tsx` | 2025-04-05   |
| `Suspense` Boundaries               | Streaming and progressive rendering       | Homepage, case studies page                              | 2025-04-07   |
| `cache()`                           | Request deduplication                     | `lib/data/*.ts`, `lib/location/location-service.ts`      | 2025-04-07   |
| `revalidatePath`                    | On-demand revalidation                    | Contact form submission, feedback forms                  | 2025-04-06   |
| `fetch` with `next: { revalidate }` | Time-based revalidation                   | Blog posts, service listings                             | 2025-04-05   |
| `useFormStatus`                     | Form submission state tracking            | All form components                                      | 2025-04-06   |
| `useFormState`                      | Form state management with Server Actions | Contact form, feedback forms                             | 2025-04-06   |

## Build Optimization Features

| Feature                 | Purpose                               | Components Affected           | Last Updated |
| ----------------------- | ------------------------------------- | ----------------------------- | ------------ |
| `prefetch={false}`      | Disable link prefetching              | Low-priority navigation links | 2025-04-05   |
| `Link prefetch={true}`  | Prioritize prefetching                | Primary navigation            | 2025-04-05   |
| Route Segments config   | Control rendering strategy            | Root layout, dashboard layout | 2025-04-05   |
| Static/Dynamic Settings | Per-page rendering strategy           | All pages                     | 2025-04-05   |
| Image Optimization      | Config in `next.config.js`            | All `Image` components        | 2025-04-05   |
| Font Optimization       | Local fonts & display settings        | Typography components         | 2025-04-05   |
| Bundle Splitting        | Code organization for optimal loading | All client components         | 2025-04-06   |

## Server/Client Boundaries

The application implements a clear separation between Server and Client Components following Next.js 15 best practices:

| Component Type    | Purpose                                                 | Considerations                                    | Examples                           |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------- | ---------------------------------- |
| Server Components | Data fetching, SEO, initial HTML                        | Cannot use hooks, client-side APIs                | Page components, layout components |
| Client Components | Interactivity, state management, event handling         | Add `'use client'` directive, avoid large bundles | `LocationProvider`, UI components  |
| Client Boundaries | Wrapper components that separate server/client concerns | Use dynamic imports and Suspense                  | `LocationConsentWrapper`           |

## Next.js-Specific Dependencies

| Feature         | Used In                                     | Considerations                      | Last Updated |
| --------------- | ------------------------------------------- | ----------------------------------- | ------------ |
| Edge Runtime    | `middleware.ts`                             | Required for geolocation in Vercel  | 2025-04-07   |
| React Context   | `location-context.tsx`, `theme-context.tsx` | Client Components only              | 2025-04-07   |
| Headers API     | `location-service.ts`                       | Server Components only              | 2025-04-07   |
| Dynamic Imports | `location-consent-wrapper.tsx`              | Used for code splitting             | 2025-04-07   |
| Root Layout     | `app/layout.tsx`                            | Wraps all pages, includes Providers | 2025-04-07   |

## Update Workflow

1. **Before Starting Work**:

   - Review this dependency tracking document
   - Identify all components affected by planned changes
   - Create a checklist in your issue/task ticket

2. **During Development**:

   - Update the primary component/utility
   - Work through dependent components in order of their dependency
   - Update tests for all modified components

3. **After Completion**:
   - Run full test suite to ensure all dependencies work correctly
   - Update this tracking document with new relationships or modified dates
   - Record any new dependencies discovered during development

## Automated Dependency Analysis

For more comprehensive dependency tracking, we've implemented several automation tools:

### ESLint Import Checker

Our ESLint configuration includes import checking to identify unused or circular dependencies:

```bash
# Run ESLint with import checking
npm run lint
```

### Dependency Graph Generator

To visualize component relationships, run:

```bash
# Generate a visual dependency graph (requires dependency-cruiser)
npm run analyze:deps
```

This will create a visual representation of component dependencies in `.dependency-graph.html`.

### Update Detection Script

We've added a script to detect outdated dependencies based on file modification dates:

```bash
# Check for potentially outdated dependencies
npm run check:deps
```

### Server Component Analysis

To specifically track Server vs. Client component boundaries:

```bash
# Analyze Server/Client component boundaries
npm run analyze:server-client
```

## Testing Infrastructure

| Test Category     | Location             | Covers                                      | Last Updated |
| ----------------- | -------------------- | ------------------------------------------- | ------------ |
| Component Tests   | `tests/components/*` | UI components, interactive elements         | 2025-04-05   |
| Utility Tests     | `tests/utils/*`      | Helper functions, data processing           | 2025-04-05   |
| Performance Tests | TBD                  | Performance metrics, optimization utilities | -            |
| API Route Tests   | TBD                  | API endpoints, server actions               | -            |

## Client/Server Type Safety

| Type or Interface | Location                            | Shared Between            | Last Updated |
| ----------------- | ----------------------------------- | ------------------------- | ------------ |
| `LocationData`    | `lib/location/location-context.tsx` | Server and Client         | 2025-04-07   |
| `ThemeOptions`    | `lib/theme-context.tsx`             | Server and Client         | 2025-04-05   |
| `UserProfile`     | `types/user.ts`                     | Server and Client         | 2025-04-05   |
| `CaseStudyType`   | `types/case-study.ts`               | Server and Client         | 2025-04-05   |
| `ApiResponse`     | `types/api.ts`                      | Server Actions and Client | 2025-04-06   |
| `FormState`       | `types/forms.ts`                    | Server Actions and Client | 2025-04-06   |

### Serialization Boundaries

| Component       | Props Serialized   | Considerations             | Last Updated |
| --------------- | ------------------ | -------------------------- | ------------ |
| `Providers`     | `locationData`     | JSON-serializable only     | 2025-04-07   |
| `CaseStudyPage` | `caseStudy` data   | Complex data structure     | 2025-04-05   |
| `ContactForm`   | Form initial state | Simple primitives only     | 2025-04-05   |
| `UserDashboard` | User profile data  | Dates converted to strings | 2025-04-05   |

## Special Considerations

### Server Component Dependencies

Server Components have special dependency considerations:

1. **Data Dependencies**: Track both component and data dependencies
2. **Client Boundaries**: Document where Server/Client component boundaries exist
3. **React Cache**: Note which components use React's `cache()` function
4. **Headers API**: Track components using `headers()` from Next.js
5. **Middleware Integration**: Components relying on headers set by middleware

### Location-Based Features

Components that rely on geolocation data have special considerations:

1. **Middleware Dependencies**: Components using geo headers from middleware
2. **Client-Side Location Access**: Components using the `useLocation()` hook
3. **Consent Requirements**: Components that must respect user location consent
4. **Edge Runtime**: Features requiring Edge Runtime (e.g., geolocation on Vercel)
5. **Environment Differences**: Development vs. Production behavior

### CSS and Style Dependencies

Track style dependencies, especially for:

1. **Theme Variables**: Components using specific theme variables
2. **Critical CSS**: Components with styles included in critical CSS
3. **Conditional Styles**: Components with environment-dependent styling

## Client Management System Dependencies

### Package Dependencies

| Package                          | Version   | Purpose                                       | Used By                                         |
|----------------------------------|-----------|-----------------------------------------------|------------------------------------------------|
| `@supabase/auth-helpers-nextjs`  | ^0.8.1    | Authentication helpers for Next.js             | Auth flows, Session management                  |
| `@supabase/supabase-js`          | ^2.39.0   | Core Supabase client                          | Database operations, Real-time subscriptions    |
| `@stripe/stripe-js`              | ^2.2.0    | Client-side Stripe integration                | Payment form, Checkout components               |
| `stripe`                         | ^14.5.0   | Server-side Stripe API handling               | Webhook handlers, Subscription management       |
| `zod`                            | ^3.22.4   | Schema validation                             | Form validation, API request/response validation|
| `react-hook-form`                | ^7.48.2   | Form state management                         | All client-side forms                          |
| `@tanstack/react-query`          | ^4.36.1   | Data fetching and caching                     | Client components requiring data fetching       |
| `recharts`                       | ^2.10.3   | Data visualization components                 | Analytics dashboards, Reporting components      |
| `@heroicons/react`               | ^2.0.18   | Icon components                               | UI elements throughout the application         |

### Component Dependencies

#### Authentication Components

| Component                   | Location                                     | Dependents                                    | Type             |
|-----------------------------|----------------------------------------------|-----------------------------------------------|------------------|
| `AuthProvider`              | `components/auth/auth-provider.tsx`          | `app/layout.tsx`                              | Client Component |
| `LoginForm`                 | `components/auth/login-form.tsx`             | `app/(auth)/login/page.tsx`                   | Client Component |
| `RegisterForm`              | `components/auth/register-form.tsx`          | `app/(auth)/register/page.tsx`                | Client Component |
| `AuthGuard`                 | `components/auth/auth-guard.tsx`             | Protected page layouts                         | Client Component |

#### Dashboard Components

| Component                   | Location                                     | Dependents                                    | Type             |
|-----------------------------|----------------------------------------------|-----------------------------------------------|------------------|
| `DashboardLayout`           | `app/(dashboard)/layout.tsx`                 | All dashboard pages                           | Server Component |
| `ClientDashboard`           | `components/dashboard/client-dashboard.tsx`  | `app/(dashboard)/page.tsx`                    | Server Component |
| `AdminDashboard`            | `components/dashboard/admin-dashboard.tsx`   | `app/(admin)/page.tsx`                        | Server Component |
| `ServiceRequestTable`       | `components/dashboard/service-request.tsx`   | Dashboard pages                               | Client Component |
| `ServiceStatusCard`         | `components/dashboard/service-status-card.tsx` | Dashboard pages                             | Server Component |

#### Payment Components

| Component                   | Location                                     | Dependents                                    | Type             |
|-----------------------------|----------------------------------------------|-----------------------------------------------|------------------|
| `CheckoutButton`            | `components/payment/checkout-button.tsx`     | Service pages                                 | Client Component |
| `SubscriptionManager`       | `components/payment/subscription-manager.tsx`| Account pages                                 | Client Component |
| `PaymentHistoryTable`       | `components/payment/payment-history.tsx`     | Account pages                                 | Server Component |
| `InvoiceViewer`             | `components/payment/invoice-viewer.tsx`      | Account pages                                 | Server Component |

### Database Schema Dependencies

| Table                   | Purpose                                             | Relations                            | Security                      |
|-------------------------|-----------------------------------------------------|--------------------------------------|-------------------------------|
| `auth.users`            | Built-in Supabase auth table for user accounts      | Parent table for all user relations  | Managed by Supabase Auth     |
| `client_records`        | Extended client information and billing details     | Foreign key to `auth.users.id`       | RLS policies by user role    |
| `projects`              | Client service projects and deliverables            | Foreign key to `client_records.id`   | RLS policies by user role    |
| `service_packages`      | Available service tiers and offerings               | Referenced by `projects`             | Public read, admin write     |
| `invoices`              | Generated client invoices and payment records       | Foreign key to `client_records.id`   | RLS policies by user role    |
| `subscriptions`         | Recurring subscription details                      | Foreign key to `client_records.id`   | RLS policies by user role    |
| `website_analytics`     | Performance metrics for client websites             | Foreign key to `projects.id`         | RLS policies by user role    |

### API Route Dependencies

| Route Handler                | Location                                  | Purpose                                    | Dependencies                           |
|------------------------------|-------------------------------------------|--------------------------------------------|-----------------------------------------|
| `auth/callback`              | `app/api/auth/callback/route.ts`          | Supabase Auth callback handling            | Supabase Auth                         |
| `webhooks/stripe`            | `app/api/webhooks/stripe/route.ts`        | Stripe webhook handling                    | Stripe, Supabase                       |
| `services/request`           | `app/api/services/request/route.ts`       | Service request submission                 | Zod, Supabase                          |
| `payment/create-checkout`    | `app/api/payment/create-checkout/route.ts`| Create Stripe checkout sessions           | Stripe, Supabase                       |
| `analytics/website`          | `app/api/analytics/website/route.ts`      | Website performance metrics               | Supabase                               |

## Next Steps

1. Complete the dependency tracking for all existing components
2. Implement automated dependency checking in CI/CD pipeline
3. Create visual dependency graph for the entire application
4. Add component relationship diagrams to component documentation
5. Implement automatic dependency warnings when modifying shared components
6. Create a dashboard to visualize component health metrics
7. Integrate dependency tracking with performance monitoring system
8. Add test coverage tracking per component/utility
9. Document data flow between client/server boundaries
10. Create script to auto-detect new dependencies from import statements
11. Track location-based feature dependencies more granularly
12. Document middleware dependencies across different environments
13. Create tests specifically for geolocation feature dependencies
14. Update database schema diagrams with client management system tables
15. Track Supabase RLS policy dependencies for client/admin data access
