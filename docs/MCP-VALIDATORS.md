# MCP Validators Documentation

This document describes the Model Context Protocol (MCP) validators available for the Cyber Hand project and how to use them.

## Overview

Our project enforces code quality using four specialized MCP validators:

1. **Architecture Guard**: Ensures components follow Next.js 15.2.4 architecture patterns
2. **Dependency Validator**: Enforces proper dependency usage and prevents problematic imports
3. **Style Validator**: Checks that code follows our styling standards
4. **Documentation Validator**: Ensures documentation is up-to-date, consistent, and comprehensive

All validators can be used through:

- Command-line scripts
- CI/CD pipelines
- Pre-commit hooks
- Windsurf Cascade AI (if configured)

## Architecture Guard

**Port**: 3901

### Rules Enforced

- **Component Organization**:

  - Server Components for data fetching
  - Client Components only at leaf nodes
  - Proper Suspense boundaries following Next.js 15 streaming patterns
  - UI components separate from data fetching logic

- **File Size Limits**:

  - Files must not exceed 500 lines
  - Functions should be modular and focused

- **Component Naming Conventions**:

  - Client components follow `-client.tsx` suffix pattern
  - Page components follow proper routing structure
  - Component names must match their functionality

- **React Patterns**:
  - Proper use of `use client` directive only when required
  - Implementation of React 19 features where appropriate
  - Correct caching behavior with React's `cache()` for data fetching

- **Next.js 15.2.4 Specific Validations**:

  - **Server/Client Component Boundaries**:
    - Detection of browser APIs or hooks in Server Components
    - Verification of proper `use client` directive placement
    - Validation of component import patterns between Server and Client components
  
  - **Suspense Boundary Implementation**:
    - Validation of Suspense boundaries for streaming data
    - Detection of missing Error boundaries around Suspense
    - Prevention of nested Suspense boundaries causing waterfalls
    - Verification of meaningful fallback UI for better UX
  
  - **Data Fetching Patterns**:
    - Enforcement of React's `cache()` for data fetching deduplication
    - Verification of parallel data fetching with Promise.all()
    - Validation of proper Next.js 15.2.4 fetch options for caching
    - Separation of data fetching logic from component rendering

### Usage

```bash
# CLI
node scripts/validate.js architecture ./app

# API
POST http://localhost:3901/v1
{
  "name": "architecture_check",
  "tool_call_id": "my-tool-123",
  "arguments": {
    "path": "./app",
    "options": { 
      "verbose": true,
      "checkSuspenseBoundaries": true,
      "checkDataFetching": true,
      "includeServerComponents": true,
      "includeClientComponents": true 
    }
  }
}
```

### Available Options

- `verbose`: Include detailed validation information (default: false)
- `checkSuspenseBoundaries`: Validate proper Suspense boundary usage (default: false)
- `checkDataFetching`: Validate data fetching patterns including cache() (default: false)
- `includeServerComponents`: Include server component validation (default: true)
- `includeClientComponents`: Include client component validation (default: true)
- `checkDependencies`: Check dependency compliance (default: false)
- `validateTypes`: Validate TypeScript types (default: false)

## Dependency Validator

**Port**: 8002

### Rules Enforced

- **Package Versioning**:

  - React 19 compatibility
  - Next.js 15.2.4 compatibility
  - All TypeScript dependencies aligned

- **Import Rules**:

  - Server components cannot import client components
  - Client components can only import specific server utilities
  - No direct imports from restricted paths
  - No circular dependencies

- **Package Policing**:
  - Prefer internal utilities over external packages
  - Whitelist of approved packages
  - Size limits for dependencies

### Usage

```bash
# CLI
node scripts/validate.js dependencies ./package.json

# Check specific import
node scripts/validate.js check-import ./app/page.tsx ./components/Button-client.tsx

# API
POST http://localhost:8002/v1
{
  "name": "dependency_check",
  "tool_call_id": "my-tool-123",
  "arguments": {
    "path": "./",
    "options": { "verbose": true }
  }
}
```

