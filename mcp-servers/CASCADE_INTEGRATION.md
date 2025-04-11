# Cascade AI Integration Guide

This document explains how to integrate Cascade AI with the CyberHand MCP servers for automated code validation during development.

## Overview

Cascade AI can leverage our MCP (Model Context Protocol) servers to automatically validate code architecture, dependencies, and style during development. This enables the AI assistant to enforce project standards and best practices in real-time.

## Critical Requirements for STDIN/STDOUT MCP Servers

MCP servers for Cascade must adhere to these **critical requirements**:

1. **SDK Version Compatibility**:
   - Use `@modelcontextprotocol/sdk` version 1.9.0 exactly (not higher or lower)
   - Use `zod` version 3.24.2 or compatible

2. **Transport Protocol**: 
   - Use STDIN/STDOUT transport via `StdioServerTransport` (not HTTP)
   - Use `server.connect(transport)` method (not `server.listen(transport)`)

3. **Response Format**:
   - All responses must include a `content` array containing both `json` and `text` entries
   - Errors must use the standard error format with code and message

4. **Docker Image Naming Conventions**:
   - Images must be tagged with format: `cyber-hand/{service-name}:latest`
   - This must match exactly what's defined in Windsurf mcp_config.json

## Configuration

Cascade is configured to use our MCP servers via the `mcp-config.json` file in the Windsurf directory (~/.codeium/windsurf/mcp_config.json). This configuration defines the available tools, their parameters, and how to execute the servers.

### Windsurf MCP Configuration

The configuration file must follow this exact structure for STDIN/STDOUT MCP servers:

```json
{
  "mcpServers": {
    "your-validator-name": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "cyber-hand/your-validator-name:latest"
      ]
    }
  }
}
```

**CRITICAL**: The image name `cyber-hand/your-validator-name:latest` must match exactly what you've tagged your Docker image with. This is often different from what docker-compose names your images.

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

## Creating & Integrating a New MCP Server

When creating a new MCP server for Cascade integration, follow these steps in order:

1. **Create the MCP Server**:
   - Follow the guidelines in `MCP_SERVER_SETUP.md` using exact SDK versions
   - Ensure STDIN/STDOUT transport with `server.connect(transport)`
   - Format responses with proper `content` array structure

2. **Build and Tag the Docker Image**:
   ```bash
   # Build the Docker image using docker-compose
   docker-compose -f docker-compose.custom.yml build your-validator-name
   
   # Tag the built image with the format expected by Windsurf
   docker tag cyber-handcom-your-validator-name:latest cyber-hand/your-validator-name:latest
   ```

3. **Test the MCP Server Directly**:
   ```bash
   # Test with a simple request via direct Docker run command
   echo '{"id":"test-123","type":"request","name":"your_tool_name","params":{"path":".","options":{"verbose":true}}}' | \
   docker run -i --rm cyber-hand/your-validator-name:latest
   ```

4. **Add to Windsurf MCP Configuration**:
   - Edit `~/.codeium/windsurf/mcp_config.json`
   - Add your server configuration using the exact Docker image name you tagged

5. **Restart Cascade**:
   - Close and restart Cascade to pick up the new MCP tool
   - This is required for Cascade to recognize new MCP tools

## Recommended Practices

1. **Proactive Validation**: Ask Cascade to validate your code early and often
2. **Learn from Feedback**: Use validation results to improve your understanding of the project architecture
3. **Fix and Re-validate**: Address issues and ask Cascade to validate again
4. **Understand Why**: Ask Cascade to explain why certain patterns are preferred in the project

## Troubleshooting

### Common Integration Issues

#### "Unknown tool name" Errors

If Cascade returns "unknown tool name" when you try to use your MCP tool:

1. **Docker Image Naming**:
   - Verify the Docker image is tagged correctly: `cyber-hand/your-validator-name:latest`
   - Check that this matches exactly what's in the Windsurf configuration

2. **Tool Registration**:
   - Ensure the tool is registered in your standalone-server.js with the exact name
   - Tool names must be snake_case and match between server code and Cascade calls

3. **Cascade Restart**:
   - Restart Cascade completely to pick up new MCP tools
   - Cascade only loads MCP tools on startup

4. **Test Direct Docker Execution**:
   ```bash
   echo '{"id":"test-123","type":"request","name":"your_tool_name","params":{"path":".","options":{"verbose":true}}}' | \
   docker run -i --rm cyber-hand/your-validator-name:latest
   ```
   - If this doesn't work, your MCP server has implementation issues

#### Container Not Running or Communication Issues

1. **Check Container Status**:
   ```bash
   docker ps | findstr your-validator-name
   ```
   - If not running, start it: `docker-compose -f docker-compose.custom.yml up -d your-validator-name`

2. **Check Logs for Errors**:
   ```bash
   docker logs $(docker ps -q --filter name=your-validator-name)
   ```

3. **SDK Version Compatibility**:
   - Check that you're using exact SDK version 1.9.0: `npm list @modelcontextprotocol/sdk`
   - Incorrect SDK version is a common cause of communication errors

4. **Response Format Issues**:
   - Ensure responses include both `json` and `text` content entries
   - Use `server.connect()` not `server.listen()`

#### Multiple Instances Conflict

If you have multiple container instances of the same validator:

1. **Stop All Instances**:
   ```bash
   docker ps | findstr your-validator-name
   docker stop <container-ids>
   ```

2. **Clean Up Old Containers**:
   ```bash
   docker container prune -f
   ```

3. **Tag Fresh Image**:
   ```bash
   docker-compose -f docker-compose.custom.yml build your-validator-name
   docker tag cyber-handcom-your-validator-name:latest cyber-hand/your-validator-name:latest
   ```

## Extending MCP Tools

If you need to add new validation capabilities:

1. Update the relevant MCP server with new validation rules
2. Build and tag the Docker image correctly
3. Test the MCP server directly with Docker before Cascade integration
4. Update the tool definitions in Windsurf `mcp-config.json`
5. Restart Cascade to pick up the new tools
6. Document the new tools in this guide

## MCP Server Checklist Before Integration

Use this checklist to verify your MCP server before integrating with Cascade:

- [ ] Server code uses `@modelcontextprotocol/sdk@^1.9.0` exactly
- [ ] Server uses `server.connect(transport)` method
- [ ] All responses include both `json` and `text` entries in content array
- [ ] Docker image is tagged with format `cyber-hand/your-validator-name:latest`
- [ ] Windsurf config references the exact same Docker image name
- [ ] Direct Docker execution test passes
- [ ] Cascade has been restarted after adding the new tool

This checklist ensures that your MCP server will integrate properly with Cascade and avoid common integration issues.
