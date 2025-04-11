/**
 * Mock implementation of the MCP TypeScript SDK
 * This provides the interfaces and basic functionality needed for our tests
 */
import { ServerResponse } from 'http';
import { Request, Response } from 'express';
export declare class McpServer {
    private name;
    private version;
    private description?;
    private tools;
    constructor(options: {
        name: string;
        version: string;
        description?: string;
    });
    tool(name: string, paramSchema: any, handler: (params: any) => Promise<any>): ToolRegistration;
    connect(transport: any): Promise<void>;
    listTools(): ToolDefinition[];
    executeTool(name: string, params: any): Promise<any>;
}
interface ToolDefinition {
    name: string;
    paramSchema: any;
    handler: (params: any) => Promise<any>;
    enabled: boolean;
}
interface ToolRegistration {
    update: (updates: Partial<ToolDefinition>) => void;
    enable: () => void;
    disable: () => void;
    remove: () => void;
}
export declare class StdioServerTransport {
    constructor();
}
export declare class SSEServerTransport {
    sessionId: string;
    constructor(messagesPath: string, res: ServerResponse);
    handlePostMessage(req: Request, res: Response): Promise<void>;
}
export {};
