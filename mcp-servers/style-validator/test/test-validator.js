/**
 * Test script for the enhanced style-validator
 * Demonstrates validation capabilities for:
 * - 'any' type detection
 * - naming convention validation
 * - unused variable prefix checking
 * - file size compliance
 */

// Set debug mode to see detailed logs
process.env.MCP_DEBUG = "true";

const path = require('path');
const fs = require('fs');
const { validateStyles } = require('../standalone-server');

// Simple color utility since chalk is having issues
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`
};

// Create output directory for test results if it doesn't exist
const outputDir = path.join(__dirname, 'results');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Path to test files
const testFilePath = path.join(__dirname, 'any-type-examples.ts');
const testDir = __dirname;

// Utility function to save test results to a JSON file
function saveResults(filename, results) {
  const resultsPath = path.join(outputDir, filename);
  try {
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(colors.blue(`\nResults saved to: ${resultsPath}`));
  } catch (error) {
    console.error(colors.red(`Error saving results: ${error.message}`));
  }
}

// Format validation messages for better readability
function formatValidationIssues(issues, type = 'error') {
  if (!issues || issues.length === 0) {
    return colors.green('No issues found');
  }
  
  const color = type === 'error' ? colors.red : colors.yellow;
  return issues.map((issue, i) => {
    return color(`${i + 1}. ${issue}`);
  }).join('\n');
}

// Handle errors consistently
function handleError(message, error) {
  console.error(colors.red(`\n❌ ${message}: ${error.message}`));
  if (error.stack) {
    console.error(colors.gray(error.stack.split('\n').slice(1).join('\n')));
  }
  return { success: false, error: error.message };
}

// Test function with improved error handling and formatting
async function runTests() {
  console.log(colors.blue("============================================================"));
  console.log(colors.blue("CYBER HAND STYLE VALIDATOR - COMPREHENSIVE TEST SUITE"));
  console.log(colors.blue("============================================================"));
  console.log(colors.gray(`Test run: ${new Date().toISOString()}`));

  // Test 1: Single file validation for 'any' type detection
  console.log(colors.blue("\n🔍 TEST 1: Single file validation for 'any' type detection"));
  console.log(colors.gray(`File: ${testFilePath}\n`));
  
  let singleFileResults;
  try {
    singleFileResults = await validateStyles(testFilePath, { 
      includeTypeChecking: true,
      checkNaming: true,
      checkUnusedVars: true,
      verbose: true
    });
    
    if (singleFileResults.success) {
      console.log(colors.green("✅ Validation completed successfully"));
      console.log(colors.blue(`\n📊 Summary:`));
      console.log(singleFileResults.summary.replace(/\\n/g, '\n'));
      
      // Save results for future reference
      saveResults('single-file-validation.json', singleFileResults);
      
      // Display 'any' type issues
      console.log(colors.blue("\n📋 Detected 'any' type issues:"));
      if (singleFileResults.anyTypeIssues && singleFileResults.anyTypeIssues.length > 0) {
        const issues = singleFileResults.anyTypeIssues[0].issues;
        console.log(`Found ${issues.length} instances of 'any' type usage:\n`);
        
        // Display the first 5 issues with recommendations
        issues.slice(0, 5).forEach((issue, index) => {
          console.log(colors.red(`${index + 1}. Line ${issue.line}: ${issue.message}`));
          console.log(colors.gray(`   Context: ${issue.context}`));
          console.log(colors.yellow(`   Recommendation: ${singleFileResults.anyTypeIssues[0].recommendations[index].recommendation}\n`));
        });
        
        if (issues.length > 5) {
          console.log(colors.gray(`... and ${issues.length - 5} more issues`));
        }
      } else {
        console.log(colors.green("No 'any' type issues detected"));
      }
      
      // Display naming convention issues
      console.log(colors.blue("\n📋 Naming convention issues:"));
      if (singleFileResults.namingConventionIssues && singleFileResults.namingConventionIssues.length > 0) {
        singleFileResults.namingConventionIssues.forEach((issue, index) => {
          console.log(colors.yellow(`${index + 1}. ${issue.message} at line ${issue.line}`));
        });
      } else {
        console.log(colors.green("No naming convention issues detected"));
      }
      
      // Display unused variable issues
      console.log(colors.blue("\n📋 Unused variable issues:"));
      if (singleFileResults.unusedVarIssues && singleFileResults.unusedVarIssues.length > 0) {
        singleFileResults.unusedVarIssues.forEach((issue, index) => {
          console.log(colors.yellow(`${index + 1}. ${issue.message} at line ${issue.line}`));
          console.log(colors.gray(`   Context: ${issue.context}`));
          console.log(colors.yellow(`   Recommendation: ${issue.recommendation}\n`));
        });
      } else {
        console.log(colors.green("No unused variable issues detected"));
      }
    } else {
      console.log(colors.red("❌ Validation failed:"));
      console.log(formatValidationIssues(singleFileResults.errors));
    }
  } catch (error) {
    handleError("Error running single file validation", error);
  }

  // Test 2: Directory validation
  console.log(colors.blue("\n\n============================================================"));
  console.log(colors.blue("🔍 TEST 2: Directory validation"));
  console.log(colors.gray(`Directory: ${testDir}\n`));
  
  try {
    const dirResults = await validateStyles(testDir, { 
      includeTypeChecking: true,
      includeJavaScript: true,
      checkNaming: true,
      checkUnusedVars: true
    });
    
    if (dirResults.success) {
      console.log(colors.green("✅ Validation completed successfully"));
      console.log(colors.blue(`\n📊 Summary:`));
      console.log(dirResults.summary.replace(/\\n/g, '\n'));
      
      // Save results for future reference
      saveResults('directory-validation.json', dirResults);
      
      console.log(colors.blue("\n📋 Files analyzed:"), dirResults.fileCount);
      
      // Display errors with better formatting
      if (dirResults.errors && dirResults.errors.length > 0) {
        console.log(colors.blue("\n❌ Errors found:"));
        console.log(formatValidationIssues(dirResults.errors.slice(0, 10), 'error'));
        
        if (dirResults.errors.length > 10) {
          console.log(colors.gray(`... and ${dirResults.errors.length - 10} more errors`));
        }
      } else {
        console.log(colors.green("\nNo errors found!"));
      }
      
      // Display warnings with better formatting
      if (dirResults.warnings && dirResults.warnings.length > 0) {
        console.log(colors.blue("\n⚠️ Warnings found:"));
        console.log(formatValidationIssues(dirResults.warnings, 'warning'));
      } else {
        console.log(colors.green("\nNo warnings found!"));
      }
      
      // Display statistics
      console.log(colors.blue("\n📊 Validation Statistics:"));
      console.log(colors.gray("- 'Any' type issues:"), 
                 dirResults.anyTypeIssues ? dirResults.anyTypeIssues.length : 0);
      console.log(colors.gray("- Naming convention issues:"), 
                 dirResults.namingConventionIssues ? dirResults.namingConventionIssues.length : 0);
      console.log(colors.gray("- Unused variable issues:"), 
                 dirResults.unusedVarIssues ? dirResults.unusedVarIssues.length : 0);
      console.log(colors.gray("- File size issues:"), 
                 dirResults.sizeLimitIssues ? dirResults.sizeLimitIssues.length : 0);
    } else {
      console.log(colors.red("❌ Validation failed:"));
      console.log(formatValidationIssues(dirResults.errors));
    }
  } catch (error) {
    handleError("Error running directory validation", error);
  }

  // Test 3: Integration test with Cascade MCP tool format
  console.log(colors.blue("\n\n============================================================"));
  console.log(colors.blue("🔍 TEST 3: Cascade MCP Integration Test"));
  console.log(colors.gray("Simulating how Cascade would call our MCP server\n"));
  
  try {
    // Create a temporary directory for our test files
    const tempTestDir = path.join(testDir, 'temp');
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
    
    // Create a sample file to test
    const cascadeTestFilePath = path.join(tempTestDir, 'cascade-test.ts');
    const cascadeTestContent = `
      // Sample file with 'any' type and naming issues
      const UserData: any = { name: "test" };
      function processData(data) {
        const ItemsList = data.items;
        const unused = "This should have an underscore prefix";
        return ItemsList;
      }
    `;
    
    // Write the test file
    fs.writeFileSync(cascadeTestFilePath, cascadeTestContent);
    
    // Format for MCP response
    const formatMcpResponse = (results) => {
      return {
        id: "test-1234",
        type: "response",
        request_id: "test-1234",
        name: "style_check",
        content: [
          {
            type: "json",
            json: results
          },
          {
            type: "text",
            text: results.summary || "Validation complete"
          }
        ]
      };
    };
    
    try {
      // Validate using the style_check tool format
      const cascadeResults = await validateStyles(cascadeTestFilePath, {
        includeTypeChecking: true,
        checkNaming: true,
        checkUnusedVars: true,
        cascadeFormat: true // Special flag for Cascade format
      });
      
      console.log(colors.blue("MCP Response Format (Success):"));
      console.log(JSON.stringify(formatMcpResponse(cascadeResults), null, 2));
    } 
    catch (validationError) {
      // Handle validation errors properly
      const errorResponse = {
        success: false,
        errors: [`Validation error: ${validationError.message}`],
        warnings: [],
        fixable: [],
        summary: "Validation failed due to an error"
      };
      
      console.log(colors.red("MCP Response Format (Error):"));
      console.log(JSON.stringify(formatMcpResponse(errorResponse), null, 2));
    }
    
    // Clean up test files
    try {
      fs.unlinkSync(cascadeTestFilePath);
      fs.rmdirSync(tempTestDir);
    } catch (cleanupError) {
      console.log(colors.yellow(`Note: Could not clean up temporary test files: ${cleanupError.message}`));
    }
  } catch (error) {
    handleError("Error running Cascade integration test", error);
  }

  console.log(colors.blue("\n============================================================"));
  console.log(colors.blue("TEST COMPLETED"));
  console.log(colors.blue("============================================================"));
}

// Run the tests with better error handling
runTests().catch(error => {
  console.error(colors.red('\n❌ Fatal error in test execution:'));
  console.error(colors.red(error.message));
  console.error(colors.gray(error.stack));
  process.exit(1);
});
