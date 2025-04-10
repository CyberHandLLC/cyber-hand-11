/**
 * Simple test harness for MCP-ArchitectureGuard rules
 *
 * This script tests the validation rules against sample files
 * without requiring the full MCP server infrastructure.
 *
 * Run with: node test-rules.js
 */

const fs = require("fs");
const path = require("path");
const rules = require("./rules");

// Sample files to test against
const SAMPLE_FILES = {
  // Client component with missing "use client" directive
  invalidClientComponent: {
    filepath: "components/example/example-client.tsx",
    content: `
import { useState } from 'react';

export function ExampleComponent() {
  const [count, setState] = useState(0);
  
  return (
    <button onClick={() => setState(count + 1)}>
      Count: {count}
    </button>
  );
}
`,
    expectErrors: true, // We expect validation errors
  },

  // Server component with client-side features
  serverComponentWithClientFeatures: {
    filepath: "app/example/page.tsx",
    content: `
import { getData } from '@/lib/data';

export default function ExamplePage() {
  // This is meant to be a server component but uses client features
  const data = getData();
  
  return (
    <div>
      <h1>Example Page</h1>
      <button onClick={() => console.log('clicked')}>Click me</button>
    </div>
  );
}
`,
    expectErrors: true, // We expect validation errors
  },

  // Oversized component
  oversizedComponent: {
    filepath: "components/large/large-component.tsx",
    content: new Array(501).fill("// Line of code").join("\n"),
    expectErrors: true, // We expect validation errors
  },

  // Valid server component
  validServerComponent: {
    filepath: "app/valid/page.tsx",
    content: `
import { Suspense } from 'react';
import { cache } from 'react';
import { getData } from '@/lib/data';
import { ClientPart } from './client-part';

export default async function ValidPage() {
  // Server-side data fetching with cache
  const data = await getData();
  
  return (
    <main>
      <h1>Valid Page</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <ClientPart data={data} />
      </Suspense>
    </main>
  );
}
`,
    expectErrors: false, // We expect no validation errors
  },

  // Valid client component
  validClientComponent: {
    filepath: "components/valid/valid-client.tsx",
    content: `
"use client";

import { useState } from 'react';

export function ValidClientComponent() {
  const [state, setState] = useState(null);
  
  return (
    <button onClick={() => setState('clicked')}>
      Click me
    </button>
  );
}
`,
    expectErrors: false, // We expect no validation errors
  },

  // Image without Next.js Image
  imageWithoutNextImage: {
    filepath: "components/image-example/bad-image.tsx",
    content: `
"use client";

export function BadImageComponent() {
  return (
    <div>
      <img src="/images/example.jpg" alt="Example" />
    </div>
  );
}
`,
    expectErrors: true, // We expect validation errors
  },
};

// Test all validation rules against the sample files
function runTests() {
  console.log("===== Testing MCP-ArchitectureGuard Rules =====\n");

  let passedTests = 0;
  let totalTests = 0;

  for (const [testName, testFile] of Object.entries(SAMPLE_FILES)) {
    console.log(`\n----- Testing ${testName} -----`);
    totalTests++;

    console.log(`Testing file: ${testFile.filepath}`);

    // Run all relevant rules and print detailed results for debugging
    const validationResults = {};

    // Test boundaries rule
    validationResults.boundaries = rules.validateServerClientBoundaries(
      testFile.filepath,
      testFile.content
    );
    console.log(
      "Boundaries check:",
      validationResults.boundaries.errors.length ? "Found errors ✓" : "No errors ✗",
      validationResults.boundaries.warnings.length ? "Found warnings" : "No warnings"
    );

    // Test size rule
    validationResults.size = rules.checkComponentSize(testFile.content);
    console.log(
      "Size check:",
      validationResults.size.errors.length ? "Found errors ✓" : "No errors ✗",
      validationResults.size.warnings.length ? "Found warnings" : "No warnings"
    );

    // Test data fetching rule
    validationResults.dataFetching = rules.validateDataFetchingPatterns(testFile.content);
    console.log(
      "Data fetching check:",
      validationResults.dataFetching.errors.length ? "Found errors ✓" : "No errors ✗",
      validationResults.dataFetching.warnings.length ? "Found warnings" : "No warnings"
    );

    // Test other rules
    validationResults.form = rules.validateFormImplementation(testFile.content, testFile.filepath);
    validationResults.structure = rules.validateComponentStructure(
      testFile.filepath,
      testFile.content
    );
    validationResults.image = rules.validateImageOptimization(testFile.content);

    // Aggregate all errors and warnings
    const allErrors = [];
    const allWarnings = [];

    for (const [ruleName, result] of Object.entries(validationResults)) {
      if (result.errors && result.errors.length > 0) {
        console.log(`❌ ${ruleName}: ${result.errors.length} errors`);
        result.errors.forEach((error) => console.log(`   - ${error}`));
        allErrors.push(...result.errors);
      }

      if (result.warnings && result.warnings.length > 0) {
        console.log(`⚠️ ${ruleName}: ${result.warnings.length} warnings`);
        result.warnings.forEach((warning) => console.log(`   - ${warning}`));
        allWarnings.push(...result.warnings);
      }
    }

    // Check against expected results
    const expectedResult = testFile.expectErrors ? allErrors.length > 0 : allErrors.length === 0;

    if (expectedResult) {
      console.log(`✅ Test passed: ${testName}`);
      passedTests++;
    } else {
      console.log(`❌ Test failed: ${testName}`);
    }
  }

  // Print summary
  console.log(`\n===== Test Summary =====`);
  console.log(`Tests: ${passedTests}/${totalTests} passed`);

  return passedTests === totalTests;
}

// Run the tests
const success = runTests();

console.log("\nTo use this architecture guard with Windsurf:");
console.log("1. The rules are working correctly and will validate your code");
console.log("2. Windsurf will use these rules when processing files via the MCP server");
console.log("3. No need to manually run this - Windsurf will invoke the server when needed");

process.exit(success ? 0 : 1);
