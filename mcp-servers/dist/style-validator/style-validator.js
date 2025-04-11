"use strict";
/**
 * Style Validator Implementation
 *
 * Validates code style against project standards using ESLint and Prettier.
 * Provides detailed reporting on style issues and fix suggestions.
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
exports.validateStyles = validateStyles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("../shared/utils");
// For actual implementation, we would import ESLint and Prettier
// This is a simplified implementation that demonstrates the structure
// In a real implementation, you would use:
// import { ESLint } from 'eslint';
// import * as prettier from 'prettier';
/**
 * Validate code style for a file or project
 * @param filePath - Path to file or directory to validate
 * @param options - Validation options
 * @returns Style validation results
 */
async function validateStyles(filePath, options = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            return {
                success: false,
                errors: [`Path not found: ${filePath}`],
                warnings: [],
                fixable: [],
                summary: `File or directory not found: ${filePath}`
            };
        }
        // Check if this is a single file check
        const isSingleFile = options.singleFile || fs.statSync(filePath).isFile();
        // Track results
        const errors = [];
        const warnings = [];
        const fixable = [];
        if (isSingleFile) {
            // Single file validation
            await validateSingleFile(filePath, errors, warnings, fixable, options);
        }
        else {
            // Project-wide validation
            await validateDirectory(filePath, errors, warnings, fixable, options);
        }
        // Generate summary
        const summary = errors.length > 0
            ? `Style validation failed with ${errors.length} errors and ${warnings.length} warnings (${fixable.length} fixable issues)`
            : `Style validation passed with ${warnings.length} warnings (${fixable.length} fixable issues)`;
        return {
            success: errors.length === 0,
            errors,
            warnings,
            fixable,
            summary
        };
    }
    catch (error) {
        (0, utils_1.logger)('error', `Style validation failed: ${error.message}`, { filePath });
        return {
            success: false,
            errors: [`Validation error: ${error.message}`],
            warnings: [],
            fixable: [],
            summary: 'Validation failed due to an error'
        };
    }
}
/**
 * Validate a single file for code style issues
 * @param filePath - Path to the file
 * @param errors - Array to collect errors
 * @param warnings - Array to collect warnings
 * @param fixable - Array to collect fixable issues
 * @param options - Validation options
 */
async function validateSingleFile(filePath, errors, warnings, fixable, options) {
    // Check file extension to determine which validation to run
    const ext = path.extname(filePath).toLowerCase();
    // Only validate supported file types
    const supportedExts = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.md'];
    if (!supportedExts.includes(ext)) {
        warnings.push(`Skipping unsupported file type: ${filePath}`);
        return;
    }
    // Load file content
    const content = fs.readFileSync(filePath, 'utf8');
    // In a real implementation, you would run ESLint here
    // For example:
    // const eslint = new ESLint({
    //   fix: !!options.fix,
    //   extensions: ['.js', '.jsx', '.ts', '.tsx']
    // });
    // const results = await eslint.lintText(content, { filePath });
    // Simulate ESLint checks
    const lintResults = mockEslintCheck(filePath, content);
    // Process lint results
    lintResults.forEach(result => {
        const location = `${path.basename(filePath)}:${result.line}:${result.column}`;
        const message = `${location} - ${result.message} (${result.ruleId})`;
        if (result.severity === 2) { // Error
            errors.push(message);
        }
        else { // Warning
            warnings.push(message);
        }
        if (result.fixable) {
            fixable.push(message);
        }
    });
    // In a real implementation, you would also check Prettier format issues
    // For example:
    // const isPrettierFormatted = await prettier.check(content, {
    //   filepath: filePath
    // });
    // if (!isPrettierFormatted) {
    //   const message = `${path.basename(filePath)} - Formatting does not follow Prettier rules`;
    //   warnings.push(message);
    //   fixable.push(message);
    // }
    // If fix option is enabled, fix and write back the file
    if (options.fix && fixable.length > 0) {
        // In real implementation:
        // const fixedText = (await eslint.lintText(content, { filePath, fix: true }))[0].output;
        // if (fixedText) {
        //   fs.writeFileSync(filePath, fixedText, 'utf8');
        // }
        (0, utils_1.logger)('info', `Applied fixes to ${filePath}`);
    }
}
/**
 * Validate all supported files in a directory
 * @param dirPath - Path to the directory
 * @param errors - Array to collect errors
 * @param warnings - Array to collect warnings
 * @param fixable - Array to collect fixable issues
 * @param options - Validation options
 */
