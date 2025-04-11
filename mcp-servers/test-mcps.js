/**
 * MCP Servers Test Script
 *
 * This script tests all three MCP servers by sending validation requests
 * and displaying the results. It helps verify that the MCP infrastructure
 * is working correctly.
 *
 * Usage: node test-mcps.js
 */

const http = require("http");

// Configuration for MCP servers
const servers = [
  { name: "Architecture Guard", port: 8001, endpoint: "/validate" },
  { name: "Dependency Guard", port: 8002, endpoint: "/validate" },
  { name: "Style Validator", port: 8003, endpoint: "/validate" },
];

// Function to make HTTP requests to MCP servers
function testMcpServer(server) {
  return new Promise((resolve, reject) => {
    console.log(`Testing ${server.name} at http://localhost:${server.port}${server.endpoint}...`);

    // Create the request payload
    const data = JSON.stringify({
      path: process.cwd(),
      options: { testMode: true },
    });

    // Set up the request options
    const options = {
      hostname: "localhost",
      port: server.port,
      path: server.endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    // Send the request
    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(responseData);
          resolve({
            server: server.name,
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            result: result,
          });
        } catch (error) {
          resolve({
            server: server.name,
            status: res.statusCode,
            success: false,
            error: `Failed to parse response: ${error.message}`,
            rawResponse: responseData,
          });
        }
      });
    });

    // Handle errors
    req.on("error", (error) => {
      resolve({
        server: server.name,
        success: false,
        error: `Connection error: ${error.message} - Make sure the server is running at port ${server.port}`,
      });
    });

    // Send the request data
    req.write(data);
    req.end();
  });
}

// Test all MCP servers
async function testAllServers() {
  console.log("🔍 Testing MCP Servers...\n");

  try {
    const results = await Promise.all(servers.map(testMcpServer));

    console.log("\n📊 Test Results:\n");

    let allSuccessful = true;

    results.forEach((result) => {
      const statusIcon = result.success ? "✅" : "❌";
      console.log(`${statusIcon} ${result.server}: ${result.success ? "Connected" : "Failed"}`);

      if (result.error) {
        console.log(`   Error: ${result.error}`);
        allSuccessful = false;
      } else if (!result.success) {
        console.log(`   HTTP Status: ${result.status}`);
        allSuccessful = false;
      } else {
        // Display some basic information from the result
        if (result.result.summary) {
          console.log(`   Summary: ${result.result.summary}`);
        }
        if (result.result.errors && result.result.errors.length > 0) {
          console.log(`   Errors: ${result.result.errors.length}`);
        }
        if (result.result.warnings && result.result.warnings.length > 0) {
          console.log(`   Warnings: ${result.result.warnings.length}`);
        }
      }

      console.log("");
    });

    if (allSuccessful) {
      console.log("🎉 All MCP servers are working correctly!");
      console.log("   Integration with Cascade AI is ready to use.");
    } else {
      console.log("⚠️  Some MCP servers are not responding correctly.");
      console.log("   Make sure all servers are running with:");
      console.log("   npm run mcp:start");
    }
  } catch (error) {
    console.error("❌ Test failed with an unexpected error:", error);
  }
}

// Run the tests
testAllServers();
