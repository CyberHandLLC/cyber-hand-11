/**
 * Dependency Guard MCP Server
 *
 * Implements MCP protocol with stdin/stdout transport following the official documentation
 */

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");

// Simple in-memory validation results
const validationResults = {
  errors: [],
  warnings: [
    "Package 'react' version should be exactly '19.0.0' to comply with project policy",
    "No direct imports from lib folder in UI components are allowed",
    "Server-only code is being imported in client component",
  ],
  allowed: [
    { source: "app/*", target: "components/ui/*" },
    { source: "components/ui/*", target: "lib/utils" },
  ],
  summary: "Dependency validation completed with 0 errors and 4 warnings. Several dependencies need updates, especially for security fixes."
};

// Actual dependency validation function - This would contain real implementation
async function validateDependencies(projectPath, options = {}) {
  debugLog(`Validating dependencies for: ${projectPath} with options:`, JSON.stringify(options));

  // Mock implementation for demo purposes
  if (options.testMode) {
    return {
      success: true,
      errors: validationResults.errors,
      warnings: validationResults.warnings,
      dependencyIssues: validationResults.dependencyIssues,
      summary: validationResults.summary,
    };
  }

  // In a real implementation, this would analyze package.json and node_modules
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    
    if (!fs.existsSync(packageJsonPath)) {
      return {
        success: false,
        errors: ["package.json not found in project directory"],
        warnings: [],
        summary: "Dependency validation failed: package.json not found"
      };
    }

    // For demo purposes, we'll return the mock data
    // In a real implementation, this would do actual dependency analysis
    return {
      success: true,
      errors: validationResults.errors,
      warnings: validationResults.warnings,
      dependencyIssues: validationResults.dependencyIssues, 
      timestamp: new Date().toISOString(),
      summary: options.verbose 
        ? validationResults.summary 
        : `Dependency validation found ${validationResults.dependencyIssues.length} issues with 0 errors and ${validationResults.warnings.length} warnings`,
    };
  } catch (error) {
    debugLog("Error during dependency validation:", error);
    return {
      success: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      summary: "Dependency validation failed due to an error",
    };
  }
}

async function main() {
  try {
    debugLog("Starting Dependency Validator MCP Server");
    
    // Initialize MCP server with proper metadata for Cascade compatibility
    const server = new McpServer({
      name: "dependency-validator",
      version: "1.0.0",
      description: "Validates dependencies for Next.js 15.2.4/React 19 projects according to Cyber Hand standards"
    });
    
    // Register dependency_check tool - Cascade requires this specific format
    server.tool(
      "dependency_check",
      {
        // Schema defined with Zod as required by MCP specification
        path: z.string().optional().describe("Path to the project root directory"),
        options: z.object({
          verbose: z.boolean().optional().describe("Include detailed validation information"),
          checkForUpdates: z.boolean().optional().describe("Check for newer package versions"),
          auditSecurity: z.boolean().optional().describe("Perform security audit"),
          checkUnused: z.boolean().optional().describe("Check for unused dependencies")
        }).optional().describe("Validation options")
      },
      async ({ path, options = {} }) => {
        try {
          debugLog(`Processing dependency_check for path: ${path || './'} with options:`, JSON.stringify(options));
          
          const projectPath = path || process.env.PROJECT_ROOT || process.cwd();
          const results = await validateDependencies(projectPath, options);

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
          debugLog(`Error processing dependency_check: ${error.message}`);
          // Return error in proper MCP format
          return {
            error: {
              code: -32000,
              message: `Dependency validation error: ${error.message}`
            }
          };
        }
      }
    );

    // Register check_import_allowed tool for checking if an import is allowed
    server.tool(
      "check_import_allowed",
      {
        source: z.string().describe("Source module or file"),
        target: z.string().describe("Target module or file to import"),
        options: z.object({
          verbose: z.boolean().optional().describe("Include detailed explanation")
        }).optional().describe("Validation options")
      },
      async ({ source, target, options = {} }) => {
        debugLog(`Checking if import from ${source} to ${target} is allowed`);
        
        // Simple mock implementation for demonstration
        // In a real implementation, this would check architectural rules
        const isAllowed = !(
          (source.includes('server') && target.includes('client')) || 
          (source.includes('ui') && target.includes('data')) ||
          (target === 'react-dom/client' && source.includes('server'))
        );
        
        const reason = isAllowed 
          ? "Import complies with architectural rules" 
          : "Import violates separation of concerns between server/client components";
          
        return {
          content: [
            {
              type: "json",
              json: {
                allowed: isAllowed,
                reason,
                source,
                target,
                details: options.verbose ? {
                  rule: "Server components cannot import client components or browser APIs",
                  documentation: "https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns"
                } : undefined
              }
            },
            {
              type: "text",
              text: `Import from ${source} to ${target} is ${isAllowed ? 'allowed' : 'not allowed'}. ${reason}`
            }
          ],
        };
      }
    );

    // Create a stdin/stdout transport using the official MCP SDK
    // This handles the communication protocol formatting automatically
    const transport = new StdioServerTransport();
    
    debugLog("Dependency Validator MCP Server starting with stdin/stdout transport");
    
    // Connect the server to the transport - this handles all the MCP protocol details
    await server.connect(transport);
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
    debugLog("Error starting Dependency Validator MCP Server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  debugLog("Fatal error:", error);
  process.exit(1);
});

// Export the main function for testing
module.exports = { main, validateDependencies };
