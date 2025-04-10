/**
 * Dependency Validator
 *
 * Validates package dependencies against Next.js 15.2.4/React 19 requirements
 * Detects outdated, deprecated, or unapproved dependencies
 * Ensures Supabase and other core libraries are properly used
 */

const fs = require("fs");
const path = require("path");

// Approved dependencies with version constraints for Next.js 15.2.4
const APPROVED_DEPENDENCIES = {
  // Core dependencies
  next: "^15.2.4",
  react: "^19.0.0",
  "react-dom": "^19.0.0",

  // UI libraries
  tailwindcss: "^3.4.0",
  "class-variance-authority": "^0.7.0",
  clsx: "^2.0.0",
  "tailwind-merge": "^2.0.0",

  // Data fetching
  swr: "^2.2.0",
  "@tanstack/react-query": "^5.0.0",

  // Supabase
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/auth-helpers-nextjs": "^0.9.0",

  // Forms
  "react-hook-form": "^7.49.0",
  zod: "^3.22.0",
};

// Deprecated packages that should be avoided
const DEPRECATED_PACKAGES = [
  "moment", // Use date-fns or dayjs instead
  "request", // Use fetch or axios instead
  "jquery", // Use native DOM APIs
  "react-redux", // For most Next.js 15 apps, use React Context/Server Components
  "redux-thunk", // Use React Query or SWR for data fetching
  "next-redux-wrapper", // No longer needed with App Router
];

// Packages that should not be used in client components
const SERVER_ONLY_PACKAGES = [
  "fs",
  "path",
  "crypto",
  "querystring",
  "child_process",
  "worker_threads",
];

/**
 * Validate package.json against dependency rules
 * @param {string} packageJsonPath - Path to package.json file
 * @returns {Object} Validation results with errors and warnings
 */
function validateDependencies(packageJsonPath) {
  const errors = [];
  const warnings = [];

  try {
    // Read package.json
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);

    // Combine dependencies and devDependencies
    const allDependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    // Check for required dependencies
    const requiredDependencies = ["next", "react", "react-dom"];
    for (const dep of requiredDependencies) {
      if (!allDependencies[dep]) {
        errors.push(`Missing required dependency: ${dep}`);
      }
    }

    // Check for outdated dependencies
    for (const [name, version] of Object.entries(allDependencies)) {
      // Skip @types packages
      if (name.startsWith("@types/")) continue;

      const approvedVersion = APPROVED_DEPENDENCIES[name];

      // If in approved list, check version constraint
      if (approvedVersion) {
        const cleanVersion = version.replace(/[^0-9.]/g, "");
        const cleanApproved = approvedVersion.replace(/[^0-9.]/g, "");

        // Simple version check (would be more complex in a real implementation)
        if (cleanVersion < cleanApproved) {
          warnings.push(
            `${name}@${version} is outdated. Update to ${approvedVersion} for Next.js 15.2.4 compatibility`
          );
        }
      }
    }

    // Check for deprecated packages
    for (const deprecatedPkg of DEPRECATED_PACKAGES) {
      if (allDependencies[deprecatedPkg]) {
        errors.push(
          `${deprecatedPkg} is deprecated and should not be used. ${getAlternative(deprecatedPkg)}`
        );
      }
    }

    // Check if Node.js server-only packages are used
    for (const serverPkg of SERVER_ONLY_PACKAGES) {
      if (allDependencies[serverPkg]) {
        warnings.push(
          `${serverPkg} should only be used in server components and may cause issues if imported in client components`
        );
      }
    }

    // Check for Supabase integration
    const hasSupabase = allDependencies["@supabase/supabase-js"] !== undefined;
    const hasSupabaseHelpers = allDependencies["@supabase/auth-helpers-nextjs"] !== undefined;

    if (hasSupabase && !hasSupabaseHelpers) {
      warnings.push(
        "Using Supabase without @supabase/auth-helpers-nextjs. Consider adding it for better Next.js 15 integration."
      );
    }

    // Check for concurrent mode support
    const reactVersion = allDependencies["react"] || "";
    const reactMajorVersion = parseInt(reactVersion.replace(/[^0-9]/g, "").charAt(0));

    if (reactMajorVersion < 18) {
      errors.push(
        "React version 18+ is required for Next.js 15.2.4 to support concurrent features."
      );
    }
  } catch (error) {
    errors.push(`Error validating dependencies: ${error.message}`);
  }

  return { errors, warnings };
}

/**
 * Validate usage of dependencies in code against best practices
 * @param {string} filePath - Path to the file to analyze
 * @param {string} content - Content of the file
 * @returns {Object} Validation results with errors and warnings
 */
