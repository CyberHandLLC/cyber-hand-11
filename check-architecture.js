/**
 * Cyber Hand Architecture Check Script
 * Checks real project files against architectural rules, dependencies, and style
 */

// Import core architecture rules
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
} = require("./mcp-servers/architecture-guard/rules");

// Import dependency validators
const {
  validateDependencies,
  validateDependencyUsage,
  readDependencyPolicy,
  validateDependencyPolicy,
} = require("./mcp-servers/architecture-guard/dependency-validator");

// Import style validators
const {
  validateCodeStyle,
  parseESLintConfig,
  parsePrettierConfig,
  validateFileStyle,
} = require("./mcp-servers/architecture-guard/style-validator");

// Import test validators
const testValidator = require("./mcp-servers/architecture-guard/test-validator");

const fs = require("fs");
const path = require("path");

// Configuration constants
const CONFIG = {
  MAX_COMPONENT_SIZE: 500,
  CI_MODE: process.argv.includes("--ci"),
  MAX_FILES_TO_CHECK: process.argv.includes("--all") ? Infinity : 20,
  PATH_TO_CHECK: process.argv.find((arg) => arg.startsWith("--path="))?.split("=")[1] || ".",
  DEPENDENCY_CONFIG: {
    POLICY_FILE: process.env.DEPENDENCY_POLICY_FILE || ".dependency-policy.md",
    DUPLICATION_THRESHOLD: parseFloat(process.env.ARCH_GUARD_DUPLICATION_THRESHOLD || "0.7"),
    DISALLOWED_PACKAGES: (process.env.DISALLOWED_PACKAGES || "").split(",").filter(Boolean),
  },
};

// Function to recursively find files in a directory
function findFiles(dir, extensions, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith("node_modules") && !file.startsWith(".")) {
      // Recursively search directories
      findFiles(filePath, extensions, results);
    } else if (stat.isFile() && extensions.some((ext) => file.endsWith(ext))) {
      // Add matching files
      results.push(filePath);
    }
  }

  return results;
}

// Find files to analyze based on type
console.log(`Finding files to analyze in ${CONFIG.PATH_TO_CHECK}...`);
const baseDir = path.resolve(CONFIG.PATH_TO_CHECK);

// Find component files
const componentFiles = findFiles(baseDir, [".tsx", ".jsx"])
  .filter((file) => !file.includes("node_modules"))
  .filter((file) => !file.includes("dist"))
  .filter((file) => !file.includes("mcp-servers"));

// Find test files
const testFiles = findFiles(baseDir, [
  ".test.tsx",
  ".test.jsx",
  ".test.ts",
  ".test.js",
  ".spec.tsx",
  ".spec.jsx",
  ".spec.ts",
  ".spec.js",
]);

// Find package.json files
const packageJsonFiles = findFiles(baseDir, ["package.json"]);

// Find other JS/TS files for style/dependency checks
const jstsFiles = findFiles(baseDir, [".ts", ".js"])
  .filter((file) => !file.includes("node_modules"))
  .filter((file) => !file.includes("dist"))
  .filter((file) => !file.includes("mcp-servers"))
  .filter((file) => !componentFiles.includes(file) && !testFiles.includes(file));

// Count total files to check
const totalFiles =
  componentFiles.length + testFiles.length + packageJsonFiles.length + jstsFiles.length;
console.log(
  `Found ${componentFiles.length} component files, ${testFiles.length} test files, ${packageJsonFiles.length} package.json files, and ${jstsFiles.length} other JS/TS files.\n`
);

// Limit to a reasonable number for analysis unless --all is specified
const filesToCheck = [...componentFiles, ...testFiles, ...packageJsonFiles, ...jstsFiles].slice(
  0,
  CONFIG.MAX_FILES_TO_CHECK
);

console.log("===== Cyber Hand Project Architecture Analysis =====\n");

// Try to parse ESLint and Prettier configs for style validation
let eslintConfig = { rules: {}, extends: [] };
let prettierConfig = {};

try {
  eslintConfig = parseESLintConfig(baseDir);
  prettierConfig = parsePrettierConfig(baseDir);
  console.log("✅ Found ESLint and Prettier configurations");
} catch (error) {
  console.log("⚠️ Could not find or parse ESLint/Prettier configurations");
}

// Read dependency policy if it exists
let dependencyPolicy = { allowed: {}, disallowed: [], notes: {} };
try {
  const policyPath = path.join(baseDir, CONFIG.DEPENDENCY_CONFIG.POLICY_FILE);
  if (fs.existsSync(policyPath)) {
    dependencyPolicy = readDependencyPolicy(policyPath);
    console.log("✅ Found dependency policy file");
  } else {
    console.log("⚠️ No dependency policy file found at", CONFIG.DEPENDENCY_CONFIG.POLICY_FILE);
  }
} catch (error) {
  console.log("⚠️ Error reading dependency policy:", error.message);
}

let issueCount = 0;
let filesWithIssues = 0;

