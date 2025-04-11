/**
 * TypeScript File Scanner
 * 
 * Provides utilities for scanning directories and finding TypeScript files
 * to be analyzed according to Cyber Hand style standards.
 */

const fs = require('fs');
const path = require('path');

// Debug helper
function debugLog(...args) {
  if (process.env.MCP_DEBUG === "true") {
    console.error(...args);
  }
}

/**
 * Scans a directory for TypeScript files recursively
 * @param {string} directoryPath - Path to scan
 * @param {object} options - Scan options
 * @returns {Array} List of TypeScript file paths
 */
function scanDirectory(directoryPath, options = {}) {
  const {
    includeJs = false,
    excludeNodeModules = true,
    excludePatterns = [],
    maxDepth = 10
  } = options;

  // TypeScript extensions to scan for
  const extensions = ['.ts', '.tsx'];
  if (includeJs) {
    extensions.push('.js', '.jsx');
  }

  // Default exclude patterns
  const allExcludePatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    ...excludePatterns
  ];

  const results = [];
  
  function scan(currentPath, depth = 0) {
    // Prevent infinite recursion or extremely deep traversal
    if (depth > maxDepth) {
      debugLog(`Max depth reached at ${currentPath}, skipping deeper traversal`);
      return;
    }

    // Skip excluded directories
    const dirName = path.basename(currentPath);
    if (allExcludePatterns.includes(dirName)) {
      debugLog(`Skipping excluded directory: ${currentPath}`);
      return;
    }

    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          // Recurse into directories
          scan(itemPath, depth + 1);
        } else if (stats.isFile()) {
          // Check if it's a TypeScript/JavaScript file
          const ext = path.extname(item).toLowerCase();
          if (extensions.includes(ext)) {
            results.push(itemPath);
          }
        }
      }
    } catch (error) {
      debugLog(`Error scanning directory ${currentPath}:`, error);
    }
  }

  // Start the scan
  scan(directoryPath);
  return results;
}

/**
 * Gets information about a specific file
 * @param {string} filePath - Path to the file
 * @returns {object} File information including size, type, etc.
 */
function getFileInfo(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath);
    const dirname = path.dirname(filePath);
    
    return {
      path: filePath,
      name: basename,
      directory: dirname,
      extension,
      size: stats.size,
      modified: stats.mtime,
      isTypeScript: ['.ts', '.tsx'].includes(extension),
      isJavaScript: ['.js', '.jsx'].includes(extension),
      isReact: ['.tsx', '.jsx'].includes(extension),
      isServerComponent: extension === '.tsx' && !isClientComponent(filePath),
      isClientComponent: isClientComponent(filePath)
    };
  } catch (error) {
    debugLog(`Error getting file info for ${filePath}:`, error);
    return {
      path: filePath,
      error: error.message
    };
  }
}

/**
 * Checks if a file is a Client Component based on
 * Cyber Hand project rules (has 'use client' directive or client suffix)
 * @param {string} filePath - Path to the file
 * @returns {boolean} True if it's a Client Component
 */
function isClientComponent(filePath) {
  // Check filename for client indicator (based on Cyber Hand naming conventions)
  const filename = path.basename(filePath).toLowerCase();
  if (filename.includes('-client.') || filename.includes('_client.') || filename.endsWith('-client') || filename.endsWith('_client')) {
    return true;
  }
  
  // Check file content for 'use client' directive
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const firstLines = content.split('\n').slice(0, 10).join('\n');
    return /['"]use client['"]/.test(firstLines);
  } catch (error) {
    debugLog(`Error checking if ${filePath} is a client component:`, error);
    return false;
  }
}

/**
 * Checks if a file exceeds the Cyber Hand size limit of 500 lines
 * @param {string} filePath - Path to the file
 * @returns {object} File size information and compliance status
 */
function checkFileSizeCompliance(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const lineCount = lines.length;
    const CYBER_HAND_LINE_LIMIT = 500;
    
    return {
      path: filePath,
      lineCount,
      compliant: lineCount <= CYBER_HAND_LINE_LIMIT,
      limit: CYBER_HAND_LINE_LIMIT,
      exceededBy: lineCount > CYBER_HAND_LINE_LIMIT ? lineCount - CYBER_HAND_LINE_LIMIT : 0
    };
  } catch (error) {
    debugLog(`Error checking file size compliance for ${filePath}:`, error);
    return {
      path: filePath,
      error: error.message,
      compliant: false
    };
  }
}

module.exports = {
  scanDirectory,
  getFileInfo,
  isClientComponent,
  checkFileSizeCompliance
};
