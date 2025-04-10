# CyberHand MCP Infrastructure

This directory contains the Model Context Protocol (MCP) servers used for automated code validation in the CyberHand project.

## Overview

The MCP infrastructure consists of three main validation servers:

1. **Architecture Guard** - Enforces Next.js 15.2.4/React 19 architectural patterns and component organization
2. **Dependency Guard** - Validates package dependencies and import paths
3. **Style Validator** - Ensures consistent code style and formatting

These servers are containerized with Docker and integrated with Windsurf's Cascade AI for automated validation during coding sessions.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Windsurf/Cascade AI (for AI-assisted validation)

### Starting the MCP Servers

```bash
# Build the Docker images
npm run mcp:build

# Start all MCP servers
npm run mcp:start

# Stop the servers when done
npm run mcp:stop
```

### Manual Validation

You can manually validate your code using the following commands:

```bash
# Validate all (architecture, dependencies, and style)
npm run mcp:validate

# Validate only architecture
npm run mcp:validate:arch

# Validate only dependencies
npm run mcp:validate:dep

# Validate only code style
npm run mcp:validate:style
```

## Windsurf Cascade Integration

The MCP servers can be used by Windsurf's Cascade AI to validate code during development. The AI assistant will:

1. Suggest architectural improvements based on project standards
2. Validate dependencies and import paths before committing changes
3. Ensure code style consistency according to project rules

## CI/CD Integration

The MCP validation is integrated into the CI/CD pipeline via GitHub Actions:

- Pull requests to main and develop branches trigger automatic validation
- GitHub Action comments on PRs with validation results
- Merges are blocked if validation fails

## Server Endpoints

Each MCP server exposes the following endpoints:

- `/validate` - POST endpoint for validating the entire project
- `/health` - GET endpoint for checking server health
- `/mcp` - POST endpoint for Model Context Protocol tool calls

## Configuration

Each validator can be configured through environment variables or configuration files:

- Architecture Guard reads rules from `.eslintrc.json` and project-specific rules
- Dependency Guard uses package.json and dependency policies
- Style Validator uses ESLint and Prettier configurations

## Troubleshooting

If you encounter issues with the MCP servers:

1. Check logs with `docker-compose logs`
2. Ensure Docker is running properly
3. Verify that ports 8001-8003 are not in use by other applications
4. Restart the servers with `npm run mcp:stop && npm run mcp:start`

## Contributing

To extend or modify the MCP infrastructure:

1. Update the appropriate validator in the mcp-servers directory
2. Rebuild the Docker images with `npm run mcp:build`
3. Update tests if applicable
4. Update this documentation with any changes to endpoints or configuration
