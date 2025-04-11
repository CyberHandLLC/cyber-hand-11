/**
 * Documentation Validator Test Script
 * 
 * This script demonstrates how to use the Documentation Validator MCP server
 * to validate documentation in a Next.js 15.2.4/React 19 project.
 */

const path = require('path');
const util = require('util');
const { validateDocumentation, validators } = require('../index');

// Configure debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

// Pretty print results
function printResults(results, depth = 4) {
  console.log(util.inspect(results, { colors: true, depth }));
}

// Get project path from command line or use default
const projectPath = process.argv[2] || path.resolve(__dirname, '../../..');
console.log(`Testing Documentation Validator on project: ${projectPath}`);

// Example: Test freshness validation
async function testFreshnessValidator() {
  console.log('\n=== TESTING FRESHNESS VALIDATOR ===');
  
  try {
    const docsDir = path.join(projectPath, 'docs');
    const results = await validators.freshness.analyzeFreshness(projectPath, docsDir);
    
    console.log(`\nFreshness Analysis Results:`);
    console.log(`- Total Documents: ${results.totalDocuments}`);
    console.log(`- Outdated Docs: ${results.outdatedDocs?.length || 0}`);
    console.log(`- Severely Outdated: ${results.severelyOutdatedDocs?.length || 0}`);
    
    if (results.outdatedDocs?.length > 0) {
      console.log('\nOutdated Documentation:');
      results.outdatedDocs.forEach(doc => {
        console.log(`- ${doc.file} (Last updated: ${doc.lastUpdated}, Code changed: ${doc.codeLastChanged})`);
      });
    }
  } catch (error) {
    console.error('Error testing freshness validator:', error);
  }
}

// Example: Test consistency validation
async function testConsistencyValidator() {
  console.log('\n=== TESTING CONSISTENCY VALIDATOR ===');
  
  try {
    const docsDir = path.join(projectPath, 'docs');
    const results = await validators.consistency.analyzeConsistency(docsDir);
    
    console.log(`\nConsistency Analysis Results:`);
    console.log(`- Total Documents: ${results.totalDocuments}`);
    console.log(`- Terminology Issues: ${results.terminologyIssues || 0}`);
    console.log(`- Broken Links: ${results.brokenLinks || 0}`);
    console.log(`- Outdated Code Examples: ${results.outOfDateExamples || 0}`);
    
    if (results.issues?.length > 0) {
      console.log('\nConsistency Issues:');
      results.issues.slice(0, 5).forEach(fileIssue => {
        console.log(`\nFile: ${path.basename(fileIssue.file)}`);
        fileIssue.issues.slice(0, 3).forEach(issue => {
          console.log(`- [${issue.severity}] ${issue.message}`);
        });
        
        if (fileIssue.issues.length > 3) {
          console.log(`  ... and ${fileIssue.issues.length - 3} more issues`);
        }
      });
      
      if (results.issues.length > 5) {
        console.log(`\n... and issues in ${results.issues.length - 5} more files`);
      }
    }
  } catch (error) {
    console.error('Error testing consistency validator:', error);
  }
}

// Example: Test best practices validation
async function testBestPracticesValidator() {
  console.log('\n=== TESTING BEST PRACTICES VALIDATOR ===');
  
  try {
    const docsDir = path.join(projectPath, 'docs');
    const results = await validators.bestPractices.analyzeBestPractices(docsDir);
    
    console.log(`\nBest Practices Analysis Results:`);
    console.log(`- Total Documents: ${results.totalDocuments}`);
    console.log(`- Architectural Issues: ${results.architecturalIssues || 0}`);
    console.log(`- Technical Inaccuracies: ${results.technicalInaccuracies || 0}`);
    console.log(`- Accessibility Issues: ${results.accessibilityIssues || 0}`);
    
    if (results.issues?.length > 0) {
      console.log('\nBest Practices Issues:');
      results.issues.slice(0, 5).forEach(fileIssue => {
        console.log(`\nFile: ${path.basename(fileIssue.file)}`);
        fileIssue.issues.slice(0, 3).forEach(issue => {
          console.log(`- [${issue.severity}] ${issue.message}`);
        });
        
        if (fileIssue.issues.length > 3) {
          console.log(`  ... and ${fileIssue.issues.length - 3} more issues`);
        }
      });
    }
  } catch (error) {
    console.error('Error testing best practices validator:', error);
  }
}

// Example: Test coverage validation
async function testCoverageValidator() {
  console.log('\n=== TESTING COVERAGE VALIDATOR ===');
  
  try {
    const docsDir = path.join(projectPath, 'docs');
    const results = await validators.coverage.generateCoverageReport(projectPath, docsDir);
    
    console.log(`\nCoverage Report:`);
    console.log(`- Documentation Coverage: ${results.summary?.coveragePercentage || 0}%`);
    console.log(`- Documented Categories: ${results.summary?.documented || 0}/${results.summary?.total || 0}`);
    console.log(`- Undocumented Components: ${results.summary?.undocumentedComponents || 0}`);
    console.log(`- Undocumented Features: ${results.summary?.undocumentedFeatures || 0}`);
    
    if (results.recommendations?.length > 0) {
      console.log('\nRecommendations:');
      results.recommendations.forEach(rec => {
        console.log(`- [${rec.priority}] ${rec.recommendation}`);
      });
    }
  } catch (error) {
    console.error('Error testing coverage validator:', error);
  }
}

// Example: Test complete documentation validation
async function testCompleteValidation() {
  console.log('\n=== TESTING COMPLETE DOCUMENTATION VALIDATION ===');
  
  try {
    const results = await validateDocumentation(projectPath, {
      validators: ['freshness', 'consistency', 'best-practices', 'coverage'],
      verbose: true
    });
    
    console.log('\nValidation Summary:');
    console.log(`- Total Validators: ${results.summary.total}`);
    console.log(`- Passed: ${results.summary.passed}`);
    console.log(`- Failed: ${results.summary.failed}`);
    console.log(`- Overall: ${results.pass ? 'PASS' : 'FAIL'}`);
    
    console.log('\nDetailed Results:');
    printResults(results.validators);
  } catch (error) {
    console.error('Error testing complete validation:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('Starting Documentation Validator tests...\n');
  
  // Test individual validators
  await testFreshnessValidator();
  await testConsistencyValidator();
  await testBestPracticesValidator();
  await testCoverageValidator();
  
  // Test complete validation
  await testCompleteValidation();
  
  console.log('\nAll tests completed.');
}

// Run the tests
runTests().catch(err => {
  console.error('Error running tests:', err);
});
