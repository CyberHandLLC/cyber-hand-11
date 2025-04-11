/**
 * Architecture Guard MCP Server
 *
 * This server implements the Model Context Protocol (MCP) to provide architecture validation
 * capabilities for the Cyber Hand project. It ensures that components follow Next.js 15.2.4/React 19
 * architectural patterns and enforces proper Server/Client component separation.
 */
import { IncomingMessage, ServerResponse } from 'http';
declare const server: import("http").Server<typeof IncomingMessage, typeof ServerResponse>;
export default server;
