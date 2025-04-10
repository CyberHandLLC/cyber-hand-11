/**
 * MCP-ArchitectureGuard Server for Cyber Hand Website
 *
 * This MCP server validates that code changes adhere to the architectural
 * principles and patterns defined in the Cyber Hand documentation.
 *
 * Based on principles from:
 * - /docs/architecture/system-reference.md
 * - /docs/architecture/server-components.md
 * - /docs/getting-started/code-standards.md
 */

const { createServer } = require("@modelcontextprotocol/server");
const fs = require("fs");
const path = require("path");

// Import validation rules
const {
  validateServerClientBoundaries,
  checkComponentSize,
  validateDataFetchingPatterns,
  validateFormImplementation,
  validateComponentStructure,
  validateImageOptimization,
  detectCodeDuplication,
  validateReact19Patterns,
  validateSupabasePatterns,
  validateSecurityPractices,
  generateFixes,
} = require("./rules");

// Import dependency validator
const {
  validateDependencies,
  validateDependencyUsage,
  readDependencyPolicy,
  validateDependencyPolicy,
} = require("./dependency-validator");

// Import style validator
const {
  validateCodeStyle,
  parseESLintConfig,
  parsePrettierConfig,
  validateESLintConfig,
  validatePrettierConfig,
  validateFileStyle,
} = require("./style-validator");

// Import test validator
const testValidator = require("./test-validator");

