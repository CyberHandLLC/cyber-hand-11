# Component Update Checklist

> This template provides a standardized checklist for updating existing components in the Cyber Hand project. Follow this checklist to ensure changes are consistent, properly documented, and follow Next.js 15 best practices.

## Component Information

- **Name**: [Component Name]
- **Path**: [File Path]
- **Type**: [Server or Client Component]
- **Purpose**: [Brief description of what this component does]
- **Last Updated**: [Date of last update]
- **Updated By**: [Name of last updater]
- **Next.js Version**: [Version number at time of update, e.g., 15.2.4]

## Update Requirements

- [ ] Feature enhancements: [List any new features]
- [ ] Bug fixes: [List any bugs to fix]
- [ ] Performance improvements: [List performance goals]
- [ ] Accessibility improvements: [List a11y enhancements]
- [ ] UI/UX changes: [List any design changes]
- [ ] Next.js 15 compatibility: [List any Next.js 15 changes needed]
- [ ] Server Component optimizations: [List any server rendering enhancements]
- [ ] Caching strategy updates: [Update any caching configurations]
- [ ] Breaking change

## Pre-Update Checks

- [ ] Review component's current implementation and dependencies
- [ ] Check for any open issues or bugs related to this component
- [ ] Identify the impact of changes on other components
- [ ] Create a backup or branch if making significant changes
- [ ] Understand the component's role in the overall architecture
- [ ] Verify if the component follows Next.js 15 Server/Client Component best practices
- [ ] Review data fetching patterns for alignment with explicit opt-in caching model
- [ ] Check for any deprecated APIs or patterns that need updating

## Update Implementation Checklist

- [ ] Update component code according to requirements
- [ ] Ensure proper TypeScript types are used (avoid 'any' type)
- [ ] Add or update comments for complex logic
- [ ] Verify Server/Client Component designation is appropriate
- [ ] Implement proper error boundaries and fallback states
- [ ] Update data fetching with explicit caching settings
- [ ] Optimize streaming with appropriate Suspense boundaries
- [ ] Implement proper loading states (skeleton components)
- [ ] Test the component in isolation and with its parents/children
- [ ] Verify the component meets accessibility standards (WCAG 2.1 AA)
- [ ] Check for Core Web Vitals impact (LCP, FID/INP, CLS)
- [ ] Ensure bundle size remains within budget (<300KB JS)
- [ ] Verify SEO metadata if applicable

## Dependency Impact Assessment

When updating a component, consider its impact on other parts of the application:

- [ ] Update dependent components if there are breaking changes
- [ ] Identify all pages that use this component
- [ ] Document changes in props, behavior, or appearance
- [ ] Update snapshots or examples if they exist
- [ ] Consider impact on layouts or parent components

Use this table to track affected dependencies:

| Dependency | Path | Impact | Action Required |
|------------|------|--------|-----------------|
| [Component name] | [Component path] | [Description of impact] | [Description of required changes] |

## Accessibility Verification

- [ ] Maintain or improve keyboard navigation
- [ ] Verify ARIA attributes are still appropriate
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Test with screen readers if UI flow has changed
- [ ] Confirm focus management for interactive elements

## Performance Verification

- [ ] Component maintains or improves render performance
- [ ] No unnecessary re-renders in Client Components
- [ ] Optimized asset usage (images, etc.)
- [ ] Appropriate caching for data fetching
- [ ] Bundle size impact is minimal

## Visual Verification

For visual changes:

- [ ] Works correctly in both light and dark themes
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Consistent with design system
- [ ] Animations/transitions are smooth and appropriate
- [ ] Works in all supported browsers

## Documentation Updates

- [ ] Update or add JSDoc comments
- [ ] Update props documentation if props have changed
- [ ] Update examples in documentation (if applicable)
- [ ] Document any new usage patterns or restrictions

## Server Component Considerations

If updating a Server Component:

- [ ] Data fetching follows Next.js 15 best practices
- [ ] No unintended client-side code inclusion
- [ ] Appropriate use of React's `cache()` for data fetching
- [ ] No state, effects, or browser APIs

## Client Component Considerations

If updating a Client Component:

- [ ] Component is properly marked with `'use client'` directive
- [ ] Interactive features work as expected
- [ ] Minimal client-side JS footprint
- [ ] Properly handles client-side errors

## Update Review Checklist

Before submitting:

- [ ] Code changes are focused and address the specific issue
- [ ] Component still follows project coding standards
- [ ] All components affected by the change have been updated
- [ ] Visual changes have been verified
- [ ] Types are accurate and complete
- [ ] Documentation is updated
- [ ] Accessibility is maintained or improved
- [ ] Code is clean and well-formatted

## Post-Update Verification

- [ ] Test the component in all contexts where it's used
- [ ] Verify that no regressions have been introduced
- [ ] Check that all affected pages render correctly
- [ ] Confirm that the update meets the original requirements

## Related Documentation

- [Code Standards](/docs/getting-started/code-standards.md)
- [Component System](/docs/architecture/component-system.md)
- [Component Template](/docs/templates/component-template.md)
- [Accessibility Guide](/docs/guides/accessibility.md)
