/**
 * Architecture Guard MCP Server
 *
 * This server implements the Model Context Protocol (MCP) to provide architecture validation
 * capabilities to Windsurf's Cascade AI. It exposes endpoints for architecture validation
 * and can be invoked by the AI assistant during coding sessions.
 *
 * The server follows Next.js 15.2.4/React 19 validation guidelines.
 */

const { createServer } = require("http");
const { parse } = require("url");
const { runValidator } = require("./index");

// Parse JSON payload from requests
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        console.error("Failed to parse request body:", error);
        resolve({});
      }
    });
  });
}

// Validate architecture for a given path
async function validateArchitecture(path, options = {}) {
  try {
    const results = await runValidator(path || process.cwd(), options);
    return {
      success: results.errors.length === 0,
      errors: results.errors,
      warnings: results.warnings,
      summary: results.summary,
    };
  } catch (error) {
    console.error("Architecture validation failed:", error);
    return {
      success: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      summary: "Validation failed due to an error",
    };
  }
}

// Handle MCP tool calls
async function handleRequest(req, res) {
  const { pathname } = parse(req.url);

  // CORS headers to allow Windsurf to make requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Health check endpoint
  if (pathname === "/health") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  // Validate endpoint
  if (pathname === "/validate" && req.method === "POST") {
    const body = await parseBody(req);
    const projectPath = body.path || process.env.PROJECT_ROOT || process.cwd();
    const options = body.options || {};

    const results = await validateArchitecture(projectPath, options);

    res.statusCode = results.success ? 200 : 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(results));
    return;
  }

  // MCP Tool call endpoint
  if (pathname === "/mcp" && req.method === "POST") {
    const body = await parseBody(req);

    if (body.name === "architecture_check") {
      const projectPath = body.arguments?.path || process.env.PROJECT_ROOT || process.cwd();
      const options = body.arguments?.options || {};

      const results = await validateArchitecture(projectPath, options);

      // Format response according to MCP protocol
      const response = {
        name: body.name,
        tool_call_id: body.tool_call_id,
        content: {
          success: results.success,
          results: results,
        },
      };

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
      return;
    }

    // Unknown tool call
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `Unknown tool: ${body.name}`,
      })
    );
    return;
  }

  // Fallback for unknown routes
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Not found" }));
}

// Start the server
const PORT = process.env.PORT || 8001;
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Architecture Guard MCP Server running at http://localhost:${PORT}`);
});

module.exports = server;
