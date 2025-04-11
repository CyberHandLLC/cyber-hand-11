/**
 * Data Fetching Patterns Validator
 * 
 * This module analyzes Next.js components to ensure proper implementation of data fetching
 * patterns including React's cache() for deduplication according to Next.js 15.2.4 best practices.
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
 * Validates proper data fetching patterns in Next.js 15.2.4 components with focus on cache()
 * 
 * Rules from Cyber Hand standards:
 * 1. Use React's cache() for deduplication and parallel data fetching
 * 2. Keep UI components separate from data fetching logic
 * 3. Use proper fetch options for Next.js 15.2.4 caching
 * 4. Implement Promise.all() for parallel data fetching to prevent waterfalls
 * 
 * @param {string} filepath - Path to the component file
 * @param {string} content - Content of the component file
 * @returns {Object} Object containing errors and warnings arrays
 */
function validateDataFetching(filepath, content) {
  const errors = [];
  const warnings = [];
  
  // Skip if not a Next.js component
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.jsx')) {
    return { errors, warnings };
  }
  
  // Skip client components for server-side data fetching checks
  const hasUseClientDirective = content.includes('"use client"') || content.includes("'use client'");
  
  // Key patterns to look for
  const hasFetchCalls = content.includes('fetch(');
  const hasGetCall = content.includes('.get(') || content.includes('.from(');
  const hasSupabaseImport = content.includes('supabase');
  const hasCacheImport = content.includes('import { cache }') || 
                        content.includes('import {cache}') || 
                        content.includes('unstable_cache');
  const hasCacheUsage = content.includes('cache(') || content.includes('unstable_cache(');
  
  // Check if this is a Server Component doing data fetching
  if (!hasUseClientDirective && (hasFetchCalls || hasGetCall || hasSupabaseImport)) {
    
    // 1. Check for direct data fetching in component without extraction
    const isPageOrLayout = filepath.includes('/page.') || filepath.includes('/layout.');
    const hasExportedFunction = content.includes('export default') || content.includes('export async function');
    const hasDataFetchingInComponent = content.match(/export\s+(default\s+)?async\s+function.*\{[\s\S]*?fetch\(/);
    const hasSeparateDataFunction = content.match(/async\s+function\s+\w+\(\)\s*\{[\s\S]*?fetch\(/);
    
    // Page components often need to do direct fetching, but other components should separate concerns
    if (!isPageOrLayout && hasDataFetchingInComponent && !hasSeparateDataFunction) {
      warnings.push({
        rule: 'data-fetching-separation',
        message: 'Data fetching should be separated from component rendering for better maintainability',
        location: filepath,
        severity: 'warning',
        fix: 'Extract data fetching logic to a separate async function using React\'s cache()'
      });
    }
    
    // 2. Check for missing cache() usage with fetch
    if (hasFetchCalls && !hasCacheImport && !hasCacheUsage) {
      // Only warn for components with multiple fetch calls that could benefit from deduplication
      const fetchCallMatches = content.match(/fetch\(/g) || [];
      if (fetchCallMatches.length > 1) {
        warnings.push({
          rule: 'missing-cache-usage',
          message: 'Multiple fetch calls should use React\'s cache() for deduplication',
          location: filepath,
          severity: 'warning',
          fix: 'Implement cache() for fetch functions that may be called multiple times'
        });
      }
    }
    
    // 3. Check Next.js 15.2.4 fetch options
    if (hasFetchCalls) {
      // Next.js 15.2.4 requires explicit opt-in for caching and revalidation
      const hasProperCachingOptions = content.includes('next: {') || 
                                     content.includes('revalidate:') || 
                                     content.includes('tags:');
      
      if (!hasProperCachingOptions) {
        warnings.push({
          rule: 'missing-fetch-options',
          message: 'Next.js 15.2.4 requires explicit fetch options for caching and revalidation',
          location: filepath,
          severity: 'warning',
          fix: 'Add appropriate caching options: fetch(url, { next: { revalidate: 60, tags: [\'tag\'] } })'
        });
      }
    }
    
    // 4. Check for potential request waterfalls
    const hasSequentialFetches = content.match(/const\s+\w+\s*=\s*await\s+fetch.*\r?\n.*const\s+\w+\s*=\s*await\s+fetch/);
    const hasPromiseAll = content.includes('Promise.all');
    
    if (hasSequentialFetches && !hasPromiseAll) {
      warnings.push({
        rule: 'sequential-fetches',
        message: 'Sequential fetch calls create request waterfalls and slow down page rendering',
        location: filepath,
        severity: 'warning',
        fix: 'Use Promise.all() to fetch data in parallel: const [data1, data2] = await Promise.all([fetchData1(), fetchData2()])'
      });
    }
    
    // 5. Check for proper Supabase usage in Server Components
    if (hasSupabaseImport && !hasUseClientDirective) {
      const hasCreateServerClient = content.includes('createServerClient') || content.includes('createServerComponentClient');
      if (!hasCreateServerClient) {
        errors.push({
          rule: 'incorrect-supabase-client',
          message: 'Server Components must use createServerComponentClient() for Supabase in Next.js 15.2.4',
          location: filepath,
          severity: 'error',
          fix: 'Use createServerComponentClient() from @supabase/auth-helpers-nextjs'
        });
      }
      
      // Check if Supabase queries are cached
      if (content.includes('supabase.') && content.includes('.from(') && !hasCacheUsage) {
        warnings.push({
          rule: 'uncached-supabase-query',
          message: 'Supabase queries in Server Components should be wrapped with cache() for deduplication',
          location: filepath,
          severity: 'warning',
          fix: 'Implement cache() for Supabase query functions that may be called multiple times'
        });
      }
    }
  }
  
  // Check for data fetching in Client Components (should use SWR or React Query)
  if (hasUseClientDirective && hasFetchCalls) {
    const hasSWR = content.includes('useSWR');
    const hasReactQuery = content.includes('useQuery');
    const hasMutation = content.includes('useMutation');
    
    if (!hasSWR && !hasReactQuery && !hasMutation) {
      warnings.push({
        rule: 'client-fetch-without-library',
        message: 'Client Components should use SWR or React Query for data fetching instead of raw fetch',
        location: filepath,
        severity: 'warning',
        fix: 'Implement useSWR() or useQuery() for client-side data fetching with proper caching and revalidation'
      });
    }
  }
  
  return { errors, warnings };
}

/**
 * Analyzes a directory of components for proper data fetching patterns
 * 
 * @param {string} directory - Directory to scan for components
 * @param {Object} options - Options for validation
 * @returns {Object} Summary of data fetching pattern validation results
 */
function validateDataFetchingInDirectory(directory, options = {}) {
  const results = {
    errors: [],
    warnings: [],
    componentsWithCache: 0,
    componentsWithFetch: 0,
    componentsWithSupabase: 0,
    componentsChecked: 0,
    summary: ''
  };
  
  try {
    const files = scanDirectory(directory);
    debugLog(`Found ${files.length} files to analyze for data fetching patterns`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const { errors, warnings } = validateDataFetching(file, content);
        
        // Count components with different data fetching patterns
        if (content.includes('fetch(')) {
          results.componentsWithFetch++;
        }
        if (content.includes('cache(') || content.includes('unstable_cache(')) {
          results.componentsWithCache++;
        }
        if (content.includes('supabase')) {
          results.componentsWithSupabase++;
        }
        
        if (errors.length > 0 || warnings.length > 0) {
          results.errors.push(...errors);
          results.warnings.push(...warnings);
        }
        
        results.componentsChecked++;
      } catch (err) {
        debugLog(`Error analyzing file ${file} for data fetching patterns:`, err);
      }
    }
    
    // Generate summary
    results.summary = `Analyzed ${results.componentsChecked} components: found ${results.componentsWithFetch} using fetch, ${results.componentsWithCache} using cache() and ${results.componentsWithSupabase} using Supabase. Detected ${results.errors.length} critical issues and ${results.warnings.length} warnings related to data fetching patterns.`;
    
  } catch (err) {
    debugLog(`Error scanning directory ${directory} for data fetching patterns:`, err);
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
  validateDataFetching,
  validateDataFetchingInDirectory
};
