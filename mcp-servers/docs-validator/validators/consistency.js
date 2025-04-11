/**
 * Documentation Consistency Validator
 * 
 * Ensures consistency across documentation:
 * - Validates consistent terminology is used throughout docs
 * - Checks code examples match actual implementation patterns
 * - Identifies broken internal references and links
 */

const path = require('path');
const fs = require('fs');
const { marked } = require('marked');
const matter = require('gray-matter');

// Debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

// Standard terminology according to Cyber Hand documentation standards
const TERMINOLOGY_STANDARDS = {
  // Next.js terminology
  'server component': 'Server Component',
  'client component': 'Client Component',
  'static rendering': 'Static Rendering',
  'dynamic rendering': 'Dynamic Rendering',
  'server actions': 'Server Actions',
  'app router': 'App Router',
  'page router': 'Page Router',
  'route handlers': 'Route Handlers',
  
  // React terminology
  'use client': '"use client"',
  'use server': '"use server"',
  'react hook': 'React Hook',
  'error boundary': 'Error Boundary',
  'suspense boundary': 'Suspense Boundary',
  
  // Project-specific terminology
  'cyber hand': 'Cyber Hand',
};

/**
 * Validates terminology consistency in documentation
 * 
 * @param {string} docPath - Path to documentation file
 * @param {Object} options - Validation options
 * @returns {Object} Terminology validation results
 */
function validateTerminology(docPath, options = {}) {
  const results = {
    issues: []
  };
  
  try {
    const content = fs.readFileSync(docPath, 'utf-8');
    const { content: markdownContent } = matter(content);
    
    // Check for terminology inconsistencies
    Object.entries(TERMINOLOGY_STANDARDS).forEach(([term, standardForm]) => {
      // Skip checking if the term is already in its standard form
      if (markdownContent.includes(standardForm)) {
        return;
      }
      
      // Look for case-insensitive matches of the term that aren't in standard form
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(markdownContent)) {
        // Find specific instances to report line numbers
        const lines = markdownContent.split('\n');
        lines.forEach((line, lineNumber) => {
          if (regex.test(line) && !line.includes(standardForm)) {
            results.issues.push({
              severity: 'warning',
              type: 'terminology',
              term: term,
              standardForm: standardForm,
              lineNumber: lineNumber + 1,
              line: line.trim(),
              message: `Inconsistent terminology: "${term}" should be "${standardForm}"`,
              suggestion: `Replace with standard form: "${standardForm}"`
            });
          }
        });
      }
    });
    
    return results;
  } catch (error) {
    debugLog('Error validating terminology:', error);
    return {
      issues: [{
        severity: 'error',
        message: `Failed to validate terminology: ${error.message}`
      }]
    };
  }
}

/**
 * Validates internal links and references in documentation
 * 
 * @param {string} docPath - Path to documentation file
 * @param {string} docsDir - Root documentation directory 
 * @param {Object} options - Validation options
 * @returns {Object} Link validation results
 */
function validateLinks(docPath, docsDir, options = {}) {
  const results = {
    totalLinks: 0,
    brokenLinks: 0,
    issues: []
  };
  
  try {
    const content = fs.readFileSync(docPath, 'utf-8');
    const { content: markdownContent } = matter(content);
    
    // Extract all links using marked lexer
    const tokens = marked.lexer(markdownContent);
    const links = extractLinks(tokens);
    results.totalLinks = links.length;
    
    // Validate each link
    links.forEach(link => {
      // Skip external links if requested
      if (link.href.startsWith('http') && options.skipExternalLinks) {
        return;
      }
      
      // Check internal links (anchors and relative paths)
      if (link.href.startsWith('#')) {
        // Anchor link - check if the heading exists
        const headingId = link.href.substring(1);
        const headings = extractHeadings(tokens);
        
        if (!headings.some(h => h.id === headingId)) {
          results.brokenLinks++;
          results.issues.push({
            severity: 'error',
            type: 'broken_anchor',
            href: link.href,
            lineNumber: link.lineNumber,
            message: `Broken anchor link: "${link.href}" - no matching heading ID found`,
            suggestion: 'Update the anchor to match an existing heading ID or add the missing heading'
          });
        }
      } else if (!link.href.startsWith('http')) {
        // Relative link to another doc - check if file exists
        const targetPath = path.resolve(path.dirname(docPath), link.href);
        
        if (!fs.existsSync(targetPath)) {
          results.brokenLinks++;
          results.issues.push({
            severity: 'error',
            type: 'broken_file_link',
            href: link.href,
            lineNumber: link.lineNumber,
            message: `Broken file link: "${link.href}" - file not found`,
            suggestion: 'Update the link to point to an existing file or create the missing file'
          });
        }
      }
    });
    
    return results;
  } catch (error) {
    debugLog('Error validating links:', error);
    return {
      issues: [{
        severity: 'error',
        message: `Failed to validate links: ${error.message}`
      }]
    };
  }
}

