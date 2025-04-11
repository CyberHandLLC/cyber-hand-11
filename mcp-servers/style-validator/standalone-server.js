/**
 * Style Validator MCP Server
 *
 * Implements Model Context Protocol with stdin/stdout transport following the official TypeScript SDK
 * Properly structured for compatibility with Cascade and other MCP clients
 * Validates code style according to Next.js 15.2.4/React 19 best practices and Cyber Hand standards
 * @see https://github.com/modelcontextprotocol/typescript-sdk
 */

// Import official MCP SDK components
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");

// Set to true for additional debugging output on stderr
// This won't affect the MCP protocol communication, as it uses stdout
const DEBUG = process.env.MCP_DEBUG === "true";

// Debug logging helper that doesn't interfere with MCP protocol
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

// Import our TypeScript validation modules
const tsAnalyzer = require('./ts-parser/ast-analyzer');
const fileScanner = require('./ts-parser/file-scanner');
const namingValidator = require('./ts-parser/naming-convention');
const unusedVarsValidator = require('./ts-parser/unused-variables');
const recommendationEngine = require('./ts-parser/recommendation-engine');

// Full validation results structure
const validationResults = {
  errors: [],
  warnings: [
    "Inconsistent use of semicolons at line endings",
    "Lines exceeding 500 characters limit per Cyber Hand standards",
    "TypeScript interfaces using 'any' instead of proper types",
    "Unused variables not prefixed with underscore",
    "Naming convention violations (PascalCase for components/interfaces, camelCase for variables/functions)",
    "Missing return type annotations for functions",
  ],
  fixable: [
    "Inconsistent use of semicolons at line endings",
    "Unused variables not prefixed with underscore",
    "Naming convention violations",
  ],
  // Store detailed validation results by category
  anyTypeIssues: [],
  sizeLimitIssues: [],
  namingConventionIssues: [],
  unusedVarIssues: [],
  summary: "Style validation completed with 0 errors and 6 warnings (3 fixable)",
};

