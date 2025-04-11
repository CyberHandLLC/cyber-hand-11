"use strict";
/**
 * Architecture Validator Implementation
 *
 * Validates project architecture against Next.js 15.2.4/React 19 best practices.
 * Ensures proper Server/Client component separation and architectural boundaries.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArchitecture = validateArchitecture;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("../shared/utils");
/**
 * Validate the architecture of a project or specific file
 * @param filePath - Path to the project or file to validate
 * @param options - Validation options
 * @returns Architecture validation results
 */
async function validateArchitecture(filePath, options = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            return {
                success: false,
                errors: [`Path not found: ${filePath}`],
                warnings: [],
                components: { valid: [], invalid: [] },
                summary: `File or directory not found: ${filePath}`
            };
        }
        // Check if this is a single file check
        const isSingleFile = options.singleFile || fs.statSync(filePath).isFile();
        // Track results
        const errors = [];
        const warnings = [];
        const validComponents = [];
        const invalidComponents = [];
        if (isSingleFile) {
            // Single file validation
            await validateSingleFile(filePath, errors, warnings, validComponents, invalidComponents);
        }
        else {
            // Project-wide validation
            await validateDirectory(filePath, errors, warnings, validComponents, invalidComponents, options);
        }
        // Generate summary
        const summary = errors.length > 0
            ? `Architecture validation failed with ${errors.length} errors and ${warnings.length} warnings`
            : `Architecture validation passed with ${warnings.length} warnings`;
        return {
            success: errors.length === 0,
            errors,
            warnings,
            components: {
                valid: validComponents,
                invalid: invalidComponents
            },
            summary
        };
    }
    catch (error) {
        (0, utils_1.logger)('error', `Architecture validation failed: ${error.message}`, { filePath });
        return {
            success: false,
            errors: [`Validation error: ${error.message}`],
            warnings: [],
            components: { valid: [], invalid: [] },
            summary: 'Validation failed due to an error'
        };
    }
}
/**
 * Get architecture rules for Next.js 15.2.4/React 19 projects
 * @returns List of architecture rules
 */
function getArchitectureRules() {
    return [
        {
            name: 'client-component-naming',
            description: 'Client components should use the -client suffix',
            severity: 'error',
            validate: (filePath, content) => {
                // Check if this is a client component
                if (content.includes('use client')) {
                    const fileName = path.basename(filePath, path.extname(filePath));
                    if (!fileName.toLowerCase().endsWith('-client')) {
                        return `Client component "${fileName}" should use the -client suffix`;
                    }
                }
                return null;
            }
        },
        {
            name: 'no-browser-apis-in-server-components',
            description: 'Server components should not use browser APIs',
            severity: 'error',
            validate: (filePath, content) => {
                // Skip client components
                if (content.includes('use client')) {
                    return null;
                }
                // Check for browser APIs in server components
                const browserApis = [
                    /window\./,
                    /document\./,
                    /localStorage\./,
                    /sessionStorage\./,
                    /navigator\./,
                    /location\./
                ];
                for (const regex of browserApis) {
                    if (regex.test(content)) {
                        return `Server component contains browser API: ${regex.toString()}`;
                    }
                }
                return null;
            }
        },
        {
            name: 'proper-component-returns',
            description: 'Components should have explicit ReactElement return types',
            severity: 'warning',
            validate: (filePath, content) => {
                // Only check React component files
                if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) {
                    return null;
                }
                // Check for function components without explicit return types
                const componentMatches = content.match(/(?:export\s+)?function\s+([A-Z]\w+)/g) || [];
                for (const match of componentMatches) {
                    const compName = match.replace(/(?:export\s+)?function\s+/, '');
                    const hasReturnType = content.includes(`function ${compName}`) &&
                        (content.includes(`${compName}(`) && content.includes(': ReactElement') ||
                            content.includes(': React.') ||
                            content.includes(': JSX.'));
                    if (!hasReturnType) {
                        return `Component "${compName}" should have explicit ReactElement return type`;
                    }
                }
                return null;
            }
        },
        {
            name: 'no-client-imports-in-server',
            description: 'Server components should not import client components directly',
            severity: 'error',
            validate: (filePath, content) => {
                // Skip client components
                if (content.includes('use client')) {
                    return null;
                }
                // Look for imports that include client-suffixed components
                const importMatches = content.match(/import.*from\s+['"][^'"]+['"]/g) || [];
                for (const match of importMatches) {
                    if (match.includes('-client') || match.includes('Client')) {
                        return `Server component imports client components directly: ${match}`;
                    }
                }
                return null;
            }
        },
        {
            name: 'component-file-size',
            description: 'Component files should be under 500 lines',
            severity: 'warning',
            validate: (filePath, content) => {
                const lineCount = content.split('\n').length;
                if (lineCount > 500) {
                    return `Component file has ${lineCount} lines, which exceeds the 500 line limit`;
                }
                return null;
            }
        }
    ];
}
/**
 * Validate a single file for architecture issues
 * @param filePath - Path to the file
 * @param errors - Array to collect errors
 * @param warnings - Array to collect warnings
 * @param validComponents - Array to collect valid components
 * @param invalidComponents - Array to collect invalid components
 */
