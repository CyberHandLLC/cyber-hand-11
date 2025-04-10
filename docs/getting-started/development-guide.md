# Development Guide

> This comprehensive guide serves as the main reference for developers working on the Cyber Hand website. It follows Next.js 15.2.4 best practices and provides everything you need to understand the project, set up your environment, and contribute effectively.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Architecture](#architecture)
5. [Code Standards](#code-standards)
6. [Performance Guidelines](#performance-guidelines)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Process](#deployment-process)
9. [Troubleshooting](#troubleshooting)

## Project Overview

The Cyber Hand website is built with Next.js 15.2.4 and React 19, focusing on performance, accessibility, and SEO. Key characteristics include:

- **Performance Budget**: <3s initial load (3G), <300KB JS bundle
- **Core Web Vitals targets**: LCP <2.5s, TBT <200ms, CLS <0.1
- **SEO & Accessibility**: Lighthouse scores >90 for all categories
- **Server-first Approach**: Leveraging React Server Components
- **Type Safety**: TypeScript throughout the codebase

For a full project overview, see [Project Overview](./project-overview.md).

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.6.7 or later
- Git

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/CyberHandLLC/cyber-hand.git
   cd cyber-hand
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your local configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

For detailed setup instructions, see the [Setup Guide](./setup-guide.md).

## Development Workflow

### Branch Strategy

- `main` - Production branch, deployed to live site
- `develop` - Development branch, deployed to staging
- Feature branches - Named as `feature/feature-name`
- Bug fix branches - Named as `fix/bug-description`

### Commit Guidelines

Follow conventional commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code changes that neither fix nor add
test: adding or updating tests
chore: updates to build process, etc.
```

### Pull Request Process

1. Create a feature/fix branch from `develop`
2. Implement changes following code standards
3. Write/update tests
4. Submit PR to `develop` with description of changes
5. Address review comments
6. Merge after approval

## Architecture

The Cyber Hand website follows a modular architecture with clear separation of concerns:

### Key Architectural Principles

1. **Server-first Approach**: Next.js 15's React Server Components for optimal performance
2. **Component Modularity**: Breaking down UI into focused, reusable components
3. **Separation of Concerns**: Clear boundaries between data fetching, UI rendering, and client interactivity
4. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features
5. **Type Safety**: TypeScript throughout the entire codebase

### System Layers

The architecture consists of the following layers:

- **UI Layer**: React components organized in a component hierarchy
- **Data Layer**: Server Components fetching data and Context Providers
- **Business Logic**: Server Actions and service modules
- **Infrastructure**: Configuration, utilities, and middleware

For detailed architecture information, refer to the [System Reference](../architecture/system-reference.md).

## Code Standards

### TypeScript Guidelines

- Use explicit typing instead of `any`
- Prefer interface over type for object definitions
- Prefix unused variables with underscore

### Component Patterns

- Server Components should handle data fetching and pass data to Client Components
- Client Components should focus on interactivity
- Components should be small and focused (<500 lines)
- Use descriptive, consistent naming

### CSS Approach

- Use CSS Modules for component-specific styling
- Follow mobile-first responsive design
- Use theme variables from the central theme file

For complete code standards, see [Code Standards](./code-standards.md).

## Performance Guidelines

### Key Performance Strategies

1. **Server Components**: Reduce client-side JavaScript
2. **Code Splitting**: Dynamic imports for non-critical components
3. **Image Optimization**: Next.js Image component with proper sizing
4. **Font Optimization**: Preload fonts and use variable fonts
5. **CSS Containment**: Isolate layout impact
6. **Streaming**: Progressive page loading with Suspense

### Monitoring Performance

- Monitor Core Web Vitals using `web-vitals.js`
- Run Lighthouse audits regularly
- Track bundle size with build reports

For detailed performance guidelines, see [Performance Goals and Metrics](../performance/goals-and-metrics.md).

## Testing Strategy

### Testing Levels

1. **Unit Tests**: For utility functions and isolated components
2. **Component Tests**: For UI components using React Testing Library
3. **Integration Tests**: For feature workflows
4. **E2E Tests**: For critical user journeys

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test

# Run tests in watch mode
npm test -- --watch
```

## Deployment Process

### Environments

- **Development**: Local development environment
- **Staging**: For testing before production (vercel-staging.app)
- **Production**: Live website (cyber-hand.com)

### Deployment Steps

1. Merge changes to the appropriate branch
2. CI pipeline runs tests and builds
3. Vercel preview deployment for PRs
4. Manual approval for production deployment
5. Automated deployment to Vercel

## Troubleshooting

### Common Issues

- **Build failures**: Check for TypeScript errors or missing dependencies
- **SSR/CSR mismatches**: Look for hydration errors in the console
- **API errors**: Verify environment variables and API keys
- **Performance issues**: Check bundle size and component rendering

### Getting Help

- Check the issues in the GitHub repository
- Refer to [Next.js Documentation](https://nextjs.org/docs)
- Consult the team on Discord

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
