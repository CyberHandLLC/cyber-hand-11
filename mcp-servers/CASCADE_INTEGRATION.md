# Cascade AI Integration Guide

This document explains how to integrate Cascade AI with the CyberHand MCP servers for automated code validation during development.

## Overview

Cascade AI can leverage our MCP (Model Context Protocol) servers to automatically validate code architecture, dependencies, and style during development. This enables the AI assistant to enforce project standards and best practices in real-time.

## Configuration

Cascade is already configured to use our MCP servers via the `mcp-config.json` file in the project root. This configuration defines the available tools and their parameters.

### Available MCP Tools

When working with Cascade AI, the following validation tools are available:

#### Architecture Validation

```
architecture_check: Validates code architecture according to project standards
Parameters:
- path: The path to check (optional)
- options: Additional validation options (optional)
```

Example prompt: "Can you validate the architecture of my component?"

#### Dependency Validation

```
dependency_check: Validates project dependencies against policy
Parameters:
- path: The path to check (optional)
- options: Additional validation options (optional)

check_import_allowed: Checks if an import is allowed by architecture rules
Parameters:
- source: The source module or file path (required)
- target: The target module being imported (required)
- options: Additional options (optional)
```

Example prompt: "Is it okay to import from '@/lib/utils' in a client component?"

#### Style Validation

```
style_check: Validates code style according to project standards
Parameters:
- path: The path to check (optional)
- options: Additional validation options (optional)

check_file_style: Checks a specific file for style issues
Parameters:
- filePath: The path to the file to check (required)
- options: Additional options (optional)
```

Example prompt: "Check if my component follows the project's style guidelines."

## Workflow Integration

### Before Coding

Ask Cascade to explain architectural patterns:

- "What are the architectural guidelines for creating a new Next.js 15 component in this project?"
- "How should I structure a streaming-compatible page with proper Suspense boundaries?"

### During Development

Request architecture validation:

- "Can you check if this component follows our architecture rules?"
- "Is there a better way to organize this code based on our project guidelines?"

Validate dependencies:

- "Are these imports valid according to our architecture?"
- "Is it okay to import this component here or should I create an abstraction?"

### Before Committing

Run comprehensive validation:

- "Validate all my changes against our architecture, dependency, and style rules."
- "Are there any issues I should fix before committing this code?"

## Recommended Practices

1. **Proactive Validation**: Ask Cascade to validate your code early and often
2. **Learn from Feedback**: Use validation results to improve your understanding of the project architecture
3. **Fix and Re-validate**: Address issues and ask Cascade to validate again
4. **Understand Why**: Ask Cascade to explain why certain patterns are preferred in the project

## Troubleshooting

If Cascade is unable to access the MCP servers:

1. Ensure MCP servers are running (`npm run mcp:start`)
2. Check server logs for errors (`docker-compose logs`)
3. Verify that ports 8001-8003 are accessible
4. Restart the MCP servers if needed (`npm run mcp:stop && npm run mcp:start`)

If validation results seem incorrect:

1. Review the rule configurations
2. Check if recent project changes require rule updates
3. Consult with the team lead about architecture guideline changes

## Extending MCP Tools

If you need to add new validation capabilities:

1. Update the relevant MCP server with new validation rules
2. Update the tool definitions in `mcp-config.json`
3. Document the new tools in this guide
