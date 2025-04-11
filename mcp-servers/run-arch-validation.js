/**
 * Architecture Validation Script
 * 
 * This script runs the architecture validation MCP server in a more visible way,
 * capturing the output and displaying it for analysis.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the request file
const requestFile = path.join(__dirname, 'requests', 'validate-arch.json');
const requestData = fs.readFileSync(requestFile, 'utf8');

// Function to run validation
async function runValidation() {
  console.log('Starting architecture validation...');
  
  const dockerProcess = spawn('docker', [
    'exec',
    '-i',
    'cyber-handcom-architecture-guard-1',
    'node',
    'standalone-server.js'
  ], { 
    stdio: ['pipe', 'pipe', 'pipe'] 
  });
  
  // Send the request data to stdin
  dockerProcess.stdin.write(requestData);
  dockerProcess.stdin.end();
  
  // Capture stdout and stderr
  let output = '';
  let errors = '';
  
  dockerProcess.stdout.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    console.log('Server output:', chunk);
  });
  
  dockerProcess.stderr.on('data', (data) => {
    const chunk = data.toString();
    errors += chunk;
    console.error('Server error:', chunk);
  });
  
  // Handle process exit
  return new Promise((resolve, reject) => {
    dockerProcess.on('exit', (code) => {
      console.log(`Docker process exited with code ${code}`);
      if (code === 0) {
        resolve({ output, errors });
      } else {
        reject(new Error(`Docker process failed with code ${code}`));
      }
    });
  });
}

// Run the validation
runValidation()
  .then(({ output, errors }) => {
    console.log('\n=== Architecture Validation Results ===\n');
    if (output.trim()) {
      console.log('OUTPUT:', output);
      try {
        // Try to parse any JSON in the output
        const matches = output.match(/\{[\s\S]*\}/);
        if (matches) {
          const jsonObj = JSON.parse(matches[0]);
          console.log('Parsed validation results:', JSON.stringify(jsonObj, null, 2));
        }
      } catch (e) {
        console.log('Could not parse JSON from output');
      }
    } else {
      console.log('No output received from server');
    }
    
    if (errors.trim()) {
      console.log('\nERRORS:', errors);
    }
  })
  .catch(err => {
    console.error('Validation failed:', err.message);
  });
