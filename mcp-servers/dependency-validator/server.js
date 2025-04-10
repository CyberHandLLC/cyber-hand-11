/**
 * Dependency Guard MCP Server
 * 
 * This server implements the Model Context Protocol (MCP) to provide dependency validation
 * capabilities to Windsurf's Cascade AI. It ensures that dependencies follow project standards
 * and prevents problematic imports across module boundaries.
 */

const { createServer } = require('http');
const { parse } = require('url');
const { validateDependencyPolicy } = require('./dependency-validator');

// Parse JSON payload from requests
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        console.error('Failed to parse request body:', error);
        resolve({});
      }
    });
  });
}

// Validate dependencies for a given project
async function validateDependencies(path, options = {}) {
  try {
    const results = await validateDependencyPolicy(path || process.cwd(), options);
    return {
      success: results.errors.length === 0,
      errors: results.errors,
      warnings: results.warnings,
      allowed: results.allowed,
      denied: results.denied,
      summary: results.summary
    };
  } catch (error) {
    console.error('Dependency validation failed:', error);
    return {
      success: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      allowed: [],
      denied: [],
      summary: 'Validation failed due to an error'
    };
  }
}

// Check a specific import/dependency
async function checkDependency(source, target, options = {}) {
  try {
    const isAllowed = await checkImportAllowed(source, target, options);
    return {
      success: true,
      isAllowed,
      message: isAllowed 
        ? `Import from '${source}' to '${target}' is allowed` 
        : `Import from '${source}' to '${target}' is not allowed per project architecture rules`
    };
  } catch (error) {
    return {
      success: false,
      isAllowed: false,
      message: `Error checking dependency: ${error.message}`
    };
  }
}

// Handle MCP tool calls
async function handleRequest(req, res) {
  const { pathname } = parse(req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Health check endpoint
  if (pathname === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Validate dependencies endpoint
  if (pathname === '/validate' && req.method === 'POST') {
    const body = await parseBody(req);
    const projectPath = body.path || process.env.PROJECT_ROOT || process.cwd();
    const options = body.options || {};
    
    const results = await validateDependencies(projectPath, options);
    
    res.statusCode = results.success ? 200 : 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
    return;
  }

  // Check specific dependency endpoint
  if (pathname === '/check-dependency' && req.method === 'POST') {
    const body = await parseBody(req);
    const source = body.source;
    const target = body.target;
    
    if (!source || !target) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing source or target dependency' }));
      return;
    }
    
    const result = await checkDependency(source, target, body.options || {});
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
    return;
  }

  // MCP Tool call endpoint
  if (pathname === '/mcp' && req.method === 'POST') {
    const body = await parseBody(req);
    
    if (body.name === 'dependency_check') {
      const projectPath = body.arguments?.path || process.env.PROJECT_ROOT || process.cwd();
      const options = body.arguments?.options || {};
      
      const results = await validateDependencies(projectPath, options);
      
      // Format response according to MCP protocol
      const response = {
        name: body.name,
        tool_call_id: body.tool_call_id,
        content: {
          success: results.success,
          results: results
        }
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
      return;
    }
    
    if (body.name === 'check_import_allowed') {
      const source = body.arguments?.source;
      const target = body.arguments?.target;
      
      if (!source || !target) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          name: body.name,
          tool_call_id: body.tool_call_id,
          content: {
            success: false,
            error: 'Missing source or target dependency'
          }
        }));
        return;
      }
      
      const result = await checkDependency(source, target, body.arguments?.options || {});
      
      const response = {
        name: body.name,
        tool_call_id: body.tool_call_id,
        content: result
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
      return;
    }
    
    // Unknown tool call
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: `Unknown tool: ${body.name}`
    }));
    return;
  }

  // Fallback for unknown routes
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
}

// Start the server
const PORT = process.env.PORT || 8002;
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Dependency Guard MCP Server running at http://localhost:${PORT}`);
});

module.exports = server;
