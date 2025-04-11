/**
 * Dependency Validator Implementation
 *
 * Validates dependencies against the project's dependency policy.
 * Ensures all imports follow the architectural boundaries and uses approved packages.
 */
import { DependencyValidationResult, ImportCheckResult, ValidatorOptions } from '../shared/types';
/**
 * Check if an import/dependency is allowed based on the project's policy
 * @param source - Source module path
 * @param target - Target dependency path
 * @param options - Validation options
 * @returns Result indicating if the import is allowed
 */
export declare function checkImportAllowed(source: string, target: string, options?: ValidatorOptions): Promise<ImportCheckResult>;
/**
 * Validate a project's dependencies against the policy
 * @param projectPath - Path to the project root
 * @param options - Validation options
 * @returns Validation results
 */
export declare function validateDependencyPolicy(projectPath: string, options?: ValidatorOptions): Promise<DependencyValidationResult>;
