/**
 * MCP Protocol Test for Documentation Validator
 * 
 * This test file sends a properly formatted MCP protocol request to the standalone server
 * using the STDIN/STDOUT transport mechanism required by Cascade.
 */

const { spawn } = require('child_process');
const path = require('path');

// MCP protocol request in the correct format expected by Cascade
const testRequest = {
  id: `test-${Date.now()}`,
  type: "request",
  name: "documentation_validate",
  params: {
    path: process.cwd(),
    options: {
      verbose: true,
      validators: ["freshness", "consistency", "best-practices", "coverage"]
    }
  }
};

// Debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

/**
 * Test the MCP server using STDIN/STDOUT protocol
 */
async function testMcpServer() {
  console.log('Testing Documentation Validator MCP Server...');
  console.log(`Sending request: ${JSON.stringify(testRequest, null, 2)}\n`);
  
  // Path to the standalone server
  const serverPath = path.resolve(__dirname, '..', 'standalone-server.js');
  
  // Spawn the node process with STDIN/STDOUT pipes
  const serverProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let responseData = '';
  
  // Collect response data from STDOUT
  serverProcess.stdout.on('data', (data) => {
    responseData += data.toString();
    debugLog('Received chunk:', data.toString());
  });
  
  // Log any errors from STDERR
  serverProcess.stderr.on('data', (data) => {
    console.error(`Server stderr: ${data}`);
  });
  
  // Handle process completion
  serverProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Server process exited with code ${code}`);
      return;
    }
    
    console.log('Received MCP response:');
    
    try {
      // Parse each line as a separate JSON message
      // (MCP protocol may send multiple JSON objects, one per line)
      const responseLines = responseData.trim().split('\n');
      
      responseLines.forEach((line, index) => {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            console.log(`\nResponse ${index + 1}:`);
            console.log(JSON.stringify(response, null, 2));
            
            // Check if we got actual results
            if (response.content) {
              console.log('\nMCP Content:');
              // Extract JSON content
              const jsonContent = response.content.find(item => item.type === 'json');
              if (jsonContent && jsonContent.json) {
                console.log('\nJSON Content:');
                console.log(JSON.stringify(jsonContent.json, null, 2));
                
                // Extract summary if available
                if (jsonContent.json.summary) {
                  console.log('\nValidation Summary:');
                  console.log(`- Passed: ${jsonContent.json.summary.passed || 0}`);
                  console.log(`- Failed: ${jsonContent.json.summary.failed || 0}`);
                  console.log(`- Overall: ${jsonContent.json.pass ? 'PASSED' : 'FAILED'}`);
                }
              }
              
              // Extract text content
              const textContent = response.content.find(item => item.type === 'text');
              if (textContent && textContent.text) {
                console.log('\nText Content:');
                console.log(textContent.text);
              }
            } else if (response.error) {
              console.log('\nError:', response.error.message);
            }
          } catch (err) {
            console.error(`Error parsing response line ${index + 1}:`, err.message);
            console.error('Raw line:', line);
          }
        }
      });
    } catch (error) {
      console.error('Error processing response:', error.message);
      console.error('Raw response:', responseData);
    }
  });
  
  // Send the MCP request as a JSON string followed by newline
  serverProcess.stdin.write(JSON.stringify(testRequest) + '\n');
  serverProcess.stdin.end();
}

// Run the test
testMcpServer().catch(err => {
  console.error('Fatal error running test:', err);
  process.exit(1);
});
