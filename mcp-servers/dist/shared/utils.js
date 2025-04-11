"use strict";
/**
 * Shared utilities for MCP servers
 * These functions are used across all MCP servers for common operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = parseBody;
exports.setCorsHeaders = setCorsHeaders;
exports.handlePreflight = handlePreflight;
exports.sendJsonResponse = sendJsonResponse;
exports.handleNotFound = handleNotFound;
exports.createErrorResponse = createErrorResponse;
exports.logger = logger;
exports.validateParameter = validateParameter;
exports.getPathname = getPathname;
exports.getNestedProperty = getNestedProperty;
const url_1 = require("url");
/**
 * Parse JSON payload from requests
 * @param req - The incoming HTTP request
 * @returns Parsed JSON object or empty object on error
 */
async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            }
            catch (error) {
                console.error('Failed to parse request body:', error);
                resolve({});
            }
        });
    });
}
/**
 * Set CORS headers on response
 * @param res - The server response object
 */
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
}
/**
 * Handle preflight OPTIONS requests
 * @param req - The incoming HTTP request
 * @param res - The server response object
 * @returns Boolean indicating if request was handled
 */
function handlePreflight(req, res) {
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        res.statusCode = 204;
        res.end();
        return true;
    }
    return false;
}
/**
 * Send JSON response with appropriate headers
 * @param res - The server response object
 * @param data - Data to send as JSON
 * @param statusCode - HTTP status code
 */
function sendJsonResponse(res, data, statusCode = 200) {
    setCorsHeaders(res);
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}
/**
 * Handle unknown routes with 404 response
 * @param res - The server response object
 */
function handleNotFound(res) {
    sendJsonResponse(res, { error: 'Not found', success: false }, 404);
}
/**
 * Create a standardized error response
 * @param message - Error message
 * @param details - Additional error details
 * @param statusCode - HTTP status code
 * @returns Formatted error response
 */
function createErrorResponse(message, details, statusCode = 400) {
    return {
        success: false,
        error: message,
        details,
        statusCode
    };
}
/**
 * Structured logger with levels and timestamps
 * @param level - Log level
 * @param message - Message to log
 * @param meta - Additional metadata
 */
function logger(level, message, meta) {
    const timestamp = new Date().toISOString();
    const logData = {
        timestamp,
        level,
        message,
        ...(meta || {})
    };
    switch (level) {
        case 'debug':
            console.debug(JSON.stringify(logData));
            break;
        case 'info':
            console.info(JSON.stringify(logData));
            break;
        case 'warn':
            console.warn(JSON.stringify(logData));
            break;
        case 'error':
            console.error(JSON.stringify(logData));
            break;
        default:
            console.log(JSON.stringify(logData));
    }
}
/**
 * Validate that a parameter exists and is of the expected type
 * @param value - The value to check
 * @param name - Parameter name for error messages
 * @param type - Expected type
 * @returns Boolean indicating if validation passed
 */
function validateParameter(value, name, type) {
    if (value === undefined || value === null) {
        return false;
    }
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number';
        case 'boolean':
            return typeof value === 'boolean';
        case 'object':
            return typeof value === 'object' && !Array.isArray(value);
        case 'array':
            return Array.isArray(value);
        default:
            return false;
    }
}
/**
 * Extract path parameter from URL
 * @param req - The incoming HTTP request
 * @returns The pathname from the URL
 */
function getPathname(req) {
    return (0, url_1.parse)(req.url || '').pathname || '';
}
/**
 * Safely access nested properties in an object
 * @param obj - The object to access
 * @param path - Dot-separated path to the property
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value or default
 */
function getNestedProperty(obj, path, defaultValue = undefined) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current === undefined || current === null) {
            return defaultValue;
        }
        current = current[key];
    }
    return current !== undefined ? current : defaultValue;
}
//# sourceMappingURL=utils.js.map