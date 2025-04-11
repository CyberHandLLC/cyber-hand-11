/**
 * Mock implementation of the MCP TypeScript SDK
 * This provides the interfaces and basic functionality needed for our tests
 */

import { ServerResponse } from 'http';
import { Request, Response } from 'express';

// Server class
export class McpServer {
  private name: string;
  private version: string;
  private description?: string;
  private tools: Map<string, ToolDefinition> = new Map();

  constructor(options: { name: string; version: string; description?: string }) {
    this.name = options.name;
    this.version = options.version;
    this.description = options.description;
  }

  // Register a tool with the server
  tool(
    name: string,
    paramSchema: any,
    handler: (params: any) => Promise<any>
  ): ToolRegistration {
    const toolDef: ToolDefinition = {
      name,
      paramSchema,
      handler,
      enabled: true
    };
    
    this.tools.set(name, toolDef);
    
    return {
      update: (updates: Partial<ToolDefinition>) => {
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
  async connect(transport: any): Promise<void> {
    console.log(`Connected MCP server ${this.name} to transport`);
    
    // In a real implementation, this would set up event listeners
    // and handle protocol messages
  }
  
  // List all registered tools
  listTools(): ToolDefinition[] {
    return Array.from(this.tools.values())
      .filter(tool => tool.enabled);
  }
  
  // Execute a tool by name
  async executeTool(name: string, params: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool || !tool.enabled) {
      throw new Error(`Tool not found or disabled: ${name}`);
    }
    
    return await tool.handler(params);
  }
}

// Tool definition interface
interface ToolDefinition {
  name: string;
  paramSchema: any;
  handler: (params: any) => Promise<any>;
  enabled: boolean;
}

// Tool registration return type
interface ToolRegistration {
  update: (updates: Partial<ToolDefinition>) => void;
  enable: () => void;
  disable: () => void;
  remove: () => void;
}

// Transport implementations
export class StdioServerTransport {
  constructor() {
    console.log('Created stdio transport');
  }
}

export class SSEServerTransport {
  sessionId: string;
  
  constructor(messagesPath: string, res: ServerResponse) {
    this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`Created SSE transport with session ID ${this.sessionId}`);
    
    // Set up SSE response headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
  }
  
  async handlePostMessage(req: Request, res: Response): Promise<void> {
    console.log(`Handling message for session ${this.sessionId}`);
    
    // Send a basic acknowledgement
    res.json({ success: true });
  }
}
