"use strict";
/**
 * Architecture Guard MCP Server
 *
 * This server implements the Model Context Protocol (MCP) to provide architecture validation
 * capabilities for the Cyber Hand project. It ensures that components follow Next.js 15.2.4/React 19
 * architectural patterns and enforces proper Server/Client component separation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const architecture_validator_1 = require("./architecture-validator");
const utils_1 = require("../shared/utils");
// Create an MCP server instance
const mcpServer = new mcp_js_1.McpServer({
    name: 'Architecture Guard MCP',
    version: '1.0.0',
    description: 'Validates architecture against Next.js 15.2.4/React 19 best practices'
});
// Add architecture check tool
mcpServer.tool('architecture_check', {
    path: zod_1.z.string().describe('Project path or file to check architecture for'),
    options: zod_1.z.object({
        singleFile: zod_1.z.boolean().optional().describe('Whether to check a single file'),
        ignorePatterns: zod_1.z.array(zod_1.z.string()).optional().describe('Patterns to ignore')
    }).passthrough().optional().describe('Validation options')
}, async ({ path, options = {} }) => {
    (0, utils_1.logger)('info', 'Running architecture check', { path, options });
    const projectPath = path || process.env.PROJECT_ROOT || process.cwd();
    const results = await (0, architecture_validator_1.validateArchitecture)(projectPath, options);
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ success: results.success, results }, null, 2)
            }]
    };
});
// Add component check tool
mcpServer.tool('check_component_architecture', {
    filePath: zod_1.z.string().describe('Path to the component file to check'),
    options: zod_1.z.object({}).passthrough().optional().describe('Check options')
}, async ({ filePath, options = {} }) => {
    (0, utils_1.logger)('info', 'Checking component architecture', { filePath, options });
    if (!filePath) {
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: 'Missing component file path'
                    }, null, 2)
                }],
            isError: true
        };
    }
    const result = await (0, architecture_validator_1.validateArchitecture)(filePath, { ...options, singleFile: true });
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
            if (body.name === 'architecture_check') {
                const projectPath = body.arguments?.path || process.env.PROJECT_ROOT || process.cwd();
                const options = body.arguments?.options || {};
                const results = await (0, architecture_validator_1.validateArchitecture)(projectPath, options);
                response = {
                    name: body.name,
                    tool_call_id: body.tool_call_id,
                    content: {
                        success: results.success,
                        results
                    }
                };
            }
            else if (body.name === 'check_component_architecture') {
                const filePath = body.arguments?.filePath;
                if (!filePath) {
                    response = {
                        name: body.name,
                        tool_call_id: body.tool_call_id,
                        content: {
                            success: false,
                            error: 'Missing component file path'
                        }
                    };
                }
                else {
                    const result = await (0, architecture_validator_1.validateArchitecture)(filePath, {
                        ...(body.arguments?.options || {}),
                        singleFile: true
                    });
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
            const results = await (0, architecture_validator_1.validateArchitecture)(projectPath, options);
            (0, utils_1.sendJsonResponse)(res, results, results.success ? 200 : 400);
        }
        catch (error) {
            (0, utils_1.logger)('error', 'Error validating architecture', { error: error.message, projectPath });
            (0, utils_1.sendJsonResponse)(res, {
                success: false,
                errors: [`Error: ${error.message}`],
                warnings: [],
                components: { valid: [], invalid: [] },
                summary: 'Validation failed due to an error'
            }, 500);
        }
        return;
    }
    if (pathname === '/check-component' && req.method === 'POST') {
        const body = await (0, utils_1.parseBody)(req);
        const filePath = body.filePath;
        if (!filePath) {
            (0, utils_1.sendJsonResponse)(res, { error: 'Missing component file path' }, 400);
            return;
        }
        try {
            const result = await (0, architecture_validator_1.validateArchitecture)(filePath, { ...(body.options || {}), singleFile: true });
            (0, utils_1.sendJsonResponse)(res, result);
        }
        catch (error) {
            (0, utils_1.logger)('error', 'Error checking component architecture', {
                error: error.message,
                filePath
            });
            (0, utils_1.sendJsonResponse)(res, {
                success: false,
                errors: [`Error checking architecture: ${error.message}`],
                warnings: [],
                components: { valid: [], invalid: [] },
                summary: `Failed to check architecture for ${filePath}`
            }, 500);
        }
        return;
    }
    // Handle unknown routes
    (0, utils_1.handleNotFound)(res);
}
// Create an HTTP server
const PORT = process.env.PORT || 8001;
const server = (0, http_1.createServer)(handleRequest);
// Start the server
server.listen(PORT, () => {
    (0, utils_1.logger)('info', `Architecture Guard MCP Server running at http://localhost:${PORT}`);
});
exports.default = server;
//# sourceMappingURL=server.js.map