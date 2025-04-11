#!/usr/bin/env node
/**
 * MCP Validation Script
 *
 * This script provides a CLI to interact with MCP validation servers.
 * It supports architecture, dependency, and style validation.
 */

const { program } = require("commander");
const path = require("path");
const fs = require("fs");

// Use native fetch in Node.js v18+ or fallback to node-fetch
const fetch = global.fetch || require("node-fetch");

// Configuration for MCP servers
const MCP_SERVERS = {
  ARCHITECTURE: "http://localhost:3901/v1",
  DEPENDENCY: "http://localhost:8002/v1",
  STYLE: "http://localhost:8003/v1",
};

// Configure CLI
program
  .version("1.0.0")
  .description("Cyber Hand MCP Server CLI - Validate components, dependencies, and styles");

// Architecture validation command
program
  .command("architecture [path]")
  .description("Validate architecture of project or specific path")
  .option("-v, --verbose", "Show verbose output")
  .option("-f, --fix", "Attempt to fix issues if possible")
  .action(async (targetPath, options) => {
    try {
      const projectPath = targetPath || "./";
      console.log(`Validating architecture for: ${projectPath}`);
      console.log(`Sending request to: ${MCP_SERVERS.ARCHITECTURE}`);

      const body = {
        name: "architecture_check",
        tool_call_id: `cli-${Date.now()}`,
        arguments: {
          path: projectPath,
          options: {
            verbose: options.verbose,
            fix: options.fix,
          },
        },
      };

      console.log("Request payload:", JSON.stringify(body, null, 2));

      const response = await fetch(MCP_SERVERS.ARCHITECTURE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}: ${response.statusText}`);
      }

      console.log(`Response status: ${response.status}`);
      const contentType = response.headers.get("content-type");
      console.log(`Content-Type: ${contentType}`);

      const text = await response.text();
      console.log("Raw response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e.message);
        console.error("Received non-JSON response, please check the MCP server configuration");
        process.exit(1);
      }

      handleValidationResult(result, "Architecture");
    } catch (error) {
      console.error("Architecture validation failed:", error.message);
      process.exit(1);
    }
  });

// Dependency validation command
program
  .command("dependencies [path]")
  .description("Validate dependencies of project or specific path")
  .option("-v, --verbose", "Show verbose output")
  .action(async (targetPath, options) => {
    try {
      const projectPath = targetPath || "./";
      console.log(`Validating dependencies for: ${projectPath}`);

      const response = await fetch(MCP_SERVERS.DEPENDENCY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "dependency_check",
          tool_call_id: `cli-${Date.now()}`,
          arguments: {
            path: projectPath,
            options: {
              verbose: options.verbose,
            },
          },
        }),
      });

      const result = await response.json();
      handleValidationResult(result, "Dependencies");
    } catch (error) {
      console.error("Dependency validation failed:", error.message);
      process.exit(1);
    }
  });

// Import check command
program
  .command("check-import <source> <target>")
  .description("Check if an import from source to target is allowed")
  .action(async (source, target) => {
    try {
      console.log(`Checking if import from ${source} to ${target} is allowed`);

      const response = await fetch(MCP_SERVERS.DEPENDENCY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "check_import_allowed",
          tool_call_id: `cli-${Date.now()}`,
          arguments: {
            source,
            target,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Import from ${source} to ${target} is allowed`);
      } else {
        console.error(`❌ Import from ${source} to ${target} is NOT allowed`);
        console.error("Reason:", result.reason || "Unknown");
        process.exit(1);
      }
    } catch (error) {
      console.error("Import check failed:", error.message);
      process.exit(1);
    }
  });

// Style validation command
program
  .command("style [path]")
  .description("Validate code style of project or specific path")
  .option("-v, --verbose", "Show verbose output")
  .option("-f, --fix", "Attempt to fix style issues")
  .action(async (targetPath, options) => {
    try {
      const projectPath = targetPath || "./";
      console.log(`Validating style for: ${projectPath}`);

      const response = await fetch(MCP_SERVERS.STYLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "style_check",
          tool_call_id: `cli-${Date.now()}`,
          arguments: {
            path: projectPath,
            options: {
              verbose: options.verbose,
              fix: options.fix,
            },
          },
        }),
      });

      const result = await response.json();
      handleValidationResult(result, "Style");
    } catch (error) {
      console.error("Style validation failed:", error.message);
      process.exit(1);
    }
  });

// File style check command
program
  .command("check-file <filePath>")
  .description("Check a specific file for style issues")
  .option("-v, --verbose", "Show verbose output")
  .option("-f, --fix", "Attempt to fix style issues")
  .action(async (filePath, options) => {
    try {
      console.log(`Checking style for file: ${filePath}`);

      const response = await fetch(MCP_SERVERS.STYLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "check_file_style",
          tool_call_id: `cli-${Date.now()}`,
          arguments: {
            filePath,
            options: {
              verbose: options.verbose,
              fix: options.fix,
            },
          },
        }),
      });

      const result = await response.json();
      handleValidationResult(result, "File Style");
    } catch (error) {
      console.error("File style check failed:", error.message);
      process.exit(1);
    }
  });

