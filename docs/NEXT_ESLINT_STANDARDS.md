# Next.js 15.2.4 ESLint and Schema Standards

This document outlines standards for ESLint configuration and structured data implementation in Cyber Hand projects using Next.js 15.2.4.

## ESLint Configuration

Next.js 15.2.4 comes with a built-in ESLint configuration (`eslint-config-next`) that enforces best practices for Next.js applications.

### Unused Variables

As per Cyber Hand's coding principles:

1. All unused variables **must** be prefixed with an underscore (`_`).
2. If you're importing components that are not yet used but planned for future use, either:
   - Add the underscore prefix: `import { _UnusedComponent } from '...'`
   - Comment out the import until needed
   - Add explicit TypeScript ignore comments if absolutely necessary (discouraged)

**Good example:**
```typescript
// Used variable - no underscore needed
const activeItems = items.filter(item => item.active);

// Unused variable - underscore prefix required
const _totalItems = items.length;
```

### Import Standards

1. Always use ES6 import statements.
2. Never use CommonJS-style `require()` imports in TypeScript files.
3. Maintain clean imports by removing unused ones.

**Correct:**
```typescript
import { Component } from '@/components/component';
```

**Incorrect:**
```typescript
const Component = require('@/components/component');
```

## Structured Data Implementation

Next.js 15.2.4 requires careful implementation of structured data components to avoid ESLint errors related to unused expressions.

### Function Call Pattern (Recommended)

When using schema components in JSX, use function calls wrapped in curly braces:

```tsx
export default function Page() {
  return (
    <div>
      {/* Correct: Function call pattern */}
      {WebPageSchema({
        title: "Page Title",
        description: "Page description",
        url: "/page",
        datePublished: "2023-01-01",
        dateModified: new Date().toISOString(),
        imageUrl: "/images/image.jpg"
      })}
      
      {/* Page content */}
    </div>
  );
}
```

### JSX Pattern (Requires Additional Configuration)

If you prefer the JSX component pattern, you must ensure your components return valid React elements:

```tsx
export default function Page() {
  return (
    <div>
      {/* Only use this pattern if your schema components return React elements */}
      <WebPageSchema
        title="Page Title"
        description="Page description"
        url="/page"
        datePublished="2023-01-01"
        dateModified={new Date().toISOString()}
        imageUrl="/images/image.jpg"
      />
      
      {/* Page content */}
    </div>
  );
}
```

## Common ESLint Issues and Solutions

1. **"Expected an assignment or function call and instead saw an expression"**
   - Solution: Use the function call pattern for structured data components

2. **"X is defined but never used"**
   - Solution: Prefix unused variables with an underscore or remove the import

3. **"A require() style import is forbidden"**
   - Solution: Use ES6 import syntax instead of require()

4. **"React Hook X is called conditionally"**
   - Solution: Always call React Hooks at the top level, never inside conditionals

## Disabling ESLint Rules (Discouraged)

In rare cases where rules need to be disabled, do so at the smallest possible scope:

```typescript
// Line-specific disable (preferred if needed)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVar = 'something';

// Block-specific disable (use sparingly)
/* eslint-disable @typescript-eslint/no-unused-vars */
const unusedVar1 = 'something';
const unusedVar2 = 'something else';
/* eslint-enable @typescript-eslint/no-unused-vars */
```

## ESLint Configuration Changes

Our Next.js 15.2.4 projects use the following ESLint configuration in `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unused-expressions': 'error'
  }
};
```

---

This documentation aligns with Cyber Hand's 10 Critical Principles, particularly:
- Principle 3: Enforce Complete Type Safety
- Principle 10: Handle Errors Properly
