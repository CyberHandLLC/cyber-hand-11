"use strict";
/**
 * Standalone Architecture Guard MCP Server
 *
 * This file provides a standalone server implementation using the Model Context Protocol (MCP)
 * SDK for validating architecture against Next.js 15.2.4/React 19 best practices.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const architecture_validator_1 = require("./architecture-validator");
const utils_1 = require("../shared/utils");
// Create a new MCP server with metadata
const server = new mcp_js_1.McpServer({
    name: 'Architecture Guard MCP',
    version: '1.0.0',
    description: 'Validates architecture against Next.js 15.2.4/React 19 best practices'
});
// Register the architecture_check tool
server.tool('architecture_check', {
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
// Register the check_component_architecture tool
server.tool('check_component_architecture', {
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
// Determine transport mode based on environment variables
const transportMode = process.env.TRANSPORT_MODE || 'stdio';
async function startServer() {
    if (transportMode === 'stdio') {
        // Use stdio transport (for CLI usage)
        (0, utils_1.logger)('info', 'Starting architecture guard MCP server with stdio transport');
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
    }
    else if (transportMode === 'http') {
        // Use HTTP+SSE transport (for web usage)
        const PORT = process.env.PORT || 8001;
        const app = (0, express_1.default)();
        // Enable CORS and basic security headers
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('X-Content-Type-Options', 'nosniff');
            res.header('X-Frame-Options', 'DENY');
            res.header('Content-Security-Policy', "default-src 'self'");
            if (req.method === 'OPTIONS') {
                return res.status(204).end();
            }
            next();
        });
        // Simple health check endpoint
        app.get('/health', (_, res) => {
            res.json({ status: 'ok' });
        });
        // Map to store active SSE connections
        const transports = {};
        // SSE endpoint for clients to connect
        app.get('/sse', async (_, res) => {
            const transport = new sse_js_1.SSEServerTransport('/messages', res);
            transports[transport.sessionId] = transport;
            res.on('close', () => {
                delete transports[transport.sessionId];
                (0, utils_1.logger)('info', 'SSE connection closed', { sessionId: transport.sessionId });
            });
            await server.connect(transport);
        });
        // Messages endpoint for clients to send requests
        app.post('/messages', async (req, res) => {
            const sessionId = req.query.sessionId;
            const transport = transports[sessionId];
            if (transport) {
                await transport.handlePostMessage(req, res);
            }
            else {
                res.status(400).send('No transport found for sessionId');
            }
        });
        // Start HTTP server
        app.listen(PORT, () => {
            (0, utils_1.logger)('info', `Architecture Guard MCP Server running at http://localhost:${PORT}`);
        });
    }
    else {
        (0, utils_1.logger)('error', `Unknown transport mode: ${transportMode}`);
        process.exit(1);
    }
}
// Start the server
startServer().catch(error => {
    (0, utils_1.logger)('error', 'Failed to start server', { error: error.message });
    process.exit(1);
});
//# sourceMappingURL=standalone-server.js.map