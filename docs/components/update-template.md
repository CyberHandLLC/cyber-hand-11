# Component Update Template

Use this template when making significant changes to components or utilities in the Cyber Hand website. This helps ensure that all dependent components and related files are properly updated.

## Component Update Checklist

```markdown
# [Component Name] Update Checklist

**Date**: YYYY-MM-DD
**Developer**: [Your Name]
**Component Path**: `path/to/component.tsx`
**Component Type**: [Server | Client | Hybrid]
**Last Deployment**: YYYY-MM-DD

## Change Summary

Brief description of what changes were made and why

## Type of Change

- [ ] Bug fix
- [ ] Performance optimization
- [ ] Feature enhancement
- [ ] API change
- [ ] Refactoring
- [ ] Style update
- [ ] Documentation
- [ ] Testing
- [ ] Server/Client boundary change
- [ ] Type definition update

## Component Dependencies

List components directly using this component that need to be checked:

- [ ] `path/to/dependent1.tsx`
- [ ] `path/to/dependent2.tsx`

## Utility Dependencies

- [ ] Performance utilities (e.g., `performance-metrics.ts`, `code-splitting.tsx`)
- [ ] Theme system (`theme-context.tsx`, `theme-utils.ts`)
- [ ] Animation utilities (`animation-utils.tsx`)
- [ ] Image optimization utilities (`image-utils.ts`)

## API and Data Dependencies

If this component makes API calls or fetches data:

- [ ] Server actions (`lib/actions/...`)
- [ ] Data fetching utilities (`lib/data/...`)
- [ ] API routes (`app/api/...`)
- [ ] Server-side data fetching functions

## Type Updates

If prop types or interfaces were changed:

- [ ] Updated component props interface
- [ ] Updated types in `types/*.ts` files
- [ ] Updated JSDoc comments
- [ ] Verified type imports in dependent components
- [ ] Kept type definitions DRY (no duplication)
- [ ] Addressed any TypeScript warnings/errors

## Tests Affected

- [ ] Updated existing tests in `tests/path/to/test.tsx`
- [ ] Added new tests
- [ ] Verified test coverage
- [ ] Added snapshot tests if UI component
- [ ] Added accessibility tests if interactive
- [ ] Created test cases for error handling

## Performance Considerations

- [ ] Added performance metrics logging with `usePerformanceMetrics`
- [ ] Measured impact on bundle size with Next.js built-in analytics
- [ ] Verified no memory leaks (especially event listeners, subscriptions)
- [ ] Checked render performance with React DevTools Profiler
- [ ] Implemented code-splitting if component is large/complex
- [ ] Used React.memo() for expensive renders
- [ ] Optimized images with Next.js Image component
- [ ] Implemented proper dependencies in hooks (useEffect, useMemo, etc.)
- [ ] Added to performance dashboard metrics (if appropriate)
- [ ] Verified Core Web Vitals impact

## Server/Client Boundary Considerations

- [ ] Verified correct use of 'use client' directive
- [ ] Ensured data fetching happens on server when possible
- [ ] Properly handled client-side state
- [ ] Used React.lazy() for client-only code
- [ ] Added proper error boundaries for client components
- [ ] Implemented loading states for async operations

## Documentation

- [ ] Updated component documentation
- [ ] Updated `DEPENDENCY-TRACKING.md`
- [ ] Added usage examples if API changed
- [ ] Updated build/deploy instructions if needed
- [ ] Documented any environment-specific behavior

## Related Components

These components have similar patterns and might need similar updates:

- [ ] `path/to/similar1.tsx`
- [ ] `path/to/similar2.tsx`

## Accessibility Considerations

- [ ] Proper semantic HTML elements
- [ ] Added/verified ARIA attributes
- [ ] Ensured keyboard navigation works
- [ ] Verified color contrast with theme variants
- [ ] Tested with screen reader if interactive

## Notes for Future Development

Any considerations for future development or technical debt
```

## Usage Instructions

1. Copy the template above for any significant component change
2. Fill out all sections before submitting your changes
3. Include the completed checklist in your PR or commit message
4. Update the `DEPENDENCY-TRACKING.md` file with any new dependencies discovered

## Integration with Development Workflow

### When to Use This Template

Use this template when:

1. Creating a new component
2. Making significant changes to an existing component
3. Changing the API of a component used by multiple other components
4. Optimizing a component for performance
5. Refactoring shared utilities

### Dependency Update Process

1. **Identify dependencies**: Before making changes, identify all components that depend on the component you're updating
2. **Update the primary component**: Make changes to the main component
3. **Check and update dependents**: Review and update all dependent components
4. **Update tests**: Update or add tests for all modified components
5. **Document changes**: Complete this template and update the dependency tracking document

## Special Templates for Common Component Types

### Server Component Template

Use for components that primarily fetch and render data without client interactivity:

```markdown
# [Component Name] Update Checklist

**Date**: YYYY-MM-DD
**Developer**: [Your Name]
**Component Path**: `path/to/component.tsx`
**Component Type**: Server

## Additional Server Component Considerations

- [ ] Properly implements React cache() for data fetching
- [ ] No useState or useEffect hooks present
- [ ] Passes only serializable props to Client Components
- [ ] Uses correct data fetching pattern (parallel when possible)
- [ ] All imports are server-safe
```

### Performance Utility Template

Use for performance-related utilities and components:

```markdown
# [Performance Utility] Update Checklist

**Date**: YYYY-MM-DD
**Developer**: [Your Name]
**Utility Path**: `lib/performance/utility-name.ts`

## Performance Metrics Impacted

- [ ] Core Web Vitals (specify which)
- [ ] Custom metrics (list key metrics)
- [ ] Bundle size
- [ ] Render performance

## Environment Considerations

- [ ] Development behavior
- [ ] Production behavior
- [ ] Test environment behavior
```

## Example - Button Component Update

```markdown
# Button Component Update Checklist

**Date**: 2025-04-07
**Developer**: Jamie Developer
**Component Path**: `components/ui/button.tsx`
**Component Type**: Client
**Last Deployment**: 2025-04-01

## Change Summary

Added loading state to Button component for better UX during async operations.

## Type of Change

- [x] Feature enhancement
- [x] API change
- [x] Performance optimization

## Component Dependencies

List components directly using this component that need to be checked:

- [x] `components/forms/contact-form-client.tsx`
- [x] `components/forms/newsletter-signup.tsx`
- [x] `components/navigation/mobile-menu.tsx`
- [x] `components/custom/cta-section.tsx`

## Utility Dependencies

- [x] Performance utilities (`performance-metrics.ts` for click-to-feedback measurement)
- [x] Theme system (`theme-context.tsx` for loading state styling)
- [ ] Animation utilities
- [ ] Image optimization utilities

## API and Data Dependencies

If this component makes API calls, list them here:

- [n/a]

## Type Updates

If prop types or interfaces were changed:

- [x] Updated ButtonProps interface to add `isLoading` and `loadingText` properties
- [x] Updated types in `types/components.ts`
- [x] Updated JSDoc comments

## Tests Affected

- [x] Updated existing tests in `tests/components/ui/button.test.tsx`
- [x] Added new test for loading state
- [x] Verified test coverage (100% on new properties)

## Performance Considerations

- [x] Added performance metrics for button click-to-feedback time using `usePerformanceMetrics`
- [x] Verified no unnecessary re-renders during loading state with React DevTools Profiler
- [x] Optimized loading spinner animation using CSS transforms
- [x] Implemented React.memo() to prevent parent re-renders from affecting button
- [x] Added proper cleanup for any event listeners
- [x] Verified bundle size impact (minimal: +0.2kb gzipped)
- [x] Measured LCP impact on pages where Button is above the fold

## Documentation

- [x] Updated component documentation
- [x] Updated `DEPENDENCY-TRACKING.md`
- [x] Added loading state example to component storybook

## Server/Client Boundary Considerations

- [x] Verified 'use client' directive is present
- [x] Implemented proper loading UI for async states
- [x] Added client-side error handling for failed operations
- [x] Ensured accessible focus management during state changes

## Related Components

These components have similar patterns and might need similar updates:

- [x] `components/ui/icon-button.tsx` (updated with same pattern)
- [ ] `components/ui/link-button.tsx` (scheduled for future update)
- [ ] `components/forms/form-submit-button.tsx` (shares button patterns)

## Accessibility Considerations

- [x] Added aria-busy attribute during loading state
- [x] Ensured disabled state is properly conveyed to screen readers
- [x] Maintained keyboard focus during loading/success transitions
- [x] Verified color contrast of loading state in all themes

## Notes for Future Development

Consider implementing a standardized approach to loading states across all interactive components. The button loading pattern could be extracted to a higher-level hook or utility.
```
