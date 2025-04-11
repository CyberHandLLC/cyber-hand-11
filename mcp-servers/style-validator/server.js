/**
 * Style Validator MCP Server
 *
 * This server implements the Model Context Protocol (MCP) to provide code style validation
 * capabilities to Windsurf's Cascade AI. It enforces consistent code style and formatting
 * according to the project's standards.
 *
 * It integrates with ESLint and Prettier for validation.
 */

const { createServer } = require("http");
const { parse } = require("url");
const { validateStyles } = require("./style-validator");

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

// Validate styles for a given file or project
async function validateStyleRules(path, options = {}) {
  try {
    const results = await validateStyles(path || process.cwd(), options);
    return {
      success: results.errors.length === 0,
      errors: results.errors,
      warnings: results.warnings,
      fixable: results.fixable || [],
      summary: results.summary,
    };
  } catch (error) {
    console.error("Style validation failed:", error);
    return {
      success: false,
      errors: [`Validation error: ${error.message}`],
      warnings: [],
      fixable: [],
      summary: "Validation failed due to an error",
    };
  }
}

// Check a specific file's style
async function checkFileStyle(filePath, options = {}) {
  if (!filePath) {
    return {
      success: false,
      errors: ["File path is required"],
      warnings: [],
      fixable: [],
      summary: "No file path provided",
    };
  }

  try {
    const results = await validateStyles(filePath, { ...options, singleFile: true });
    return {
      success: results.errors.length === 0,
      errors: results.errors,
      warnings: results.warnings,
      fixable: results.fixable || [],
      summary: `Style check for ${filePath}: ${results.errors.length} errors, ${results.warnings.length} warnings`,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Style check error: ${error.message}`],
      warnings: [],
      fixable: [],
      summary: `Failed to check style for ${filePath}`,
    };
  }
}

// Handle MCP tool calls
async function handleRequest(req, res) {
  const { pathname } = parse(req.url);

  // CORS headers
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

  // Validate styles endpoint
  if (pathname === "/validate" && req.method === "POST") {
    const body = await parseBody(req);
    const projectPath = body.path || process.env.PROJECT_ROOT || process.cwd();
    const options = body.options || {};

    const results = await validateStyleRules(projectPath, options);

    res.statusCode = results.success ? 200 : 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(results));
    return;
  }

  // Check file style endpoint
  if (pathname === "/check-file" && req.method === "POST") {
    const body = await parseBody(req);
    const filePath = body.filePath;

    if (!filePath) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing file path" }));
      return;
    }

    const result = await checkFileStyle(filePath, body.options || {});

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
    return;
  }

  // MCP Tool call endpoint
  if (pathname === "/mcp" && req.method === "POST") {
    const body = await parseBody(req);

    if (body.name === "style_check") {
      const projectPath = body.arguments?.path || process.env.PROJECT_ROOT || process.cwd();
      const options = body.arguments?.options || {};

      const results = await validateStyleRules(projectPath, options);

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

    if (body.name === "check_file_style") {
      const filePath = body.arguments?.filePath;

      if (!filePath) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            name: body.name,
            tool_call_id: body.tool_call_id,
            content: {
              success: false,
              error: "Missing file path",
            },
          })
        );
        return;
      }

      const result = await checkFileStyle(filePath, body.arguments?.options || {});

      const response = {
        name: body.name,
        tool_call_id: body.tool_call_id,
        content: result,
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
const PORT = process.env.PORT || 8003;
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Style Validator MCP Server running at http://localhost:${PORT}`);
});

module.exports = server;
