/**
 * MCP Orchestrator Server
 *
 * Implements Model Context Protocol with stdin/stdout transport following the official TypeScript SDK
 * Coordinates validation workflows across multiple MCP validators
 * @see https://github.com/modelcontextprotocol/typescript-sdk
 */

// Import official MCP SDK components - MUST use version 1.9.0 or compatible
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod"); // Use version 3.24.2 for compatibility
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Set to true for additional debugging output on stderr
// This won't affect the MCP protocol communication, as it uses stdout
const DEBUG = process.env.MCP_DEBUG === "true";

// Validation priority - determines the order of validation
const VALIDATION_PRIORITY = {
  architecture: 0, // Highest priority - architecture should be valid first
  dependency: 1,   // Dependency validation depends on architecture
  documentation: 2, // Documentation validation
  style: 3,        // Style should be checked last
};

// Docker image names for direct execution
const VALIDATOR_IMAGES = {
  architecture: "cyber-hand/architecture-guard:latest",
  dependency: "cyber-hand/dependency-validator:latest",
  documentation: "cyber-hand/docs-validator:latest",
  style: "cyber-hand/style-validator:latest",
};

// Cache for validation results to prevent redundant validations
const validationCache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache TTL

// Debug logging helper
function debugLog(...args) {
  if (DEBUG) {
    console.error(new Date().toISOString(), "[MCP-ORCHESTRATOR]", ...args);
  }
}

/**
 * Execute a validator directly using Docker
 * @param {string} validator Validator name (architecture, dependency, documentation, style)
 * @param {string} toolName The specific tool name to invoke
 * @param {object} params Parameters to pass to the tool
 * @returns {Promise<object>} The validation result
 */