## Style Validator

**Port**: 8003

### Rules Enforced

- **TypeScript Standards**:

  - TypeScript interfaces instead of 'any'
  - Underscore prefix for unused variables
  - Explicit typing

- **Code Formatting**:

  - ESLint + Prettier integration
  - Consistent spacing and indentation
  - Maximum line length
  - No trailing whitespace

- **Component Style**:
  - Theme-based styling with centralized CSS variables
  - Proper error boundaries
  - Consistent component structure

### Usage

```bash
# CLI
node scripts/validate.js style ./app

# Check specific file
node scripts/validate.js check-file ./app/page.tsx

# API
POST http://localhost:8003/v1
{
  "name": "style_check",
  "tool_call_id": "my-tool-123",
  "arguments": {
    "path": "./app",
    "options": { "verbose": true }
  }
}
```

## Running All Validators

```bash
# Run all validators on the entire project
node scripts/validate.js all ./

# Run all validators on a specific directory
node scripts/validate.js all ./app
```

## Docker Setup

All validators run in Docker containers for consistent environments:

```bash
# Start all validators
docker-compose -f docker-compose.custom.yml up -d

# Stop all validators
docker-compose -f docker-compose.custom.yml down
```

## Documentation Validator

**Port**: 7003

### Rules Enforced

- **Freshness Checking**:

  - Compares documentation timestamps against code changes
  - Tracks when documentation was last updated
  - Flags documentation that's out of sync with code
  - Monitors documentation age relative to feature changes

- **Consistency Validation**:

  - Ensures consistent terminology throughout documentation
  - Validates internal references and links between documents
  - Checks that code examples match actual implementation patterns
  - Identifies broken links and references

- **Best Practices Adherence**:

  - Verifies documentation follows Cyber Hand architectural principles
  - Ensures technical accuracy against Next.js 15.2.4 standards
  - Checks accessibility guidelines in UI component documentation
  - Validates examples follow project coding standards

- **Coverage Analysis**:
  - Tracks which components/features have documentation
  - Identifies undocumented or poorly documented areas
  - Generates documentation coverage reports
  - Recommends areas needing documentation improvement

### Usage

```bash
# CLI
node scripts/validate.js documentation ./

# Check specific document
node scripts/validate.js check-doc ./docs/architecture.md

# API
POST http://localhost:7003/v1
{
  "name": "documentation_validate",
  "tool_call_id": "my-tool-123",
  "arguments": {
    "path": "./",
    "options": { 
      "verbose": true,
      "validators": ["freshness", "consistency", "best-practices", "coverage"],
      "minCoveragePercentage": 70
    }
  }
}
```

### Available Options

- `verbose`: Include detailed validation information (default: false)
- `validators`: Array of validators to run (default: all validators)
  - Options: `"freshness"`, `"consistency"`, `"best-practices"`, `"coverage"`
- `minCoveragePercentage`: Minimum acceptable documentation coverage percentage (default: 70)
- `skipExternalLinks`: Skip validation of external links in documentation (default: false)
- `requireLanguage`: Require code blocks to specify language (default: true)
- `includeEmpty`: Include empty categories in coverage analysis (default: false)

## Integration with Cascade

These MCP servers can be used directly by Cascade AI. Configure Windsurf by:

1. Ensuring validators are running: `docker-compose -f docker-compose.custom.yml up -d`
2. Verifying Windsurf MCP config points to correct URLs:
   - Architecture Guard: `http://localhost:3901/v1`
   - Dependency Guard: `http://localhost:8002/v1`
   - Style Validator: `http://localhost:8003/v1`
   - Documentation Validator: `http://localhost:7003/v1`
3. When chatting with Cascade, you can request validation: "Can you check if my components follow our architecture rules?" or "Can you validate the documentation for our project?"
