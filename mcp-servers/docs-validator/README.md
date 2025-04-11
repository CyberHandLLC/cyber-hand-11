# Documentation Validator MCP Server

A Model Context Protocol (MCP) server for validating documentation quality, freshness, consistency, and coverage in Next.js 15.2.4/React 19 projects.

## Overview

The Documentation Validator ensures that your project documentation remains accurate, up-to-date, and comprehensive as your codebase evolves. It provides four key validators:

1. **Freshness Validator**: Compares documentation timestamps against code changes
2. **Consistency Validator**: Ensures terminology consistency and validates references
3. **Best Practices Validator**: Validates adherence to Cyber Hand's architectural principles
4. **Coverage Validator**: Identifies undocumented areas and generates coverage reports

## Installation

```bash
cd mcp-servers/docs-validator
npm install
```

## Usage

### Start the Server

```bash
# Start with debug logging
MCP_DEBUG=true npm start

# Start without debug logging
npm start
```

The server will run on port 7003 by default.

### Manual Testing

A test script is provided to validate your documentation:

```bash
# Test the validator on the current project
npm test

# Test on a specific project path
node test/test-validator.js /path/to/your/project
```

### API Endpoints

The server exposes the following endpoints:

- `POST /`: Main validation endpoint for full documentation validation
  - Request body: `{ "operation": "validate", "path": "/path/to/project", "options": { ... } }`
  - Returns: Comprehensive validation results

- `POST /check`: Quick check if documentation exists
  - Request body: `{ "operation": "check", "path": "/path/to/project" }`
  - Returns: Whether documentation exists in the specified path

### Configuration Options

The validator accepts the following options:

| Option | Description | Default |
|--------|-------------|---------|
| `validators` | Array of validators to run | `["freshness", "consistency", "best-practices", "coverage"]` |
| `verbose` | Include detailed validation information | `false` |
| `minCoveragePercentage` | Minimum acceptable documentation coverage | `70` |
| `skipExternalLinks` | Skip validation of external links | `false` |
| `requireLanguage` | Require code blocks to specify language | `true` |
| `includeEmpty` | Include empty categories in coverage | `false` |

## Validators

### Freshness Validator

Compares documentation update times with code changes to ensure docs stay current:

- Tracks when documentation was last updated
- Compares timestamps against code changes in related directories
- Flags documentation that's out of sync with code
- Uses git history to detect related file changes

### Consistency Validator

Ensures documentation terminology and references remain consistent:

- Validates consistent terminology across all documentation
- Checks internal references and links between documents
- Validates code examples against actual implementation patterns
- Identifies broken links and references

### Best Practices Validator

Ensures documentation adheres to Cyber Hand's technical standards:

- Verifies documentation reflects core architectural principles
- Ensures technical accuracy against Next.js 15.2.4 standards
- Checks that component documentation includes accessibility guidelines
- Validates that examples follow project coding standards

### Coverage Validator

Analyzes how completely the project is documented:

- Tracks which components and features have documentation
- Identifies undocumented or poorly documented areas
- Generates documentation coverage reports
- Provides recommendations for documentation improvements

## Integration with Other MCP Servers

The Documentation Validator works alongside:

- **Architecture Guard**: Validates Next.js architectural patterns
- **Dependency Validator**: Ensures proper dependency usage
- **Style Validator**: Checks code styling standards

## Docker Support

Include the Documentation Validator in your Docker setup:

```yaml
# In docker-compose.custom.yml
services:
  docs-validator:
    build: ./mcp-servers/docs-validator
    ports:
      - "7003:7003"
    environment:
      - MCP_DEBUG=true
```

## Contributing

To enhance the Documentation Validator:

1. Add new validation rules in the appropriate validator module
2. Update tests to cover new functionality
3. Document new features in MCP-VALIDATORS.md
