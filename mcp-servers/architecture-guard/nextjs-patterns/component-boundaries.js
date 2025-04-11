/**
 * Component Boundaries Validator
 * 
 * This module analyzes Next.js components to ensure proper implementation of Server/Client
 * component boundaries according to Next.js 15.2.4 best practices and Cyber Hand standards.
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
 * Client-side features that indicate a component should be a Client Component
 */
const CLIENT_FEATURES = {
  // React hooks
  HOOKS: [
    'useState',
    'useEffect',
    'useRef',
    'useCallback',
    'useReducer',
    'useMemo',
    'useImperativeHandle',
    'useLayoutEffect',
    'useInsertionEffect',
    'useTransition',
    'useDeferredValue',
    'useId',
    'useContext',
    'useSyncExternalStore'
  ],
  
  // Browser APIs that can't be used in Server Components
  BROWSER_APIS: [
    'window.',
    'document.',
    'navigator.',
    'localStorage',
    'sessionStorage',
    'indexedDB',
    'addEventListener',
    'removeEventListener',
    'setTimeout(',
    'clearTimeout(',
    'setInterval(',
    'clearInterval(',
    'requestAnimationFrame(',
    'cancelAnimationFrame('
  ],
  
  // React event handlers that indicate interactivity
  EVENT_HANDLERS: [
    'onClick',
    'onChange',
    'onSubmit',
    'onBlur',
    'onFocus',
    'onKeyDown',
    'onKeyUp',
    'onMouseOver',
    'onMouseOut',
    'onMouseEnter',
    'onMouseLeave',
    'onScroll',
    'onWheel',
    'onTouchStart',
    'onTouchMove',
    'onTouchEnd',
    'onDrag',
    'onDrop'
  ],
  
  // Client component import pattern
  CLIENT_IMPORTS: [
    /'use client'/,
    /"use client"/,
    /from ['"]next\/navigation['"]/,
    /from ['"]@\/components\/ui\/.*-client['"]/,
    /from ['"]@\/components\/client\//
  ]
};

/**
 * Validates proper Server/Client component boundaries in Next.js 15.2.4 components
 * 
 * Rules from Cyber Hand Project:
 * 1. Server Components for data fetching, Client Components at leaf nodes only
 * 2. Client Components must have "use client" directive
 * 3. Server Components should not use browser APIs or React hooks
 * 4. Client Components should follow naming conventions with -client suffix
 * 
 * @param {string} filepath - Path to the component file
 * @param {string} content - Content of the component file
 * @returns {Object} Object containing errors and warnings arrays
 */
function validateComponentBoundaries(filepath, content) {
  const errors = [];
  const warnings = [];
  
  // Skip if not a Next.js component
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.jsx')) {
    return { errors, warnings };
  }
  
  // Is this declared as a Client Component?
  const hasUseClientDirective = content.includes('"use client"') || content.includes("'use client'");
  
  // Is this in a client component path or has client naming convention?
  const isClientByPath = 
    filepath.includes('-client.') || 
    filepath.includes('/client/') || 
    filepath.includes('/ui/client/');
  
  // Check for client-side features
  let hasClientFeatures = false;
  let detectedClientFeatures = [];
  
  // 1. Check for React hooks
  for (const hook of CLIENT_FEATURES.HOOKS) {
    // Check for hook usage with proper boundaries
    const hookPattern = new RegExp(`\\b${hook}\\s*\\(`, 'i');
    if (hookPattern.test(content)) {
      hasClientFeatures = true;
      detectedClientFeatures.push(hook);
    }
  }
  
  // 2. Check for browser APIs
  for (const api of CLIENT_FEATURES.BROWSER_APIS) {
    if (content.includes(api)) {
      hasClientFeatures = true;
      detectedClientFeatures.push(api);
    }
  }
  
  // 3. Check for event handlers
  for (const handler of CLIENT_FEATURES.EVENT_HANDLERS) {
    const regex = new RegExp(`\\b${handler}\\s*=`, 'i');
    if (regex.test(content)) {
      hasClientFeatures = true;
      detectedClientFeatures.push(handler);
    }
  }
  
  // 4. Check for client component imports
  for (const pattern of CLIENT_FEATURES.CLIENT_IMPORTS) {
    if (pattern.test(content)) {
      hasClientFeatures = true;
      detectedClientFeatures.push('client component import');
    }
  }
  
  // 5. Check if it's importing something from "react"
  if (content.match(/import\s+.*\s+from\s+["']react["']/)) {
    // Only flag this for Client Component detection if specifically importing hooks or client-only features
    const clientImports = CLIENT_FEATURES.HOOKS.some(hook => 
      content.includes(`{ ${hook}`) || content.includes(`${hook} }`)
    );
    
    if (clientImports) {
      hasClientFeatures = true;
      detectedClientFeatures.push('react hooks import');
    }
  }
  
  // Now validate based on the detected features
  
  // Error: Client features without "use client" directive
  if (hasClientFeatures && !hasUseClientDirective) {
    errors.push({
      rule: 'missing-use-client',
      message: `Component using client-side features (${detectedClientFeatures.slice(0, 3).join(', ')}) must have "use client" directive`,
      location: filepath,
      severity: 'error',
      fix: 'Add "use client" directive at the top of the file, before any imports'
    });
  }
  
  // Warning: "use client" directive but no client features detected
  if (hasUseClientDirective && !hasClientFeatures) {
    warnings.push({
      rule: 'unnecessary-use-client',
      message: 'Component has "use client" directive but no client-side features were detected',
      location: filepath,
      severity: 'warning',
      fix: 'Remove "use client" directive to make this a Server Component if possible'
    });
  }
  
  // Warning: Client component not following naming conventions
  if ((hasUseClientDirective || hasClientFeatures) && !isClientByPath && !filepath.includes('/page.') && !filepath.includes('/layout.')) {
    warnings.push({
      rule: 'client-naming-convention',
      message: 'Client Components should follow naming conventions with -client suffix or be in a /client/ directory',
      location: filepath,
      severity: 'warning',
      fix: 'Rename the file to include -client suffix or move it to a /client/ directory'
    });
  }
  
  // Error: Server component importing Client component without proper boundary
  if (!hasUseClientDirective && !hasClientFeatures) {
    // Check for imports of Client Components
    const importMatches = content.match(/import\s+.*\s+from\s+["'].*-client["']/g) || [];
    const clientImports = importMatches.length;
    
    if (clientImports > 0 && !content.includes('<Suspense')) {
      warnings.push({
        rule: 'client-in-server-without-suspense',
        message: 'Server Component importing Client Component should consider using Suspense boundaries',
        location: filepath,
        severity: 'warning',
        fix: 'Consider wrapping imported Client Components with Suspense boundaries for better streaming'
      });
    }
  }
  
  return { errors, warnings };
}

/**
 * Analyzes a directory of components for proper Server/Client component boundaries
 * 
 * @param {string} directory - Directory to scan for components
 * @param {Object} options - Options for validation
 * @returns {Object} Summary of component boundary validation results
 */
function validateComponentBoundariesInDirectory(directory, options = {}) {
  const results = {
    errors: [],
    warnings: [],
    serverComponentsFound: 0,
    clientComponentsFound: 0,
    componentsChecked: 0,
    summary: ''
  };
  
  try {
    const files = scanDirectory(directory);
    debugLog(`Found ${files.length} files to analyze for component boundaries`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const { errors, warnings } = validateComponentBoundaries(file, content);
        
        // Count Server and Client components
        const hasUseClientDirective = content.includes('"use client"') || content.includes("'use client'");
        if (hasUseClientDirective) {
          results.clientComponentsFound++;
        } else {
          results.serverComponentsFound++;
        }
        
        if (errors.length > 0 || warnings.length > 0) {
          results.errors.push(...errors);
          results.warnings.push(...warnings);
        }
        
        results.componentsChecked++;
      } catch (err) {
        debugLog(`Error analyzing file ${file} for component boundaries:`, err);
      }
    }
    
    // Generate summary
    results.summary = `Analyzed ${results.componentsChecked} components: ${results.serverComponentsFound} Server Components and ${results.clientComponentsFound} Client Components. Detected ${results.errors.length} critical issues and ${results.warnings.length} warnings related to component boundaries.`;
    
  } catch (err) {
    debugLog(`Error scanning directory ${directory} for component boundaries:`, err);
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
  validateComponentBoundaries,
  validateComponentBoundariesInDirectory
};
