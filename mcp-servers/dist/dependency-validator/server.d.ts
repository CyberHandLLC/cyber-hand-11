/**
 * Dependency Guard MCP Server
 *
 * This server implements the Model Context Protocol (MCP) to provide dependency validation
 * capabilities for the Cyber Hand project. It ensures that dependencies follow project standards
 * and prevents problematic imports across module boundaries.
 */
import { IncomingMessage, ServerResponse } from 'http';
declare const server: import("http").Server<typeof IncomingMessage, typeof ServerResponse>;
export default server;
