/**
 * MCP Client
 * 
 * A proper MCP client implementation that follows the protocol specification
 * See https://github.com/modelcontextprotocol/typescript-sdk for more details
 */
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

// Docker container name for the architecture guard
const CONTAINER_NAME = 'cyber-handcom-architecture-guard-1';

// Create a proper MCP request message
function createMcpRequest(toolName, parameters) {
  return JSON.stringify({
    id: uuidv4(),
    type: 'request',
    name: toolName,
    parameters
  }) + '\n';
}

// Run MCP tool and parse response
async function runMcpTool(toolName, parameters) {
  console.log(`Running MCP tool '${toolName}' with parameters:`, parameters);
  
  const dockerProcess = spawn('docker', [
    'exec',
    '-i',
    CONTAINER_NAME,
    'node',
    'standalone-server.js'
  ], { 
    stdio: ['pipe', 'pipe', 'pipe'] 
  });
  
  // Create and send MCP request
  const mcpRequest = createMcpRequest(toolName, parameters);
  console.log(`Sending MCP request: ${mcpRequest.trim()}`);
  dockerProcess.stdin.write(mcpRequest);
  dockerProcess.stdin.end();
  
  // Collect all output
  let stdoutChunks = [];
  let stderrChunks = [];
  
  dockerProcess.stdout.on('data', (data) => {
    stdoutChunks.push(data.toString());
    console.log(`STDOUT: ${data.toString().trim()}`);
  });
  
  dockerProcess.stderr.on('data', (data) => {
    stderrChunks.push(data.toString());
    console.log(`STDERR: ${data.toString().trim()}`);
  });
  
  // Return promise that resolves when the process exits
  return new Promise((resolve, reject) => {
    dockerProcess.on('close', (code) => {
      console.log(`Docker process exited with code ${code}`);
      
      const stdout = stdoutChunks.join('');
      const stderr = stderrChunks.join('');
      
      try {
        // Try to find a valid JSON response in the output
        const matches = stdout.match(/\{[\s\S]*\}/);
        let result = null;
        
        if (matches) {
          result = JSON.parse(matches[0]);
          console.log('Successfully parsed MCP response');
        } else {
          console.log('No valid JSON found in response');
        }
        
        resolve({
          code,
          result,
          stdout,
          stderr
        });
      } catch (error) {
        console.error('Error parsing response:', error);
        resolve({
          code,
          result: null,
          stdout,
          stderr,
          error: error.message
        });
      }
    });
    
    dockerProcess.on('error', (error) => {
      reject(error);
    });
  });
}

// Run the architecture check
async function runArchitectureCheck() {
  const parameters = {
    path: './',
    options: {
      verbose: true,
      includeServerComponents: true,
      includeClientComponents: true,
      checkDependencies: true,
      validateTypes: true
    }
  };
  
  console.log('Running architecture validation check...');
  
  try {
    const { code, result, stdout, stderr } = await runMcpTool('architecture_check', parameters);
    
    console.log('\n=== Architecture Validation Results ===\n');
    
    if (result) {
      console.log('SUCCESS! Received validation results:');
      console.log(JSON.stringify(result, null, 2));
      
      if (result.results && result.results.componentIssues) {
        console.log('\nComponent Issues:');
        result.results.componentIssues.forEach(issue => {
          console.log(`- ${issue.file}:`);
          issue.issues.forEach(problem => {
            console.log(`  * ${problem}`);
          });
        });
      }
      
      if (result.results && result.results.recommendations) {
        console.log('\nRecommendations:');
        result.results.recommendations.forEach((rec, i) => {
          console.log(`${i+1}. ${rec}`);
        });
      }
      
      if (result.results && result.results.summary) {
        console.log('\nSummary:');
        console.log(result.results.summary);
      }
      
      if (result.results && result.results.architectureScore) {
        console.log(`\nArchitecture Score: ${result.results.architectureScore}%`);
      }
    } else {
      console.log('Failed to get parseable response.');
      console.log('Raw stdout:', stdout || 'None');
    }
  } catch (error) {
    console.error('Error running architecture check:', error);
  }
}

// Run the validation
runArchitectureCheck();