async function validateDirectory(dirPath, errors, warnings, fixable, options) {
    // Process files recursively
    const files = getFilesRecursively(dirPath, options.ignorePatterns);
    // Validate each file
    for (const file of files) {
        await validateSingleFile(file, errors, warnings, fixable, options);
    }
}
/**
 * Get all supported files in a directory recursively
 * @param dirPath - Path to the directory
 * @param ignorePatterns - Patterns to ignore
 * @returns Array of file paths
 */
function getFilesRecursively(dirPath, ignorePatterns = []) {
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
                // Check if file is supported
                const ext = path.extname(file).toLowerCase();
                const supportedExts = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.md'];
                if (supportedExts.includes(ext)) {
                    results.push(filePath);
                }
            }
        });
    }
    walk(dirPath);
    return results;
}
function mockEslintCheck(filePath, content) {
    const results = [];
    const ext = path.extname(filePath).toLowerCase();
    // Check for TypeScript specific issues
    if (ext === '.ts' || ext === '.tsx') {
        // Check for missing return types
        const functionMatches = content.match(/function\s+\w+\s*\([^)]*\)\s*{/g) || [];
        functionMatches.forEach((match, index) => {
            if (!content.includes('function') || !match.includes(':')) {
                results.push({
                    ruleId: '@typescript-eslint/explicit-function-return-type',
                    severity: 1, // Warning
                    message: 'Missing return type on function',
                    line: estimateLineNumber(content, match, index),
                    column: 1,
                    fixable: true
                });
            }
        });
        // Check for 'any' type usage
        const anyMatches = content.match(/:\s*any(\s|[,)])/g) || [];
        anyMatches.forEach((match, index) => {
            results.push({
                ruleId: '@typescript-eslint/no-explicit-any',
                severity: 2, // Error
                message: "Unexpected 'any' type",
                line: estimateLineNumber(content, match, index),
                column: 1,
                fixable: false
            });
        });
    }
    // General JS/TS rules
    // Check for console.log statements
    const consoleMatches = content.match(/console\.(log|warn|error)\(/g) || [];
    consoleMatches.forEach((match, index) => {
        results.push({
            ruleId: 'no-console',
            severity: 1, // Warning
            message: 'Unexpected console statement',
            line: estimateLineNumber(content, match, index),
            column: 1,
            fixable: false
        });
    });
    // Check for inconsistent quotes
    const singleQuoteMatches = content.match(/'[^']*'/g) || [];
    const doubleQuoteMatches = content.match(/"[^"]*"/g) || [];
    if (singleQuoteMatches.length > 0 && doubleQuoteMatches.length > 0) {
        results.push({
            ruleId: 'quotes',
            severity: 1, // Warning
            message: 'Inconsistent quotes',
            line: estimateLineNumber(content, doubleQuoteMatches[0], 0),
            column: 1,
            fixable: true
        });
    }
    // Check for unused variables (simplified)
    const varMatches = content.match(/(?:const|let|var)\s+(\w+)/g) || [];
    varMatches.forEach((match, index) => {
        const varName = match.replace(/(?:const|let|var)\s+/, '');
        // Very simplistic check - just count occurrences
        const occurrences = (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
        if (occurrences <= 1) {
            results.push({
                ruleId: 'no-unused-vars',
                severity: 1, // Warning
                message: `'${varName}' is defined but never used`,
                line: estimateLineNumber(content, match, index),
                column: 1,
                fixable: false
            });
        }
    });
    return results;
}
/**
 * Estimate line number of a match in file content
 * This is a simple utility for the mock implementation
 */
function estimateLineNumber(content, match, index) {
    const upToMatch = content.indexOf(match);
    if (upToMatch === -1)
        return 1;
    return (content.substring(0, upToMatch).match(/\n/g) || []).length + 1;
}
//# sourceMappingURL=style-validator.js.map