function validateDependencyUsage(filePath, content) {
  const errors = [];
  const warnings = [];

  const isClientComponent = content.includes('"use client"') || content.includes("'use client'");

  // Check for server-only packages in client components
  if (isClientComponent) {
    for (const pkg of SERVER_ONLY_PACKAGES) {
      const importRegex = new RegExp(`import.*?['"]${pkg}['"]`);
      const requireRegex = new RegExp(`require\\(['"]${pkg}['"]\\)`);

      if (importRegex.test(content) || requireRegex.test(content)) {
        errors.push(
          `Client Component imports server-only package '${pkg}' which will cause runtime errors`
        );
      }
    }
  }

  // Check for proper Supabase initialization
  if (content.includes("@supabase/supabase-js") || content.includes("supabase")) {
    if (
      isClientComponent &&
      !content.includes("createClientComponentClient") &&
      content.includes("createClient")
    ) {
      errors.push("Supabase client should use createClientComponentClient() in client components");
    }

    if (
      !isClientComponent &&
      content.includes("createClient") &&
      !content.includes("createServerComponentClient")
    ) {
      warnings.push(
        "Consider using createServerComponentClient() for proper Supabase integration in Server Components"
      );
    }

    // Check for potential RLS bypass
    if (content.includes("service_role") || content.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      if (isClientComponent) {
        errors.push(
          "Never use service_role key in client components - this bypasses RLS and exposes all data"
        );
      } else if (
        !content.includes("auth.") &&
        content.includes("supabase.from") &&
        (content.includes(".insert") || content.includes(".update") || content.includes(".delete"))
      ) {
        warnings.push(
          "Using service_role key without RLS filtering - ensure proper access control"
        );
      }
    }
  }

  // Check for outdated React patterns
  if (
    content.includes("componentDidMount") ||
    content.includes("componentWillUnmount") ||
    content.includes("componentDidUpdate")
  ) {
    warnings.push(
      "Using legacy class components instead of React 19 functional components and hooks"
    );
  }

  return { errors, warnings };
}

/**
 * Find all non-Node.js dependencies used in a codebase
 * @param {string} rootDir - Root directory to start search
 * @param {Object} packageJson - Contents of package.json
 * @returns {Object} Map of imports found and where they're used
 */
function findActualDependencyUsage(rootDir, packageJson) {
  const dependencies = {
    // Dependencies declared in package.json
    declared: Object.keys({
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    }),
    // Dependencies found in code but not in package.json
    undeclared: [],
    // Dependencies in package.json but not used in code
    unused: [],
  };

  const importedDeps = new Set();

  try {
    // Find all JS/TS files
    const files = findFiles(rootDir, [".js", ".jsx", ".ts", ".tsx"]);

    // Analyze each file for imports
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");

      // Match all imports
      const importMatches = content.matchAll(/import.*?from\s+['"]([^./][^'"]*)['"];?/g);
      const requireMatches = content.matchAll(/require\(['"]([^./][^'"]*)['"]\);?/g);

      // Process imports and requires
      for (const match of [...importMatches, ...requireMatches]) {
        const packageName = getPackageRoot(match[1]);
        if (packageName && !packageName.startsWith(".")) {
          importedDeps.add(packageName);
        }
      }
    }

    // Convert Set to Array
    const importedDepsArray = [...importedDeps];

    // Find undeclared dependencies
    dependencies.undeclared = importedDepsArray.filter(
      (dep) => !dependencies.declared.includes(dep) && !isNodeBuiltin(dep)
    );

    // Find unused dependencies
    dependencies.unused = dependencies.declared.filter(
      (dep) => !importedDepsArray.includes(dep) && !dep.startsWith("@types/") && !isDevTool(dep)
    );
  } catch (error) {
    console.error(`Error finding dependency usage: ${error.message}`);
  }

  return dependencies;
}

/**
 * Read dependency tracking policy file
 * @param {string} policyPath - Path to dependency policy file
 * @returns {Object} Parsed policy information
 */
