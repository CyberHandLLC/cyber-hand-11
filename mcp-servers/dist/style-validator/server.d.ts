/**
 * Style Validator MCP Server
 *
 * This server implements the Model Context Protocol (MCP) to provide code style validation
 * capabilities for the Cyber Hand project. It enforces consistent code style and formatting
 * according to the project's standards using ESLint and Prettier.
 */
import { IncomingMessage, ServerResponse } from 'http';
declare const server: import("http").Server<typeof IncomingMessage, typeof ServerResponse>;
export default server;
