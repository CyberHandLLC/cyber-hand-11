/**
 * MCP-DocumentationSynchronizer Server for Cyber Hand Website
 *
 * This MCP server helps ensure that code changes align with documentation standards,
 * patterns, and best practices defined in the Cyber Hand project documentation.
 *
 * It analyzes changes against the following key documentation:
 * - /docs/architecture/server-components.md - React Server Components implementation
 * - /docs/streaming/implementation-guide.md - Next.js 15 streaming patterns
 * - /docs/templates/component-template.md - Component creation with Next.js 15 best practices
 * - /docs/templates/feature-template.md - Feature implementation with Next.js 15 guidance
 */

const { createServer } = require("@modelcontextprotocol/server");
const fs = require("fs");
const path = require("path");
const { loadAllDocumentation, checkFileAgainstDocumentation } = require("./documentation-loader");
const { generateSuggestions } = require("./suggestion-generator");

// Load documentation on startup
let documentationData = null;
let documentationLoaded = false;

// Initialize the documentation data
async function initializeDocumentation() {
  try {
    documentationData = await loadAllDocumentation();
    documentationLoaded = true;
    console.log("Documentation loaded successfully.");

    if (documentationData.errors.length > 0) {
      console.warn("Some documentation could not be loaded:", documentationData.errors.join(", "));
    }

    return documentationData;
  } catch (error) {
    console.error("Failed to load documentation:", error);
    documentationLoaded = false;
    return null;
  }
}

// Create and configure the MCP server
const server = createServer({
  name: "documentation-synchronizer",
  version: "1.0.0",
  description: "Validates code against Cyber Hand documentation patterns",

  // Determine which files this MCP server should validate
  isRelevant: (request) => {
    const filepath = request.filepath;

    // Process TypeScript/JavaScript/React files
    if (
      !filepath.endsWith(".tsx") &&
      !filepath.endsWith(".ts") &&
      !filepath.endsWith(".jsx") &&
      !filepath.endsWith(".js")
    ) {
      return false;
    }

    // Skip test files
    if (
      filepath.includes("/tests/") ||
      filepath.includes(".test.") ||
      filepath.includes(".spec.")
    ) {
      return false;
    }

    // Skip build files and dependencies
    if (
      filepath.includes("node_modules") ||
      filepath.includes(".next") ||
      filepath.includes("out")
    ) {
      return false;
    }

    // Focus on app and components directories
    return (
      filepath.includes("/app/") ||
      filepath.includes("/components/") ||
      filepath.includes("/pages/")
    );
  },

  // Validate file changes against documentation standards
  validateFileChange: async (request) => {
    const { filepath, content } = request;

    console.log(`Validating file against documentation: ${filepath}`);

    // Skip if content is empty
    if (!content || content.trim() === "") {
      return { isValid: true };
    }

    // Ensure documentation is loaded
    if (!documentationLoaded) {
      await initializeDocumentation();

      if (!documentationLoaded) {
        return {
          isValid: true,
          warnings: [
            "Documentation could not be loaded. Documentation synchronization is disabled.",
          ],
        };
      }
    }

    // Check the file against documentation patterns and guidelines
    const { issues, suggestions } = checkFileAgainstDocumentation(filepath, content);

    // Generate code suggestions based on identified issues
    const suggestedFixes = generateSuggestions(filepath, content, issues, suggestions);

    // Return validation results
    return {
      isValid: issues.length === 0,
      warnings: issues.map((issue) => `Documentation Sync: ${issue}`),
      errors: [],
      suggestedFixes,
    };
  },
});

// Start the server
initializeDocumentation()
  .then(() => {
    return server.start();
  })
  .then(() => {
    console.log("MCP-DocumentationSynchronizer server started successfully");
  })
  .catch((error) => {
    console.error("Failed to start MCP-DocumentationSynchronizer server:", error);
  });