// Style validation function with enhanced TypeScript analysis
async function validateStyles(targetPath, options = {}) {
  debugLog(`Validating styles for: ${targetPath} with options:`, JSON.stringify(options));

  // If test mode is enabled, return mock results
  if (options.testMode) {
    return {
      success: true,
      errors: validationResults.errors,
      warnings: validationResults.warnings,
      fixable: validationResults.fixable,
      summary: validationResults.summary,
    };
  }
  
  // Real validation logic using our TypeScript AST analyzer and file scanner
  try {
    const results = {
      errors: [],
      warnings: [],
      fixable: [],
      anyTypeIssues: [],
      sizeLimitIssues: [],
      namingConventionIssues: [],
      fileDetails: [],
    };
    
    // Check if path is a file or directory
    const stats = fs.existsSync(targetPath) ? fs.statSync(targetPath) : null;
    const isDirectory = stats ? stats.isDirectory() : false;
    
    // Files to analyze
    let filesToAnalyze = [];
    
    if (isDirectory) {
      // Scan directory recursively for TypeScript/JavaScript files
      debugLog(`Scanning directory: ${targetPath}`);
      filesToAnalyze = fileScanner.scanDirectory(targetPath, {
        includeJs: options.includeJavaScript || false,
        excludeNodeModules: true,
        maxDepth: options.maxDepth || 10
      });
      debugLog(`Found ${filesToAnalyze.length} files to analyze`);
    } else if (stats && stats.isFile()) {
      // Single file - just analyze it
      filesToAnalyze = [targetPath];
    } else {
      return {
        success: false,
        errors: [`Invalid path: ${targetPath}`],
        warnings: [],
        summary: `Validation failed: ${targetPath} is not a valid file or directory`,
      };
    }

    // Process each file
    for (const filePath of filesToAnalyze) {
      debugLog(`Analyzing file: ${filePath}`);
      const fileInfo = fileScanner.getFileInfo(filePath);
      
      // Add file to details (ensure arrays are initialized)
      if (!results.fileDetails) results.fileDetails = [];
      if (!results.anyTypeIssues) results.anyTypeIssues = [];
      if (!results.namingConventionIssues) results.namingConventionIssues = [];
      if (!results.unusedVarIssues) results.unusedVarIssues = [];
      if (!results.sizeLimitIssues) results.sizeLimitIssues = [];
      
      results.fileDetails.push(fileInfo);
      
      // 1. Check for 'any' type usage - critical for Cyber Hand standards
      if (options.includeTypeChecking !== false && (fileInfo.isTypeScript || fileInfo.isJavaScript)) {
        const anyTypeAnalysis = tsAnalyzer.analyzeAnyTypeUsage(filePath);
        
        if (anyTypeAnalysis.success && anyTypeAnalysis.issues.length > 0) {
          // Generate enhanced recommendations
          const recommendations = tsAnalyzer.generateRecommendations(anyTypeAnalysis.issues);
          
          // Add to results
          results.anyTypeIssues.push({
            file: filePath,
            issues: anyTypeAnalysis.issues,
            recommendations
          });
          
          // Add to errors list (Cyber Hand considers 'any' usage as errors)
          anyTypeAnalysis.issues.forEach(issue => {
            results.errors.push(`${path.relative(targetPath, filePath)}: ${issue.message} at line ${issue.line}`);
          });
        }
      }
      
      // 2. Check naming conventions according to Cyber Hand standards
      if (options.checkNaming !== false && (fileInfo.isTypeScript || fileInfo.isJavaScript)) {
        const namingAnalysis = namingValidator.analyzeNamingConventions(filePath);
        
        if (namingAnalysis.success && namingAnalysis.issues.length > 0) {
          // Add to results
          results.namingConventionIssues.push({
            file: filePath,
            issues: namingAnalysis.issues
          });
          
          // Add to warnings list 
          namingAnalysis.issues.forEach(issue => {
            results.warnings.push(`${path.relative(targetPath, filePath)}: ${issue.message} at line ${issue.line}`);
          });
        }
      }
      
      // 3. Check for unused variables not prefixed with underscore
      if (options.checkUnusedVars !== false && (fileInfo.isTypeScript || fileInfo.isJavaScript)) {
        const unusedVarsAnalysis = unusedVarsValidator.analyzeUnusedVariables(filePath);
        
        if (unusedVarsAnalysis.success && unusedVarsAnalysis.issues.length > 0) {
          // Add to results
          results.unusedVarIssues.push({
            file: filePath,
            issues: unusedVarsAnalysis.issues
          });
          
          // Add to warnings list and fixable list
          unusedVarsAnalysis.issues.forEach(issue => {
            results.warnings.push(`${path.relative(targetPath, filePath)}: ${issue.message} at line ${issue.line}`);
            results.fixable.push(`${path.relative(targetPath, filePath)}: Prefix unused variable '${issue.message.split("'")[1]}' with underscore at line ${issue.line}`);
          });
        }
      }
      
      // 2. Check file size limits (<500 lines per Cyber Hand standards)
      const sizeCompliance = fileScanner.checkFileSizeCompliance(filePath);
      if (!sizeCompliance.compliant) {
        results.sizeLimitIssues.push(sizeCompliance);
        results.warnings.push(
          `${path.relative(targetPath, filePath)}: File exceeds ${sizeCompliance.limit} lines limit (${sizeCompliance.lineCount} lines)`
        );
      }
      
      // More validation checks can be added here for future enhancements
    }
    
    // Generate summary message
    const summary = generateValidationSummary(results, targetPath, isDirectory);
    
    // Process recommendations for all issues
    const recommendations = [];
    
    // Generate recommendations for any type issues
    if (results.anyTypeIssues && results.anyTypeIssues.length > 0) {
      results.anyTypeIssues.forEach(issue => {
        recommendations.push(recommendationEngine.generateRecommendation('anyType', {
          file: issue.file || targetPath,
          line: issue.line,
          column: issue.column,
          snippet: issue.code
        }));
      });
    }
    
    // Generate recommendations for naming convention issues
    if (results.namingConventionIssues && results.namingConventionIssues.length > 0) {
      results.namingConventionIssues.forEach(issue => {
        const issueType = issue.type === 'component' ? 'componentNaming' : 'variableNaming';
        recommendations.push(recommendationEngine.generateRecommendation(issueType, {
          file: issue.file || targetPath,
          line: issue.line,
          column: issue.column,
          snippet: issue.code
        }));
      });
    }
    
    // Generate recommendations for unused variable issues
    if (results.unusedVarIssues && results.unusedVarIssues.length > 0) {
      results.unusedVarIssues.forEach(issue => {
        recommendations.push(recommendationEngine.generateRecommendation('unusedVariable', {
          file: issue.file || targetPath,
          line: issue.line,
          column: issue.column,
          snippet: issue.code
        }));
      });
    }
    
    // Generate recommendations for file size issues
    if (results.sizeLimitIssues && results.sizeLimitIssues.length > 0) {
      results.sizeLimitIssues.forEach(issue => {
        recommendations.push(recommendationEngine.generateRecommendation('fileSize', {
          file: issue.file || targetPath,
          line: 1,
          snippet: `File size: ${issue.size} lines (limit: ${issue.limit} lines)`
        }));
      });
    }
    
    // Categorize recommendations by severity
    const categorized = recommendationEngine.categorizeIssuesBySeverity(recommendations);
    
    // Generate detailed summary with recommendations
    const detailedSummary = recommendationEngine.generateSummaryReport(recommendations);
    
    // Format results for Cascade MCP return
    const returnResults = {
      success: true,
      errors: categorized.errors.map(err => err.title) || [],
      warnings: categorized.warnings.map(warn => warn.title) || [],
      fixable: results.fixable || [],
      anyTypeIssues: results.anyTypeIssues || [],
      sizeLimitIssues: results.sizeLimitIssues || [],
      namingConventionIssues: results.namingConventionIssues || [],
      unusedVarIssues: results.unusedVarIssues || [],
      recommendations: recommendations,
      fileCount: filesToAnalyze.length,
      fileDetails: options.verbose ? (results.fileDetails || []) : undefined,
      detailedSummary,
      summary
    };
    
    // For Cascade MCP integration, format response slightly differently
    if (options.cascadeFormat) {
      // Format specifically for Cascade Model Context Protocol
      return {
        validation: {
          success: returnResults.success,
          summary: summary,
          errors: returnResults.errors || [],
          warnings: returnResults.warnings || [],
          fixable: returnResults.fixable || []
        },
        details: {
          anyTypeIssues: returnResults.anyTypeIssues || [],
          namingConventionIssues: returnResults.namingConventionIssues || [],
          unusedVarIssues: returnResults.unusedVarIssues || [],
          sizeLimitIssues: returnResults.sizeLimitIssues || []
        },
        stats: {
          fileCount: returnResults.fileCount || 0,
          errorCount: (returnResults.errors || []).length,
          warningCount: (returnResults.warnings || []).length,
          fixableCount: (returnResults.fixable || []).length
        }
      };
    }
    
    return returnResults;
  } catch (error) {
    debugLog("Error during style validation:", error);
    return {
      success: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      fixable: [],
      summary: "Validation failed due to an error",
    };
  }
}

