/**
 * Simple MCP Client for testing architecture validation
 * 
 * This script sends an MCP request to the architecture-guard server
 * and properly processes the response according to the MCP protocol
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the request JSON file
const REQUEST_FILE = path.join(__dirname, 'mcp-servers', 'requests', 'validate-arch.json');

// Read the request file
const requestData = JSON.parse(fs.readFileSync(REQUEST_FILE, 'utf8'));

// Print request details
console.log('Sending MCP request:');
console.log(JSON.stringify(requestData, null, 2));
console.log('\n');

// Spawn docker exec process with pipes
const docker = spawn('docker', [
  'exec',
  '-i',
  '-e', 'MCP_DEBUG=true', // Enable debug mode in the MCP server
  'cyber-handcom-architecture-guard-1',
  'node',
  'standalone-server.js'
], {
  stdio: ['pipe', 'pipe', process.stderr]
});

console.log('Spawned MCP server with debug mode enabled');

// Buffer to collect stdout data
let responseData = '';

// Collect stdout data
docker.stdout.on('data', (data) => {
  responseData += data.toString();
});

// Handle process completion
docker.on('close', (code) => {
  console.log(`Docker process exited with code ${code}`);
  
  if (responseData) {
    try {
      // Parse JSON response (MCP uses JSON-RPC format)
      const responses = responseData
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
      
      // Print formatted responses
      console.log('MCP Response:');
      responses.forEach((response, index) => {
        console.log(`\nResponse ${index + 1}:`);
        console.log(JSON.stringify(response, null, 2));
        
        // If this is a tool response, show the content
        if (response.type === 'response' && response.content) {
          console.log('\nValidation Results:');
          if (Array.isArray(response.content)) {
            response.content.forEach(item => {
              if (item.type === 'json') {
                console.log('\nJSON Data:');
                console.log(JSON.stringify(item.json, null, 2));
              } else if (item.type === 'text') {
                console.log('\nSummary:');
                console.log(item.text);
              }
            });
          } else {
            console.log(JSON.stringify(response.content, null, 2));
          }
        }
      });
    } catch (error) {
      console.error('Error parsing MCP response:', error);
      console.log('Raw response:', responseData);
    }
  } else {
    console.log('No response received');
  }
});

// Handle errors
docker.on('error', (error) => {
  console.error('Error executing Docker command:', error);
});

// Format the request with proper MCP protocol format
const formattedRequest = JSON.stringify(requestData) + '\n';

// Write the request to stdin and close
docker.stdin.write(formattedRequest);
docker.stdin.end();

console.log('Request sent, waiting for response...');
console.log('Looking for MCP protocol response formatted as JSON lines...');
