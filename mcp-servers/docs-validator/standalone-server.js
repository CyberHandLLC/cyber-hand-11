/**
 * Documentation Validator MCP Server
 * 
 * Implements Model Context Protocol with stdin/stdout transport following the official TypeScript SDK
 * Provides comprehensive documentation validation:
 * - Freshness checking (comparing doc update times to code changes)
 * - Consistency validation (terminology, references, etc.)
 * - Best practices adherence (architectural principles, technical accuracy)
 * - Coverage analysis (identifying undocumented components/features)
 * 
 * @see https://github.com/modelcontextprotocol/typescript-sdk
 */

// Import official MCP SDK components
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { execSync } = require('child_process');
const { z } = require("zod");

// Import validators
const { validateDocCoverage } = require('./validators/coverage');
const { validateDocConsistency } = require('./validators/consistency');
const { validateDocFreshness } = require('./validators/freshness');
const { validateBestPractices } = require('./validators/best-practices');
const { validateEslintCompliance } = require('./validators/eslint-compliance');

// Debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

// Determine docs directory based on common patterns
function findDocsDirectory(projectPath) {
  const possibleDocsDirs = [
    path.join(projectPath, 'docs'),
    path.join(projectPath, 'documentation'),
    path.join(projectPath, 'doc'),
    path.join(projectPath, 'src', 'docs'),
    path.join(projectPath, 'app', 'docs')
  ];
  
  for (const dir of possibleDocsDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir;
    }
  }
  
  // Default to docs at project root if no docs directory found
  const docsDir = path.join(projectPath, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  return docsDir;
}

/**
 * Validate documentation freshness
 */
async function validateFreshness(projectPath, options = {}) {
  debugLog(`Validating documentation freshness for: ${projectPath} with options:`, JSON.stringify(options));
  
  const docsDir = options.docsDir || findDocsDirectory(projectPath);
  const results = await validateDocFreshness(projectPath, docsDir, options);
  
  return {
    type: 'freshness',
    results,
    summary: `Found ${results.outdatedDocs?.length || 0} outdated docs out of ${results.totalDocuments || 0} total documents`,
    pass: results.outdatedDocs?.length === 0
  };
}

/**
 * Validate documentation consistency
 */
async function validateConsistency(projectPath, options = {}) {
  debugLog(`Validating documentation consistency for: ${projectPath} with options:`, JSON.stringify(options));
  
  const docsDir = options.docsDir || findDocsDirectory(projectPath);
  const results = await validateDocConsistency(docsDir, options);
  
  return {
    type: 'consistency',
    results,
    summary: `Found ${results.terminologyIssues || 0} terminology issues, ${results.brokenLinks || 0} broken links, and ${results.outOfDateExamples || 0} outdated code examples`,
    pass: results.issues?.length === 0
  };
}

/**
 * Validate documentation best practices
 */
async function validateBestPractices(projectPath, options = {}) {
  debugLog(`Validating documentation best practices for: ${projectPath} with options:`, JSON.stringify(options));
  
  const docsDir = options.docsDir || findDocsDirectory(projectPath);
  const results = await validateBestPractices(docsDir, options);
  
  return {
    type: 'best-practices',
    results,
    summary: `Found ${results.architecturalIssues || 0} architectural issues, ${results.technicalInaccuracies || 0} technical inaccuracies, and ${results.accessibilityIssues || 0} accessibility issues`,
    pass: results.issues?.length === 0
  };
}

/**
 * Validate documentation coverage
 */
async function validateCoverage(projectPath, options = {}) {
  debugLog(`Validating documentation coverage for: ${projectPath} with options:`, JSON.stringify(options));
  
  const docsDir = options.docsDir || findDocsDirectory(projectPath);
  const results = await validateDocCoverage(projectPath, docsDir, options);
  
  return {
    type: 'coverage',
    results,
    summary: `Documentation coverage: ${results.summary?.coveragePercentage || 0}% (${results.summary?.documented || 0}/${results.summary?.total || 0} categories documented)`,
    pass: (results.summary?.coveragePercentage || 0) >= (options.minCoveragePercentage || 70)
  };
}

/**
 * Validate ESLint compliance
 */
async function validateEslint(projectPath, options = {}) {
  debugLog(`Validating ESLint compliance for: ${projectPath} with options:`, JSON.stringify(options));
  
  const docsDir = options.docsDir || findDocsDirectory(projectPath);
  const results = await validateEslintCompliance(docsDir, options);
  
  return {
    type: 'eslint-compliance',
    results,
    summary: `ESLint compliance: ${results.passed ? 'Pass' : 'Fail'}`,
    pass: results.passed
  };
}

/**
 * Main documentation validation function
 */