/**
 * Extracts links from markdown tokens
 */
function extractLinks(tokens, lineOffset = 0) {
  const links = [];
  
  tokens.forEach(token => {
    if (token.type === 'link') {
      links.push({
        text: token.text,
        href: token.href,
        lineNumber: token.line || lineOffset
      });
    } else if (token.tokens) {
      // Recursively extract links from nested tokens
      links.push(...extractLinks(token.tokens, token.line || lineOffset));
    }
  });
  
  return links;
}

/**
 * Extracts headings and their IDs from markdown tokens
 */
function extractHeadings(tokens) {
  const headings = [];
  
  tokens.forEach(token => {
    if (token.type === 'heading') {
      // Generate ID similar to how GitHub does it (simplified)
      const id = token.text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');
      
      headings.push({
        level: token.depth,
        text: token.text,
        id: id,
        line: token.line
      });
    }
  });
  
  return headings;
}

/**
 * Validates code examples in documentation
 * 
 * @param {string} docPath - Path to documentation file
 * @param {Object} options - Validation options
 * @returns {Object} Code example validation results
 */
function validateCodeExamples(docPath, options = {}) {
  const results = {
    totalExamples: 0,
    outOfDateExamples: 0,
    issues: []
  };
  
  try {
    const content = fs.readFileSync(docPath, 'utf-8');
    const { content: markdownContent } = matter(content);
    
    // Extract code blocks
    const codeBlocks = extractCodeBlocks(markdownContent);
    results.totalExamples = codeBlocks.length;
    
    // Validate each code block
    codeBlocks.forEach(codeBlock => {
      // Skip blocks without a language specifier if requested
      if (!codeBlock.language && options.requireLanguage) {
        results.issues.push({
          severity: 'warning',
          type: 'missing_language',
          lineNumber: codeBlock.lineNumber,
          message: 'Code block is missing language specifier',
          suggestion: 'Add a language specifier to the code block, e.g., ```jsx or ```tsx'
        });
      }
      
      // Validate based on language
      switch (codeBlock.language) {
        case 'jsx':
        case 'tsx':
        case 'js':
        case 'ts':
          validateJsCodeExample(codeBlock, results);
          break;
        case 'css':
        case 'scss':
          validateCssCodeExample(codeBlock, results);
          break;
        case 'bash':
        case 'sh':
          validateBashCodeExample(codeBlock, results);
          break;
      }
    });
    
    return results;
  } catch (error) {
    debugLog('Error validating code examples:', error);
    return {
      issues: [{
        severity: 'error',
        message: `Failed to validate code examples: ${error.message}`
      }]
    };
  }
}

/**
 * Extracts code blocks from markdown content
 */
function extractCodeBlocks(markdownContent) {
  const codeBlocks = [];
  const lines = markdownContent.split('\n');
  
  let inCodeBlock = false;
  let currentBlock = null;
  let lineNumber = 0;
  
  lines.forEach((line, index) => {
    lineNumber = index + 1;
    
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        currentBlock = {
          language: line.substring(3).trim(),
          code: '',
          lineNumber: lineNumber
        };
      } else {
        // End of code block
        inCodeBlock = false;
        codeBlocks.push(currentBlock);
        currentBlock = null;
      }
    } else if (inCodeBlock && currentBlock) {
      // Inside code block
      currentBlock.code += line + '\n';
    }
  });
  
  return codeBlocks;
}

/**
 * Validates JavaScript/TypeScript code examples
 */
