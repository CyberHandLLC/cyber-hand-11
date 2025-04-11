/**
 * ESLint Compliance Validator for Documentation
 * 
 * This validator checks documentation code examples for compliance with
 * Cyber Hand's ESLint rules and Next.js 15.2.4 standards.
 */

const { parse } = require('@typescript-eslint/parser');

/**
 * Validates code examples for ESLint compliance
 * @param {string} content - Documentation content with code blocks
 * @returns {Object} Validation results with issues found
 */
function validateEslintCompliance(content) {
  const codeBlocks = extractCodeBlocks(content);
  const issues = [];

  codeBlocks.forEach(block => {
    // Only validate TypeScript/JavaScript code blocks
    if (block.language === 'typescript' || block.language === 'javascript' || block.language === 'tsx' || block.language === 'jsx') {
      const blockIssues = validateCodeBlock(block.code, block.language);
      
      if (blockIssues.length > 0) {
        issues.push({
          type: 'eslint-compliance',
          codeBlock: block.code.substring(0, 50) + '...',
          issues: blockIssues
        });
      }
    }
  });

  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Extract all code blocks from markdown content
 * @param {string} content - Documentation content
 * @returns {Array<{language: string, code: string}>} Extracted code blocks with language
 */
function extractCodeBlocks(content) {
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2]
    });
  }

  return blocks;
}

/**
 * Validate a code block for ESLint compliance
 * @param {string} code - Code content
 * @param {string} language - Code language
 * @returns {Array<string>} List of issues found
 */
function validateCodeBlock(code, language) {
  const issues = [];

  try {
    // For TypeScript/TSX code blocks
    if (language === 'typescript' || language === 'tsx') {
      // Check for require() style imports
      if (code.includes('require(')) {
        issues.push('A `require()` style import is forbidden. Use ES6 imports instead.');
      }

      // Check for unused variables without underscore prefix
      const ast = parse(code, {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      });

      // Basic AST analysis (simplified for demonstration)
      const variableDeclarations = findVariableDeclarations(ast);
      const variableUsages = findVariableUsages(ast);

      // Find unused variables without underscore prefix
      variableDeclarations.forEach(declaration => {
        if (!variableUsages.includes(declaration.name) && !declaration.name.startsWith('_')) {
          issues.push(`'${declaration.name}' is defined but never used. Allowed unused vars must match /^_/u.`);
        }
      });

      // Check for structured data implementation patterns
      if (code.includes('Schema') && (code.includes('<') && code.includes('>'))) {
        // Look for potential schema components used as JSX
        const schemaComponents = ['WebPageSchema', 'BreadcrumbSchema', 'ProductSchema', 'ArticleSchema', 'OrganizationSchema'];
        
        for (const schema of schemaComponents) {
          if (code.includes(`<${schema}`) && !code.includes(`{${schema}(`)) {
            issues.push(`Schema component ${schema} should use function call pattern with curly braces to avoid ESLint errors.`);
          }
        }
      }
    }
  } catch (error) {
    // Parsing errors should not break the validator
    issues.push(`Code parsing error: ${error.message}`);
  }

  return issues;
}

/**
 * Simple utility to find variable declarations in AST (simplified)
 * Note: A full implementation would use proper AST traversal
 * @param {Object} ast - Abstract Syntax Tree
 * @returns {Array<{name: string}>} List of variable declarations
 */
function findVariableDeclarations(ast) {
  // This is a simplified placeholder
  // A real implementation would traverse the AST properly
  const declarations = [];
  
  // Basic traversal example
  if (ast.body) {
    ast.body.forEach(node => {
      if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(decl => {
          if (decl.id && decl.id.name) {
            declarations.push({ name: decl.id.name });
          }
        });
      }
    });
  }
  
  return declarations;
}

/**
 * Simple utility to find variable usages in AST (simplified)
 * @param {Object} ast - Abstract Syntax Tree
 * @returns {Array<string>} List of variable names used
 */
function findVariableUsages(ast) {
  // This is a simplified placeholder
  // A real implementation would traverse the AST properly
  return [];
}

module.exports = {
  validateEslintCompliance
};