async function validateDocumentation(projectPath, options = {}) {
  debugLog(`Validating documentation for: ${projectPath} with options:`, JSON.stringify(options));
  
  try {
    // Determine documentation directory
    const docsDir = options.docsDir || findDocsDirectory(projectPath);
    options.docsDir = docsDir;
    
    // Determine which validators to run
    const validators = options.validators || ['coverage', 'consistency', 'freshness', 'best-practices', 'eslint-compliance'];
    
    const results = {
      projectPath,
      docsDir,
      timestamp: new Date().toISOString(),
      validators: {},
      summary: {
        total: validators.length,
        passed: 0,
        failed: 0
      }
    };
    
    // Run selected validators
    if (validators.includes('coverage')) {
      results.validators.coverage = await validateCoverage(projectPath, options);
      results.summary.passed += results.validators.coverage.pass ? 1 : 0;
      results.summary.failed += results.validators.coverage.pass ? 0 : 1;
    }
    
    if (validators.includes('consistency')) {
      results.validators.consistency = await validateConsistency(projectPath, options);
      results.summary.passed += results.validators.consistency.pass ? 1 : 0;
      results.summary.failed += results.validators.consistency.pass ? 0 : 1;
    }
    
    if (validators.includes('freshness')) {
      results.validators.freshness = await validateFreshness(projectPath, options);
      results.summary.passed += results.validators.freshness.pass ? 1 : 0;
      results.summary.failed += results.validators.freshness.pass ? 0 : 1;
    }
    
    if (validators.includes('best-practices')) {
      results.validators.bestPractices = await validateBestPractices(projectPath, options);
      results.summary.passed += results.validators.bestPractices.pass ? 1 : 0;
      results.summary.failed += results.validators.bestPractices.pass ? 0 : 1;
    }
    
    if (validators.includes('eslint-compliance')) {
      results.validators.eslintCompliance = await validateEslint(projectPath, options);
      results.summary.passed += results.validators.eslintCompliance.pass ? 1 : 0;
      results.summary.failed += results.validators.eslintCompliance.pass ? 0 : 1;
    }
    
    // Generate overall pass/fail status
    results.pass = results.summary.failed === 0;
    
    return results;
  } catch (error) {
    debugLog('Error validating documentation:', error);
    return {
      error: `Failed to validate documentation: ${error.message}`,
      pass: false
    };
  }
}

/**
 * Quick check if documentation exists
 */
function documentationExists(projectPath) {
  try {
    const docsDir = findDocsDirectory(projectPath);
    
    // Check for markdown files in the docs directory
    const markdownFiles = execSync(`find "${docsDir}" -name "*.md" -o -name "*.mdx" | wc -l`, 
                               { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    
    return parseInt(markdownFiles, 10) > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Main function that sets up and runs the MCP server
 */
async function main() {
  try {
    debugLog("Starting Documentation Validator MCP Server");
    
    // Initialize MCP server with proper metadata for Cascade compatibility
    const server = new McpServer({
      name: "docs-validator",
      version: "1.0.0",
      description: "Validates documentation for Next.js 15.2.4/React 19 projects according to Cyber Hand standards"
    });
    
    // Register documentation_validate tool - follows required MCP format
    server.tool(
      "documentation_validate",
      {
        // Schema defined with Zod as required by MCP specification
        path: z.string().describe("Path to the project root directory"),
        options: z.object({
          verbose: z.boolean().optional().describe("Include detailed validation information"),
          validators: z.array(z.enum(["coverage", "consistency", "freshness", "best-practices", "eslint-compliance"])).optional()
            .describe("Specific validators to run"),
          minCoveragePercentage: z.number().optional().describe("Minimum acceptable documentation coverage percentage"),
          skipExternalLinks: z.boolean().optional().describe("Skip validation of external links"),
          requireLanguage: z.boolean().optional().describe("Require code blocks to specify language"),
          includeEmpty: z.boolean().optional().describe("Include empty categories in coverage analysis")
        }).optional().describe("Validation options")
      },
      async ({ path, options = {} }) => {
        try {
          debugLog(`Processing documentation validation for path: ${path} with options:`, JSON.stringify(options));
          
          // Perform the actual validation
          const results = await validateDocumentation(path, options);
          
          // Format response according to MCP protocol specification for Cascade
          return {
            content: [
              {
                type: "json",
                json: {
                  projectPath: path,
                  summary: results.summary,
                  pass: results.pass,
                  ...results.validators
                }
              },
              {
                type: "text",
                text: results.summary ? `Documentation validation: ${results.summary.passed}/${results.summary.total} validators passed.` : "Documentation validation complete."
              }
            ]
          };
        } catch (error) {
          debugLog("Validation error:", error);
          
          // Return error in proper MCP format
          return {
            error: {
              code: -32000,
              message: `Documentation validation error: ${error.message}`
            }
          };
        }
      }
    );
    
    // Register documentation_check tool for simple existence checks
    server.tool(
      "documentation_check",
      {
        path: z.string().describe("Path to the project root directory")
      },
      async ({ path }) => {
        try {
          debugLog(`Checking if documentation exists for: ${path}`);
          
          const exists = documentationExists(path);
          
          return {
            content: [
              {
                type: "json",
                json: {
                  exists,
                  path,
                  message: exists ? 'Documentation found' : 'No documentation found'
                }
              },
              {
                type: "text",
                text: exists ? `Documentation found in ${path}` : `No documentation found in ${path}`
              }
            ]
          };
        } catch (error) {
          debugLog("Documentation check error:", error);
          
          return {
            error: {
              code: -32000,
              message: `Documentation check error: ${error.message}`
            }
          };
        }
      }
    );
    
    // Create a stdin/stdout transport using the official MCP SDK
    const transport = new StdioServerTransport();
    
    debugLog("MCP Server starting with stdin/stdout transport");
    
    // Connect the server to the transport - this handles all the MCP protocol details
    await server.connect(transport);
    debugLog("Server connected to transport, ready to receive messages");
    
    // Handle process signals for clean shutdown
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

// Export all validators
module.exports = {
  validateDocumentation,
  validateFreshness,
  validateConsistency,
  validateBestPractices,
  validateCoverage,
  validateEslint,
  documentationExists
};

// Defined validators mapped to their implementation functions
const VALIDATORS = {
  'coverage': validateDocCoverage,
  'consistency': validateDocConsistency,
  'freshness': validateDocFreshness,
  'best-practices': validateBestPractices,
  'eslint-compliance': validateEslintCompliance
};
