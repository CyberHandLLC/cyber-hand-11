/**
 * MCP Protocol Helper
 * 
 * This module provides utilities to correctly format MCP protocol messages
 * according to the official Model Context Protocol specification.
 * 
 * See: https://github.com/modelcontextprotocol/typescript-sdk
 */

/**
 * Format an MCP response message according to protocol specifications
 * @param {string} requestId - The ID of the request being responded to
 * @param {string} toolName - The name of the tool that was executed
 * @param {object} content - The content to return in the response
 * @returns {string} - Properly formatted MCP response message
 */
function formatMcpResponse(requestId, toolName, content) {
  const response = {
    id: requestId,
    type: "response",
    request_id: requestId,
    name: toolName,
    content: content
  };

  // MCP requires messages to be JSON objects, one per line
  return JSON.stringify(response);
}

/**
 * Parse an MCP request message from raw input
 * @param {string} input - Raw JSON input string
 * @returns {object|null} - Parsed MCP request or null if invalid
 */
function parseMcpRequest(input) {
  try {
    const request = JSON.parse(input);
    
    // Validate that this is a proper MCP request
    if (request.type !== 'request' || !request.id || !request.name) {
      console.error('Invalid MCP request format:', request);
      return null;
    }
    
    return request;
  } catch (error) {
    console.error('Failed to parse MCP request:', error);
    return null;
  }
}

/**
 * Create a simple MCP error response
 * @param {string} requestId - The ID of the request being responded to
 * @param {string} toolName - The name of the tool that was called
 * @param {string} errorMessage - The error message
 * @returns {string} - Properly formatted MCP error response
 */
function createErrorResponse(requestId, toolName, errorMessage) {
  const content = {
    type: "error",
    message: errorMessage
  };
  
  return formatMcpResponse(requestId, toolName, content);
}

module.exports = {
  formatMcpResponse,
  parseMcpRequest,
  createErrorResponse
};
