/**
 * Unused Variables Validator for Cyber Hand Project
 * 
 * Analyzes TypeScript/JavaScript code to detect unused variables that don't follow
 * the Cyber Hand standards of prefixing unused variables with an underscore.
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
 * Analyzes a TypeScript file for unused variables not prefixed with underscore
 * @param {string} filePath - Path to the TypeScript file
 * @returns {object} Analysis result with unused variable issues
 */
function analyzeUnusedVariables(filePath) {
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

    // Perform analysis
    const issues = [];
    const variableUsage = new Map(); // Track variable declarations and usages
    
    // First pass: collect all variable declarations
    collectVariableDeclarations(sourceFile, variableUsage, sourceFile.getFullText());
    
    // Second pass: collect all variable usages
    collectVariableUsages(sourceFile, variableUsage, sourceFile.getFullText());
    
    // Find unused variables that don't have underscore prefix
    for (const [varName, varInfo] of variableUsage.entries()) {
      if (varInfo.usageLocations.length === 0 && varInfo.declarationType !== 'parameter' && 
          !varName.startsWith('_') && !isExempt(varName, varInfo.declarationType)) {
        issues.push({
          line: varInfo.line,
          character: varInfo.character,
          type: 'unusedVariable',
          severity: 'warning',
          message: `Unused variable '${varName}' should be prefixed with underscore`,
          context: varInfo.context,
          recommendation: `Rename to '_${varName}'`
        });
      }
    }

    return {
      success: true,
      fileName: path.basename(filePath),
      filePath,
      issues,
      summary: `Found ${issues.length} unused variables without underscore prefix`
    };
  } catch (error) {
    debugLog(`Error analyzing unused variables in file ${filePath}:`, error);
    return {
      success: false,
      error: `Analysis error: ${error.message}`,
      issues: []
    };
  }
}

/**
 * Collects all variable declarations in the AST
 * @param {ts.Node} node - Current node in the TypeScript AST
 * @param {Map} variableUsage - Map to track variable declarations and usages
 * @param {string} sourceText - Original source text for context
 */
function collectVariableDeclarations(node, variableUsage, sourceText) {
  // Variable declarations
  if (node.kind === ts.SyntaxKind.VariableDeclaration && node.name && ts.isIdentifier(node.name)) {
    const varName = node.name.text;
    const pos = node.name.getStart();
    const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
    
    variableUsage.set(varName, {
      declarationType: 'variable',
      line: lineAndChar.line + 1,
      character: lineAndChar.character + 1,
      context: getContextLine(sourceText, lineAndChar.line),
      usageLocations: []
    });
  }
  
  // Function parameters
  else if ((node.kind === ts.SyntaxKind.Parameter) && node.name && ts.isIdentifier(node.name)) {
    const paramName = node.name.text;
    const pos = node.name.getStart();
    const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
    
    variableUsage.set(paramName, {
      declarationType: 'parameter',
      line: lineAndChar.line + 1,
      character: lineAndChar.character + 1,
      context: getContextLine(sourceText, lineAndChar.line),
      usageLocations: []
    });
  }
  
  // Function declarations
  else if (node.kind === ts.SyntaxKind.FunctionDeclaration && node.name && ts.isIdentifier(node.name)) {
    const funcName = node.name.text;
    const pos = node.name.getStart();
    const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
    
    variableUsage.set(funcName, {
      declarationType: 'function',
      line: lineAndChar.line + 1,
      character: lineAndChar.character + 1,
      context: getContextLine(sourceText, lineAndChar.line),
      usageLocations: []
    });
  }
  
  // Class property declarations
  else if (node.kind === ts.SyntaxKind.PropertyDeclaration && node.name && ts.isIdentifier(node.name)) {
    const propName = node.name.text;
    const pos = node.name.getStart();
    const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
    
    variableUsage.set(propName, {
      declarationType: 'property',
      line: lineAndChar.line + 1,
      character: lineAndChar.character + 1,
      context: getContextLine(sourceText, lineAndChar.line),
      usageLocations: []
    });
  }

  // Recursively check all child nodes
  ts.forEachChild(node, child => collectVariableDeclarations(child, variableUsage, sourceText));
}

/**
 * Collects all variable usages in the AST
 * @param {ts.Node} node - Current node in the TypeScript AST
 * @param {Map} variableUsage - Map to track variable declarations and usages
 * @param {string} sourceText - Original source text for context
 */
function collectVariableUsages(node, variableUsage, sourceText) {
  // Only process identifier nodes that aren't part of declarations
  if (ts.isIdentifier(node) && !isDeclaration(node) && variableUsage.has(node.text)) {
    const varName = node.text;
    const pos = node.getStart();
    const lineAndChar = ts.getLineAndCharacterOfPosition(node.getSourceFile(), pos);
    
    const varInfo = variableUsage.get(varName);
    if (varInfo) {
      varInfo.usageLocations.push({
        line: lineAndChar.line + 1,
        character: lineAndChar.character + 1
      });
    }
  }

  // Recursively check all child nodes
  ts.forEachChild(node, child => collectVariableUsages(child, variableUsage, sourceText));
}

/**
 * Checks if an identifier node is part of a declaration
 * @param {ts.Node} node - Node to check
 * @returns {boolean} True if it's part of a declaration
 */
function isDeclaration(node) {
  // Check if this identifier is the name in a declaration
  const parent = node.parent;
  if (!parent) return false;
  
  return (parent.kind === ts.SyntaxKind.VariableDeclaration || 
          parent.kind === ts.SyntaxKind.FunctionDeclaration ||
          parent.kind === ts.SyntaxKind.Parameter ||
          parent.kind === ts.SyntaxKind.PropertyDeclaration) && 
         parent.name === node;
}

/**
 * Checks if a variable name is exempt from the underscore prefix requirement
 * @param {string} varName - Variable name to check
 * @param {string} declarationType - Type of declaration
 * @returns {boolean} True if it's exempt
 */
function isExempt(varName, declarationType) {
  // Common React hooks are exempt
  const reactHooks = ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 
                       'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue'];
  if (reactHooks.includes(varName)) {
    return true;
  }
  
  // Export items are exempt
  if (declarationType === 'function' || declarationType === 'variable') {
    // This is a simplification - we'd need to check if it's actually exported
    return varName === 'default' || varName.indexOf('$') >= 0;
  }
  
  // Special names like 'props', 'state', 'ref' are exempt
  const specialNames = ['props', 'state', 'ref', 'key', 'children'];
  if (specialNames.includes(varName)) {
    return true;
  }
  
  return false;
}

/**
 * Gets a line of context from the source text
 * @param {string} sourceText - Source text
 * @param {number} lineNumber - Line number (0-based)
 * @returns {string} The line of code
 */
function getContextLine(sourceText, lineNumber) {
  const lines = sourceText.split('\n');
  return lines[lineNumber].trim();
}

module.exports = {
  analyzeUnusedVariables
};