// Configuration constants
const CONFIG = {
  MAX_COMPONENT_SIZE: 500,
  PERFORMANCE_BUDGET: {
    JS_BUNDLE_SIZE: 300, // KB
    INITIAL_LOAD_TIME: 3, // seconds
  },
  DEPENDENCY_CONFIG: {
    POLICY_FILE: process.env.DEPENDENCY_POLICY_FILE || ".dependency-policy.md",
    DUPLICATION_THRESHOLD: parseFloat(process.env.ARCH_GUARD_DUPLICATION_THRESHOLD || "0.7"),
    DISALLOWED_PACKAGES: (process.env.DISALLOWED_PACKAGES || "").split(",").filter(Boolean),
  },
  SECURITY_CONFIG: {
    REQUIRE_CSP: process.env.REQUIRE_CSP === "true",
    SUPABASE_URL_VAR: process.env.SUPABASE_URL_VAR || "NEXT_PUBLIC_SUPABASE_URL",
    SUPABASE_ANON_KEY_VAR: process.env.SUPABASE_ANON_KEY_VAR || "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  },
};

// Create and configure the MCP server
const server = createServer({
  name: "architecture-guard",
  version: "1.0.0",
  description: "Validates architectural patterns for Cyber Hand website",

  // Determine which files this MCP server should validate
  isRelevant: (request) => {
    const filepath = request.filepath;

    // Only process TypeScript/JavaScript files
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

    return true;
  },

  // Validate file changes against architectural rules
  validateFileChange: async (request) => {
    const { filepath, content } = request;

    console.log(`Validating file: ${filepath}`);

    // Skip if content is empty
    if (!content || content.trim() === "") {
      return { isValid: true };
    }

    // Apply different validation rules based on file type and location
    const validationResult = validateFile(filepath, content);

    return {
      isValid: validationResult.errors.length === 0,
      warnings: validationResult.warnings,
      errors: validationResult.errors,
      suggestedFixes: generateFixes(validationResult.errors, content),
    };
  },
});

/**
 * Apply all relevant validation rules to a file
 */
function validateFile(filepath, content) {
  const allErrors = [];
  const allWarnings = [];

  // Special handling for package.json - dependency validation
  if (filepath.endsWith("package.json")) {
    try {
      const projectRoot = path.dirname(filepath);
      const dependencyResult = validateDependencies(filepath);
      allErrors.push(...dependencyResult.errors);
      allWarnings.push(...dependencyResult.warnings);

      // Read dependency policy if it exists
      try {
        const policyPath = path.join(projectRoot, CONFIG.DEPENDENCY_CONFIG.POLICY_FILE);
        if (fs.existsSync(policyPath)) {
          const packageJson = JSON.parse(content);
          const policy = readDependencyPolicy(policyPath);
          const policyResult = validateDependencyPolicy(
            {
              declared: Object.keys({
                ...(packageJson.dependencies || {}),
                ...(packageJson.devDependencies || {}),
              }),
              packageJson: packageJson,
            },
            policy
          );
          allErrors.push(...policyResult.errors);
          allWarnings.push(...policyResult.warnings);
        }
      } catch (error) {
        console.error(`Error validating against dependency policy: ${error.message}`);
      }

      return { errors: allErrors, warnings: allWarnings };
    } catch (error) {
      return {
        errors: [`Error validating package.json: ${error.message}`],
        warnings: [],
      };
    }
  }

  // Special handling for ESLint/Prettier config files
  if (
    filepath.endsWith(".eslintrc.json") ||
    filepath.endsWith(".eslintrc") ||
    filepath.endsWith(".prettierrc") ||
    filepath.endsWith(".prettierrc.json")
  ) {
    try {
      const projectRoot = path.dirname(filepath);

      if (filepath.includes("eslint")) {
        const config = JSON.parse(content);
        const { warnings } = validateESLintConfig({
          rules: config.rules || {},
          extends: config.extends || [],
        });
        allWarnings.push(...warnings);
      } else if (filepath.includes("prettier")) {
        const config = JSON.parse(content);
        const { warnings } = validatePrettierConfig(config);
        allWarnings.push(...warnings);
      }

      return { errors: allErrors, warnings: allWarnings };
    } catch (error) {
      return {
        errors: [`Error validating config file: ${error.message}`],
        warnings: [],
      };
    }
  }

  // Test file validation
  if (filepath.includes(".test.") || filepath.includes(".spec.")) {
    const testResult = testValidator.validateTestFile(filepath, content);
    allErrors.push(...testResult.errors);
    allWarnings.push(...testResult.warnings);

    // Apply style validation to test files
    const styleResult = validateCodeStyle(filepath, content);
    allErrors.push(...styleResult.errors);
    allWarnings.push(...styleResult.warnings);

    return { errors: allErrors, warnings: allWarnings };
  }

  // Apply rules based on file type and location

  // Components in /app/ or /components/
  if (
    (filepath.includes("/app/") || filepath.includes("/components/")) &&
    (filepath.endsWith(".tsx") || filepath.endsWith(".jsx"))
  ) {
    // Validate Server/Client Component boundaries
    const boundaryResult = validateServerClientBoundaries(filepath, content);
    allErrors.push(...boundaryResult.errors);
    allWarnings.push(...boundaryResult.warnings);

    // Check component size
    const sizeResult = checkComponentSize(content);
    allErrors.push(...sizeResult.errors);
    allWarnings.push(...sizeResult.warnings);

    // Validate component structure
    const structureResult = validateComponentStructure(filepath, content);
    allErrors.push(...structureResult.errors);
    allWarnings.push(...structureResult.warnings);

    // Validate image optimization
    const imageResult = validateImageOptimization(content);
    allErrors.push(...imageResult.errors);
    allWarnings.push(...imageResult.warnings);

    // Check form implementation if file contains forms
    if (content.includes("<form") || content.includes("<Form")) {
      const formResult = validateFormImplementation(content, filepath);
      allErrors.push(...formResult.errors);
      allWarnings.push(...formResult.warnings);
    }

    // Detect code duplication
    const duplicationResult = detectCodeDuplication(filepath, content);
    allErrors.push(...duplicationResult.errors);
    allWarnings.push(...duplicationResult.warnings);

    // Validate React 19 concurrency patterns
    const react19Result = validateReact19Patterns(filepath, content);
    allErrors.push(...react19Result.errors);
    allWarnings.push(...react19Result.warnings);

    // Validate security practices
    const securityResult = validateSecurityPractices(filepath, content);
    allErrors.push(...securityResult.errors);
    allWarnings.push(...securityResult.warnings);
  }

  // Check data fetching patterns in all app and components files
  if (
    (filepath.includes("/app/") ||
      filepath.includes("/components/") ||
      filepath.includes("/lib/")) &&
    (filepath.endsWith(".tsx") ||
      filepath.endsWith(".ts") ||
      filepath.endsWith(".jsx") ||
      filepath.endsWith(".js"))
  ) {
    const dataFetchingResult = validateDataFetchingPatterns(content, filepath);
    allErrors.push(...dataFetchingResult.errors);
    allWarnings.push(...dataFetchingResult.warnings);

    // Validate Supabase integration patterns
    const supabaseResult = validateSupabasePatterns(filepath, content);
    allErrors.push(...supabaseResult.errors);
    allWarnings.push(...supabaseResult.warnings);
  }

  // Apply dependency usage validation to all JS/TS files
  if (
    filepath.endsWith(".js") ||
    filepath.endsWith(".jsx") ||
    filepath.endsWith(".ts") ||
    filepath.endsWith(".tsx")
  ) {
    const dependencyResult = validateDependencyUsage(filepath, content);
    allErrors.push(...dependencyResult.errors);
    allWarnings.push(...dependencyResult.warnings);

    // Apply style validation to all JS/TS files
    try {
      const projectRoot = path.resolve(filepath, "../..");

      // Try to find ESLint and Prettier configs
      const eslintConfig = parseESLintConfig(projectRoot);
      const prettierConfig = parsePrettierConfig(projectRoot);

      const styleResult = validateFileStyle(filepath, content, eslintConfig, prettierConfig);
      allErrors.push(...styleResult.errors);
      allWarnings.push(...styleResult.warnings);
    } catch (error) {
      console.error(`Error applying style validation: ${error.message}`);
    }
  }

  // For CI mode
  if (process.argv.includes("--ci")) {
    // In CI mode, treat warnings as errors for stricter validation
    return {
      errors: [...allErrors, ...allWarnings],
      warnings: [],
    };
  }

  return {
    errors: allErrors,
    warnings: allWarnings,
  };
}

// Start the server
server
  .start()
  .then(() => {
    console.log("MCP-ArchitectureGuard server started successfully");
  })
  .catch((error) => {
    console.error("Failed to start MCP-ArchitectureGuard server:", error);
  });
