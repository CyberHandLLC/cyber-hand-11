/**
 * Architecture Validation CLI Tool
 * 
 * This Node.js script directly communicates with the architecture-guard MCP server
 * using proper stdin/stdout pipes to validate the architecture based on Cyber Hand Project Rules.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colorize console output for better readability
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

// Path to the MCP request file
const requestPath = path.join(__dirname, 'mcp-servers', 'requests', 'validate-arch.json');

// Read the request file
const requestContent = JSON.parse(fs.readFileSync(requestPath, 'utf8'));

// Format the request with proper newline terminator for MCP protocol
const formattedRequest = JSON.stringify(requestContent) + '\n';

console.log(`${colors.bright}Architecture Validation - Cyber Hand Project${colors.reset}`);
console.log(`${colors.cyan}Checking compliance with Next.js 15.2.4/React 19 standards...${colors.reset}\n`);

// Spawn Docker process with proper pipes
const docker = spawn('docker', [
  'exec',
  '-i',
  '-e', 'MCP_DEBUG=true',
  'cyber-handcom-architecture-guard-1',
  'node',
  'standalone-server.js'
], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Buffer to collect stdout data
let responseData = '';

// Collect stdout data
docker.stdout.on('data', (data) => {
  responseData += data.toString();
});

// Handle process completion
docker.on('close', (code) => {
  if (code !== 0) {
    console.error(`${colors.red}Docker process exited with code ${code}${colors.reset}`);
    return;
  }

  if (responseData) {
    try {
      // Parse JSON response
      const response = JSON.parse(responseData.trim());

      if (response.type === 'response' && response.content) {
        console.log(`${colors.green}${colors.bright}\n=== Architecture Validation Results ===\n${colors.reset}`);

        // Process and display the content
        response.content.forEach(item => {
          if (item.type === 'json') {
            const results = item.json;

            // Display errors if any
            if (results.errors && results.errors.length > 0) {
              console.log(`${colors.red}${colors.bright}Errors:${colors.reset}`);
              results.errors.forEach(error => {
                console.log(`${colors.red}• ${error}${colors.reset}`);
              });
              console.log();
            }

            // Display warnings if any
            if (results.warnings && results.warnings.length > 0) {
              console.log(`${colors.yellow}${colors.bright}Warnings:${colors.reset}`);
              results.warnings.forEach(warning => {
                console.log(`${colors.yellow}• ${warning}${colors.reset}`);
              });
              console.log();
            }

            // Display component issues if any
            if (results.componentIssues && results.componentIssues.length > 0) {
              console.log(`${colors.cyan}${colors.bright}Component Issues:${colors.reset}`);
              results.componentIssues.forEach(issue => {
                console.log(`${colors.cyan}File: ${issue.file}${colors.reset}`);
                issue.issues.forEach(issueItem => {
                  console.log(`  ${colors.yellow}• ${issueItem}${colors.reset}`);
                });
                console.log();
              });
            }
          } else if (item.type === 'text') {
            console.log(`${colors.green}${colors.bright}Summary:${colors.reset}`);
            console.log(`${colors.green}${item.text}${colors.reset}`);
          }
        });

        // Basic compliance report
        const jsonContent = response.content.find(item => item.type === 'json')?.json;
        if (jsonContent) {
          const errorCount = jsonContent.errors?.length || 0;
          const warningCount = jsonContent.warnings?.length || 0;

          console.log(`\n${colors.bright}Compliance Report:${colors.reset}`);
          if (errorCount === 0) {
            console.log(`${colors.green}✓ No architecture errors detected${colors.reset}`);
          } else {
            console.log(`${colors.red}✗ ${errorCount} architecture errors detected${colors.reset}`);
          }

          if (warningCount > 0) {
            console.log(`${colors.yellow}⚠ ${warningCount} warnings to address${colors.reset}`);
          }

          // Final assessment
          console.log(`\n${colors.bright}Assessment:${colors.reset}`);
          if (errorCount === 0 && warningCount < 5) {
            console.log(`${colors.green}✓ Project largely complies with Cyber Hand standards${colors.reset}`);
            console.log(`${colors.green}  Recommended: Address warnings to improve architecture quality${colors.reset}`);
          } else if (errorCount === 0) {
            console.log(`${colors.yellow}⚠ Project needs improvements to meet Cyber Hand standards${colors.reset}`);
            console.log(`${colors.yellow}  Required: Address warnings, especially those related to component structure${colors.reset}`);
          } else {
            console.log(`${colors.red}✗ Project has architectural issues that must be fixed${colors.reset}`);
            console.log(`${colors.red}  Critical: Fix all errors and address high-priority warnings${colors.reset}`);
          }
        }
      } else if (response.error) {
        console.error(`${colors.red}Error: ${response.error.message}${colors.reset}`);
      }
    } catch (error) {
      console.error(`${colors.red}Error parsing MCP response: ${error.message}${colors.reset}`);
      console.log(`${colors.cyan}Raw response: ${responseData}${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}No response received${colors.reset}`);
  }
});

// Handle errors
docker.on('error', (error) => {
  console.error(`${colors.red}Error executing Docker command: ${error.message}${colors.reset}`);
});

// Write the request to stdin and close
docker.stdin.write(formattedRequest);
docker.stdin.end();

console.log(`${colors.cyan}Sending architecture validation request...${colors.reset}`);
