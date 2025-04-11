/**
 * Next.js 15.2.4 Pattern Validator Integration
 * 
 * This module integrates all Next.js pattern validators and provides a unified
 * interface for architectural validation according to Cyber Hand standards.
 */

const suspenseValidator = require('./suspense-validator');
const componentBoundaries = require('./component-boundaries');
const dataFetching = require('./data-fetching');

/**
 * Validates a component file against all Next.js 15.2.4 patterns
 * 
 * @param {string} filepath - Path to the component file
 * @param {string} content - Content of the component file
 * @param {Object} options - Validation options
 * @returns {Object} Aggregated validation results
 */
function validateComponent(filepath, content, options = {}) {
  // Run individual validators
  const suspenseResults = suspenseValidator.validateSuspenseBoundaries(filepath, content);
  const boundaryResults = componentBoundaries.validateComponentBoundaries(filepath, content);
  const dataResults = dataFetching.validateDataFetching(filepath, content);
  
  // Combine all results
  return {
    errors: [
      ...suspenseResults.errors,
      ...boundaryResults.errors,
      ...dataResults.errors
    ],
    warnings: [
      ...suspenseResults.warnings,
      ...boundaryResults.warnings,
      ...dataResults.warnings
    ]
  };
}

/**
 * Validates all Next.js 15.2.4 patterns in a directory
 * 
 * @param {string} directory - Directory to validate
 * @param {Object} options - Validation options
 * @returns {Object} Comprehensive validation results
 */
function validateDirectory(directory, options = {}) {
  // Initialize results structure
  const results = {
    errors: [],
    warnings: [],
    componentStats: {
      total: 0,
      server: 0,
      client: 0,
      withSuspense: 0,
      withCache: 0
    },
    patterns: {
      suspenseBoundaries: 0,
      errorBoundaries: 0,
      cacheUsage: 0,
      parallelFetching: 0
    },
    issues: {
      byCategory: {
        suspense: { errors: 0, warnings: 0 },
        boundaries: { errors: 0, warnings: 0 },
        dataFetching: { errors: 0, warnings: 0 }
      },
      mostCommon: []
    },
    summary: ''
  };
  
  // Run specialized directory validators and aggregate results
  const suspenseResults = suspenseValidator.validateSuspenseBoundariesInDirectory(directory, options);
  const boundaryResults = componentBoundaries.validateComponentBoundariesInDirectory(directory, options);
  const dataResults = dataFetching.validateDataFetchingInDirectory(directory, options);
  
  // Combine errors and warnings
  results.errors.push(...suspenseResults.errors);
  results.errors.push(...boundaryResults.errors);
  results.errors.push(...dataResults.errors);
  
  results.warnings.push(...suspenseResults.warnings);
  results.warnings.push(...boundaryResults.warnings);
  results.warnings.push(...dataResults.warnings);
  
  // Combine stats
  results.componentStats.total = Math.max(
    suspenseResults.componentsChecked,
    boundaryResults.componentsChecked,
    dataResults.componentsChecked
  );
  results.componentStats.server = boundaryResults.serverComponentsFound;
  results.componentStats.client = boundaryResults.clientComponentsFound;
  results.componentStats.withSuspense = suspenseResults.suspenseBoundariesFound;
  results.componentStats.withCache = dataResults.componentsWithCache;
  
  // Calculate issue counts by category
  results.issues.byCategory.suspense.errors = suspenseResults.errors.length;
  results.issues.byCategory.suspense.warnings = suspenseResults.warnings.length;
  results.issues.byCategory.boundaries.errors = boundaryResults.errors.length;
  results.issues.byCategory.boundaries.warnings = boundaryResults.warnings.length;
  results.issues.byCategory.dataFetching.errors = dataResults.errors.length;
  results.issues.byCategory.dataFetching.warnings = dataResults.warnings.length;
  
  // Calculate most common issues
  const issueTypes = {};
  [...results.errors, ...results.warnings].forEach(issue => {
    if (!issue.rule) return;
    
    if (!issueTypes[issue.rule]) {
      issueTypes[issue.rule] = {
        rule: issue.rule,
        count: 0,
        severity: issue.severity || 'warning',
        example: issue.message
      };
    }
    issueTypes[issue.rule].count++;
  });
  
  results.issues.mostCommon = Object.values(issueTypes)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Generate summary
  results.summary = `Analyzed ${results.componentStats.total} components (${results.componentStats.server} Server, ${results.componentStats.client} Client). Found ${results.errors.length} critical issues and ${results.warnings.length} warnings. Most common issue: ${results.issues.mostCommon[0]?.example || 'None'}`;
  
  return results;
}

module.exports = {
  validateComponent,
  validateDirectory,
  suspenseValidator,
  componentBoundaries,
  dataFetching
};