/**
 * Generates a meaningful summary of validation results
 * @param {object} results - Validation results
 * @param {string} targetPath - Path that was validated
 * @param {boolean} isDirectory - Whether the target is a directory
 * @returns {string} A formatted summary message
 */
function generateValidationSummary(results, targetPath, isDirectory) {
  // Ensure all properties exist to avoid undefined errors
  results.errors = results.errors || [];
  results.warnings = results.warnings || [];
  results.anyTypeIssues = results.anyTypeIssues || [];
  results.sizeLimitIssues = results.sizeLimitIssues || [];
  results.namingConventionIssues = results.namingConventionIssues || [];
  results.unusedVarIssues = results.unusedVarIssues || [];
  
  const { errors, warnings, anyTypeIssues, sizeLimitIssues, namingConventionIssues, unusedVarIssues } = results;
  
  // Calculate issues by category
  const anyTypeCount = anyTypeIssues.reduce((count, file) => count + file.issues.length, 0);
  const sizeLimitCount = sizeLimitIssues.length;
  const namingCount = namingConventionIssues.reduce((count, file) => count + file.issues.length, 0);
  const unusedVarsCount = unusedVarIssues.reduce((count, file) => count + file.issues.length, 0);
  
  // Generate summary based on Cyber Hand project standards
  let summary;
  
  if (isDirectory) {
    summary = `Style validation for ${path.basename(targetPath)}:\n`;
    summary += `- Found ${errors.length} style errors and ${warnings.length} warnings\n`;
    summary += `- TypeScript safety issues: ${anyTypeCount} 'any' type usages detected\n`;
    summary += `- Module size issues: ${sizeLimitCount} files exceed the 500 line limit\n`;
    summary += `- Naming convention issues: ${namingCount} instances detected\n`;
    summary += `- Unused variables without underscore: ${unusedVarsCount} instances detected`;
    
    // Add compliance statement for the project
    if (errors.length === 0 && warnings.length === 0) {
      summary += `\n\nCongratulations! Code is fully compliant with Cyber Hand style standards.`;
    } else {
      summary += `\n\nCode has style issues that should be addressed to comply with Cyber Hand standards.`;
    }
  } else {
    const fileName = path.basename(targetPath);
    summary = `Style validation for ${fileName}:\n`;
    summary += `- Found ${errors.length} style errors and ${warnings.length} warnings\n`;
    
    // TypeScript safety issues
    if (anyTypeCount > 0) {
      summary += `- TypeScript safety: ${anyTypeCount} 'any' type usages detected\n`;
      summary += `- Recommendation: Replace with specific interfaces per Cyber Hand standards\n`;
    } else {
      summary += `- TypeScript safety: No 'any' type usage detected - Compliant!\n`;
    }
    
    // Module size issues
    if (sizeLimitCount > 0) {
      summary += `- Module size: File exceeds the 500 line limit (${sizeLimitIssues[0].lineCount} lines)\n`;
      summary += `- Recommendation: Split into smaller modules following Cyber Hand modular design principles\n`;
    } else {
      summary += `- Module size: Within the 500 line limit - Compliant!\n`;
    }
    
    // Naming convention issues
    if (namingCount > 0) {
      summary += `- Naming conventions: ${namingCount} naming issues detected\n`;
      summary += `- Recommendation: Use PascalCase for components/types and camelCase for variables/functions\n`;
    } else {
      summary += `- Naming conventions: Follows Cyber Hand naming standards - Compliant!\n`;
    }
    
    // Unused variables issues
    if (unusedVarsCount > 0) {
      summary += `- Unused variables: ${unusedVarsCount} instances without underscore prefix\n`;
      summary += `- Recommendation: Prefix unused variables with underscore (_)`;
    } else {
      summary += `- Unused variables: All unused variables properly prefixed - Compliant!`;
    }
    
    // Overall compliance statement
    if (errors.length === 0 && warnings.length === 0) {
      summary += `\n\nCongratulations! File is fully compliant with Cyber Hand style standards.`;
    }
  }
  
  return summary;
}