// Analyze each file
for (const fullPath of filesToCheck) {
  try {
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
    console.log(`Checking: ${relativePath}`);

    // Read file content
    const content = fs.readFileSync(fullPath, "utf8");

    // Initialize arrays for errors and warnings
    let allErrors = [];
    let allWarnings = [];

    // HANDLE DIFFERENT FILE TYPES

    // 1. PACKAGE.JSON FILES
    if (fullPath.endsWith("package.json")) {
      // Validate dependencies using dependency validator
      const dependencyResults = validateDependencies(fullPath);
      allErrors.push(...dependencyResults.errors);
      allWarnings.push(...dependencyResults.warnings);

      // Validate against dependency policy if available
      try {
        const packageJson = JSON.parse(content);
        const allDeps = Object.keys({
          ...(packageJson.dependencies || {}),
          ...(packageJson.devDependencies || {}),
        });

        const policyResults = validateDependencyPolicy(
          { declared: allDeps, packageJson },
          dependencyPolicy
        );

        allErrors.push(...policyResults.errors);
        allWarnings.push(...policyResults.warnings);
      } catch (error) {
        allErrors.push(`Error validating package.json: ${error.message}`);
      }
    }
    // 2. TEST FILES
    else if (fullPath.includes(".test.") || fullPath.includes(".spec.")) {
      // Validate test patterns using test validator
      const testResults = testValidator.validateTestPatterns(fullPath, content);
      allErrors.push(...testResults.errors);
      allWarnings.push(...testResults.warnings);

      // Also check style on test files
      const styleResults = validateCodeStyle(fullPath, content);
      allErrors.push(...styleResults.errors);
      allWarnings.push(...styleResults.warnings);
    }
    // 3. COMPONENT/JS/TS FILES
    else if (
      fullPath.endsWith(".tsx") ||
      fullPath.endsWith(".jsx") ||
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".js")
    ) {
      // For React components, apply architecture rules
      if (fullPath.endsWith(".tsx") || fullPath.endsWith(".jsx")) {
        // Core architecture validation
        const boundaries = validateServerClientBoundaries(relativePath, content);
        const size = checkComponentSize(content);
        const dataFetching = validateDataFetchingPatterns(content, relativePath);
        const forms = validateFormImplementation(content, relativePath);
        const structure = validateComponentStructure(relativePath, content);
        const images = validateImageOptimization(content);
        const duplication = detectCodeDuplication(relativePath, content);
        const react19 = validateReact19Patterns(relativePath, content);
        const supabase = validateSupabasePatterns(relativePath, content);
        const security = validateSecurityPractices(relativePath, content);

        // Collect all errors and warnings from architecture checks
        allErrors.push(
          ...boundaries.errors,
          ...size.errors,
          ...dataFetching.errors,
          ...forms.errors,
          ...structure.errors,
          ...images.errors,
          ...duplication.errors,
          ...react19.errors,
          ...supabase.errors,
          ...security.errors
        );

        allWarnings.push(
          ...boundaries.warnings,
          ...size.warnings,
          ...dataFetching.warnings,
          ...forms.warnings,
          ...structure.warnings,
          ...images.warnings,
          ...duplication.warnings,
          ...react19.warnings,
          ...supabase.warnings,
          ...security.warnings
        );
      }

      // For all JS/TS files, check style and dependency usage
      const styleResults = validateFileStyle(fullPath, content, eslintConfig, prettierConfig);
      const dependencyResults = validateDependencyUsage(fullPath, content);

      allErrors.push(...styleResults.errors, ...dependencyResults.errors);
      allWarnings.push(...styleResults.warnings, ...dependencyResults.warnings);
    }

    // Report issues
    let hasIssues = false;

    if (allErrors.length > 0) {
      console.log("  Errors:");
      allErrors.forEach((error) => console.log(`  - ${error}`));
      issueCount += allErrors.length;
      hasIssues = true;
    }

    if (allWarnings.length > 0) {
      console.log("  Warnings:");
      allWarnings.forEach((warning) => console.log(`  - ${warning}`));
      hasIssues = true;
    }

    if (hasIssues) {
      filesWithIssues++;
    } else {
      console.log("  ✅ No issues found");
    }

    console.log(""); // Empty line for separation
  } catch (err) {
    console.log(`  ❌ Error processing file: ${err.message}\n`);
  }
}

// Summary
console.log("===== Analysis Complete =====");
console.log(`Analyzed ${filesToCheck.length} files out of ${totalFiles} total`);
console.log(`${issueCount} issue(s) found in ${filesWithIssues} files.`);

if (issueCount === 0) {
  console.log("✅ All checked files pass validation");
} else {
  console.log("⚠️ Some files have issues");
  if (CONFIG.CI_MODE) {
    console.log("❌ CI mode enabled - failing build due to detected issues");
    process.exit(1);
  }
}

// Show sample file list
console.log("\nSample of files checked:");
filesToCheck.slice(0, 5).forEach((file) => {
  console.log(`- ${path.relative(baseDir, file).replace(/\\/g, "/")}`);
});

// Suggest running with different options if limited
if (filesToCheck.length < totalFiles) {
  console.log("\nNote: Only checked a subset of files. Run with --all to check all files.");
}

console.log("\nOptions:");
console.log("  --ci          : Run in CI mode (exits with error code on issues)");
console.log("  --all         : Check all files (no limit)");
console.log("  --path=<path> : Specify a directory to check (default: current directory)");
