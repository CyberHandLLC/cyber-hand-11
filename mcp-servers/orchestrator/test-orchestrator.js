/**
 * Test script for the MCP Orchestrator
 * 
 * This script tests the orchestrator's ability to coordinate multiple validators
 */

// Simple MCP client implementation for testing
const { spawnSync } = require('child_process');
const { randomUUID } = require('crypto');

function callOrchestrator(tool, params) {
  const request = {
    id: randomUUID(),
    type: "request",
    name: tool,
    params
  };

  console.log(`Testing ${tool} with params:`, params);
  
  const result = spawnSync('node', ['standalone-server.js'], {
    input: JSON.stringify(request),
    encoding: 'utf-8'
  });
  
  if (result.error) {
    console.error('Error executing orchestrator:', result.error);
    return null;
  }
  
  if (result.stderr) {
    console.log('Orchestrator stderr:', result.stderr);
  }
  
  try {
    const response = JSON.parse(result.stdout);
    return response;
  } catch (err) {
    console.error('Failed to parse orchestrator response:', err);
    console.log('Raw response:', result.stdout);
    return null;
  }
}

async function runTests() {
  console.log('=== MCP Orchestrator Tests ===');
  
  // Test orchestrated validation
  console.log('\n[TEST] Orchestrated Validation');
  const validationResult = callOrchestrator('orchestrate_validation', {
    path: '/app/project',
    options: {
      verbose: true,
      includeArchitecture: true,
      includeDependencies: true,
      includeDocumentation: true,
      includeStyle: true
    }
  });
  
  if (validationResult && validationResult.content) {
    const jsonContent = validationResult.content.find(c => c.type === "json");
    const textContent = validationResult.content.find(c => c.type === "text");
    
    console.log('\nValidation Summary:');
    if (jsonContent && jsonContent.json) {
      console.log(`- Pass Rate: ${jsonContent.json.summary.passRate.toFixed(1)}%`);
      console.log(`- Passed: ${jsonContent.json.summary.passed}`);
      console.log(`- Failed: ${jsonContent.json.summary.failed}`);
      console.log(`- Errors: ${jsonContent.json.summary.errors}`);
      console.log(`- Warnings: ${jsonContent.json.summary.warnings}`);
    }
    
    if (textContent) {
      console.log('\nValidation Output:');
      console.log(textContent.text);
    }
  } else {
    console.log('Validation test failed or returned no results');
  }
  
  // Test performance measurement
  console.log('\n[TEST] Performance Measurement');
  const performanceResult = callOrchestrator('measure_performance', {
    path: '/app/project',
    options: {
      iterations: 2,
      validators: ['architecture', 'dependency', 'documentation', 'style']
    }
  });
  
  if (performanceResult && performanceResult.content) {
    const textContent = performanceResult.content.find(c => c.type === "text");
    
    if (textContent) {
      console.log('\nPerformance Results:');
      console.log(textContent.text);
    }
  } else {
    console.log('Performance test failed or returned no results');
  }
  
  console.log('\n=== Tests Complete ===');
}

runTests().catch(err => {
  console.error('Test error:', err);
});
