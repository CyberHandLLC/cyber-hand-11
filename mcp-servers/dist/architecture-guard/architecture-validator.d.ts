/**
 * Architecture Validator Implementation
 *
 * Validates project architecture against Next.js 15.2.4/React 19 best practices.
 * Ensures proper Server/Client component separation and architectural boundaries.
 */
import { ArchitectureValidationResult, ValidatorOptions } from '../shared/types';
/**
 * Validate the architecture of a project or specific file
 * @param filePath - Path to the project or file to validate
 * @param options - Validation options
 * @returns Architecture validation results
 */
export declare function validateArchitecture(filePath: string, options?: ValidatorOptions): Promise<ArchitectureValidationResult>;
