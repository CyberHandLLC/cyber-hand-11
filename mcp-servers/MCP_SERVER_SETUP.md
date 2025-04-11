# Setting Up MCP Servers for Cyber Hand Project

This guide documents the complete process for creating and configuring Model Context Protocol (MCP) servers that can be used with Codeium Cascade and other MCP-compatible clients. These MCP servers follow the official MCP specifications from the [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Setup Process](#step-by-step-setup-process)
4. [Docker Configuration](#docker-configuration)
5. [Testing and Validation](#testing-and-validation)
6. [Troubleshooting](#troubleshooting)
7. [Example MCP Servers](#example-mcp-servers)

## Overview

Model Context Protocol (MCP) servers are specialized services that provide validation and analysis capabilities to MCP clients like Cascade. They communicate via a standardized protocol that allows AI assistants to leverage specialized domain knowledge or validation capabilities.

Each MCP server in the Cyber Hand project follows a common structure:
- Implements the MCP protocol using the TypeScript SDK
- Uses stdin/stdout for communication
- Provides specific validation capabilities (architecture, dependencies, style, etc.)
- Runs as a Docker container for isolation and reproducibility

## Prerequisites

Before setting up a new MCP server, ensure you have:

1. Node.js (v18+) installed
2. Docker and Docker Compose installed
3. The MCP TypeScript SDK installed: `npm install @modelcontextprotocol/sdk@^1.9.0` (exact version is critical)
4. Basic understanding of the specific validation domain (architecture, dependencies, etc.)

## Step-by-Step Setup Process

### 1. Create the Server Directory Structure

```
mcp-servers/
└── your-validator-name/
    ├── Dockerfile
    ├── package.json
    ├── standalone-server.js
    └── README.md
```

### 2. Create the package.json File

```json
{
  "name": "your-validator-name",
  "version": "1.0.0",
  "description": "MCP server for validating [specific focus area]",
  "main": "standalone-server.js",
  "scripts": {
    "start": "node standalone-server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.1.0",
    "zod": "^3.22.4"
  }
}
```

### 3. Implement the MCP Server (standalone-server.js Template)

```javascript
/**
 * Your Validator Name MCP Server
 *
 * Implements Model Context Protocol with stdin/stdout transport following the official TypeScript SDK
 * Properly structured for compatibility with Cascade and other MCP clients
 * @see https://github.com/modelcontextprotocol/typescript-sdk
 */

// Import official MCP SDK components - MUST use version 1.9.0 or compatible
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const fs = require("fs");
const path = require("path");
const { z } = require("zod"); // Use version 3.24.2 for compatibility

// Set to true for additional debugging output on stderr
// This won't affect the MCP protocol communication, as it uses stdout
const DEBUG = process.env.MCP_DEBUG === "true";

// Debug logging helper that doesn't interfere with MCP protocol
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

// Sample validation results - Replace with your actual validation logic
const validationResults = {
  errors: [],
  warnings: [],
  // Add domain-specific results here
  summary: "Validation completed successfully"
};

// Actual validation function - This would contain real implementation
async function validateYourDomain(projectPath, options = {}) {
  debugLog(`Validating for: ${projectPath} with options:`, JSON.stringify(options));

  // Implement your actual validation logic here
  // This is just a placeholder that returns mock results
          // CRITICAL: Return results in proper MCP 1.9.0 content format
          // MUST include both json and text type entries in the content array
          return {
            content: [
              {
                type: "json",
                json: {
                  success: true,
                  errors: validationResults.errors,
                  warnings: validationResults.warnings,
                  // Add your specific validation results here
                  timestamp: new Date().toISOString()
                }
              },
              {
                type: "text",
                text: options.verbose 
                  ? validationResults.summary 
                  : "Architecture validation completed successfully"
              }
            ]
          };
  } catch (error) {
    debugLog("Error during validation:", error);
    return {
      success: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      summary: "Validation failed due to an error",
    };
  }
}

async function main() {
  try {
    debugLog("Starting Your Validator MCP Server");
    
    // Initialize MCP server with proper metadata for Cascade compatibility
    const server = new McpServer({
      name: "your-validator-name",
      version: "1.0.0",
      description: "Validates [your domain] for Next.js 15.2.4/React 19 projects according to Cyber Hand standards"
    });
    
    // Register your_validation_tool - Cascade requires this specific format
    server.tool(
      "your_validation_tool",
      {
        // Schema defined with Zod as required by MCP specification
        path: z.string().optional().describe("Path to the project root directory"),
        options: z.object({
          verbose: z.boolean().optional().describe("Include detailed validation information"),
          // Add your specific options here
        }).optional().describe("Validation options")
      },
      async ({ path, options = {} }) => {
        try {
          debugLog(`Processing validation for path: ${path || './'} with options:`, JSON.stringify(options));
          
          const projectPath = path || process.env.PROJECT_ROOT || process.cwd();
          const results = await validateYourDomain(projectPath, options);

          debugLog(`Validation complete for path: ${projectPath}`);
          
          // Format response according to MCP protocol specification for Cascade
          return {
            content: [
              {
                type: "json",
                json: results
              },
              {
                type: "text",
                text: results.summary
              }
            ],
          };
        } catch (error) {
          debugLog(`Error processing validation: ${error.message}`);
          // Return error in proper MCP format - this format is consistent across SDK versions
          return {
            error: {
              code: -32000,
              message: `Validation error: ${error.message}`
            }
          };
        }
      }
    );

    // Create a stdin/stdout transport using the official MCP SDK
    const transport = new StdioServerTransport();
    
    debugLog("MCP Server starting with stdin/stdout transport");
    
    // CRITICAL: Must use connect() method, NOT listen() for SDK 1.9.0 compatibility
    await server.connect(transport);
    debugLog("Server connected to transport, ready to receive messages");
    debugLog("Server connected to transport, ready to receive messages");
    debugLog("MCP Server initialization complete");
    
    // Handle process signals to ensure clean shutdown
    process.on('SIGINT', () => {
      debugLog('Received SIGINT, shutting down...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      debugLog('Received SIGTERM, shutting down...');
      process.exit(0);
    });
  } catch (error) {
    debugLog("Error starting MCP Server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  debugLog("Fatal error:", error);
  process.exit(1);
});

// Export the main function for testing
module.exports = { main, validateYourDomain };
```

### 4. Create the Dockerfile

```dockerfile
FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server code
COPY . .

# Configure environment for STDIN/STDOUT communication
# CRITICAL: Do NOT expose ports for STDIN/STDOUT MCP servers
ENV NODE_ENV=production
ENV FORCE_COLOR=1

# Start server with STDIN/STDOUT communication
CMD ["node", "standalone-server.js"]
```

### 5. Update Docker Compose Configuration

Add your new MCP server to the `docker-compose.yml` file:

```yml
version: '3.8'

services:
  your-validator-name:
    build: 
      context: ./mcp-servers/your-validator-name
      dockerfile: Dockerfile
    # CRITICAL: Remove ports for STDIN/STDOUT MCP servers
    # DO NOT include port mappings for STDIN/STDOUT communication
    stdin_open: true # CRITICAL for STDIN/STDOUT MCP protocol
    tty: true        # CRITICAL for proper terminal handling
    volumes:
      - ./:/app/project
      - your-validator-logs:/app/logs
    environment:
      - NODE_ENV=production
      - MCP_DEBUG=true
      - PROJECT_ROOT=/app/project
      # DO NOT set PORT environment variable for STDIN/STDOUT servers
    restart: unless-stopped
    # CRITICAL: Disable healthcheck for STDIN/STDOUT MCP servers
    healthcheck:
      disable: true

volumes:
  your-validator-logs:
```

## Docker Configuration

### Building the Docker Image

```bash
docker-compose build your-validator-name
```

### Starting the MCP Server

```bash
docker-compose up -d your-validator-name
```

### Stopping the MCP Server

```bash
docker-compose stop your-validator-name
```

## Testing and Validation

### Method 1: Using Node.js Client

Create a test script that communicates with your MCP server:

```javascript
// test-your-validator.js
const { spawn } = require('child_process');

// Function to test the MCP server
async function testMcpServer() {
  // Create the MCP protocol request
  const request = {
    id: `test-${Date.now()}`,
    type: "request",
    name: "your_validation_tool",
    params: {
      path: process.cwd(),
      options: {
        verbose: true
      }
    }
  };
  
  console.log(`Sending test request to your-validator-name...`);
  
  // Spawn the Docker container with stdin/stdout handling
  const dockerProcess = spawn('docker', [
    'exec',
    '-i',
    'cyber-handcom-your-validator-name-1',
    'node',
    'standalone-server.js'
  ]);
  
  let responseData = '';
  
  // Collect response data
  dockerProcess.stdout.on('data', (data) => {
    responseData += data.toString();
  });
  
  // Log any errors
  dockerProcess.stderr.on('data', (data) => {
    console.error(`MCP Server stderr: ${data}`);
  });
  
  // Handle process completion
  dockerProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Docker process exited with code ${code}`);
      return;
    }
    
    try {
      const response = JSON.parse(responseData);
      console.log('MCP Server response:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Error parsing response:', error.message);
    }
  });
  
  // Send the request
  dockerProcess.stdin.write(JSON.stringify(request) + '\n');
  dockerProcess.stdin.end();
}

