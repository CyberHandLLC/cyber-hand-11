/**
 * Documentation Coverage Validator
 * 
 * Analyzes documentation completeness:
 * - Tracks which components/features have documentation
 * - Identifies undocumented or poorly documented areas
 * - Generates documentation coverage reports
 */

const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const glob = require('glob');

// Debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

/**
 * Component/feature categories that should be documented
 */
const REQUIRED_DOCUMENTATION_CATEGORIES = [
  // Core architectural components
  {
    name: 'Server Components',
    pattern: 'app/**/page.tsx',
    docPattern: 'docs/**/server-components*.md',
    minWordCount: 300,
    required: true
  },
  {
    name: 'Client Components',
    pattern: ['components/**/*-client.tsx', 'app/**/*-client.tsx'],
    docPattern: 'docs/**/client-components*.md',
    minWordCount: 300,
    required: true
  },
  {
    name: 'UI Components',
    pattern: 'components/ui/**/*.tsx',
    docPattern: 'docs/components/**/*.md',
    minWordCount: 200,
    required: true
  },
  {
    name: 'Layout Components',
    pattern: 'app/**/layout.tsx',
    docPattern: 'docs/**/layout*.md',
    minWordCount: 200,
    required: true
  },
  
  // Data patterns
  {
    name: 'Data Fetching',
    pattern: ['lib/data/**/*.ts', 'lib/data/**/*.js'],
    docPattern: 'docs/**/data-fetching*.md',
    minWordCount: 300,
    required: true
  },
  {
    name: 'Database Schema',
    pattern: ['lib/database/**/*.ts', 'supabase/**/*.ts'],
    docPattern: 'docs/**/database*.md',
    minWordCount: 300,
    required: true
  },
  {
    name: 'API Routes',
    pattern: 'app/api/**/route.ts',
    docPattern: 'docs/**/api-routes*.md',
    minWordCount: 300,
    required: true
  },
  
  // Feature areas
  {
    name: 'Authentication',
    pattern: ['lib/auth/**/*.ts', 'app/auth/**/*.tsx'],
    docPattern: 'docs/**/authentication*.md',
    minWordCount: 400,
    required: true
  },
  {
    name: 'SEO Features',
    pattern: ['app/**/opengraph-image.tsx', 'app/**/metadata.ts'],
    docPattern: 'docs/**/seo*.md',
    minWordCount: 300,
    required: true
  },
  {
    name: 'Performance Optimizations',
    pattern: ['middleware.ts', 'next.config.js'],
    docPattern: 'docs/**/performance*.md',
    minWordCount: 400,
    required: true
  }
];

/**
 * Analyzes documentation coverage for components and features
 * 
 * @param {string} projectRoot - Root directory of the project
 * @param {string} docsDir - Directory containing documentation
 * @param {Object} options - Analysis options
 * @returns {Object} Coverage analysis results
 */
