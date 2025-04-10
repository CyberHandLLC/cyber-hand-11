/**
 * Style Validator
 *
 * Validates code style and formatting against Next.js 15.2.4/React 19 best practices
 * Integrates with ESLint/Prettier to ensure consistent code quality
 */

const fs = require("fs");
const path = require("path");

// Common ESLint rules for Next.js 15.2.4/React 19 projects
const ESLINT_RULES = {
  // React patterns
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
  "react/no-danger": "warn",

  // Next.js specific
  "@next/next/no-img-element": "warn",
  "@next/next/no-html-link-for-pages": "warn",

  // TypeScript
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

  // Import organization
  "import/order": [
    "warn",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
    },
  ],
};

// Common prettier configuration for Next.js projects
const PRETTIER_CONFIG = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
  trailingComma: "es5",
  bracketSpacing: true,
};

/**
 * Validate code style against established standards
 * @param {string} filePath - Path to the file
 * @param {string} content - Content of the file
 * @returns {Object} Validation results with errors and warnings
 */
function validateCodeStyle(filePath, content) {
  const errors = [];
  const warnings = [];

  const extension = path.extname(filePath);
  const isTS = extension === ".ts" || extension === ".tsx";
  const isJS = extension === ".js" || extension === ".jsx";

  if (!isTS && !isJS) {
    // Only validate JS/TS files
    return { errors, warnings };
  }

  // ----- Simple style checks without requiring full ESLint parsing -----

  // Check line length
  const lines = content.split("\n");
  let longLines = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.length > 100 && !line.includes("http")) {
      longLines++;
    }
  }

  if (longLines > 5) {
    warnings.push(`File has ${longLines} lines exceeding 100 characters`);
  }

  // Check indentation consistency (simplified)
  let tabIndentCount = 0;
  let spaceIndentCount = 0;

  for (const line of lines) {
    if (line.match(/^\t+/)) {
      tabIndentCount++;
    } else if (line.match(/^ {2,}/)) {
      spaceIndentCount++;
    }
  }

  if (tabIndentCount > 0 && spaceIndentCount > 0) {
    warnings.push("Mixed use of tabs and spaces for indentation");
  }

  // Check for semicolon consistency
  const lineEndings = content.match(/;\s*$/gm) || [];
  const lineEndingPercentage = lineEndings.length / lines.length;

  if (lineEndingPercentage > 0 && lineEndingPercentage < 0.5) {
    warnings.push("Inconsistent use of semicolons at line endings");
  }

  // Check for proper TypeScript interfaces/types
  if (isTS) {
    if (content.includes(": any")) {
      warnings.push("Usage of any type - consider using specific TypeScript interfaces instead");
    }

    if (
      content.includes("function") &&
      content.includes("(") &&
      !content.includes(":") &&
      !content.includes("useState") &&
      !content.includes("useEffect")
    ) {
      warnings.push("Functions missing TypeScript return type annotations");
    }

    // Check for proper unused variable naming
    const unusedVars = content.match(/const\s+([A-Za-z0-9]+)\s*=/g) || [];
    for (const match of unusedVars) {
      const varName = match.replace(/const\s+/, "").replace(/\s*=/, "");

      if (content.split(varName).length === 2 && !varName.startsWith("_")) {
        warnings.push(
          `Unused variable '${varName}' should be prefixed with underscore (_${varName})`
        );
      }
    }
  }

  // Next.js specific checks
  if (content.includes("<img") && !content.includes("Image from")) {
    warnings.push("Using HTML img tags instead of Next.js Image component");
  }

  if (content.includes('<a href="/') && !content.includes("Link from")) {
    warnings.push(
      "Using HTML anchor tags instead of Next.js Link component for internal navigation"
    );
  }

  // React pattern checks
  if (
    content.includes("useEffect") &&
    content.includes("[]") &&
    !content.includes("return () =>")
  ) {
    warnings.push("useEffect with empty dependency array should include cleanup function");
  }

  const effectCalls = content.match(/useEffect\(\(\) => {[^}]*}/g) || [];
  for (const effect of effectCalls) {
    if (!effect.includes("[]") && !effect.includes("[") && !effect.includes("// eslint-disable")) {
      warnings.push("useEffect is missing dependency array");
    }
  }

  return { errors, warnings };
}

/**
 * Parse ESLint configuration from existing files
 * @param {string} rootDir - Root directory of the project
 * @returns {Object} Parsed ESLint configuration
 */
