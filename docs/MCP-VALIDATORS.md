# MCP Validators Documentation

This document describes the Model Context Protocol (MCP) validators available for the Cyber Hand project and how to use them.

## Overview

Our project enforces code quality using three specialized MCP validators:

1. **Architecture Guard**: Ensures components follow Next.js 15.2.4 architecture patterns
2. **Dependency Validator**: Enforces proper dependency usage and prevents problematic imports
3. **Style Validator**: Checks that code follows our styling standards

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
    "options": { "verbose": true }
  }
}
```

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

## Integration with Cascade

These MCP servers can be used directly by Cascade AI. Configure Windsurf by:

1. Ensuring validators are running: `docker-compose -f docker-compose.custom.yml up -d`
2. Verifying Windsurf MCP config points to correct URLs:
   - Architecture Guard: `http://localhost:3901/v1`
   - Dependency Guard: `http://localhost:8002/v1`
   - Style Validator: `http://localhost:8003/v1`
3. When chatting with Cascade, you can request validation: "Can you check if my components follow our architecture rules?"