async function analyzeCoverage(projectRoot, docsDir, options = {}) {
  const results = {
    categoriesChecked: 0,
    categoriesWithDocs: 0,
    missingDocumentation: [],
    incompleteDocumentation: [],
    documentationQuality: {},
    issues: []
  };
  
  try {
    // Process each documentation category
    for (const category of REQUIRED_DOCUMENTATION_CATEGORIES) {
      results.categoriesChecked++;
      
      // 1. Find source files matching the pattern
      const sourceFiles = findSourceFiles(projectRoot, category.pattern);
      
      // Skip if no source files match the pattern
      if (sourceFiles.length === 0 && !options.includeEmpty) {
        continue;
      }
      
      // 2. Find documentation files for this category
      const docFiles = findDocFiles(docsDir, category.docPattern);
      
      // 3. Evaluate documentation coverage
      if (docFiles.length === 0) {
        // No documentation found for this category
        if (category.required || sourceFiles.length > 0) {
          results.missingDocumentation.push(category.name);
          
          results.issues.push({
            severity: 'error',
            type: 'missing_documentation',
            category: category.name,
            message: `No documentation found for ${category.name}`,
            suggestion: `Create documentation for ${category.name} in the docs directory`,
            codeFiles: sourceFiles.slice(0, 5) // Show first 5 source files
          });
        }
      } else {
        // Documentation exists - check its quality
        results.categoriesWithDocs++;
        
        // Analyze documentation quality
        const qualityResults = analyzeDocumentationQuality(docFiles, category, sourceFiles);
        results.documentationQuality[category.name] = qualityResults;
        
        // Check for incomplete documentation
        if (qualityResults.wordCount < category.minWordCount) {
          results.incompleteDocumentation.push(category.name);
          
          results.issues.push({
            severity: 'warning',
            type: 'incomplete_documentation',
            category: category.name,
            message: `Documentation for ${category.name} is too brief (${qualityResults.wordCount} words, minimum: ${category.minWordCount})`,
            suggestion: `Expand documentation with more detailed explanations, examples, and usage guidelines`,
            docFiles: docFiles
          });
        }
        
        // Check coverage of specific components if this is a component category
        if (category.name.includes('Component') && sourceFiles.length > 0) {
          const { coveredComponents, uncoveredComponents } = analyzeComponentCoverage(sourceFiles, docFiles);
          
          if (uncoveredComponents.length > 0) {
            results.issues.push({
              severity: 'warning',
              type: 'incomplete_component_coverage',
              category: category.name,
              message: `${uncoveredComponents.length} components are not documented: ${uncoveredComponents.slice(0, 3).join(', ')}${uncoveredComponents.length > 3 ? '...' : ''}`,
              suggestion: `Add documentation for missing components`,
              uncoveredComponents: uncoveredComponents
            });
          }
        }
      }
    }
    
    return results;
  } catch (error) {
    debugLog('Error analyzing documentation coverage:', error);
    return {
      error: `Failed to analyze documentation coverage: ${error.message}`
    };
  }
}

/**
 * Finds source files matching a pattern
 */
function findSourceFiles(projectRoot, pattern) {
  try {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    
    // Find files matching each pattern
    const allFiles = patterns.flatMap(p => {
      return glob.sync(p, { cwd: projectRoot, absolute: true, nodir: true });
    });
    
    // Deduplicate and return
    return [...new Set(allFiles)];
  } catch (error) {
    debugLog('Error finding source files:', error);
    return [];
  }
}

/**
 * Finds documentation files matching a pattern
 */
function findDocFiles(docsDir, pattern) {
  try {
    return glob.sync(pattern, { cwd: docsDir, absolute: true, nodir: true });
  } catch (error) {
    debugLog('Error finding documentation files:', error);
    return [];
  }
}

/**
 * Analyzes the quality of documentation
 */
function analyzeDocumentationQuality(docFiles, category, sourceFiles) {
  const results = {
    docFileCount: docFiles.length,
    wordCount: 0,
    codeExampleCount: 0,
    hasIntroduction: false,
    hasUsageExamples: false,
    hasAPIReference: false,
    quality: 'unknown'
  };
  
  // Process each documentation file
  docFiles.forEach(docFile => {
    try {
      const content = fs.readFileSync(docFile, 'utf-8');
      const { content: markdownContent } = matter(content);
      
      // Count words (ignoring code blocks)
      const textContent = markdownContent.replace(/```[\s\S]*?```/g, '');
      const words = textContent.split(/\s+/).filter(Boolean);
      results.wordCount += words.length;
      
      // Count code examples
      const codeBlockMatches = markdownContent.match(/```[\s\S]*?```/g) || [];
      results.codeExampleCount += codeBlockMatches.length;
      
      // Check for introduction section
      if (/^#\s+Introduction|^#.*Overview|^#.*About/im.test(markdownContent)) {
        results.hasIntroduction = true;
      }
      
      // Check for usage examples section
      if (/^#\s+Usage|^#.*Examples|^#.*How to Use/im.test(markdownContent)) {
        results.hasUsageExamples = true;
      }
      
      // Check for API reference section
      if (/^#\s+API|^#.*Props|^#.*Reference|^#.*Interface/im.test(markdownContent)) {
        results.hasAPIReference = true;
      }
    } catch (error) {
      debugLog(`Error analyzing documentation file ${docFile}:`, error);
    }
  });
  
  // Determine overall quality
  if (results.wordCount < category.minWordCount / 2) {
    results.quality = 'poor';
  } else if (results.wordCount < category.minWordCount) {
    results.quality = 'needs_improvement';
  } else if (results.hasIntroduction && results.hasUsageExamples && results.codeExampleCount >= 2) {
    results.quality = 'good';
  } else if (results.hasIntroduction && results.hasUsageExamples && results.hasAPIReference && results.codeExampleCount >= 3) {
    results.quality = 'excellent';
  } else {
    results.quality = 'adequate';
  }
  
  return results;
}