function readDependencyPolicy(policyPath) {
  const policy = {
    allowed: {},
    disallowed: [],
    notes: {},
  };

  try {
    if (!fs.existsSync(policyPath)) {
      return policy;
    }

    const content = fs.readFileSync(policyPath, "utf8");

    // This is a simplified parser - in reality, you'd want more robust markdown parsing

    // Parse markdown table
    const tableRows = content.match(/\|.+\|/g) || [];
    if (tableRows.length > 1) {
      // Skip header and separator rows
      for (let i = 2; i < tableRows.length; i++) {
        const row = tableRows[i];
        const cells = row
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell);

        if (cells.length >= 2) {
          const [name, version, ...restCells] = cells;
          const notes = restCells.join(" ").trim();

          if (version.toLowerCase() === "(disallowed)") {
            policy.disallowed.push(name);
          } else {
            policy.allowed[name] = version;
            if (notes) {
              policy.notes[name] = notes;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading dependency policy: ${error.message}`);
  }

  return policy;
}

/**
 * Validate dependencies against policy
 * @param {Object} dependencies - Dependency information
 * @param {Object} policy - Policy information
 * @returns {Object} Validation results
 */
function validateDependencyPolicy(dependencies, policy) {
  const errors = [];
  const warnings = [];

  // Check for disallowed dependencies
  for (const dep of dependencies.declared) {
    if (policy.disallowed.includes(dep)) {
      errors.push(`Package '${dep}' is disallowed by policy`);
    }
  }

  // Check for version compliance
  for (const [dep, version] of Object.entries(dependencies.packageJson?.dependencies || {})) {
    const policyVersion = policy.allowed[dep];

    if (policyVersion && policyVersion !== "latest" && !satisfiesVersion(version, policyVersion)) {
      warnings.push(
        `Package '${dep}' version ${version} does not comply with policy (${policyVersion})`
      );
    }
  }

  // Check for undocumented dependencies
  const documentedDeps = [...Object.keys(policy.allowed), ...policy.disallowed];
  const undocumentedDeps = dependencies.declared.filter(
    (dep) => !documentedDeps.includes(dep) && !dep.startsWith("@types/") && !isDevTool(dep)
  );

  if (undocumentedDeps.length > 0) {
    warnings.push(
      `Found ${undocumentedDeps.length} dependencies not documented in policy: ${undocumentedDeps.join(", ")}`
    );
  }

  return { errors, warnings };
}

// Helper functions

/**
 * Get alternative for deprecated package
 */
function getAlternative(pkg) {
  const alternatives = {
    moment: "Use date-fns or dayjs instead",
    request: "Use fetch or node-fetch instead",
    jquery: "Use native DOM APIs",
    "react-redux":
      "Consider React Context API, Server Components, or use zustand for complex state",
    "redux-thunk": "Use React Query or SWR for async data fetching",
    "next-redux-wrapper": "No longer needed with App Router",
  };

  return alternatives[pkg] || "Consider modern alternatives";
}

/**
 * Extract root package name from import path
 */
function getPackageRoot(importPath) {
  // Handle scoped packages
  if (importPath.startsWith("@")) {
    const parts = importPath.split("/");
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
  }

  // Handle regular packages
  return importPath.split("/")[0];
}

/**
 * Check if a module is a Node.js builtin
 */
function isNodeBuiltin(mod) {
  const builtins = [
    "assert",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "dns",
    "domain",
    "events",
    "fs",
    "http",
    "https",
    "module",
    "net",
    "os",
    "path",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "string_decoder",
    "sys",
    "timers",
    "tls",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "zlib",
  ];

  return builtins.includes(mod);
}

/**
 * Check if a package is a dev tool
 */
function isDevTool(pkg) {
  const devTools = [
    "eslint",
    "prettier",
    "typescript",
    "jest",
    "vitest",
    "babel",
    "webpack",
    "postcss",
    "autoprefixer",
    "tailwindcss",
    "rollup",
    "vite",
    "esbuild",
    "nodemon",
    "concurrently",
    "husky",
    "lint-staged",
  ];

  return devTools.some((tool) => pkg.includes(tool));
}

/**
 * Find files with specific extensions
 */
function findFiles(dir, extensions, results = []) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith("node_modules") && !file.startsWith(".")) {
        findFiles(filePath, extensions, results);
      } else if (stat.isFile() && extensions.some((ext) => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error finding files: ${error.message}`);
  }

  return results;
}

/**
 * Check if version satisfies constraint (simplified)
 */
function satisfiesVersion(version, constraint) {
  // This is a very simplified implementation
  // In a real-world scenario, use semver package for proper version comparison

  const cleanVersion = version.replace(/[^\d.]/g, "");
  const cleanConstraint = constraint.replace(/[^\d.]/g, "");

  // If constraint starts with ^, just check major version
  if (constraint.startsWith("^")) {
    return cleanVersion.split(".")[0] === cleanConstraint.split(".")[0];
  }

  // If constraint starts with ~, check major and minor
  if (constraint.startsWith("~")) {
    const vParts = cleanVersion.split(".");
    const cParts = cleanConstraint.split(".");
    return vParts[0] === cParts[0] && vParts[1] === cParts[1];
  }

  // Exact match
  return cleanVersion === cleanConstraint;
}

module.exports = {
  validateDependencies,
  validateDependencyUsage,
  findActualDependencyUsage,
  readDependencyPolicy,
  validateDependencyPolicy,
  APPROVED_DEPENDENCIES,
  DEPRECATED_PACKAGES,
};