async function validateSingleFile(filePath, errors, warnings, validComponents, invalidComponents) {
    // Skip non-React files
    const ext = path.extname(filePath).toLowerCase();
    if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        return;
    }
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    // Apply architecture rules
    const rules = getArchitectureRules();
    let isValid = true;
    for (const rule of rules) {
        const result = rule.validate(filePath, content);
        if (result) {
            if (rule.severity === 'error') {
                errors.push(`${filePath}: ${result} (${rule.name})`);
                isValid = false;
            }
            else {
                warnings.push(`${filePath}: ${result} (${rule.name})`);
            }
        }
    }
    // Track component validity
    if (isValid) {
        validComponents.push(filePath);
    }
    else {
        invalidComponents.push(filePath);
    }
}
/**
 * Validate all React component files in a directory
 * @param dirPath - Path to the directory
 * @param errors - Array to collect errors
 * @param warnings - Array to collect warnings
 * @param validComponents - Array to collect valid components
 * @param invalidComponents - Array to collect invalid components
 * @param options - Validation options
 */
async function validateDirectory(dirPath, errors, warnings, validComponents, invalidComponents, options) {
    // Find all React component files
    const files = getComponentFiles(dirPath, options.ignorePatterns);
    // Validate each file
    for (const file of files) {
        await validateSingleFile(file, errors, warnings, validComponents, invalidComponents);
    }
}
/**
 * Get all React component files in a directory recursively
 * @param dirPath - Path to the directory
 * @param ignorePatterns - Patterns to ignore
 * @returns Array of component file paths
 */
function getComponentFiles(dirPath, ignorePatterns = []) {
    const results = [];
    function isIgnored(filePath) {
        // Check if path matches any ignore pattern
        if (!ignorePatterns || ignorePatterns.length === 0) {
            return false;
        }
        return ignorePatterns.some(pattern => {
            if (pattern.startsWith('*')) {
                return filePath.endsWith(pattern.slice(1));
            }
            return filePath.includes(pattern);
        });
    }
    function walk(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            // Skip ignored patterns
            if (isIgnored(filePath)) {
                return;
            }
            // Handle directories
            if (fs.statSync(filePath).isDirectory()) {
                // Skip node_modules and hidden directories
                if (file === 'node_modules' || file.startsWith('.')) {
                    return;
                }
                walk(filePath);
            }
            else {
                // Check if file is a React component
                const ext = path.extname(file).toLowerCase();
                if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
                    results.push(filePath);
                }
            }
        });
    }
    walk(dirPath);
    return results;
}
//# sourceMappingURL=architecture-validator.js.map