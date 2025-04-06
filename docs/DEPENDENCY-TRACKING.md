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

| Component | Location | Dependents | Last Updated |
|-----------|----------|------------|--------------|
| `PageLayout` | `components/custom/page-layout.tsx` | All app pages (`app/*.tsx`) | 2025-04-05 |
| `SectionContainer` | `components/custom/page-layout.tsx` | All page sections | 2025-04-05 |
| `PageLayoutClient` | `components/layout/page-layout-client.tsx` | `PageLayout` | 2025-04-05 |
| `OptimizedLayoutWrapper` | `components/performance/optimized-layout-wrapper.tsx` | `PageLayout` | 2025-04-05 |
| `Navbar` | `components/navigation/navbar.tsx` | `PageLayout` | 2025-04-02 |
| `Footer` | `components/navigation/footer.tsx` | `PageLayout` | 2025-04-02 |

### UI Components

| Component | Location | Dependents | Last Updated |
|-----------|----------|------------|--------------|
| `Button` | `components/ui/button.tsx` | Form components, CTAs | 2025-04-03 |
| `FormElements` | `components/ui/form-elements.tsx` | `contact-form-client.tsx` | 2025-04-03 |
| `Icons` | `components/ui/icons.tsx` | Multiple components | 2025-04-03 |
| `OptimizedImage` | `components/ui/optimized-image.tsx` | Image-heavy components | 2025-04-05 |
| `StaticImage` | `components/ui/static-image.tsx` | Static content sections | 2025-04-03 |
| `Card` | `components/ui/card.tsx` | Case study cards, service cards | 2025-04-03 |
| `Input` | `components/ui/input.tsx` | All form components | 2025-04-03 |
| `CaseStudyCard` | `components/custom/case-study-card.tsx` | Case studies page | 2025-04-04 |
| `ServiceCard` | `components/custom/service-card.tsx` | Services page | 2025-04-04 |

### Performance Utilities

| Utility | Location | Dependents | Last Updated |
|---------|----------|------------|--------------|
| `PerformanceMetrics` | `lib/performance/performance-metrics.ts` | Performance dashboard, logger | 2025-04-06 |
| `PerformanceLogger` | `lib/performance/performance-logger.ts` | App layout for production | 2025-04-06 |
| `PerformanceDashboard` | `components/performance/performance-dashboard.tsx` | App layout for development | 2025-04-06 |
| `CodeSplitting` | `lib/performance/code-splitting.tsx` | Dynamic component imports | 2025-04-05 |
| `CriticalCSS` | `lib/performance/critical-css.ts` | Root layout | 2025-04-05 |
| `DeferredLoading` | `lib/performance/deferred-loading.tsx` | Non-critical components | 2025-04-05 |
| `OptimizedLayoutWrapper` | `components/performance/optimized-layout-wrapper.tsx` | Page layouts | 2025-04-05 |
| `DynamicImportUtils` | `lib/dynamic-import-utils.tsx` | Dynamic component imports | 2025-04-05 |

### Server Actions

| Action | Location | Dependents | Last Updated |
|--------|----------|------------|--------------|
| `ContactFormActions` | `lib/actions/contact/contact-form.ts` | `contact-form-client.tsx`, `contact-form.tsx` | 2025-04-06 |
| `CaseStudyActions` | `lib/actions/case-studies/*.ts` | Case study components | - |
| `ServiceActions` | `lib/actions/services/*.ts` | Service components | - |

### Data Fetching Utilities

| Utility | Location | Dependents | Last Updated |
|---------|----------|------------|--------------|
| `ServerUtils` | `lib/server-utils.ts` | All data fetching components, API routes | 2025-04-06 |
| `CaseStudiesFetcher` | `lib/data/case-studies.ts` | Case study pages, `/api/case-studies/*` routes | 2025-04-06 |
| `ServicesFetcher` | `lib/data/services.ts` | Service pages, `/api/services/*` routes | 2025-04-04 |
| `ServerActions` | `lib/server-actions.ts` | API routes, server-side rendering | 2025-04-06 |

### Type Definitions

| Type File | Location | Dependents | Last Updated |
|-----------|----------|------------|--------------|
| `components.ts` | `types/components.ts` | UI and custom components | 2025-04-06 |
| `case-studies.ts` | `types/case-studies.ts` | Case study components and pages | 2025-04-06 |
| `services.ts` | `types/services.ts` | Service components and pages | 2025-04-06 |
| `api.ts` | `types/api.ts` | API routes and data fetching | 2025-04-06 |
| `case-study-types.ts` | `components/case-studies/case-study-types.ts` | Legacy types, being migrated to `/types` | 2025-04-04 |

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
```

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

| Test Category | Location | Covers | Last Updated |
|--------------|----------|--------|---------------|
| Component Tests | `tests/components/*` | UI components, interactive elements | 2025-04-05 |
| Utility Tests | `tests/utils/*` | Helper functions, data processing | 2025-04-05 |
| Performance Tests | TBD | Performance metrics, optimization utilities | - |
| API Route Tests | TBD | API endpoints, server actions | - |

## Special Considerations

### Server Component Dependencies

Server Components have special dependency considerations:

1. **Data Dependencies**: Track both component and data dependencies
2. **Client Boundaries**: Document where Server/Client component boundaries exist
3. **React Cache**: Note which components use React's `cache()` function

### CSS and Style Dependencies

Track style dependencies, especially for:

1. **Theme Variables**: Components using specific theme variables
2. **Critical CSS**: Components with styles included in critical CSS
3. **Conditional Styles**: Components with environment-dependent styling

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
