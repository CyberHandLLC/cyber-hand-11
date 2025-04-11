/**
 * Documentation Freshness Validator
 * 
 * Checks documentation for freshness by:
 * - Tracking last update timestamps in markdown frontmatter
 * - Comparing documentation update dates with related code changes
 * - Flagging outdated documentation based on code modification history
 */

const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const simpleGit = require('simple-git');

// Debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

/**
 * Validates documentation freshness based on frontmatter and git history
 * 
 * @param {string} docPath - Path to documentation file
 * @param {Object} options - Validation options
 * @returns {Object} Freshness validation results
 */
async function validateFreshness(docPath, options = {}) {
  const results = {
    status: 'fresh',
    issues: [],
    lastUpdated: null,
    relatedCodeFiles: [],
    relatedCodeLastUpdated: null,
    daysSinceUpdate: 0
  };

  try {
    // 1. Extract frontmatter to get last updated date
    const content = fs.readFileSync(docPath, 'utf-8');
    const { data: frontmatter } = matter(content);
    
    // Check if frontmatter has lastUpdated or similar field
    const lastUpdated = frontmatter.lastUpdated || 
                       frontmatter.updated || 
                       frontmatter.date ||
                       null;
    
    results.lastUpdated = lastUpdated;
    
    // If no lastUpdated field in frontmatter, use git history
    if (!lastUpdated) {
      try {
        const git = simpleGit(path.dirname(docPath));
        const log = await git.log({ file: docPath, maxCount: 1 });
        
        if (log.latest) {
          results.lastUpdated = new Date(log.latest.date);
        } else {
          results.issues.push({
            severity: 'warning',
            message: 'No lastUpdated field in frontmatter and no git history found',
            suggestion: 'Add a lastUpdated field to the frontmatter for proper tracking'
          });
        }
      } catch (gitError) {
        debugLog('Git history check failed:', gitError);
        results.issues.push({
          severity: 'warning',
          message: 'Failed to check git history for document update time',
          error: gitError.message
        });
      }
    }
    
    // 2. Identify related code files based on documentation content
    results.relatedCodeFiles = await findRelatedCodeFiles(docPath, content);
    
    // 3. Check last modification times of related code files
    if (results.relatedCodeFiles.length > 0) {
      const codeUpdateTimes = await Promise.all(
        results.relatedCodeFiles.map(async file => {
          try {
            const git = simpleGit(path.dirname(file));
            const log = await git.log({ file, maxCount: 1 });
            return log.latest ? new Date(log.latest.date) : null;
          } catch (e) {
            return null;
          }
        })
      );
      
      // Get the most recent code update
      const validDates = codeUpdateTimes.filter(date => date !== null);
      if (validDates.length > 0) {
        results.relatedCodeLastUpdated = new Date(Math.max(...validDates.map(d => d.getTime())));
      }
      
      // 4. Compare dates to determine freshness
      if (results.lastUpdated && results.relatedCodeLastUpdated) {
        const docDate = new Date(results.lastUpdated);
        const codeDate = new Date(results.relatedCodeLastUpdated);
        
        const daysDiff = Math.floor((codeDate - docDate) / (1000 * 60 * 60 * 24));
        results.daysSinceUpdate = daysDiff;
        
        // Flag outdated documentation based on thresholds
        if (docDate < codeDate) {
          if (daysDiff > 90) {
            results.status = 'critically_outdated';
            results.issues.push({
              severity: 'error',
              message: `Documentation is critically outdated (${daysDiff} days behind code changes)`,
              suggestion: 'Urgently review and update documentation to reflect latest code changes'
            });
          } else if (daysDiff > 30) {
            results.status = 'outdated';
            results.issues.push({
              severity: 'warning',
              message: `Documentation may be outdated (${daysDiff} days behind code changes)`,
              suggestion: 'Review and update documentation to reflect recent code changes'
            });
          } else if (daysDiff > 7) {
            results.status = 'needs_review';
            results.issues.push({
              severity: 'info',
              message: `Documentation might need a review (${daysDiff} days since code changes)`,
              suggestion: 'Consider reviewing documentation for accuracy'
            });
          }
        }
      }
    }
    
    return results;
  } catch (error) {
    debugLog('Error validating freshness:', error);
    return {
      status: 'error',
      issues: [{
        severity: 'error',
        message: `Failed to validate documentation freshness: ${error.message}`
      }]
    };
  }
}

