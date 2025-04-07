# Legacy Code

This directory contains code that has been deprecated but preserved for reference purposes as part of our transition to Next.js 15's built-in streaming capabilities.

## Contents

### Components

- `streaming-case-study-grid.tsx`: Custom streaming implementation for case studies that was replaced by Next.js 15's native streaming with loading.tsx files and async Server Components.

## Migrations Completed

These files were moved to the legacy folder as part of the Next.js 15 streaming migration (April 2025):

- ✅ `lib/streaming-utils.ts` → Completely removed (not preserved)
- ✅ `app/case-studies/streaming-page.tsx` → Completely removed (not preserved)
- ✅ `lib/data/streaming-case-studies.ts` → Refactored to `lib/data/enhanced-case-studies.ts`
- ✅ `app/case-studies/components/streaming-case-study-grid.tsx` → Moved to legacy/components/

## Removal Guidelines

These files can be safely removed once:

1. The application has been thoroughly tested with the new streaming implementation
2. No runtime errors or unexpected behavior is observed
3. Performance metrics show equal or improved results compared to the custom implementation

## Verification Process

To confirm these files can be safely removed:

1. Run the application with full page reloads on various routes
2. Test under network throttling conditions to verify streaming behavior
3. Ensure all components render correctly in the same order as before
4. Verify Core Web Vitals are maintained or improved

## Next Steps

After a stable period of 2-4 weeks in production without issues, these files should be permanently removed to reduce technical debt.
