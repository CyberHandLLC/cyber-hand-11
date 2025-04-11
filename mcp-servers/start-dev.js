/**
 * Development startup script for all MCP servers
 * This script provides a convenient way to start all three MCP servers
 * locally for development and testing without Docker.
 */

const { spawn } = require("child_process");
const path = require("path");

// Configuration for each MCP server
const servers = [
  {
    name: "Architecture Guard",
    cwd: path.join(__dirname, "architecture-guard"),
    command: "node",
    args: ["server.js"],
    env: { PORT: "8001", NODE_ENV: "development" },
  },
  {
    name: "Dependency Guard",
    cwd: path.join(__dirname, "dependency-validator"),
    command: "node",
    args: ["server.js"],
    env: { PORT: "8002", NODE_ENV: "development" },
  },
  {
    name: "Style Validator",
    cwd: path.join(__dirname, "style-validator"),
    command: "node",
    args: ["server.js"],
    env: { PORT: "8003", NODE_ENV: "development" },
  },
];

// Start each server and handle output
servers.forEach((server) => {
  console.log(`Starting ${server.name} on port ${server.env.PORT}...`);

  const env = { ...process.env, ...server.env };
  const proc = spawn(server.command, server.args, {
    cwd: server.cwd,
    env,
    stdio: "pipe",
  });

  proc.stdout.on("data", (data) => {
    console.log(`[${server.name}] ${data.toString().trim()}`);
  });

  proc.stderr.on("data", (data) => {
    console.error(`[${server.name}] ERROR: ${data.toString().trim()}`);
  });

  proc.on("close", (code) => {
    console.log(`[${server.name}] process exited with code ${code}`);
  });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log(`Stopping ${server.name}...`);
    proc.kill("SIGINT");
  });
});

console.log("All MCP servers started. Press Ctrl+C to stop all servers.");