/**
 * Identifies code files related to a documentation file
 * 
 * @param {string} docPath - Path to documentation file
 * @param {string} content - Content of documentation file
 * @returns {Array} List of related code files
 */
async function findRelatedCodeFiles(docPath, content) {
  const relatedFiles = [];
  
  try {
    // 1. Check for explicit file references in frontmatter
    const { data: frontmatter } = matter(content);
    if (frontmatter.relatedFiles && Array.isArray(frontmatter.relatedFiles)) {
      relatedFiles.push(...frontmatter.relatedFiles);
    }
    
    // 2. Look for file paths in markdown content
    const filePathRegexes = [
      /(?:app|pages|components)\/[\w\/-]+\.(tsx|jsx|ts|js)/g,
      /(?:lib|utils)\/[\w\/-]+\.(tsx|jsx|ts|js)/g,
      /(?:import|require)\s+['"]([^'"]+)['"]/g
    ];
    
    filePathRegexes.forEach(regex => {
      const matches = content.match(regex) || [];
      relatedFiles.push(...matches);
    });
    
    // 3. Use filename-based heuristics
    const docName = path.basename(docPath, path.extname(docPath));
    
    // If doc is about a component, look for that component file
    if (docName.includes('component') || content.includes('# Component')) {
      const componentNameMatch = content.match(/# ([A-Z][a-zA-Z]+) Component/) || 
                               content.match(/## ([A-Z][a-zA-Z]+)/);
      
      if (componentNameMatch && componentNameMatch[1]) {
        const componentName = componentNameMatch[1];
        relatedFiles.push(`components/${componentName}.tsx`);
        relatedFiles.push(`components/${componentName}-client.tsx`);
        relatedFiles.push(`components/ui/${componentName}.tsx`);
      }
    }
    
    // 4. Filter out duplicates and normalize paths
    const uniqueRelatedFiles = [...new Set(relatedFiles)]
      .map(file => file.replace(/^['"]+|['"]+$/g, ''))
      .filter(Boolean);
    
    return uniqueRelatedFiles;
  } catch (error) {
    debugLog('Error finding related code files:', error);
    return [];
  }
}

/**
 * Analyzes freshness of all documentation in a directory
 * 
 * @param {string} docsDir - Directory containing documentation files
 * @param {Object} options - Validation options
 * @returns {Object} Summary of freshness validation results
 */
async function analyzeFreshness(docsDir, options = {}) {
  const results = {
    totalDocuments: 0,
    fresh: 0,
    needsReview: 0,
    outdated: 0,
    criticallyOutdated: 0,
    noTimestamp: 0,
    issues: []
  };
  
  try {
    // Find all markdown files in the directory
    const docFiles = findMarkdownFiles(docsDir);
    results.totalDocuments = docFiles.length;
    
    // Validate freshness of each document
    for (const docFile of docFiles) {
      const docResult = await validateFreshness(docFile, options);
      
      // Track statistics
      switch (docResult.status) {
        case 'fresh':
          results.fresh++;
          break;
        case 'needs_review':
          results.needsReview++;
          break;
        case 'outdated':
          results.outdated++;
          break;
        case 'critically_outdated':
          results.criticallyOutdated++;
          break;
        default:
          if (!docResult.lastUpdated) {
            results.noTimestamp++;
          }
      }
      
      // Collect issues
      if (docResult.issues && docResult.issues.length > 0) {
        results.issues.push({
          file: docFile,
          issues: docResult.issues
        });
      }
    }
    
    return results;
  } catch (error) {
    debugLog('Error analyzing documentation freshness:', error);
    return {
      error: `Failed to analyze documentation freshness: ${error.message}`
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
  validateFreshness,
  analyzeFreshness,
  findRelatedCodeFiles
};
