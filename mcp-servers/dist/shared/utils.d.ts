/**
 * Shared utilities for MCP servers
 * These functions are used across all MCP servers for common operations
 */
import { IncomingMessage, ServerResponse } from 'http';
import { LogLevel } from './types';
/**
 * Parse JSON payload from requests
 * @param req - The incoming HTTP request
 * @returns Parsed JSON object or empty object on error
 */
export declare function parseBody(req: IncomingMessage): Promise<Record<string, any>>;
/**
 * Set CORS headers on response
 * @param res - The server response object
 */
export declare function setCorsHeaders(res: ServerResponse): void;
/**
 * Handle preflight OPTIONS requests
 * @param req - The incoming HTTP request
 * @param res - The server response object
 * @returns Boolean indicating if request was handled
 */
export declare function handlePreflight(req: IncomingMessage, res: ServerResponse): boolean;
/**
 * Send JSON response with appropriate headers
 * @param res - The server response object
 * @param data - Data to send as JSON
 * @param statusCode - HTTP status code
 */
export declare function sendJsonResponse(res: ServerResponse, data: Record<string, any>, statusCode?: number): void;
/**
 * Handle unknown routes with 404 response
 * @param res - The server response object
 */
export declare function handleNotFound(res: ServerResponse): void;
/**
 * Create a standardized error response
 * @param message - Error message
 * @param details - Additional error details
 * @param statusCode - HTTP status code
 * @returns Formatted error response
 */
export declare function createErrorResponse(message: string, details?: Record<string, any>, statusCode?: number): {
    success: false;
    error: string;
    details?: Record<string, any>;
    statusCode: number;
};
/**
 * Structured logger with levels and timestamps
 * @param level - Log level
 * @param message - Message to log
 * @param meta - Additional metadata
 */
export declare function logger(level: LogLevel, message: string, meta?: Record<string, any>): void;
/**
 * Validate that a parameter exists and is of the expected type
 * @param value - The value to check
 * @param name - Parameter name for error messages
 * @param type - Expected type
 * @returns Boolean indicating if validation passed
 */
export declare function validateParameter(value: any, name: string, type: 'string' | 'number' | 'boolean' | 'object' | 'array'): boolean;
/**
 * Extract path parameter from URL
 * @param req - The incoming HTTP request
 * @returns The pathname from the URL
 */
export declare function getPathname(req: IncomingMessage): string;
/**
 * Safely access nested properties in an object
 * @param obj - The object to access
 * @param path - Dot-separated path to the property
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value or default
 */
export declare function getNestedProperty(obj: Record<string, any>, path: string, defaultValue?: any): any;
