/**
 * Test script for architecture-guard validators
 *
 * This script tests the dependency and style validators against sample files
 * to demonstrate their functionality
 */

const fs = require("fs");
const path = require("path");

// Import validators
const {
  validateDependencies,
  validateDependencyUsage,
} = require("./mcp-servers/architecture-guard/dependency-validator");

const {
  validateCodeStyle,
  parseESLintConfig,
  parsePrettierConfig,
  validateFileStyle,
} = require("./mcp-servers/architecture-guard/style-validator");

const testValidator = require("./mcp-servers/architecture-guard/test-validator");

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

// Sample component with style issues for testing
const sampleComponentWithStyleIssues = `
import React, { useState, useEffect } from 'react'
import Image from 'next/image';

// This component has style issues
const BadComponent = (props) => {
    // Bad indentation
    const [counter, setCounter] = useState(0)
    
    // Missing dependency array
    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(counter + 1);
        }, 1000);
    });
    
    return (
      <div className="container">
        <h1>Counter: {counter}</h1>
        <img src="/logo.png" width={200} height={100} /> {/* Should use Next.js Image */}
        <a href="/about">About Page</a> {/* Should use Link */}
      </div>
    )
}

export default BadComponent;
`;

// Sample component with dependency issues
const sampleComponentWithDependencyIssues = `
"use client";

import { createClient } from '@supabase/supabase-js';
import moment from 'moment'; // Using deprecated package
import $ from 'jquery'; // Using disallowed package

const SupabaseClient = () => {
  // Incorrect Supabase client initialization in client component
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const today = moment(); // Using deprecated package
  
  useEffect(() => {
    // Using jQuery (disallowed)
    $('#element').fadeIn();
  }, []);
  
  return <div>Supabase Client</div>;
};

export default SupabaseClient;
`;

// Sample test file with issues
const sampleTestWithIssues = `
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

// Missing proper test structure
test('renders component', () => {
  render(<MyComponent />);
  // Missing assertions
  // No use of screen queries or user-event
});

// Missing tests for key states/interactions
`;

// Helper to display validation results
function displayResults(title, result) {
  console.log(`\n${colors.blue}=== ${title} ====${colors.reset}`);

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(`${colors.green}No issues found${colors.reset}`);
    return;
  }

  if (result.errors.length > 0) {
    console.log(`${colors.red}Errors:${colors.reset}`);
    result.errors.forEach((error) => console.log(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}Warnings:${colors.reset}`);
    result.warnings.forEach((warning) => console.log(`  - ${warning}`));
  }
}

// Main test function
async function runTests() {
  console.log(`${colors.blue}Starting Architecture Guard tests...${colors.reset}\n`);

  // Create temporary files for testing
  const tempDir = path.join(__dirname, "temp-test");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const badComponentPath = path.join(tempDir, "BadComponent.jsx");
  const badDependencyPath = path.join(tempDir, "SupabaseClient.jsx");
  const badTestPath = path.join(tempDir, "Component.test.jsx");

  try {
    // Write test files
    fs.writeFileSync(badComponentPath, sampleComponentWithStyleIssues);
    fs.writeFileSync(badDependencyPath, sampleComponentWithDependencyIssues);
    fs.writeFileSync(badTestPath, sampleTestWithIssues);

    // 1. Test style validation
    console.log(`${colors.blue}Testing style validator...${colors.reset}`);
    const styleResult = validateCodeStyle(badComponentPath, sampleComponentWithStyleIssues);
    displayResults("Style Validation", styleResult);

    // 2. Test dependency validation
    console.log(`\n${colors.blue}Testing dependency validator...${colors.reset}`);
    const dependencyResult = validateDependencyUsage(
      badDependencyPath,
      sampleComponentWithDependencyIssues
    );
    displayResults("Dependency Validation", dependencyResult);

    // 3. Test test validator
    console.log(`\n${colors.blue}Testing test validator...${colors.reset}`);
    const testResult = testValidator.validateTestPatterns(badTestPath, sampleTestWithIssues);
    displayResults("Test File Validation", testResult);

    // 4. Test package.json validation
    console.log(`\n${colors.blue}Testing package.json validation...${colors.reset}`);

    // Create sample package.json with issues
    const samplePackageJson = {
      name: "cyber-hand-website",
      version: "1.0.0",
      dependencies: {
        next: "14.0.0", // Outdated version
        react: "18.2.0", // Outdated version for Next.js 15
        moment: "2.29.4", // Deprecated package
        jquery: "3.6.0", // Disallowed package
        "@supabase/supabase-js": "2.39.0",
      },
    };

    const packageJsonPath = path.join(tempDir, "package.json");
    fs.writeFileSync(packageJsonPath, JSON.stringify(samplePackageJson, null, 2));

    const packageResult = validateDependencies(packageJsonPath);
    displayResults("Package.json Validation", packageResult);

    console.log(`\n${colors.green}All tests completed.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error running tests:${colors.reset}`, error);
  } finally {
    // Cleanup temp files
    try {
      fs.unlinkSync(badComponentPath);
      fs.unlinkSync(badDependencyPath);
      fs.unlinkSync(badTestPath);
      fs.rmdirSync(tempDir, { recursive: true });
    } catch (err) {
      console.error(`${colors.yellow}Cleanup error:${colors.reset}`, err);
    }
  }
}

// Run tests
runTests().then(() => {
  console.log(`\n${colors.blue}For a more comprehensive test, you can run:${colors.reset}`);
  console.log(`node check-architecture.js --path=./path/to/test --ci`);
});