testMcpServer();
```

Run the test script:
```bash
node test-your-validator.js
```

### Method 2: Using Cascade's Built-in MCP Tools

When properly configured, Cascade will automatically detect and use your MCP server. The tool should be available in Cascade as `mcpX_your_validation_tool` where X is the sequence number assigned by Cascade.

## Docker Integration Critical Points

### Docker Image Naming Conventions

**CRITICAL**: For proper Cascade integration, Docker image naming must follow these conventions:

1. **Docker Image Names**:
   - In docker-compose.custom.yml: Built images typically get named `{project-directory-name}_{service-name}`
   - In Windsurf config: Images must be referenced as `cyber-hand/{service-name}:latest`

2. **Docker Image Tagging**:
   Always tag built images to match Windsurf's expected format:
   ```bash
   # After building with docker-compose
   docker tag cyber-handcom-your-validator-name:latest cyber-hand/your-validator-name:latest
   ```

3. **Docker Container Configuration**:
   - For STDIN/STDOUT MCP servers, include these settings in docker-compose.yml:
     ```yaml
     your-validator-name:
       stdin_open: true  # CRITICAL for STDIN/STDOUT
       tty: true         # CRITICAL for STDIN/STDOUT
       healthcheck:
         disable: true   # No HTTP healthcheck for STDIN/STDOUT servers
     ```
   - DO NOT include port mappings for STDIN/STDOUT MCP servers

## Troubleshooting

### Common Issues

1. **No Response from MCP Server**
   - Check if the server is running: `docker-compose ps`
   - Verify stdin_open and tty are set to true in docker-compose.yml
   - Check logs: `docker-compose logs your-validator-name`
   - Verify Docker image name matches exactly what's in Windsurf config

2. **Invalid MCP Protocol Responses**
   - Ensure responses follow the exact MCP protocol format for SDK version 1.9.0
   - Check that content array has both JSON and text entries
   - Verify the response has the correct `id`, `type`, and `request_id` fields
   - Confirm you're using `server.connect(transport)` not `server.listen(transport)`

3. **MCP Server Not Recognized by Cascade**
   - Make sure tool names follow the naming conventions (snake_case)
   - Ensure Zod schemas are properly defined
   - Verify Docker image is properly tagged according to naming conventions
   - Restart Cascade to pick up new MCP tools

4. **"Unknown tool name" Errors**
   - Ensure the tool is registered properly in mcp-config.json
   - Verify Docker image is tagged with the right name format
   - Check that tools have exactly the same name in standalone-server.js and mcp-config.json
   - Try restarting Cascade to reload MCP tools

### Debugging

Enable debug logging by setting the `MCP_DEBUG` environment variable to `true` in the docker-compose.yml file. This will output debug information to stderr, which can be viewed with:

```bash
docker-compose logs -f your-validator-name
```

## Example MCP Servers

The Cyber Hand project includes several example MCP servers:

### 1. Architecture Guard

Validates project architectural patterns against Next.js 15.2.4/React 19 best practices and enforces component boundaries, file size limits, and proper Server/Client Component separation.

### 2. Dependency Validator

Checks dependencies for security vulnerabilities, version compatibility, unused packages, and enforces proper import patterns between Server and Client components.

### 3. Style Validator

Ensures consistent styling patterns, proper use of CSS variables, and adherence to design system guidelines.

## Critical Checklist for MCP Server Creation

Use this checklist when creating new MCP servers to avoid common issues:

### Dependencies
- [ ] Use `@modelcontextprotocol/sdk` version 1.9.0 or compatible
- [ ] Use `zod` version 3.24.2 or compatible
- [ ] Verify dependency versions match existing working MCP servers

### Implementation
- [ ] Use `server.connect(transport)` NOT `server.listen(transport)`
- [ ] Format responses with `content` array containing both `json` and `text` entries
- [ ] Use proper error response format with error code and message
- [ ] Follow snake_case naming for all tool names

### Docker Configuration
- [ ] Remove port mappings and PORT environment variable for STDIN/STDOUT servers
- [ ] Add `stdin_open: true` and `tty: true` to docker-compose
- [ ] Disable healthcheck with `healthcheck.disable: true`
- [ ] Tag Docker image to match Windsurf format: `cyber-hand/{service-name}:latest`

### Windsurf/Cascade Integration
- [ ] Add service to Windsurf mcp_config.json with correct Docker image name
- [ ] Test MCP tools with direct Docker commands before Cascade integration
- [ ] Define proper Zod schemas for all parameters
- [ ] Restart Cascade to pick up new MCP tools

By following this checklist and the detailed guidelines in this document, you can create standardized MCP servers that work seamlessly with Cascade and other MCP clients, providing specialized validation capabilities for your project while avoiding common integration pitfalls.