/**
 * Analyzes which components are covered by documentation
 */
function analyzeComponentCoverage(sourceFiles, docFiles) {
  const componentNames = sourceFiles.map(file => {
    const basename = path.basename(file, path.extname(file));
    // Extract component name:
    // For FooBar-client.tsx => FooBar
    // For FooBar.tsx => FooBar
    return basename.replace(/-client$/, '');
  });
  
  // Check documentation content for component names
  const docContent = docFiles.map(file => {
    try {
      return fs.readFileSync(file, 'utf-8');
    } catch (error) {
      return '';
    }
  }).join(' ');
  
  // Determine which components are documented
  const coveredComponents = [];
  const uncoveredComponents = [];
  
  componentNames.forEach(componentName => {
    // Check for header mentioning the component
    const hasHeader = new RegExp(`#\\s+${componentName}\\b|##\\s+${componentName}\\b`, 'i').test(docContent);
    // Check for component name mentions in text
    const hasMention = docContent.includes(componentName);
    
    if (hasHeader || hasMention) {
      coveredComponents.push(componentName);
    } else {
      uncoveredComponents.push(componentName);
    }
  });
  
  return { coveredComponents, uncoveredComponents };
}

/**
 * Identifies areas missing documentation by analyzing code and docs structure
 * 
 * @param {string} projectRoot - Root directory of the project
 * @param {string} docsDir - Directory containing documentation
 * @param {Object} options - Analysis options
 * @returns {Object} Missing documentation analysis
 */
