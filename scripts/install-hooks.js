#!/usr/bin/env node
/**
 * Install Git pre-commit hooks
 * 
 * This script sets up Husky and adds MCP validation hooks
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up pre-commit hooks for MCP validation...');

// Install required packages if not present
try {
  console.log('Installing husky and lint-staged...');
  execSync('npm install --save-dev husky lint-staged');
  console.log('Adding husky prepare script...');
  execSync('npm pkg set scripts.prepare="husky install"');
  console.log('Running prepare to set up husky...');
  execSync('npm run prepare');
} catch (error) {
  console.error('Failed to install husky:', error.message);
  process.exit(1);
}

// Create .lintstagedrc.js
const lintstagedConfig = `module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "node scripts/validate.js check-file",
    "npx eslint --fix"
  ],
  "*.{json,md}": [
    "npx prettier --write"
  ],
  "app/**/*.{ts,tsx}": [
    "node scripts/validate.js architecture app",
  ],
  "components/**/*.{ts,tsx}": [
    "node scripts/validate.js architecture components",
  ],
  "package.json": [
    "node scripts/validate.js dependencies"
  ]
};
`;

fs.writeFileSync(path.join(process.cwd(), '.lintstagedrc.js'), lintstagedConfig);
console.log('Created .lintstagedrc.js');

// Create the pre-commit hook
try {
  console.log('Creating pre-commit hook...');
  execSync('npx husky add .husky/pre-commit "npx lint-staged"');
  
  // Create Docker check script
  const dockerCheckScript = `#!/usr/bin/env node
/**
 * Check if MCP Docker containers are running
 */
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

function areContainersRunning() {
  try {
    const output = execSync('docker ps --format "{{.Names}}"').toString();
    return output.includes('architecture-guard') && 
           output.includes('dependency-guard') && 
           output.includes('style-validator');
  } catch (error) {
    return false;
  }
}

function startContainers() {
  try {
    console.log('Starting MCP containers...');
    execSync('docker-compose -f docker-compose.custom.yml up -d', { stdio: 'inherit' });
    // Check health
    let healthy = false;
    for (let i = 0; i < 5; i++) {
      try {
        execSync('curl -s http://localhost:3901/health');
        execSync('curl -s http://localhost:8002/health');
        execSync('curl -s http://localhost:8003/health');
        healthy = true;
        break;
      } catch (error) {
        console.log('Waiting for containers to be healthy...');
        execSync('sleep 3');
      }
    }
    return healthy;
  } catch (error) {
    console.error('Failed to start containers:', error.message);
    return false;
  }
}

async function promptUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('MCP Docker containers are not running. Start them? [Y/n] ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() !== 'n');
    });
  });
}

// Skip check if SKIP_DOCKER_CHECK is set
if (process.env.SKIP_DOCKER_CHECK) {
  console.log('Skipping Docker container check');
  process.exit(0);
}

async function main() {
  if (!areContainersRunning()) {
    const shouldStart = await promptUser();
    if (shouldStart) {
      const started = startContainers();
      if (!started) {
        console.error('Failed to start MCP containers. Continue without validation? [y/N]');
        const continueAnyway = await promptUser();
        if (!continueAnyway) {
          process.exit(1);
        }
      }
    } else {
      console.log('Proceeding without MCP validation...');
      // Set environment variable to skip validation in the validate.js script
      process.env.SKIP_MCP_VALIDATION = 'true';
    }
  } else {
    console.log('MCP containers are running.');
  }
}

main();
`;

  fs.writeFileSync(path.join(process.cwd(), 'scripts', 'check-docker.js'), dockerCheckScript);
  console.log('Created Docker check script');
  
  // Add the Docker check to the pre-commit hook
  const preCommitFile = path.join(process.cwd(), '.husky', 'pre-commit');
  let preCommitContent = fs.readFileSync(preCommitFile, 'utf8');
  preCommitContent = preCommitContent.replace('npx lint-staged', 'node scripts/check-docker.js && npx lint-staged');
  fs.writeFileSync(preCommitFile, preCommitContent);
  console.log('Updated pre-commit hook to check Docker status');
  
  // Add dependencies to the validate.js script
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const devDependencies = packageJson.devDependencies || {};
  
  if (!devDependencies['node-fetch']) {
    console.log('Adding node-fetch dependency...');
    execSync('npm install --save-dev node-fetch');
  }
  
  if (!devDependencies['commander']) {
    console.log('Adding commander dependency...');
    execSync('npm install --save-dev commander');
  }
  
  console.log('✅ Pre-commit hooks set up successfully!');
  console.log(' ');
  console.log('How to use:');
  console.log('1. Ensure Docker is running before you commit');
  console.log('2. Commit your changes normally - validation will run automatically');
  console.log('3. If you want to bypass validation: git commit --no-verify');
  console.log(' ');
  console.log('To test your setup:');
  console.log('1. Make a minor change to a file');
  console.log('2. Try to commit it: git add . && git commit -m "test hooks"');
  console.log('3. You should see the validation run before the commit completes');
  
} catch (error) {
  console.error('Failed to set up pre-commit hooks:', error.message);
  process.exit(1);
}
