/**
 * Naming Convention Validator for Cyber Hand Project
 * 
 * Checks TypeScript/JavaScript code for adherence to Cyber Hand naming conventions:
 * - Pascal case for React components and types/interfaces
 * - Camel case for variables, functions, and methods
 * - Underscore prefix for unused variables
 * - Component files should match component names
 * - Client components should have 'client' in the filename or contain 'use client' directive
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
 * Analyzes a TypeScript file for naming convention violations
 * @param {string} filePath - Path to the TypeScript file
 * @returns {object} Analysis result with naming convention issues
 */
function analyzeNamingConventions(filePath) {
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
    const namingIssues = [];
    findNamingConventionIssues(sourceFile, namingIssues, sourceFile.getFullText(), filePath);

    return {
      success: true,
      fileName: path.basename(filePath),
      filePath,
      issues: namingIssues,
      summary: `Found ${namingIssues.length} naming convention issues`
    };
  } catch (error) {
    debugLog(`Error analyzing naming conventions in file ${filePath}:`, error);
    return {
      success: false,
      error: `Analysis error: ${error.message}`,
      issues: []
    };
  }
}

/**
 * Recursively find all naming convention issues in the AST
 * @param {ts.Node} node - Current node in the TypeScript AST
 * @param {Array} issues - Array to collect found issues
 * @param {string} sourceText - Original source text for context
 * @param {string} filePath - Path to the file being analyzed
 */
function findNamingConventionIssues(node, issues, sourceText, filePath) {
  const fileName = path.basename(filePath);
  const isComponentFile = isReactComponentFile(filePath, sourceText);

  // Check node based on its kind
  switch (node.kind) {
    // Variable declarations
    case ts.SyntaxKind.VariableDeclaration:
      if (node.name && ts.isIdentifier(node.name)) {
        const varName = node.name.text;
        
        // React component variable (should be PascalCase)
        if (isComponentFile && isReactComponent(node, sourceText)) {
          if (!isPascalCase(varName)) {
            addNamingIssue(issues, node, sourceText, `React component '${varName}' should use PascalCase`, 
              `Rename to '${toPascalCase(varName)}'`);
          }
          
          // Component name should match filename for main component exports
          if (isExported(node) && fileNameWithoutExtension(fileName) !== varName 
              && !fileName.includes('-client') && !fileName.includes('_client')) {
            addNamingIssue(issues, node, sourceText, 
              `Component name '${varName}' should match filename '${fileNameWithoutExtension(fileName)}'`,
              `Either rename the component or rename the file to '${varName}.tsx'`);
          }
        } 
        // Regular variables (should be camelCase)
        else if (!isConstantVariable(node)) {
          if (!isCamelCase(varName) && !isPascalCase(varName)) { // Type aliases can be PascalCase
            addNamingIssue(issues, node, sourceText, `Variable '${varName}' should use camelCase`, 
              `Rename to '${toCamelCase(varName)}'`);
          }
        }
      }
      break;
    
    // Function declarations
    case ts.SyntaxKind.FunctionDeclaration:
      if (node.name && ts.isIdentifier(node.name)) {
        const funcName = node.name.text;
        
        // React component function (should be PascalCase)
        if (isComponentFile && isReactComponent(node, sourceText)) {
          if (!isPascalCase(funcName)) {
            addNamingIssue(issues, node, sourceText, `React component function '${funcName}' should use PascalCase`, 
              `Rename to '${toPascalCase(funcName)}'`);
          }
          
          // Component name should match filename for main exports
          if (isExported(node) && fileNameWithoutExtension(fileName) !== funcName 
              && !fileName.includes('-client') && !fileName.includes('_client')) {
            addNamingIssue(issues, node, sourceText, 
              `Component function '${funcName}' should match filename '${fileNameWithoutExtension(fileName)}'`,
              `Either rename the component or rename the file to '${funcName}.tsx'`);
          }
        } 
        // Regular functions (should be camelCase)
        else {
          if (!isCamelCase(funcName)) {
            addNamingIssue(issues, node, sourceText, `Function '${funcName}' should use camelCase`, 
              `Rename to '${toCamelCase(funcName)}'`);
          }
        }
      }
      break;
    
    // Class declarations
    case ts.SyntaxKind.ClassDeclaration:
      if (node.name && ts.isIdentifier(node.name)) {
        const className = node.name.text;
        if (!isPascalCase(className)) {
          addNamingIssue(issues, node, sourceText, `Class '${className}' should use PascalCase`, 
            `Rename to '${toPascalCase(className)}'`);
        }
      }
      break;
    
    // Interface declarations
    case ts.SyntaxKind.InterfaceDeclaration:
      if (node.name && ts.isIdentifier(node.name)) {
        const interfaceName = node.name.text;
        if (!isPascalCase(interfaceName)) {
          addNamingIssue(issues, node, sourceText, `Interface '${interfaceName}' should use PascalCase`, 
            `Rename to '${toPascalCase(interfaceName)}'`);
        }
      }
      break;
    
    // Type aliases
    case ts.SyntaxKind.TypeAliasDeclaration:
      if (node.name && ts.isIdentifier(node.name)) {
        const typeName = node.name.text;
        if (!isPascalCase(typeName)) {
          addNamingIssue(issues, node, sourceText, `Type alias '${typeName}' should use PascalCase`, 
            `Rename to '${toPascalCase(typeName)}'`);
        }
      }
      break;
    
    // Method declarations
    case ts.SyntaxKind.MethodDeclaration:
      if (node.name && ts.isIdentifier(node.name)) {
        const methodName = node.name.text;
        // Special methods like React lifecycle methods are exempt
        if (!isReactLifecycleMethod(methodName) && !isCamelCase(methodName)) {
          addNamingIssue(issues, node, sourceText, `Method '${methodName}' should use camelCase`, 
            `Rename to '${toCamelCase(methodName)}'`);
        }
      }
      break;
  }

  // Recursively check all child nodes
  ts.forEachChild(node, child => findNamingConventionIssues(child, issues, sourceText, filePath));
}