// Validate all
program
  .command("all [path]")
  .description("Run all validations (architecture, dependencies, style)")
  .option("-v, --verbose", "Show verbose output")
  .action(async (targetPath, options) => {
    try {
      const projectPath = targetPath || "./";
      console.log(`Running all validations for: ${projectPath}`);

      // Architecture validation
      console.log("\n=== Architecture Validation ===");
      const archResponse = await fetch(MCP_SERVERS.ARCHITECTURE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "architecture_check",
          tool_call_id: `cli-${Date.now()}-arch`,
          arguments: { path: projectPath, options: { verbose: options.verbose } },
        }),
      });

      const archResult = await archResponse.json();
      const archSuccess = handleValidationResult(archResult, "Architecture");

      // Dependency validation
      console.log("\n=== Dependency Validation ===");
      const depResponse = await fetch(MCP_SERVERS.DEPENDENCY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "dependency_check",
          tool_call_id: `cli-${Date.now()}-dep`,
          arguments: { path: projectPath, options: { verbose: options.verbose } },
        }),
      });

      const depResult = await depResponse.json();
      const depSuccess = handleValidationResult(depResult, "Dependencies");

      // Style validation
      console.log("\n=== Style Validation ===");
      const styleResponse = await fetch(MCP_SERVERS.STYLE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "style_check",
          tool_call_id: `cli-${Date.now()}-style`,
          arguments: { path: projectPath, options: { verbose: options.verbose } },
        }),
      });

      const styleResult = await styleResponse.json();
      const styleSuccess = handleValidationResult(styleResult, "Style");

      // Overall result
      if (archSuccess && depSuccess && styleSuccess) {
        console.log("\n✅ All validations passed!");
      } else {
        console.error("\n❌ Some validations failed. See details above.");
        process.exit(1);
      }
    } catch (error) {
      console.error("Validation failed:", error.message);
      process.exit(1);
    }
  });

// Helper function to handle validation results
function handleValidationResult(result, validationType) {
  console.log("Processing result:", JSON.stringify(result, null, 2));

  if (!result) {
    console.error(`❌ ${validationType} validation failed: No result returned`);
    return false;
  }

  // For MCP server responses, the result will have a 'content' property with stringified JSON
  if (result.content) {
    try {
      const contentObj = JSON.parse(result.content);
      console.log(`${validationType} validation results:`, JSON.stringify(contentObj, null, 2));

      // Check if the nested results object has success: true
      if (contentObj.success && contentObj.results && contentObj.results.success) {
        console.log(`✅ ${validationType} validation passed!`);

        // Display warnings if any
        if (contentObj.results.warnings && contentObj.results.warnings.length > 0) {
          console.warn("\nWarnings:");
          contentObj.results.warnings.forEach((warning) => console.warn(`- ${warning}`));
        }

        // Display summary if available
        if (contentObj.results.summary) {
          console.log("\nSummary:", contentObj.results.summary);
        }

        return true;
      } else {
        console.error(`❌ ${validationType} validation failed:`);

        // Display errors if any
        if (
          contentObj.results &&
          contentObj.results.errors &&
          contentObj.results.errors.length > 0
        ) {
          console.error("\nErrors:");
          contentObj.results.errors.forEach((error) => console.error(`- ${error}`));
        } else if (contentObj.errors && contentObj.errors.length > 0) {
          console.error("\nErrors:");
          contentObj.errors.forEach((error) => console.error(`- ${error}`));
        }

        // Display summary if available
        if (contentObj.results && contentObj.results.summary) {
          console.log("\nSummary:", contentObj.results.summary);
        }

        return false;
      }
    } catch (e) {
      console.error("Failed to parse JSON content:", e.message);
      console.error("Response content:", result.content);
      return false;
    }
  }

  // Handle direct results format (non-MCP or different response structure)
  if (result.success) {
    if (result.results && result.results.success) {
      console.log(`✅ ${validationType} validation passed!`);

      if (result.results.warnings && result.results.warnings.length > 0) {
        console.warn("\nWarnings:");
        result.results.warnings.forEach((warning) => console.warn(`- ${warning}`));
      }

      if (result.results.summary) {
        console.log("\nSummary:", result.results.summary);
      }

      return true;
    } else if (result.results) {
      console.error(`❌ ${validationType} validation failed:`);

      if (result.results.errors && result.results.errors.length > 0) {
        console.error("\nErrors:");
        result.results.errors.forEach((error) => console.error(`- ${error}`));
      }

      if (result.results.summary) {
        console.log("\nSummary:", result.results.summary);
      }

      return false;
    } else {
      console.log(`✅ ${validationType} validation succeeded (no detailed results available)`);
      return true;
    }
  } else {
    console.error(`❌ ${validationType} validation failed:`);
    if (result.error) console.error(result.error);
    return false;
  }
}

// Parse arguments and execute
program.parse(process.argv);

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