function parseESLintConfig(rootDir) {
  const config = {
    rules: {},
    extends: [],
  };

  const potentialConfigFiles = [
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintrc",
    ".eslintrc.yaml",
    ".eslintrc.yml",
  ];

  try {
    // Find ESLint config file
    let configPath = null;
    for (const file of potentialConfigFiles) {
      const fullPath = path.join(rootDir, file);
      if (fs.existsSync(fullPath)) {
        configPath = fullPath;
        break;
      }
    }

    if (!configPath) {
      // Check package.json for eslintConfig field
      const packageJsonPath = path.join(rootDir, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        if (packageJson.eslintConfig) {
          config.rules = packageJson.eslintConfig.rules || {};
          config.extends = packageJson.eslintConfig.extends || [];
          return config;
        }
      }

      return config;
    }

    // Read config based on file type
    if (configPath.endsWith(".js")) {
      // We can't dynamically require in this context, so we'll do a simple parse
      const content = fs.readFileSync(configPath, "utf8");
      const rulesMatch = content.match(/rules:\s*{([^}]*)}/);
      if (rulesMatch) {
        const rulesStr = rulesMatch[1];
        const ruleLines = rulesStr
          .split(",")
          .map((line) => line.trim())
          .filter((line) => line);

        for (const line of ruleLines) {
          const [key, value] = line.split(":").map((part) => part.trim());
          if (key && value) {
            config.rules[key.replace(/['"]/g, "")] = eval(value);
          }
        }
      }

      const extendsMatch = content.match(/extends:\s*\[(.*?)\]/);
      if (extendsMatch) {
        const extendsStr = extendsMatch[1];
        config.extends = extendsStr
          .split(",")
          .map((item) => item.trim().replace(/['"]/g, ""))
          .filter((item) => item);
      }
    } else if (configPath.endsWith(".json")) {
      const eslintConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
      config.rules = eslintConfig.rules || {};
      config.extends = eslintConfig.extends || [];
    } else {
      // YAML parsing would require a dependency, so we'll skip it in this example
    }
  } catch (error) {
    console.error(`Error parsing ESLint config: ${error.message}`);
  }

  return config;
}

/**
 * Parse Prettier configuration from existing files
 * @param {string} rootDir - Root directory of the project
 * @returns {Object} Parsed Prettier configuration
 */
function parsePrettierConfig(rootDir) {
  const config = { ...PRETTIER_CONFIG };

  const potentialConfigFiles = [
    ".prettierrc",
    ".prettierrc.json",
    ".prettierrc.js",
    "prettier.config.js",
    ".prettierrc.yaml",
    ".prettierrc.yml",
  ];

  try {
    // Find Prettier config file
    let configPath = null;
    for (const file of potentialConfigFiles) {
      const fullPath = path.join(rootDir, file);
      if (fs.existsSync(fullPath)) {
        configPath = fullPath;
        break;
      }
    }

    if (!configPath) {
      // Check package.json for prettier field
      const packageJsonPath = path.join(rootDir, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        if (packageJson.prettier) {
          return { ...config, ...packageJson.prettier };
        }
      }

      return config;
    }

    // Read config based on file type
    if (configPath.endsWith(".json") || configPath === ".prettierrc") {
      const prettierConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return { ...config, ...prettierConfig };
    } else if (configPath.endsWith(".js")) {
      // Simple parsing since we can't require
      const content = fs.readFileSync(configPath, "utf8");
      const configMatch = content.match(/module\.exports\s*=\s*({[^}]*})/);
      if (configMatch) {
        const configStr = configMatch[1];
        // This is a simplified approach - in reality you'd need a proper JS parser
        const props = configStr.match(/([a-zA-Z0-9]+):\s*([^,}]*)/g) || [];

        for (const prop of props) {
          const [key, value] = prop.split(":").map((part) => part.trim());
          if (key && value) {
            try {
              config[key] = JSON.parse(value);
            } catch (e) {
              // Handle non-JSON values
              if (value === "true") config[key] = true;
              else if (value === "false") config[key] = false;
              else if (!isNaN(value)) config[key] = Number(value);
              else config[key] = value.replace(/['"]/g, "");
            }
          }
        }
      }
    }
    // YAML parsing skipped
  } catch (error) {
    console.error(`Error parsing Prettier config: ${error.message}`);
  }

  return config;
}

/**
 * Validate ESLint configuration against Next.js 15.2.4/React 19 best practices
 * @param {Object} eslintConfig - Current ESLint configuration
 * @returns {Object} Validation results
 */
function validateESLintConfig(eslintConfig) {
  const warnings = [];

  // Check for required rule configurations
  for (const [rule, expectedLevel] of Object.entries(ESLINT_RULES)) {
    const currentRule = eslintConfig.rules[rule];

    if (!currentRule) {
      warnings.push(`Missing recommended ESLint rule: ${rule}`);
    } else if (
      typeof expectedLevel === "string" &&
      currentRule !== expectedLevel &&
      (!Array.isArray(currentRule) || currentRule[0] !== expectedLevel)
    ) {
      warnings.push(`ESLint rule ${rule} has non-recommended configuration`);
    }
  }

  // Check for required extends
  const requiredExtends = [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ];

  for (const extend of requiredExtends) {
    if (!eslintConfig.extends.includes(extend)) {
      warnings.push(`ESLint config should extend "${extend}"`);
    }
  }

  return { warnings };
}

/**
 * Validate Prettier configuration against Next.js 15.2.4/React 19 best practices
 * @param {Object} prettierConfig - Current Prettier configuration
 * @returns {Object} Validation results
 */
function validatePrettierConfig(prettierConfig) {
  const warnings = [];

  // Check for inconsistencies with recommended settings
  for (const [key, recommendedValue] of Object.entries(PRETTIER_CONFIG)) {
    if (prettierConfig[key] !== undefined && prettierConfig[key] !== recommendedValue) {
      warnings.push(
        `Prettier setting "${key}" has non-standard value (${prettierConfig[key]} vs recommended ${recommendedValue})`
      );
    }
  }

  return { warnings };
}

/**
 * Validate that a file follows the project's style guidelines
 * using ESLint and Prettier configurations
 * @param {string} filePath - Path to the file
 * @param {string} content - Content of the file
 * @param {Object} eslintConfig - ESLint configuration
 * @param {Object} prettierConfig - Prettier configuration
 * @returns {Object} Validation results
 */
function validateFileStyle(filePath, content, eslintConfig, prettierConfig) {
  const styleResult = validateCodeStyle(filePath, content);

  // Check if file would be formatted differently with Prettier
  const formattedDifferently = wouldPrettierFormat(content, prettierConfig);
  if (formattedDifferently) {
    styleResult.warnings.push("File needs formatting with Prettier");
  }

  // Apply specific ESLint rule checks based on configuration
  if (eslintConfig.rules["@typescript-eslint/no-explicit-any"] && content.includes(": any")) {
    styleResult.warnings.push(
      'Found usage of "any" type which violates TypeScript strict typing rules'
    );
  }

  if (eslintConfig.rules["@next/next/no-img-element"] && content.includes("<img")) {
    styleResult.warnings.push("Using HTML img element instead of Next.js Image component");
  }

  return styleResult;
}

/**
 * Check if Prettier would format the content differently
 * @param {string} content - File content
 * @param {Object} prettierConfig - Prettier configuration
 * @returns {boolean} Whether formatting would change
 */
function wouldPrettierFormat(content, prettierConfig) {
  // This is a simplified check since we can't run Prettier directly
  // In reality, you'd use the prettier API to check if formatting would change

  const lines = content.split("\n");
  let inconsistencies = 0;

  // Check for semicolon consistency
  const shouldHaveSemicolons = prettierConfig.semi === true;
  const semicolonLines = lines.filter((line) => line.trim().endsWith(";"));
  const semicolonRatio =
    semicolonLines.length / lines.filter((line) => line.trim().length > 0).length;

  if (shouldHaveSemicolons && semicolonRatio < 0.7) {
    inconsistencies++;
  } else if (!shouldHaveSemicolons && semicolonRatio > 0.3) {
    inconsistencies++;
  }

  // Check for quote consistency
  const singleQuoteLines = lines.filter((line) => line.includes("'"));
  const doubleQuoteLines = lines.filter((line) => line.includes('"') && !line.includes('\\"'));
  const quotesRatio = singleQuoteLines.length / (singleQuoteLines.length + doubleQuoteLines.length);

  if (prettierConfig.singleQuote && quotesRatio < 0.7) {
    inconsistencies++;
  } else if (!prettierConfig.singleQuote && quotesRatio > 0.3) {
    inconsistencies++;
  }

  // Check for indentation
  const expectedIndent = prettierConfig.tabWidth;
  const spacedIndentLines = lines.filter((line) => line.match(/^ {2,}/));
  const fourSpaceIndent = spacedIndentLines.filter((line) => line.match(/^ {4}/)).length;
  const twoSpaceIndent = spacedIndentLines.filter((line) => line.match(/^ {2}[^ ]/)).length;

  if (expectedIndent === 2 && fourSpaceIndent > twoSpaceIndent) {
    inconsistencies++;
  } else if (expectedIndent === 4 && twoSpaceIndent > fourSpaceIndent) {
    inconsistencies++;
  }

  return inconsistencies > 1;
}

/**
 * Generate ESLint configuration file
 * @param {string} outputPath - Path to write configuration
 * @returns {boolean} Success status
 */
function generateESLintConfig(outputPath) {
  const config = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react-hooks"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "next/core-web-vitals",
    ],
    rules: ESLINT_RULES,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };

  try {
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error(`Error generating ESLint config: ${error.message}`);
    return false;
  }
}

/**
 * Generate Prettier configuration file
 * @param {string} outputPath - Path to write configuration
 * @returns {boolean} Success status
 */
function generatePrettierConfig(outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(PRETTIER_CONFIG, null, 2));
    return true;
  } catch (error) {
    console.error(`Error generating Prettier config: ${error.message}`);
    return false;
  }
}

module.exports = {
  validateCodeStyle,
  parseESLintConfig,
  parsePrettierConfig,
  validateESLintConfig,
  validatePrettierConfig,
  validateFileStyle,
  generateESLintConfig,
  generatePrettierConfig,
};
