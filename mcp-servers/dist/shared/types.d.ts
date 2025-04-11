/**
 * Shared TypeScript types for MCP servers
 * This file contains common type definitions used across all MCP servers
 */
export interface McpResponse {
    name: string;
    tool_call_id: string;
    content: Record<string, any>;
}
export interface ErrorResponse {
    success: false;
    error: string;
    details?: Record<string, any>;
}
export interface SuccessResponse {
    success: true;
    [key: string]: any;
}
export type ApiResponse = ErrorResponse | SuccessResponse;
export interface ValidatorOptions {
    singleFile?: boolean;
    fix?: boolean;
    ignorePatterns?: string[];
    [key: string]: any;
}
export interface ArchitectureValidationResult {
    success: boolean;
    errors: string[];
    warnings: string[];
    components: {
        valid: string[];
        invalid: string[];
    };
    summary: string;
}
export interface DependencyValidationResult {
    success: boolean;
    errors: string[];
    warnings: string[];
    allowed: string[];
    denied: string[];
    summary: string;
}
export interface StyleValidationResult {
    success: boolean;
    errors: string[];
    warnings: string[];
    fixable: string[];
    summary: string;
}
export interface ImportCheckResult {
    success: boolean;
    isAllowed: boolean;
    message: string;
}
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