function validateJsCodeExample(codeBlock, results) {
  const code = codeBlock.code;
  
  // Check for Next.js 15 patterns
  if (code.includes('import') || code.includes('export')) {
    // Check for proper "use client" directive
    if (code.includes('useState') || 
        code.includes('useEffect') || 
        code.includes('onClick') || 
        code.includes('window.') || 
        code.includes('document.')) {
      
      if (!code.includes('"use client"') && !code.includes("'use client'")) {
        results.outOfDateExamples++;
        results.issues.push({
          severity: 'error',
          type: 'missing_use_client',
          lineNumber: codeBlock.lineNumber,
          message: 'Client Component code example is missing "use client" directive',
          suggestion: 'Add "use client" directive at the top of the code example'
        });
      }
    }
    
    // Check for outdated Next.js patterns
    if (code.includes('getStaticProps') || code.includes('getServerSideProps')) {
      results.outOfDateExamples++;
      results.issues.push({
        severity: 'error',
        type: 'outdated_nextjs_pattern',
        lineNumber: codeBlock.lineNumber,
        message: 'Code example uses outdated Next.js Page Router patterns',
        suggestion: 'Update to Next.js 15.2.4 App Router patterns'
      });
    }
    
    // Check for improper data fetching patterns
    if (code.includes('async function') && code.includes('fetch(') && !code.includes('cache(')) {
      results.outOfDateExamples++;
      results.issues.push({
        severity: 'warning',
        type: 'missing_cache',
        lineNumber: codeBlock.lineNumber,
        message: 'Data fetching example does not use React cache() for deduplication',
        suggestion: 'Implement cache() for data fetching functions as per Next.js 15.2.4 best practices'
      });
    }
  }
}

/**
 * Validates CSS code examples
 */
function validateCssCodeExample(codeBlock, results) {
  const code = codeBlock.code;
  
  // Check for outdated CSS patterns
  if (code.includes('!important')) {
    results.issues.push({
      severity: 'warning',
      type: 'css_important',
      lineNumber: codeBlock.lineNumber,
      message: 'Code example uses !important which is discouraged',
      suggestion: 'Use more specific selectors or CSS variables instead of !important'
    });
  }
}

/**
 * Validates Bash code examples
 */
function validateBashCodeExample(codeBlock, results) {
  const code = codeBlock.code;
  
  // Check for potentially dangerous commands
  const dangerousCommands = ['rm -rf', 'chmod 777', 'sudo'];
  
  dangerousCommands.forEach(cmd => {
    if (code.includes(cmd)) {
      results.issues.push({
        severity: 'warning',
        type: 'dangerous_command',
        lineNumber: codeBlock.lineNumber,
        message: `Bash example contains potentially dangerous command: ${cmd}`,
        suggestion: 'Add warning notes when including potentially destructive commands'
      });
    }
  });
}

/**
 * Analyzes consistency of all documentation in a directory
 * 
 * @param {string} docsDir - Directory containing documentation files
 * @param {Object} options - Validation options
 * @returns {Object} Summary of consistency validation results
 */
async function analyzeConsistency(docsDir, options = {}) {
  const results = {
    totalDocuments: 0,
    terminologyIssues: 0,
    brokenLinks: 0,
    outOfDateExamples: 0,
    issues: []
  };
  
  try {
    // Find all markdown files in the directory
    const docFiles = findMarkdownFiles(docsDir);
    results.totalDocuments = docFiles.length;
    
    // Validate consistency of each document
    for (const docFile of docFiles) {
      // Validate terminology
      const termResults = validateTerminology(docFile, options);
      results.terminologyIssues += termResults.issues.length;
      
      // Validate links
      const linkResults = validateLinks(docFile, docsDir, options);
      results.brokenLinks += linkResults.brokenLinks;
      
      // Validate code examples
      const codeResults = validateCodeExamples(docFile, options);
      results.outOfDateExamples += codeResults.outOfDateExamples;
      
      // Collect all issues
      if (termResults.issues.length || linkResults.issues.length || codeResults.issues.length) {
        results.issues.push({
          file: docFile,
          issues: [
            ...termResults.issues,
            ...linkResults.issues,
            ...codeResults.issues
          ]
        });
      }
    }
    
    return results;
  } catch (error) {
    debugLog('Error analyzing documentation consistency:', error);
    return {
      error: `Failed to analyze documentation consistency: ${error.message}`
    };
  }
}

/**
 * Recursively finds markdown files in a directory
 * 
 * @param {string} dir - Directory to search
 * @returns {Array} List of markdown file paths
 */
function findMarkdownFiles(dir) {
  const results = [];
  
  function scan(directory) {
    const items = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(directory, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        scan(fullPath);
      } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
        results.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return results;
}

module.exports = {
  validateTerminology,
  validateLinks,
  validateCodeExamples,
  analyzeConsistency
};
