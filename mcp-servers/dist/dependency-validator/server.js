"use strict";
/**
 * Dependency Guard MCP Server
 *
 * This server implements the Model Context Protocol (MCP) to provide dependency validation
 * capabilities for the Cyber Hand project. It ensures that dependencies follow project standards
 * and prevents problematic imports across module boundaries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const dependency_validator_1 = require("./dependency-validator");
const utils_1 = require("../shared/utils");
// Create an MCP server instance
const mcpServer = new mcp_js_1.McpServer({
    name: 'Dependency Guard MCP',
    version: '1.0.0',
    description: 'Validates dependencies against project policy and architecture rules'
});
// Add dependency check tool
mcpServer.tool('dependency_check', {
    path: zod_1.z.string().optional().describe('Project path to check dependencies for'),
    options: zod_1.z.object({}).passthrough().optional().describe('Validation options')
}, async ({ path, options = {} }) => {
    (0, utils_1.logger)('info', 'Running dependency check', { path, options });
    const projectPath = path || process.env.PROJECT_ROOT || process.cwd();
    const results = await (0, dependency_validator_1.validateDependencyPolicy)(projectPath, options);
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ success: results.success, results }, null, 2)
            }]
    };
});
// Add import check tool
mcpServer.tool('check_import_allowed', {
    source: zod_1.z.string().describe('Source module path'),
    target: zod_1.z.string().describe('Target dependency path'),
    options: zod_1.z.object({}).passthrough().optional().describe('Check options')
}, async ({ source, target, options = {} }) => {
    (0, utils_1.logger)('info', 'Checking import allowance', { source, target, options });
    if (!source || !target) {
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: 'Missing source or target dependency'
                    }, null, 2)
                }],
            isError: true
        };
    }
    const result = await (0, dependency_validator_1.checkImportAllowed)(source, target, options);
    return {
        content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
    };
});
/**
 * Handle HTTP requests
 * This provides backward compatibility with the HTTP API while using the MCP SDK
 */
async function handleRequest(req, res) {
    (0, utils_1.setCorsHeaders)(res);
    // Handle preflight requests
    if ((0, utils_1.handlePreflight)(req, res))
        return;
    const pathname = (0, utils_1.getPathname)(req);
    // Handle health check endpoint
    if (pathname === '/health') {
        (0, utils_1.sendJsonResponse)(res, { status: 'ok' });
        return;
    }
    // Handle MCP-specific requests
    if (pathname === '/mcp' && req.method === 'POST') {
        const body = await (0, utils_1.parseBody)(req);
        try {
            // Construct MCP-compatible response
            let response;
            if (body.name === 'dependency_check') {
                const projectPath = body.arguments?.path || process.env.PROJECT_ROOT || process.cwd();
                const options = body.arguments?.options || {};
                const results = await (0, dependency_validator_1.validateDependencyPolicy)(projectPath, options);
                response = {
                    name: body.name,
                    tool_call_id: body.tool_call_id,
                    content: {
                        success: results.success,
                        results
                    }
                };
            }
            else if (body.name === 'check_import_allowed') {
                const source = body.arguments?.source;
                const target = body.arguments?.target;
                if (!source || !target) {
                    response = {
                        name: body.name,
                        tool_call_id: body.tool_call_id,
                        content: {
                            success: false,
                            error: 'Missing source or target dependency'
                        }
                    };
                }
                else {
                    const result = await (0, dependency_validator_1.checkImportAllowed)(source, target, body.arguments?.options || {});
                    response = {
                        name: body.name,
                        tool_call_id: body.tool_call_id,
                        content: result
                    };
                }
            }
            else {
                // Unknown tool call
                (0, utils_1.sendJsonResponse)(res, {
                    error: `Unknown tool: ${body.name}`
                }, 400);
                return;
            }
            (0, utils_1.sendJsonResponse)(res, response);
        }
        catch (error) {
            (0, utils_1.logger)('error', 'Error handling MCP request', { error: error.message, pathname });
            (0, utils_1.sendJsonResponse)(res, {
                error: `Error: ${error.message}`
            }, 500);
        }
        return;
    }
    // Handle legacy API endpoints (for backwards compatibility)
    if (pathname === '/validate' && req.method === 'POST') {
        const body = await (0, utils_1.parseBody)(req);
        const projectPath = body.path || process.env.PROJECT_ROOT || process.cwd();
        const options = body.options || {};
        try {
            const results = await (0, dependency_validator_1.validateDependencyPolicy)(projectPath, options);
            (0, utils_1.sendJsonResponse)(res, results, results.success ? 200 : 400);
        }
        catch (error) {
            (0, utils_1.logger)('error', 'Error validating dependencies', { error: error.message, projectPath });
            (0, utils_1.sendJsonResponse)(res, {
                success: false,
                errors: [`Error: ${error.message}`],
                warnings: [],
                allowed: [],
                denied: [],
                summary: 'Validation failed due to an error'
            }, 500);
        }
        return;
    }
    if (pathname === '/check-dependency' && req.method === 'POST') {
        const body = await (0, utils_1.parseBody)(req);
        const source = body.source;
        const target = body.target;
        if (!source || !target) {
            (0, utils_1.sendJsonResponse)(res, { error: 'Missing source or target dependency' }, 400);
            return;
        }
        try {
            const result = await (0, dependency_validator_1.checkImportAllowed)(source, target, body.options || {});
            (0, utils_1.sendJsonResponse)(res, result);
        }
        catch (error) {
            (0, utils_1.logger)('error', 'Error checking dependency', {
                error: error.message,
                source,
                target
            });
            (0, utils_1.sendJsonResponse)(res, {
                success: false,
                isAllowed: false,
                message: `Error checking dependency: ${error.message}`
            }, 500);
        }
        return;
    }
    // Handle unknown routes
    (0, utils_1.handleNotFound)(res);
}
// Create an HTTP server
const PORT = process.env.PORT || 8002;
const server = (0, http_1.createServer)(handleRequest);
// Start the server
server.listen(PORT, () => {
    (0, utils_1.logger)('info', `Dependency Guard MCP Server running at http://localhost:${PORT}`);
});
exports.default = server;
//# sourceMappingURL=server.js.map