// Helper function to count source files
function countSourceFiles(directory) {
  if (!fs.existsSync(directory)) {
    return 0;
  }

  let count = 0;

  try {
    const items = fs.readdirSync(directory);

    for (const item of items) {
      const itemPath = path.join(directory, item);

      if (!fs.existsSync(itemPath)) {
        continue;
      }

      const stats = fs.statSync(itemPath);

      if (stats.isDirectory() && !item.startsWith("node_modules") && !item.startsWith(".")) {
        count += countSourceFiles(itemPath);
      } else if (
        stats.isFile() &&
        (item.endsWith(".js") ||
          item.endsWith(".ts") ||
          item.endsWith(".jsx") ||
          item.endsWith(".tsx") ||
          item.endsWith(".css"))
      ) {
        count++;
      }
    }
  } catch (error) {
    debugLog(`Error reading directory ${directory}:`, error);
  }

  return count;
}

async function main() {
  try {
    debugLog("Starting Style Validator MCP Server");
    
    // Initialize MCP server with proper metadata for Cascade compatibility
    const server = new McpServer({
      name: "style-validator",
      version: "1.0.0",
      description: "Validates code style according to Next.js 15.2.4/React 19 best practices and Cyber Hand standards"
    });
    
    // Register style_check tool - Cascade requires this specific format
    server.tool(
      "style_check",
      {
        // Schema defined with Zod as required by MCP specification
        path: z.string().optional().describe("Path to the project root directory or specific file"),
        options: z.object({
          verbose: z.boolean().optional().describe("Include detailed validation information"),
          fixable: z.boolean().optional().describe("Only show fixable style issues"),
          strict: z.boolean().optional().describe("Apply strict style validation rules"),
          includeFormatting: z.boolean().optional().describe("Include formatting validation"),
          includeTypeChecking: z.boolean().optional().describe("Include TypeScript type validation"),
          checkNaming: z.boolean().optional().describe("Validate naming conventions"),
          checkUnusedVars: z.boolean().optional().describe("Check for unused variables without underscore prefix"),
          fileSize: z.boolean().optional().describe("Validate file size compliance")
        }).optional().describe("Style validation options")
      },
      async ({ path, options = {} }) => {
        try {
          debugLog(`Processing style_check for path: ${path || './'} with options:`, JSON.stringify(options));
          
          const targetPath = path || process.env.PROJECT_ROOT || process.cwd();
          const results = await validateStyles(targetPath, options);

          debugLog(`Style validation complete for path: ${targetPath}`);
          
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
          debugLog(`Error processing style_check: ${error.message}`);
          // Return error in proper MCP format
          return {
            error: {
              code: -32000,
              message: `Style validation error: ${error.message}`
            }
          };
        }
      }
    );

    // Register check_file_style tool - For validating individual files
    server.tool(
      "check_file_style",
      {
        filePath: z.string().describe("Path to the specific file to validate"),
        options: z.object({
          verbose: z.boolean().optional().describe("Include detailed validation information"),
          fixable: z.boolean().optional().describe("Only show fixable style issues"),
          includeTypeChecking: z.boolean().optional().describe("Include TypeScript type validation"),
          checkNaming: z.boolean().optional().describe("Validate naming conventions"),
          checkUnusedVars: z.boolean().optional().describe("Check for unused variables without underscore prefix"),
          fileSize: z.boolean().optional().describe("Validate file size compliance")
        }).optional().describe("Style validation options")
      },
      async ({ filePath, options = {} }) => {
        try {
          debugLog(`Processing check_file_style for file: ${filePath} with options:`, JSON.stringify(options));
          
          if (!filePath) {
            return {
              error: {
                code: -32000,
                message: "Missing file path"
              }
            };
          }

          const result = await validateStyles(filePath, { ...options, singleFile: true });
          debugLog(`Style validation complete for file: ${filePath}`);
          
          // Format response according to MCP protocol specification
          return {
            content: [
              {
                type: "json",
                json: result
              },
              {
                type: "text",
                text: result.detailedSummary || result.summary
              }
            ],
          };
        } catch (error) {
          debugLog(`Error processing check_file_style: ${error.message}`);
          return {
            error: {
              code: -32000,
              message: `Style validation error: ${error.message}`
            }
          };
        }
      }
    );

    // Create a stdin/stdout transport using the official MCP SDK
    // This handles the communication protocol formatting automatically
    const transport = new StdioServerTransport();
    
    debugLog("Style Validator MCP Server starting with stdin/stdout transport");
    
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
    debugLog("Error starting Style Validator MCP Server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  debugLog("Fatal error:", error);
  process.exit(1);
});

// Export the main function for testing
module.exports = { main, validateStyles, countSourceFiles };
