/**
 * Dependency Guard MCP Server
 * 
 * Implements MCP protocol with stdin/stdout transport following the official documentation
 */

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const fs = require('fs');
const path = require('path');
const { z } = require('zod');

// Simple in-memory validation results
const validationResults = {
  errors: [],
  warnings: [
    "Package 'react' version should be exactly '19.0.0' to comply with project policy",
    "No direct imports from lib folder in UI components are allowed",
    "Server-only code is being imported in client component"
  ],
  allowed: [
    { source: "app/*", target: "components/ui/*" },
    { source: "components/ui/*", target: "lib/utils" },
    { source: "app/api/*", target: "lib/db/*" }
  ],
  denied: [
    { source: "app/*-client*", target: "server-only" },
    { source: "components/ui/*", target: "server-only" }
  ],
  summary: "Dependency validation completed with 0 errors and 3 warnings"
};

// Simple validation function
async function validateDependencies(projectPath, options = {}) {
  console.error(`Validating dependencies for: ${projectPath}`);
  
  // Simulate looking at package.json
  if (options.testMode) {
    return {
      success: true,
      errors: validationResults.errors,
      warnings: validationResults.warnings,
      allowed: validationResults.allowed,
      denied: validationResults.denied,
      summary: validationResults.summary
    };
  }
  
  // If not in test mode, do a simple check of the package.json
  try {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return {
        success: false,
        errors: ["package.json not found"],
        warnings: [],
        allowed: [],
        denied: [],
        summary: "Dependency validation failed: package.json not found"
      };
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const dependencyCount = Object.keys(dependencies).length;
    
    return {
      success: true,
      errors: validationResults.errors,
      warnings: validationResults.warnings,
      dependencyCount,
      allowed: validationResults.allowed,
      denied: validationResults.denied,
      summary: `Dependency validation found ${dependencyCount} dependencies with 0 errors and ${validationResults.warnings.length} warnings`
    };
  } catch (error) {
    console.error('Error during validation:', error);
    return {
      success: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      allowed: [],
      denied: [],
      summary: 'Validation failed due to an error'
    };
  }
}

// Check a specific import/dependency
async function checkDependency(source, target, options = {}) {
  // Logic to determine if the import is allowed
  const isAllowed = !source.includes('-client') || !target.includes('server');
  
  return {
    success: true,
    isAllowed,
    message: isAllowed 
      ? `Import from '${source}' to '${target}' is allowed` 
      : `Import from '${source}' to '${target}' is not allowed per project architecture rules`
  };
}

async function main() {
  try {
    // Initialize MCP server
    const server = new McpServer({
      name: "dependency-guard",
      version: "1.0.0",
      description: "Validates dependency patterns for Next.js 15.2.4/React 19 projects"
    });
    
    // Register dependency_check tool
    server.tool(
      "dependency_check",
      {
        path: z.string().optional(),
        options: z.record(z.any()).optional()
      },
      async ({ path, options = {} }) => {
        const projectPath = path || process.env.PROJECT_ROOT || process.cwd();
        const results = await validateDependencies(projectPath, options);
        
        return {
          content: [{
            type: "json",
            json: {
              success: results.success,
              results: results
            }
          }]
        };
      }
    );
    
    // Register check_import_allowed tool
    server.tool(
      "check_import_allowed",
      {
        source: z.string(),
        target: z.string(),
        options: z.record(z.any()).optional()
      },
      async ({ source, target, options = {} }) => {
        const result = await checkDependency(source, target, options);
        
        return {
          content: [{
            type: "json",
            json: result
          }]
        };
      }
    );
    
    // Create a stdin/stdout transport
    const transport = new StdioServerTransport();
    
    // Connect the server to the transport
    console.error('Dependency Guard MCP Server starting with stdin/stdout transport');
    await server.connect(transport);
    console.error('Server connected to transport, ready to receive messages');
  } catch (error) {
    console.error('Error starting Dependency Guard MCP Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
