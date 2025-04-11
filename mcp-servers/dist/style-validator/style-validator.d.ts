/**
 * Style Validator Implementation
 *
 * Validates code style against project standards using ESLint and Prettier.
 * Provides detailed reporting on style issues and fix suggestions.
 */
import { StyleValidationResult, ValidatorOptions } from '../shared/types';
/**
 * Validate code style for a file or project
 * @param filePath - Path to file or directory to validate
 * @param options - Validation options
 * @returns Style validation results
 */
export declare function validateStyles(filePath: string, options?: ValidatorOptions): Promise<StyleValidationResult>;
