"use strict";
/**
 * Dependency Validator Implementation
 *
 * Validates dependencies against the project's dependency policy.
 * Ensures all imports follow the architectural boundaries and uses approved packages.
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
exports.checkImportAllowed = checkImportAllowed;
exports.validateDependencyPolicy = validateDependencyPolicy;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const semver = __importStar(require("semver"));
const utils_1 = require("../shared/utils");
// Map to cache policy rules
const policyCache = new Map();
/**
 * Parse and cache the dependency policy from the project's .dependency-policy.md file
 * @param projectPath - Path to the project root
 * @returns The parsed dependency policy
 */
async function loadDependencyPolicy(projectPath) {
    // Check if policy is already cached
    if (policyCache.has(projectPath)) {
        return policyCache.get(projectPath);
    }
    const policyPath = path.join(projectPath, '.dependency-policy.md');
    try {
        if (!fs.existsSync(policyPath)) {
            throw new Error(`.dependency-policy.md not found at ${projectPath}`);
        }
        const content = fs.readFileSync(policyPath, 'utf8');
        const policy = {
            approved: new Map(),
            disallowed: new Map(),
            guidelines: []
        };
        // Extract approved packages
        const approvedSection = content.match(/## Approved Dependencies\s+\|(.*?)\|\s+## Disallowed Dependencies/s);
        if (approvedSection && approvedSection[0]) {
            const lines = approvedSection[0].split('\n').filter(line => line.startsWith('|') && !line.includes('---'));
            // Skip the header row
            lines.slice(1).forEach(line => {
                const [, packageName, version, notes] = line.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/) || [];
                if (packageName && version && !packageName.includes('Package')) {
                    policy.approved.set(packageName.trim(), version.trim());
                }
            });
        }
        // Extract disallowed packages
        const disallowedSection = content.match(/## Disallowed Dependencies\s+\|(.*?)\|\s+## /s);
        if (disallowedSection && disallowedSection[0]) {
            const lines = disallowedSection[0].split('\n').filter(line => line.startsWith('|') && !line.includes('---'));
            // Skip the header row
            lines.slice(1).forEach(line => {
                const [, packageName, version, notes] = line.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/) || [];
                if (packageName && notes && !packageName.includes('Package')) {
                    policy.disallowed.set(packageName.trim(), notes.trim());
                }
            });
        }
        // Extract guidelines
        const guidelinesSection = content.match(/## .* Guidelines\s+([\s\S]+?)(?=##|$)/g);
        if (guidelinesSection) {
            guidelinesSection.forEach(section => {
                const lines = section.split('\n')
                    .filter(line => line.startsWith('-'))
                    .map(line => line.replace(/^-\s*/, '').trim());
                policy.guidelines.push(...lines);
            });
        }
        // Cache the policy
        policyCache.set(projectPath, policy);
        return policy;
    }
    catch (error) {
        (0, utils_1.logger)('error', `Failed to load dependency policy: ${error.message}`);
        throw new Error(`Failed to load dependency policy: ${error.message}`);
    }
}
/**
 * Check if an import/dependency is allowed based on the project's policy
 * @param source - Source module path
 * @param target - Target dependency path
 * @param options - Validation options
 * @returns Result indicating if the import is allowed
 */
async function checkImportAllowed(source, target, options = {}) {
    const projectPath = options.projectPath || process.cwd();
    try {
        // Load the policy
        const policy = await loadDependencyPolicy(projectPath);
        // Check if target is a direct package import (node_modules)
        if (!target.startsWith('.') && !target.startsWith('/')) {
            // Extract the package name (handle scoped packages)
            const packageName = target.startsWith('@')
                ? target.split('/').slice(0, 2).join('/')
                : target.split('/')[0];
            // Check if package is disallowed
            if (policy.disallowed.has(packageName)) {
                return {
                    success: true,
                    isAllowed: false,
                    message: `Import of '${packageName}' is disallowed: ${policy.disallowed.get(packageName)}`
                };
            }
            // Check if package is approved
            const isApproved = policy.approved.has(packageName);
            return {
                success: true,
                isAllowed: isApproved,
                message: isApproved
                    ? `Import of '${packageName}' is allowed`
                    : `Import of '${packageName}' is not in the approved dependencies list`
            };
        }
        // For relative imports (project files), check architectural boundaries
        // This is a simplified implementation - real architecture rules would be more complex
        // Convert relative paths to absolute for comparison
        const sourceDir = path.dirname(source);
        const absoluteTarget = target.startsWith('.')
            ? path.normalize(path.join(sourceDir, target))
            : target;
        // Basic architecture rules (these would be customized per project)
        // Example: Prevent importing from app/ into components/ 
        if (source.includes('/components/') && absoluteTarget.includes('/app/')) {
            return {
                success: true,
                isAllowed: false,
                message: 'Components cannot import from app/ directory per architecture rules'
            };
        }
        // Example: Prevent server components from importing client components
        if (source.includes('server') && absoluteTarget.includes('client')) {
            return {
                success: true,
                isAllowed: false,
                message: 'Server components cannot import client components per architecture rules'
            };
        }
        // By default, allow relative imports
        return {
            success: true,
            isAllowed: true,
            message: `Import from '${source}' to '${target}' is allowed`
        };
    }
    catch (error) {
        return {
            success: false,
            isAllowed: false,
            message: `Error checking dependency: ${error.message}`
        };
    }
}
/**
 * Validate a project's dependencies against the policy
 * @param projectPath - Path to the project root
 * @param options - Validation options
 * @returns Validation results
 */
async function validateDependencyPolicy(projectPath, options = {}) {
    try {
        // Load the policy
        const policy = await loadDependencyPolicy(projectPath);
        // Load package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            return {
                success: false,
                errors: [`package.json not found at ${projectPath}`],
                warnings: [],
                allowed: [],
                denied: [],
                summary: 'Validation failed: package.json not found'
            };
        }
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const dependencies = {
            ...(packageJson.dependencies || {}),
            ...(packageJson.devDependencies || {})
        };
        const errors = [];
        const warnings = [];
        const allowed = [];
        const denied = [];
        // Check each dependency
        for (const [dep, version] of Object.entries(dependencies)) {
            // Check if dependency is disallowed
            if (policy.disallowed.has(dep)) {
                errors.push(`Disallowed dependency: ${dep} - ${policy.disallowed.get(dep)}`);
                denied.push(dep);
                continue;
            }
            // Check if dependency is not in approved list
            if (!policy.approved.has(dep)) {
                warnings.push(`Dependency '${dep}' is not in the approved list`);
                continue;
            }
            // Check version compatibility
            const approvedVersion = policy.approved.get(dep);
            if (!semver.satisfies(semver.coerce(version) || '', approvedVersion)) {
                warnings.push(`Dependency '${dep}' version ${version} does not satisfy policy version ${approvedVersion}`);
            }
            else {
                allowed.push(dep);
            }
        }
        // Summarize results
        const summary = errors.length > 0
            ? `Validation failed with ${errors.length} errors and ${warnings.length} warnings`
            : `Validation passed with ${warnings.length} warnings`;
        return {
            success: errors.length === 0,
            errors,
            warnings,
            allowed,
            denied,
            summary
        };
    }
    catch (error) {
        (0, utils_1.logger)('error', `Dependency validation failed: ${error.message}`);
        return {
            success: false,
            errors: [`Validation error: ${error.message}`],
            warnings: [],
            allowed: [],
            denied: [],
            summary: 'Validation failed due to an error'
        };
    }
}
//# sourceMappingURL=dependency-validator.js.map