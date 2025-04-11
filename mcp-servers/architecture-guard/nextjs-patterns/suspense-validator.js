/**
 * Suspense Boundary Validator
 * 
 * This module analyzes Next.js components to ensure proper implementation of Suspense
 * boundaries according to Next.js 15.2.4 best practices and Cyber Hand standards.
 */

const fs = require('fs');
const path = require('path');

// Debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

/**
 * Validates proper Suspense boundary usage in Next.js 15.2.4 components
 * 
 * Rules from docs/streaming/suspense-boundaries.md:
 * 1. All async Server Components with fetching should be wrapped in Suspense
 * 2. Error boundaries should wrap Suspense boundaries
 * 3. Suspense boundaries should have appropriate fallback UI
 * 
 * @param {string} filepath - Path to the component file
 * @param {string} content - Content of the component file
 * @returns {Object} Object containing errors and warnings arrays
 */
function validateSuspenseBoundaries(filepath, content) {
  const errors = [];
  const warnings = [];
  
  // Skip if not a Next.js component
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.jsx')) {
    return { errors, warnings };
  }
  
  // Skip client components for some checks
  const hasUseClientDirective = content.includes('"use client"') || content.includes("'use client'");
  
  // Check if this is a page or layout component
  const isPageComponent = filepath.includes('/page.') || filepath.includes('/layout.');
  
  // Check for async Server Components without proper Suspense
  if (!hasUseClientDirective && content.includes('async function') && content.includes('fetch(')) {
    // Check if the component has data fetching but no Suspense
    if (!content.includes('<Suspense')) {
      errors.push({
        rule: 'suspense-missing',
        message: 'Async Server Component with data fetching should be wrapped in a <Suspense> boundary',
        location: filepath,
        severity: 'error',
        fix: 'Wrap the data fetching component with <Suspense fallback={<LoadingSkeleton />}>...</Suspense>'
      });
    }
  }
  
  // Check for Suspense boundaries without Error boundaries
  if (content.includes('<Suspense') && !content.includes('ErrorBoundary') && !content.includes('error.js')) {
    warnings.push({
      rule: 'error-boundary-missing',
      message: 'Suspense boundary should be wrapped with an ErrorBoundary to handle fetch errors',
      location: filepath,
      severity: 'warning',
      fix: 'Wrap your Suspense boundary with an ErrorBoundary: <ErrorBoundary fallback={<ErrorUI />}><Suspense>...</Suspense></ErrorBoundary>'
    });
  }
  
  // Check for empty or inadequate fallback UI
  if (content.includes('<Suspense fallback={<></>}') || content.includes('<Suspense fallback={null}') || content.includes('<Suspense fallback={""}')) {
    warnings.push({
      rule: 'inadequate-fallback',
      message: 'Suspense boundary has empty fallback UI which creates poor UX during loading',
      location: filepath,
      severity: 'warning',
      fix: 'Provide a meaningful loading UI in the fallback prop'
    });
  }
  
  // Check for deep nesting of Suspense boundaries (waterfall anti-pattern)
  const suspenseBoundaryMatches = content.match(/<Suspense/g);
  if (suspenseBoundaryMatches && suspenseBoundaryMatches.length > 3 && content.includes('fetch(')) {
    warnings.push({
      rule: 'suspense-nesting',
      message: 'Multiple nested Suspense boundaries detected, which may create request waterfalls',
      location: filepath,
      severity: 'warning',
      fix: 'Consider parallel data fetching with Promise.all() to avoid request waterfalls'
    });
  }
  
  // Check for missing Suspense in layout with streaming
  if (isPageComponent && !hasUseClientDirective && content.includes('export default') && content.includes('fetch(') && !content.includes('<Suspense')) {
    errors.push({
      rule: 'streaming-without-suspense',
      message: 'Page or layout component with data fetching must use Suspense for proper streaming in Next.js 15.2.4',
      location: filepath,
      severity: 'error',
      fix: 'Implement Suspense boundaries for each data fetching section'
    });
  }
  
  return { errors, warnings };
}

/**
 * Analyzes a directory of components for proper Suspense boundary implementation
 * 
 * @param {string} directory - Directory to scan for components
 * @param {Object} options - Options for validation
 * @returns {Object} Summary of Suspense boundary validation results
 */
function validateSuspenseBoundariesInDirectory(directory, options = {}) {
  const results = {
    errors: [],
    warnings: [],
    suspenseBoundariesFound: 0,
    errorBoundariesFound: 0,
    componentsChecked: 0,
    summary: ''
  };
  
  try {
    const files = scanDirectory(directory);
    debugLog(`Found ${files.length} files to analyze for Suspense boundaries`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const { errors, warnings } = validateSuspenseBoundaries(file, content);
        
        // Count Suspense and Error boundaries
        if (content.includes('<Suspense')) {
          results.suspenseBoundariesFound++;
        }
        if (content.includes('ErrorBoundary') || content.includes('error.js')) {
          results.errorBoundariesFound++;
        }
        
        if (errors.length > 0 || warnings.length > 0) {
          results.errors.push(...errors);
          results.warnings.push(...warnings);
        }
        
        results.componentsChecked++;
      } catch (err) {
        debugLog(`Error analyzing file ${file} for Suspense boundaries:`, err);
      }
    }
    
    // Generate summary
    results.summary = `Analyzed ${results.componentsChecked} components, found ${results.suspenseBoundariesFound} Suspense boundaries and ${results.errorBoundariesFound} Error boundaries. Detected ${results.errors.length} critical issues and ${results.warnings.length} warnings.`;
    
  } catch (err) {
    debugLog(`Error scanning directory ${directory} for Suspense boundaries:`, err);
    results.errors.push({
      rule: 'directory-scan-error',
      message: `Failed to scan directory: ${err.message}`,
      location: directory,
      severity: 'error'
    });
  }
  
  return results;
}

/**
 * Recursively scans directory for component files
 */
function scanDirectory(directory) {
  const results = [];
  
  function scan(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('node_modules') && !item.name.startsWith('.')) {
        scan(fullPath);
      } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.jsx'))) {
        results.push(fullPath);
      }
    }
  }
  
  scan(directory);
  return results;
}

module.exports = {
  validateSuspenseBoundaries,
  validateSuspenseBoundariesInDirectory
};