function identifyUndocumentedAreas(projectRoot, docsDir, options = {}) {
  const results = {
    undocumentedComponents: [],
    undocumentedFeatures: [],
    poorlyDocumentedAreas: [],
    recommendedDocumentation: []
  };
  
  try {
    // Find React components without matching documentation
    const componentFiles = glob.sync('**/[A-Z]*.tsx', { 
      cwd: projectRoot, 
      ignore: ['**/node_modules/**', '**/build/**', '**/dist/**'] 
    });
    
    // For each component, check if documentation exists
    componentFiles.forEach(componentFile => {
      const componentName = path.basename(componentFile, '.tsx').replace(/-client$/, '');
      
      // Check if there's any documentation mentioning this component
      const docFiles = glob.sync(`**/*.md`, { cwd: docsDir });
      
      let isDocumented = false;
      for (const docFile of docFiles) {
        try {
          const content = fs.readFileSync(path.join(docsDir, docFile), 'utf-8');
          if (content.includes(componentName)) {
            isDocumented = true;
            break;
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
      
      if (!isDocumented) {
        results.undocumentedComponents.push({
          name: componentName,
          path: componentFile
        });
      }
    });
    
    // Identify key project features that should be documented
    const featurePatterns = [
      { name: 'Authentication', path: 'lib/auth/**/*' },
      { name: 'API Routes', path: 'app/api/**/*' },
      { name: 'Database Schema', path: 'lib/database/**/*' },
      { name: 'State Management', path: 'lib/store/**/*' },
      { name: 'Middleware', path: 'middleware.ts' },
      { name: 'Configuration', path: 'next.config.js' }
    ];
    
    featurePatterns.forEach(feature => {
      const hasFeature = glob.sync(feature.path, { cwd: projectRoot }).length > 0;
      if (!hasFeature) return;
      
      // Check if feature is documented
      const docPattern = `**/${feature.name.toLowerCase().replace(/\s+/g, '-')}*.md`;
      const hasDoc = glob.sync(docPattern, { cwd: docsDir }).length > 0;
      
      if (!hasDoc) {
        results.undocumentedFeatures.push({
          name: feature.name,
          path: feature.path
        });
      }
    });
    
    // Generate recommendations
    results.recommendedDocumentation = [
      ...results.undocumentedComponents.slice(0, 5).map(c => ({
        type: 'component',
        name: c.name,
        suggestion: `Create documentation for the ${c.name} component explaining its purpose, props, and usage examples`
      })),
      ...results.undocumentedFeatures.map(f => ({
        type: 'feature',
        name: f.name,
        suggestion: `Add documentation for the ${f.name} feature area explaining design decisions, usage patterns, and architecture`
      }))
    ];
    
    return results;
  } catch (error) {
    debugLog('Error identifying undocumented areas:', error);
    return {
      error: `Failed to identify undocumented areas: ${error.message}`
    };
  }
}

/**
 * Generates a documentation coverage report
 * 
 * @param {string} projectRoot - Root directory of the project
 * @param {string} docsDir - Directory containing documentation
 * @param {Object} options - Report options
 * @returns {Object} Documentation coverage report
 */
async function generateCoverageReport(projectRoot, docsDir, options = {}) {
  try {
    // Get coverage analysis
    const coverageResults = await analyzeCoverage(projectRoot, docsDir, options);
    
    // Get undocumented areas
    const undocumentedResults = identifyUndocumentedAreas(projectRoot, docsDir, options);
    
    // Calculate coverage percentage
    const coveragePercentage = coverageResults.categoriesWithDocs / 
                            Math.max(1, coverageResults.categoriesChecked) * 100;
    
    // Generate recommendations based on findings
    const recommendations = [];
    
    if (coverageResults.missingDocumentation.length > 0) {
      recommendations.push({
        priority: 'high',
        recommendation: `Create documentation for missing categories: ${coverageResults.missingDocumentation.join(', ')}`
      });
    }
    
    if (coverageResults.incompleteDocumentation.length > 0) {
      recommendations.push({
        priority: 'medium',
        recommendation: `Expand documentation for incomplete categories: ${coverageResults.incompleteDocumentation.join(', ')}`
      });
    }
    
    if (undocumentedResults.undocumentedComponents.length > 0) {
      const componentCount = undocumentedResults.undocumentedComponents.length;
      recommendations.push({
        priority: componentCount > 5 ? 'high' : 'medium',
        recommendation: `Document ${componentCount} undocumented components (start with the most frequently used ones)`
      });
    }
    
    if (undocumentedResults.undocumentedFeatures.length > 0) {
      recommendations.push({
        priority: 'high',
        recommendation: `Create documentation for core features: ${undocumentedResults.undocumentedFeatures.map(f => f.name).join(', ')}`
      });
    }
    
    // Compile comprehensive report
    return {
      summary: {
        coveragePercentage: Math.round(coveragePercentage),
        documented: coverageResults.categoriesWithDocs,
        total: coverageResults.categoriesChecked,
        missingCategories: coverageResults.missingDocumentation.length,
        incompleteCategories: coverageResults.incompleteDocumentation.length,
        undocumentedComponents: undocumentedResults.undocumentedComponents.length,
        undocumentedFeatures: undocumentedResults.undocumentedFeatures.length
      },
      details: {
        ...coverageResults,
        ...undocumentedResults
      },
      recommendations
    };
  } catch (error) {
    debugLog('Error generating coverage report:', error);
    return {
      error: `Failed to generate coverage report: ${error.message}`
    };
  }
}

module.exports = {
  analyzeCoverage,
  identifyUndocumentedAreas,
  generateCoverageReport,
  REQUIRED_DOCUMENTATION_CATEGORIES
};
