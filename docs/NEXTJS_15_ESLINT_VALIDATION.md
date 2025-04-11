# Next.js 15.2.4 ESLint Validation Flow

This document outlines how our MCP validators check for ESLint compliance in Next.js 15.2.4 applications according to Cyber Hand's critical principles.

## 1. Automated Validation Flow

![Next.js 15.2.4 Validation Flow](https://mermaid.ink/img/pako:eNp1U01v2zAM_SuCThvgDU3Slm3Ow9JdNqA4hqKHIAhoi0mE2ZIXiU5SFP3vI-24X-hwMPU-kY-PWk7QKpEA5dLWSnj0bx15FE0ppaKmw-hZa0Mj9cI3ykXyKiWXuYyCt9JyLZsW3zK1p8h9jfxESEjZYpbCYjdwzLijL3gj7D90pJdnZZ1H7wnP0PUq9gTFrSRj3-mTRwJy2A6Vk0lYVwG1KDz0WDmVtSJlRjfQyUJ9oi5aRLOy_IVW3WLyUolGtI5-IMdIxhTUJEDneBMUNQjSvjYYAiEkdInf6SJtPZQNNsgHvmKGaKx1wdxPvT-AipLGbW4_z_x6v4DK8XRkZ8M-Tm4e5svJZLmaz2a3bLGcTd-hdfqUznrnrLVzwULu7-b2Zbgkl51SHkKLuKf-b_FmM10tZ_P5IqTy9QDOWYbDBt_t7eP9crVcrVdM5c1V6MhT_4IQTYfKSRY7sGhdzRolxFnGKB4olsGtVXmU48VJb6jLa5ksrfv8ZHNN9c4iXyhVZaElNqpsSZyU4Dv7rRg-W0L-PNSCLeDQtJRc7S5QVCzpQGNEUJyuGxyCKz1UcKMRFdx3m6nX9xYYQe3YqQtwhJhzDj39sxc5pTmUvcCCIQE5VXqQs3SClvP-D3D64t_XNLNPLl6_6Q8)

## 2. Validation Tools Integration

Our MCP Orchestrator now includes ESLint compliance validation as part of the documentation validation process:

1. **Architecture Guard** checks:
   - Proper Server/Client component separation
   - Correct use of Suspense boundaries
   - Valid use of `cache()` for data fetching

2. **Documentation Validator** now checks:
   - ESLint compliance in documentation code examples
   - Proper structured data implementation
   - Unused variable patterns (must use underscore prefix)

3. **Style Validator** ensures:
   - No require() style imports in TypeScript files
   - Client Components only at leaf nodes (with use client)
   - No unused expressions in JSX

## 3. ESLint Rules Checked by Validators

The MCP validators now enforce the following ESLint rules specific to Next.js 15.2.4:

| Rule | Description | Example of Correct Usage |
|------|-------------|--------------------------|
| `@typescript-eslint/no-unused-vars` | Unused variables must have underscore prefix | `const _unusedVar = value;` |
| `@typescript-eslint/no-require-imports` | No require() style imports | `import { Component } from '@/components/component';` |
| `@typescript-eslint/no-unused-expressions` | No unused expressions in JSX | `{WebPageSchema({ title: "Title" })}` |
| `react-hooks/rules-of-hooks` | React hooks must be at top level | `const [state, setState] = useState(initial);` |

## 4. Automated Checks in CI/CD

Our GitHub Actions workflow now includes validation checks that align with Next.js 15.2.4:

```yaml
- name: Validate Documentation ESLint Compliance
  run: |
    npm run mcp:validate-docs -- --validators=eslint-compliance
  if: steps.change-detection.outputs.docs-changed == 'true'
```

## 5. Schema Implementation Guidance

For structured data components, the validator enforces the function call pattern:

```tsx
// ✅ CORRECT: Function call pattern with curly braces
{WebPageSchema({
  title: "Page Title",
  description: "Page description",
  url: "/page"
})}

// ❌ INCORRECT: JSX component causing unused expression error
<WebPageSchema
  title="Page Title" 
  description="Page description"
  url="/page"
/>
```

## 6. Visual Comparison of Component Patterns

**Correct Pattern (Function Call):**
```tsx
export default function Page() {
  return (
    <div>
      {WebPageSchema({
        title: "Page Title",
        description: "Page description"
      })}
      <h1>Page Content</h1>
    </div>
  );
}
```

**Incorrect Pattern (JSX):**
```tsx
export default function Page() {
  return (
    <div>
      <WebPageSchema
        title="Page Title"
        description="Page description"
      />
      <h1>Page Content</h1>
    </div>
  );
}
```

---

This documentation and validation flow aligns with Cyber Hand's 10 Critical Principles:
- **Strict Component Boundaries**: Validates Server/Client component separation
- **Type Safety**: Enforces TypeScript interfaces and proper typing
- **Performance Requirements**: Ensures proper code patterns that affect Core Web Vitals
- **Error Handling**: Catches errors at build time rather than runtime
