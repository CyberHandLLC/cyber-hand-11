/**
 * MCP-ArchitectureGuard Windsurf Integration Test
 *
 * This script simulates how Windsurf would interact with the MCP-ArchitectureGuard server.
 * It provides a way to test the validation rules against example files that would
 * typically be processed by Windsurf.
 */

const fs = require("fs");
const path = require("path");
const rules = require("./rules");

// Create a sample file violating architectural rules
const SAMPLE_VIOLATIONS = [
  {
    name: "Client Feature Without 'use client'",
    filepath: "components/custom/button-client.tsx",
    content: `
import { useState } from 'react';

export function ButtonComponent() {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button 
      className={\`btn \${isPressed ? 'btn-pressed' : ''}\`}
      onClick={() => setIsPressed(!isPressed)}
    >
      Click Me
    </button>
  );
}
`,
  },
  {
    name: "Server Component with Browser API",
    filepath: "app/dashboard/page.tsx",
    content: `
export default function DashboardPage() {
  // This should be a client component since it uses browser API
  const handleClick = () => {
    window.localStorage.setItem('dashboard-visited', 'true');
  };
  
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleClick}>Save Visit</button>
    </div>
  );
}
`,
  },
  {
    name: "Image without Next.js Image",
    filepath: "components/header/header.tsx",
    content: `
export function Header() {
  return (
    <header>
      <img src="/logo.png" alt="Company Logo" />
      <nav>{/* Nav items */}</nav>
    </header>
  );
}
`,
  },
];

// Function to validate a file against architectural rules
function validateFile(file) {
  console.log(`\n\n==== Testing: ${file.name} ====`);
  console.log(`File: ${file.filepath}`);
  console.log("-----------------------------------");

  // Apply all validation rules to the file
  const boundariesResult = rules.validateServerClientBoundaries(file.filepath, file.content);
  const sizeResult = rules.checkComponentSize(file.content);
  const dataFetchingResult = rules.validateDataFetchingPatterns(file.content);
  const formResult = rules.validateFormImplementation(file.content, file.filepath);
  const structureResult = rules.validateComponentStructure(file.filepath, file.content);
  const imageResult = rules.validateImageOptimization(file.content);

  // Combine all results
  const allResults = {
    boundaries: boundariesResult,
    size: sizeResult,
    dataFetching: dataFetchingResult,
    form: formResult,
    structure: structureResult,
    image: imageResult,
  };

  // Display results
  let allErrors = [];
  let allWarnings = [];

  for (const [ruleName, result] of Object.entries(allResults)) {
    if (result.errors && result.errors.length > 0) {
      console.log(`\n❌ ${ruleName}:`);
      result.errors.forEach((error) => console.log(`   - ${error}`));
      allErrors = [...allErrors, ...result.errors];
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log(`\n⚠️ ${ruleName}:`);
      result.warnings.forEach((warning) => console.log(`   - ${warning}`));
      allWarnings = [...allWarnings, ...result.warnings];
    }
  }

  // Summary
  console.log("\n-----------------------------------");
  if (allErrors.length === 0 && allWarnings.length === 0) {
    console.log("✅ No issues found");
    return false;
  } else {
    console.log(`Found ${allErrors.length} errors and ${allWarnings.length} warnings`);
    return true;
  }
}

// Main function to simulate Windsurf processing
function simulateWindsurfProcessing() {
  console.log("===== MCP-ArchitectureGuard Windsurf Integration Test =====");
  console.log("This test simulates how Windsurf would validate files using your MCP server");
  console.log("----------------------------------------------------------------");

  let anyIssuesFound = false;

  // Process each sample file
  for (const sampleFile of SAMPLE_VIOLATIONS) {
    const hasIssues = validateFile(sampleFile);
    if (hasIssues) anyIssuesFound = true;
  }

  // Final summary
  console.log("\n\n===== Test Summary =====");
  if (anyIssuesFound) {
    console.log("✅ Your MCP-ArchitectureGuard is working correctly!");
    console.log("   It correctly identified architectural issues in the test files.");
    console.log("\nTo use with Windsurf:");
    console.log("1. Windsurf will automatically use your MCP server when processing files");
    console.log("2. It will run these validations when AI suggests code changes");
    console.log(
      "3. Issues will be reported back to the AI to ensure code follows your architecture"
    );
  } else {
    console.log("❌ Your MCP-ArchitectureGuard failed to identify any issues.");
    console.log("   Please check your validation rules.");
  }
}

// Run the simulation
simulateWindsurfProcessing();