async function executeValidator(validator, toolName, params) {
  return new Promise((resolve, reject) => {
    const cacheKey = `${validator}_${toolName}_${JSON.stringify(params)}`;
    
    // Check cache first
    const cachedResult = validationCache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      debugLog(`Using cached result for ${cacheKey}`);
      return resolve(cachedResult.result);
    }
    
    debugLog(`Executing validator: ${validator} tool: ${toolName}`);
    
    const request = {
      id: `req-${Date.now()}`,
      type: "request",
      name: toolName,
      params
    };
    
    const dockerImage = VALIDATOR_IMAGES[validator];
    const dockerCommand = `echo '${JSON.stringify(request)}' | docker run -i --rm ${dockerImage}`;
    
    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        debugLog(`Error executing validator: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        debugLog(`Validator stderr: ${stderr}`);
      }
      
      try {
        const response = JSON.parse(stdout);
        
        // Cache the result
        validationCache.set(cacheKey, {
          timestamp: Date.now(),
          result: response
        });
        
        resolve(response);
      } catch (err) {
        debugLog(`Failed to parse validator response: ${err.message}`);
        reject(err);
      }
    });
  });
}

/**
 * Orchestrate validation across multiple validators
 * @param {string} path Project path to validate
 * @param {object} options Validation options
 * @returns {Promise<object>} Consolidated validation results
 */
async function orchestrateValidation(path, options = {}) {
  debugLog("Starting orchestrated validation for path:", path);
  
  // Determine which validators to run based on options
  const validators = [];
  
  if (options.includeArchitecture !== false) validators.push("architecture");
  if (options.includeDependencies !== false) validators.push("dependency");
  if (options.includeDocumentation !== false) validators.push("documentation");
  if (options.includeStyle !== false) validators.push("style");
  
  // Sort validators by priority
  validators.sort((a, b) => VALIDATION_PRIORITY[a] - VALIDATION_PRIORITY[b]);
  
  const results = {
    validations: {},
    summary: {
      passed: 0,
      failed: 0,
      errors: 0,
      warnings: 0,
    },
    errors: [],
    warnings: [],
  };
  
  // Run validators in sequence according to priority
  for (const validator of validators) {
    debugLog(`Running ${validator} validation`);
    
    try {
      let toolName = '';
      let params = {};
      
      // Map to appropriate tool and parameters
      switch (validator) {
        case "architecture":
          toolName = "architecture_check";
          params = { path, options: { verbose: options.verbose } };
          break;
        case "dependency":
          toolName = "dependency_check";
          params = { path, options: { verbose: options.verbose } };
          break;
        case "documentation":
          toolName = "documentation_validate";
          params = { 
            path, 
            options: { 
              verbose: options.verbose,
              validators: ["freshness", "consistency", "best-practices", "coverage"]
            } 
          };
          break;
        case "style":
          toolName = "style_check";
          params = { path, options: { verbose: options.verbose, includeFormatting: true } };
          break;
      }
      
      const response = await executeValidator(validator, toolName, params);
      
      // Extract and process validation results
      if (response.content) {
        // Find the JSON content entry
        const jsonContent = response.content.find(c => c.type === "json");
        const textContent = response.content.find(c => c.type === "text");
        
        if (jsonContent && jsonContent.json) {
          results.validations[validator] = {
            success: !jsonContent.json.errors || jsonContent.json.errors.length === 0,
            data: jsonContent.json,
            message: textContent ? textContent.text : "Validation completed"
          };
          
          if (results.validations[validator].success) {
            results.summary.passed++;
          } else {
            results.summary.failed++;
          }
          
          // Collect errors and warnings
          if (jsonContent.json.errors) {
            results.summary.errors += jsonContent.json.errors.length;
            results.errors.push(...jsonContent.json.errors.map(e => ({
              validator,
              message: e.message || e,
              location: e.location
            })));
          }
          
          if (jsonContent.json.warnings) {
            results.summary.warnings += jsonContent.json.warnings.length;
            results.warnings.push(...jsonContent.json.warnings.map(w => ({
              validator,
              message: w.message || w,
              location: w.location
            })));
          }
        }
      } else if (response.error) {
        results.validations[validator] = {
          success: false,
          error: response.error,
          message: response.error.message
        };
        
        results.summary.failed++;
        results.errors.push({
          validator,
          message: response.error.message
        });
      }
    } catch (error) {
      debugLog(`Error running ${validator} validation:`, error);
      
      results.validations[validator] = {
        success: false,
        error: { message: error.message },
        message: `Failed to run validation: ${error.message}`
      };
      
      results.summary.failed++;
      results.errors.push({
        validator,
        message: `Validation failed: ${error.message}`
      });
    }
  }
  
  // Generate overall summary
  const totalValidators = validators.length;
  const passRate = totalValidators > 0 ? (results.summary.passed / totalValidators) * 100 : 0;
  
  results.summary.passRate = passRate;
  results.summary.message = `${results.summary.passed}/${totalValidators} validations passed (${passRate.toFixed(1)}%)`;
  
  if (results.summary.errors > 0) {
    results.summary.message += `, with ${results.summary.errors} errors`;
  }
  
  if (results.summary.warnings > 0) {
    results.summary.message += ` and ${results.summary.warnings} warnings`;
  }
  
  // Prioritize feedback - most severe issues first
  results.errors.sort((a, b) => VALIDATION_PRIORITY[a.validator] - VALIDATION_PRIORITY[b.validator]);
  results.warnings.sort((a, b) => VALIDATION_PRIORITY[a.validator] - VALIDATION_PRIORITY[b.validator]);
  
  debugLog("Orchestrated validation complete:", results.summary.message);
  
  return results;
}

/**
 * Main MCP server initialization
 */
async function main() {
  debugLog("Initializing MCP Orchestration Server");
  
  try {
    // Initialize MCP server with proper metadata for Cascade compatibility
    const server = new McpServer({
      name: "mcp-orchestrator",
      version: "1.0.0",
      description: "Orchestrates multiple MCP validators for coordinated validation workflows"
    });
    
    // Configure server/transport
    const transport = new StdioServerTransport();
    
    // Register orchestrate_validation tool
    server.tool(
      "orchestrate_validation",
      {
        path: z.string().describe("Path to the project to validate"),
        options: z.object({
          verbose: z.boolean().optional().describe("Include detailed validation information"),
          includeArchitecture: z.boolean().optional().describe("Include architecture validation"),
          includeDependencies: z.boolean().optional().describe("Include dependency validation"),
          includeDocumentation: z.boolean().optional().describe("Include documentation validation"),
          includeStyle: z.boolean().optional().describe("Include style validation"),
          sequential: z.boolean().optional().describe("Run validations sequentially"),
          allowFailure: z.boolean().optional().describe("Continue validation even if earlier validations fail")
        }).optional().describe("Validation options")
      },
      async ({ path, options = {} }) => {
        debugLog("Received orchestrate_validation request for:", path);
        
        try {
          const results = await orchestrateValidation(path, options);
          
          // CRITICAL: Return results in proper MCP 1.9.0 content format
          // MUST include both json and text type entries in the content array
          return {
            content: [
              {
                type: "json",
                json: results
              },
              {
                type: "text",
                text: options.verbose 
                  ? `Validation Results:
${results.summary.message}
${results.errors.length > 0 ? '\nErrors:\n' + results.errors.map(e => `- [${e.validator}] ${e.message}`).join('\n') : ''}
${results.warnings.length > 0 ? '\nWarnings:\n' + results.warnings.map(w => `- [${w.validator}] ${w.message}`).join('\n') : ''}`
                  : results.summary.message
              }
            ]
          };
        } catch (error) {
          debugLog("Error in orchestrate_validation:", error);
          
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
    
    // Register performance_metric tool to measure validation performance
    server.tool(
      "measure_performance",
      {
        path: z.string().describe("Path to the project to validate"),
        options: z.object({
          iterations: z.number().optional().describe("Number of validation iterations for performance measurement"),
          validators: z.array(z.string()).optional().describe("Specific validators to measure")
        }).optional().describe("Performance measurement options")
      },
      async ({ path, options = {} }) => {
        debugLog("Received measure_performance request for:", path);
        
        try {
          const iterations = options.iterations || 3;
          const validators = options.validators || ["architecture", "dependency", "documentation", "style"];
          
          const metrics = {};
          
          // Clear cache to get accurate measurements
          validationCache.clear();
          
          for (const validator of validators) {
            metrics[validator] = {
              times: [],
              average: 0,
              min: 0,
              max: 0
            };
            
            let toolName = '';
            let params = {};
            
            // Map to appropriate tool and parameters
            switch (validator) {
              case "architecture":
                toolName = "architecture_check";
                params = { path, options: { verbose: false } };
                break;
              case "dependency":
                toolName = "dependency_check";
                params = { path, options: { verbose: false } };
                break;
              case "documentation":
                toolName = "documentation_validate";
                params = { path, options: { verbose: false } };
                break;
              case "style":
                toolName = "style_check";
                params = { path, options: { verbose: false } };
                break;
            }
            
            // Run multiple iterations to measure performance
            for (let i = 0; i < iterations; i++) {
              const start = process.hrtime.bigint();
              
              try {
                await executeValidator(validator, toolName, params);
              } catch (err) {
                debugLog(`Error during performance measurement for ${validator}:`, err);
              }
              
              const end = process.hrtime.bigint();
              const timeMs = Number(end - start) / 1000000; // Convert ns to ms
              
              metrics[validator].times.push(timeMs);
            }
            
            // Calculate statistics
            if (metrics[validator].times.length > 0) {
              metrics[validator].average = metrics[validator].times.reduce((a, b) => a + b, 0) / metrics[validator].times.length;
              metrics[validator].min = Math.min(...metrics[validator].times);
              metrics[validator].max = Math.max(...metrics[validator].times);
            }
          }
          
          // Calculate orchestrated validation performance
          metrics.orchestrated = {
            times: [],
            average: 0,
            min: 0,
            max: 0
          };
          
          for (let i = 0; i < iterations; i++) {
            const start = process.hrtime.bigint();
            
            try {
              await orchestrateValidation(path, {
                includeArchitecture: validators.includes("architecture"),
                includeDependencies: validators.includes("dependency"),
                includeDocumentation: validators.includes("documentation"),
                includeStyle: validators.includes("style"),
                verbose: false
              });
            } catch (err) {
              debugLog("Error during orchestrated performance measurement:", err);
            }
            
            const end = process.hrtime.bigint();
            const timeMs = Number(end - start) / 1000000; // Convert ns to ms
            
            metrics.orchestrated.times.push(timeMs);
          }
          
          // Calculate statistics for orchestrated validation
          if (metrics.orchestrated.times.length > 0) {
            metrics.orchestrated.average = metrics.orchestrated.times.reduce((a, b) => a + b, 0) / metrics.orchestrated.times.length;
            metrics.orchestrated.min = Math.min(...metrics.orchestrated.times);
            metrics.orchestrated.max = Math.max(...metrics.orchestrated.times);
          }
          
          // Calculate performance improvement
          const individualTotal = validators.reduce((total, validator) => {
            return total + metrics[validator].average;
          }, 0);
          
          metrics.improvement = {
            timeMs: individualTotal - metrics.orchestrated.average,
            percentage: ((individualTotal - metrics.orchestrated.average) / individualTotal) * 100
          };
          
          // Format performance report
          const report = `Performance Metrics (${iterations} iterations):
${validators.map(v => `- ${v}: Avg ${metrics[v].average.toFixed(2)}ms (Min: ${metrics[v].min.toFixed(2)}ms, Max: ${metrics[v].max.toFixed(2)}ms)`).join("\n")}

Orchestrated validation: Avg ${metrics.orchestrated.average.toFixed(2)}ms (Min: ${metrics.orchestrated.min.toFixed(2)}ms, Max: ${metrics.orchestrated.max.toFixed(2)}ms)

Performance improvement: ${metrics.improvement.timeMs.toFixed(2)}ms (${metrics.improvement.percentage.toFixed(2)}%)`;
          
          // Return results in proper MCP format
          return {
            content: [
              {
                type: "json",
                json: metrics
              },
              {
                type: "text",
                text: report
              }
            ]
          };
        } catch (error) {
          debugLog("Error in measure_performance:", error);
          
          return {
            error: {
              code: -32000,
              message: `Performance measurement error: ${error.message}`
            }
          };
        }
      }
    );
    
    // CRITICAL: Must use connect() method, NOT listen() for SDK 1.9.0 compatibility
    await server.connect(transport);
    debugLog("Server connected to transport, ready to receive messages");
    
    // Handle process signals to ensure clean shutdown
    process.on("SIGINT", () => {
      debugLog("Received SIGINT, shutting down");
      process.exit(0);
    });
    
    process.on("SIGTERM", () => {
      debugLog("Received SIGTERM, shutting down");
      process.exit(0);
    });
    
    debugLog("MCP Orchestration Server initialization complete");
  } catch (error) {
    debugLog("Error during server initialization:", error);
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  debugLog("Unhandled error:", error);
  process.exit(1);
});
