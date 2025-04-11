/**
 * TypeScript AST Analyzer
 * 
 * Provides utilities for parsing TypeScript code and analyzing its structure
 * with a focus on detecting type safety issues according to Cyber Hand standards.
 */

const ts = require('typescript');
const fs = require('fs');
const path = require('path');

// Debug helper
function debugLog(...args) {
  if (process.env.MCP_DEBUG === "true") {
    console.error(...args);
  }
}

/**
 * Analyzes a TypeScript file for 'any' type usage
 * @param {string} filePath - Path to the TypeScript file
 * @returns {object} Analysis result with any type occurrences
 */
function analyzeAnyTypeUsage(filePath) {
  // Ensure file exists and is a TypeScript file
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `File not found: ${filePath}`,
      issues: []
    };
  }

  const fileExtension = path.extname(filePath).toLowerCase();
  if (!['.ts', '.tsx', '.js', '.jsx'].includes(fileExtension)) {
    return {
      success: false,
      error: `Unsupported file type: ${fileExtension}`,
      issues: []
    };
  }

  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the file into a TypeScript AST
    const sourceFile = ts.createSourceFile(
      path.basename(filePath),
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Analyze the AST
    const anyTypeIssues = [];
    findAnyTypes(sourceFile, anyTypeIssues, sourceFile.getFullText());

    return {
      success: true,
      fileName: path.basename(filePath),
      filePath,
      issues: anyTypeIssues,
      summary: `Found ${anyTypeIssues.length} instances of 'any' type`
    };
  } catch (error) {
    debugLog(`Error analyzing file ${filePath}:`, error);
    return {
      success: false,
      error: `Analysis error: ${error.message}`,
      issues: []
    };
  }
}

/**
 * Recursively find all 'any' type usages in the AST
 * @param {ts.Node} node - Current node in the TypeScript AST
 * @param {Array} issues - Array to collect found issues
 * @param {string} sourceText - Original source text for context
 */
function findAnyTypes(node, issues, sourceText) {
  // Check if this node is a type reference to 'any'
  if (node.kind === ts.SyntaxKind.AnyKeyword) {
    // Get position details for better reporting
    const pos = node.getStart();
    const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
    
    // Extract surrounding context for better error messages
    const line = lineAndChar.line + 1; // 1-based line numbers for reporting
    const character = lineAndChar.character + 1;
    
    // Get the line of code for context
    const lines = sourceText.split('\n');
    const contextLine = lines[lineAndChar.line];
    
    // Find the variable or parameter name using parent nodes
    let parentInfo = getParentInfo(node);
    
    issues.push({
      line,
      character,
      type: 'anyType',
      severity: 'error', // According to Cyber Hand standards, 'any' is an error
      message: `'any' type detected ${parentInfo.description}`,
      context: contextLine.trim(),
      recommendation: parentInfo.recommendation || 'Replace with a specific interface or type'
    });
  }
  
  // Check for implicit any in function parameters without type annotations
  if (node.kind === ts.SyntaxKind.Parameter && 
      node.name && 
      node.name.kind === ts.SyntaxKind.Identifier && 
      !node.type) {
    const functionNode = node.parent;
    // Only flag if this isn't in a JSDoc-commented function (could have type info there)
    if (!hasJSDocComment(functionNode)) {
      const paramName = node.name.text;
      const pos = node.getStart();
      const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
      const line = lineAndChar.line + 1;
      const character = lineAndChar.character + 1;
      const lines = sourceText.split('\n');
      const contextLine = lines[lineAndChar.line];
      
      issues.push({
        line,
        character,
        type: 'implicitAny',
        severity: 'error',
        message: `Parameter '${paramName}' has an implicit 'any' type`,
        context: contextLine.trim(),
        recommendation: `Add an explicit type annotation for '${paramName}'`
      });
    }
  }

  // Recursively check all child nodes
  ts.forEachChild(node, child => findAnyTypes(child, issues, sourceText));
}

/**
 * Get information about the parent node for better context in error messages
 * @param {ts.Node} node - The node to analyze
 * @returns {object} Description and recommendation info
 */
function getParentInfo(node) {
  let current = node.parent;
  let description = '';
  let recommendation = '';
  
  // Keep looking up the tree for useful context
  while (current) {
    // Variable declaration
    if (current.kind === ts.SyntaxKind.VariableDeclaration && current.name) {
      const varName = current.name.text;
      description = `in variable '${varName}'`;
      recommendation = `Create a specific interface or type for '${varName}' instead of using 'any'`;
      break;
    }
    
    // Parameter declaration
    if (current.kind === ts.SyntaxKind.Parameter && current.name) {
      const paramName = current.name.text;
      description = `in parameter '${paramName}'`;
      recommendation = `Define a proper type for parameter '${paramName}'`;
      break;
    }
    
    // Function return type
    if ((current.kind === ts.SyntaxKind.FunctionDeclaration || 
         current.kind === ts.SyntaxKind.MethodDeclaration ||
         current.kind === ts.SyntaxKind.ArrowFunction) && 
        current.name) {
      const funcName = current.name.text || 'anonymous function';
      description = `in return type of '${funcName}'`;
      recommendation = `Specify a return type for '${funcName}'`;
      break;
    }
    
    // Interface or type property
    if (current.kind === ts.SyntaxKind.PropertySignature && current.name) {
      const propName = current.name.text;
      description = `in property '${propName}'`;
      recommendation = `Define a specific type for '${propName}'`;
      break;
    }
    
    current = current.parent;
  }
  
  return {
    description: description || 'in code',
    recommendation
  };
}

/**
 * Check if a node has JSDoc comments that might have type information
 * @param {ts.Node} node - Node to check for JSDoc
 * @returns {boolean} True if JSDoc comments are present
 */
function hasJSDocComment(node) {
  if (!node) return false;
  
  // Check for JSDoc comment
  const jsDocComments = node.jsDoc;
  return jsDocComments && jsDocComments.length > 0;
}

/**
 * Generates recommendations for fixing 'any' type issues
 * @param {Array} issues - The issues found in analysis
 * @returns {Array} Recommendations for fixing issues
 */
function generateRecommendations(issues) {
  return issues.map(issue => {
    // Base recommendation
    let recommendation = issue.recommendation;
    
    // Enhanced recommendations based on context
    if (issue.context) {
      // If it's a variable declaration with assignment
      if (issue.context.includes('=')) {
        const varParts = issue.context.split('=');
        recommendation += `\nConsider using typeof: \`type ${varParts[0].trim().replace(':', '')} = typeof ${varParts[1].trim().replace(';', '')}\``;
      }
      
      // If it's a function parameter
      if (issue.type === 'implicitAny' && issue.context.includes('(')) {
        recommendation += '\nFor API data, consider creating an interface that matches the expected structure';
      }
    }
    
    return {
      line: issue.line,
      character: issue.character,
      message: issue.message,
      recommendation: recommendation,
      severity: issue.severity
    };
  });
}

module.exports = {
  analyzeAnyTypeUsage,
  generateRecommendations
};