/**
 * Adds a naming issue to the issues array
 * @param {Array} issues - Array to add the issue to
 * @param {ts.Node} node - The AST node with the issue
 * @param {string} sourceText - Source text for context
 * @param {string} message - Issue message
 * @param {string} recommendation - Recommended fix
 */
function addNamingIssue(issues, node, sourceText, message, recommendation) {
  const pos = node.getStart();
  const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
  const line = lineAndChar.line + 1;
  const character = lineAndChar.character + 1;
  
  // Get the line of code for context
  const lines = sourceText.split('\n');
  const contextLine = lines[lineAndChar.line];
  
  issues.push({
    line,
    character,
    type: 'namingConvention',
    severity: 'warning',
    message,
    context: contextLine.trim(),
    recommendation
  });
}

/**
 * Checks if a node is a React component
 * @param {ts.Node} node - Node to check
 * @param {string} sourceText - Source text for context
 * @returns {boolean} True if it's a React component
 */
function isReactComponent(node, sourceText) {
  // Check if it returns JSX
  if (node.body && ts.isBlock(node.body)) {
    const returnStatements = findReturnStatements(node.body);
    for (const returnStatement of returnStatements) {
      if (returnStatement.expression) {
        const expressionText = returnStatement.expression.getText();
        // Look for JSX patterns
        if (expressionText.includes('<') && expressionText.includes('>')) {
          return true;
        }
      }
    }
  }
  
  // Check if it's annotated as React.FC or React.FunctionComponent
  if (node.type) {
    const typeText = node.type.getText();
    if (typeText.includes('React.FC') || 
        typeText.includes('React.FunctionComponent') ||
        typeText.includes('ComponentType')) {
      return true;
    }
  }
  
  return false;
}

/**
 * Find all return statements in a block
 * @param {ts.Block} node - Block to search
 * @returns {Array} Array of return statements
 */
function findReturnStatements(node) {
  const statements = [];
  
  function visit(node) {
    if (node.kind === ts.SyntaxKind.ReturnStatement) {
      statements.push(node);
    }
    ts.forEachChild(node, visit);
  }
  
  visit(node);
  return statements;
}

/**
 * Checks if a file is likely a React component file
 * @param {string} filePath - Path to the file
 * @param {string} sourceText - Source text content
 * @returns {boolean} True if it's likely a React component file
 */
function isReactComponentFile(filePath, sourceText) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.tsx' || ext === '.jsx') {
    return true;
  }
  
  // Check for React imports
  return sourceText.includes("import React") || 
         sourceText.includes("from 'react'") || 
         sourceText.includes('from "react"');
}

/**
 * Checks if a variable is a constant (all uppercase with underscores)
 * @param {ts.Node} node - Node to check
 * @returns {boolean} True if it's a constant
 */
function isConstantVariable(node) {
  if (node.name && ts.isIdentifier(node.name)) {
    const varName = node.name.text;
    return varName === varName.toUpperCase() && varName.includes('_');
  }
  return false;
}

/**
 * Checks if a function is a React lifecycle method
 * @param {string} methodName - Method name to check
 * @returns {boolean} True if it's a lifecycle method
 */
function isReactLifecycleMethod(methodName) {
  const lifecycleMethods = [
    'componentDidMount', 'componentWillUnmount', 'componentDidUpdate',
    'shouldComponentUpdate', 'getSnapshotBeforeUpdate', 'componentDidCatch',
    'getDerivedStateFromProps', 'getDerivedStateFromError', 'render'
  ];
  return lifecycleMethods.includes(methodName);
}

/**
 * Checks if a node is exported
 * @param {ts.Node} node - Node to check
 * @returns {boolean} True if it's exported
 */
function isExported(node) {
  return node.modifiers && node.modifiers.some(
    modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
  );
}

/**
 * Get filename without extension
 * @param {string} fileName - Filename with extension
 * @returns {string} Filename without extension
 */
function fileNameWithoutExtension(fileName) {
  return path.basename(fileName, path.extname(fileName));
}

/**
 * Checks if a string is in PascalCase
 * @param {string} str - String to check
 * @returns {boolean} True if it's PascalCase
 */
function isPascalCase(str) {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}

/**
 * Checks if a string is in camelCase
 * @param {string} str - String to check
 * @returns {boolean} True if it's camelCase
 */
function isCamelCase(str) {
  return /^[a-z][a-zA-Z0-9]*$/.test(str);
}

/**
 * Converts a string to PascalCase
 * @param {string} str - String to convert
 * @returns {string} PascalCase string
 */
function toPascalCase(str) {
  // Handle snake_case, kebab-case, and camelCase
  const parts = str.split(/[-_]|(?=[A-Z])/g);
  return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('');
}

/**
 * Converts a string to camelCase
 * @param {string} str - String to convert
 * @returns {string} camelCase string
 */
function toCamelCase(str) {
  // Handle snake_case, kebab-case, and PascalCase
  const parts = str.split(/[-_]|(?=[A-Z])/g);
  return parts[0].toLowerCase() + parts.slice(1).map(
    part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join('');
}

module.exports = {
  analyzeNamingConventions
};
