"use strict";
/**
 * Mock implementation of the MCP TypeScript SDK
 * This provides the interfaces and basic functionality needed for our tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEServerTransport = exports.StdioServerTransport = exports.McpServer = void 0;
// Server class
class McpServer {
    constructor(options) {
        this.tools = new Map();
        this.name = options.name;
        this.version = options.version;
        this.description = options.description;
    }
    // Register a tool with the server
    tool(name, paramSchema, handler) {
        const toolDef = {
            name,
            paramSchema,
            handler,
            enabled: true
        };
        this.tools.set(name, toolDef);
        return {
            update: (updates) => {
                const tool = this.tools.get(name);
                if (tool) {
                    Object.assign(tool, updates);
                }
            },
            enable: () => {
                const tool = this.tools.get(name);
                if (tool) {
                    tool.enabled = true;
                }
            },
            disable: () => {
                const tool = this.tools.get(name);
                if (tool) {
                    tool.enabled = false;
                }
            },
            remove: () => {
                this.tools.delete(name);
            }
        };
    }
    // Connect to a transport
    async connect(transport) {
        console.log(`Connected MCP server ${this.name} to transport`);
        // In a real implementation, this would set up event listeners
        // and handle protocol messages
    }
    // List all registered tools
    listTools() {
        return Array.from(this.tools.values())
            .filter(tool => tool.enabled);
    }
    // Execute a tool by name
    async executeTool(name, params) {
        const tool = this.tools.get(name);
        if (!tool || !tool.enabled) {
            throw new Error(`Tool not found or disabled: ${name}`);
        }
        return await tool.handler(params);
    }
}
exports.McpServer = McpServer;
// Transport implementations
class StdioServerTransport {
    constructor() {
        console.log('Created stdio transport');
    }
}
exports.StdioServerTransport = StdioServerTransport;
class SSEServerTransport {
    constructor(messagesPath, res) {
        this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        console.log(`Created SSE transport with session ID ${this.sessionId}`);
        // Set up SSE response headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    }
    async handlePostMessage(req, res) {
        console.log(`Handling message for session ${this.sessionId}`);
        // Send a basic acknowledgement
        res.json({ success: true });
    }
}
exports.SSEServerTransport = SSEServerTransport;
//# sourceMappingURL=mcp-sdk-mock.js.map