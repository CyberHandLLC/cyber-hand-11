/**
 * Documentation Best Practices Validator
 * 
 * Ensures documentation follows technical best practices:
 * - Verifies technical accuracy against Next.js 15.2.4 standards
 * - Checks accessibility guidelines in documentation
 * - Validates examples follow Cyber Hand architectural principles
 */

const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');

// Debug logging
const DEBUG = process.env.MCP_DEBUG === "true";
function debugLog(...args) {
  if (DEBUG) {
    console.error(...args);
  }
}

// Cyber Hand architectural principles based on project standards
const CYBER_HAND_PRINCIPLES = {
  // Core architectural principles
  SERVER_CLIENT_SEPARATION: {
    principle: "Server Components for data fetching, Client Components at leaf nodes only",
    keywords: ["server component", "client component", "use client", "leaf node"],
    requiredInDocs: ["server-components.md", "component-system.md", "architecture"]
  },
  SUSPENSE_BOUNDARIES: {
    principle: "Implement proper Suspense boundaries following Next.js 15 streaming patterns",
    keywords: ["suspense", "streaming", "loading", "fallback"],
    requiredInDocs: ["streaming", "suspense", "loading-ui"]
  },
  REACT_CACHE: {
    principle: "Use React's cache() for deduplication and parallel data fetching",
    keywords: ["cache()", "deduplication", "parallel fetching"],
    requiredInDocs: ["data-flow", "fetching"]
  },
  COMPONENT_SEPARATION: {
    principle: "Keep UI components separate from data fetching logic",
    keywords: ["separation of concerns", "data fetching", "ui component"],
    requiredInDocs: ["component", "architecture", "data-flow"]
  },

  // Code quality principles
  TYPE_SAFETY: {
    principle: "TypeScript interfaces instead of 'any', underscore prefix for unused variables",
    keywords: ["typescript", "interface", "type safety", "underscore prefix"],
    requiredInDocs: ["typescript", "code-quality", "standards"]
  },
  ERROR_HANDLING: {
    principle: "Content security policies (dev vs prod), proper error boundaries",
    keywords: ["error boundary", "security policy", "csp"],
    requiredInDocs: ["error-handling", "security"]
  },
  STYLING_APPROACH: {
    principle: "Theme-based styling with centralized CSS variables",
    keywords: ["theme", "css variables", "styling"],
    requiredInDocs: ["styling", "theming", "design-system"]
  },

  // Performance principles
  PERFORMANCE_BUDGET: {
    principle: "Budget: <3s initial load (3G), <300KB JS bundle",
    keywords: ["performance budget", "initial load", "bundle size"],
    requiredInDocs: ["performance", "optimization"]
  },
  CORE_WEB_VITALS: {
    principle: "Core Web Vitals targets: LCP <2.5s, TBT <200ms, CLS <0.1",
    keywords: ["web vitals", "LCP", "TBT", "CLS"],
    requiredInDocs: ["performance", "web-vitals"]
  }
};

// Next.js 15.2.4 specific concepts that should be accurately documented
const NEXTJS_CONCEPTS = [
  {
    name: "App Router",
    keywords: ["app router", "app directory", "app/"],
    requiredAccuracy: true
  },
  {
    name: "Server Components",
    keywords: ["server component", "data fetching"],
    requiredAccuracy: true
  },
  {
    name: "Client Components",
    keywords: ["client component", "use client", "interactivity"],
    requiredAccuracy: true
  },
  {
    name: "Data Fetching",
    keywords: ["fetch", "cache", "revalidate"],
    requiredAccuracy: true
  },
  {
    name: "Metadata API",
    keywords: ["metadata", "generateMetadata", "SEO"],
    requiredAccuracy: false
  },
  {
    name: "Route Handlers",
    keywords: ["api", "route handler", "api route"],
    requiredAccuracy: false
  },
  {
    name: "Server Actions",
    keywords: ["server action", "use server", "form"],
    requiredAccuracy: false
  }
];

/**
 * Validates that documentation follows Cyber Hand architectural principles
 * 
 * @param {string} docPath - Path to documentation file
 * @param {Object} options - Validation options
 * @returns {Object} Principles validation results
 */
function validateArchitecturalPrinciples(docPath, options = {}) {
  const results = {
    principlesChecked: 0,
    principlesReferenced: 0,
    missingPrinciples: [],
    issues: []
  };
  
  try {
    const content = fs.readFileSync(docPath, 'utf-8');
    const { content: markdownContent, data: frontmatter } = matter(content);
    const docName = path.basename(docPath);
    const docDir = path.basename(path.dirname(docPath));
    
    // Get document type from frontmatter if available
    const docType = frontmatter.type || 'general';
    
    // Determine which principles should be present in this document
    const relevantPrinciples = Object.values(CYBER_HAND_PRINCIPLES).filter(principle => {
      // Check if this doc matches any required paths
      return principle.requiredInDocs.some(required => {
        return docName.includes(required) || docDir.includes(required) || docType.includes(required);
      });
    });
    
    results.principlesChecked = relevantPrinciples.length;
    
    // Check each relevant principle
    relevantPrinciples.forEach(principle => {
      const keywordsPresent = principle.keywords.some(keyword => 
        markdownContent.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (keywordsPresent) {
        results.principlesReferenced++;
      } else {
        results.missingPrinciples.push(principle.principle);
        results.issues.push({
          severity: 'warning',
          type: 'missing_principle',
          principle: principle.principle,
          message: `Documentation should reference key principle: ${principle.principle}`,
          suggestion: `Consider adding information about this core architectural principle`
        });
      }
    });
    
    return results;
  } catch (error) {
    debugLog('Error validating architectural principles:', error);
    return {
      issues: [{
        severity: 'error',
        message: `Failed to validate architectural principles: ${error.message}`
      }]
    };
  }
}

/**
 * Validates technical accuracy of Next.js 15.2.4 concepts in documentation
 * 
 * @param {string} docPath - Path to documentation file
 * @param {Object} options - Validation options
 * @returns {Object} Technical accuracy validation results
 */
function validateTechnicalAccuracy(docPath, options = {}) {
  const results = {
    conceptsChecked: 0,
    potentialInaccuracies: 0,
    issues: []
  };
  
  try {
    const content = fs.readFileSync(docPath, 'utf-8');
    const { content: markdownContent } = matter(content);
    
    // Check for mentions of Next.js concepts
    NEXTJS_CONCEPTS.forEach(concept => {
      // Check if any keywords for this concept are present
      const mentionsThisConcept = concept.keywords.some(keyword => 
        markdownContent.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (mentionsThisConcept) {
        results.conceptsChecked++;
        
        // Look for potential inaccuracies or outdated information
        const potentialInaccuracies = [
          {
            outdated: ["pages directory", "pages/", "/pages/"],
            issue: "Documentation references the Pages Router which is not used in Next.js 15.2.4 App Router architecture",
            present: concept.keywords.some(kw => markdownContent.toLowerCase().includes(kw.toLowerCase())) &&
                    ["pages directory", "pages/", "/pages/"].some(outdated => 
                      markdownContent.toLowerCase().includes(outdated.toLowerCase())
                    )
          },
          {
            outdated: ["getServerSideProps", "getStaticProps", "getStaticPaths"],
            issue: "Documentation references outdated data fetching methods from Pages Router",
            present: concept.name === "Data Fetching" &&
                    ["getServerSideProps", "getStaticProps", "getStaticPaths"].some(outdated => 
                      markdownContent.toLowerCase().includes(outdated.toLowerCase())
                    )
          },
          {
            outdated: ["next/head", "<Head>"],
            issue: "Documentation references outdated Head component instead of Metadata API",
            present: concept.name === "Metadata API" &&
                    ["next/head", "<Head>"].some(outdated => 
                      markdownContent.toLowerCase().includes(outdated.toLowerCase())
                    )
          },
          {
            outdated: ["api/", "pages/api/"],
            issue: "Documentation references outdated API Routes instead of Route Handlers",
            present: concept.name === "Route Handlers" &&
                    ["api/", "pages/api/"].some(outdated => 
                      markdownContent.toLowerCase().includes(outdated.toLowerCase())
                    ) && 
                    !markdownContent.toLowerCase().includes("route.js") &&
                    !markdownContent.toLowerCase().includes("route.ts")
          }
        ];
        
        // Check for inaccuracies
        potentialInaccuracies.forEach(inaccuracy => {
          if (inaccuracy.present) {
            results.potentialInaccuracies++;
            
            // Add severity based on whether accuracy is required for this concept
            const severity = concept.requiredAccuracy ? 'error' : 'warning';
            
            results.issues.push({
              severity,
              type: 'technical_inaccuracy',
              concept: concept.name,
              message: inaccuracy.issue,
              suggestion: `Update documentation to reflect Next.js 15.2.4 patterns`
            });
          }
        });
      }
    });
    
    return results;
  } catch (error) {
    debugLog('Error validating technical accuracy:', error);
    return {
      issues: [{
        severity: 'error',
        message: `Failed to validate technical accuracy: ${error.message}`
      }]
    };
  }
}

/**
 * Validates accessibility guidelines in documentation
 * 
 * @param {string} docPath - Path to documentation file
 * @param {Object} options - Validation options
 * @returns {Object} Accessibility validation results
 */
function validateAccessibilityGuidelines(docPath, options = {}) {
  const results = {
    accessibilityMentioned: false,
    missingGuidelines: [],
    issues: []
  };
  
  try {
    const content = fs.readFileSync(docPath, 'utf-8');
    const { content: markdownContent } = matter(content);
    
    // Check if document is related to UI components or accessibility
    const isUIRelated = path.basename(docPath).includes('component') || 
                        path.dirname(docPath).includes('component') ||
                        path.basename(docPath).includes('accessibility') ||
                        path.basename(docPath).includes('ui');
    
    if (!isUIRelated) {
      // Skip non-UI documentation
      return {
        skipped: true,
        reason: 'Document not related to UI components or accessibility',
        issues: []
      };
    }
    
    // Check for accessibility-related content
    const accessibilityKeywords = [
      'accessibility', 'a11y', 'aria', 'screen reader', 'keyboard navigation'
    ];
    
    results.accessibilityMentioned = accessibilityKeywords.some(keyword => 
      markdownContent.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // For UI component documentation, check for key accessibility guidelines
    if (path.basename(docPath).includes('component')) {
      const requiredGuidelines = [
        { 
          name: 'ARIA attributes', 
          keywords: ['aria-', 'role='],
          message: 'Component documentation should mention proper ARIA attributes'
        },
        { 
          name: 'Keyboard navigation', 
          keywords: ['keyboard', 'focus', 'tab index', 'tabindex'],
          message: 'Component documentation should address keyboard navigation'
        },
        { 
          name: 'Color contrast', 
          keywords: ['contrast', 'wcag', 'color blind', 'colorblind'],
          message: 'Component documentation should mention color contrast requirements'
        },
        { 
          name: 'Screen reader', 
          keywords: ['screen reader', 'alt text', 'alternative text'],
          message: 'Component documentation should address screen reader compatibility'
        }
      ];
      
      // Check each required guideline
      requiredGuidelines.forEach(guideline => {
        const isPresent = guideline.keywords.some(keyword => 
          markdownContent.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (!isPresent) {
          results.missingGuidelines.push(guideline.name);
          results.issues.push({
            severity: 'warning',
            type: 'missing_accessibility',
            guideline: guideline.name,
            message: guideline.message,
            suggestion: `Add ${guideline.name} guidelines to component documentation`
          });
        }
      });
    }
    
    return results;
  } catch (error) {
    debugLog('Error validating accessibility guidelines:', error);
    return {
      issues: [{
        severity: 'error',
        message: `Failed to validate accessibility guidelines: ${error.message}`
      }]
    };
  }
}

/**
 * Analyzes best practices in all documentation in a directory
 * 
 * @param {string} docsDir - Directory containing documentation files
 * @param {Object} options - Validation options
 * @returns {Object} Summary of best practices validation results
 */
async function analyzeBestPractices(docsDir, options = {}) {
  const results = {
    totalDocuments: 0,
    architecturalIssues: 0,
    technicalInaccuracies: 0,
    accessibilityIssues: 0,
    issues: []
  };
  
  try {
    // Find all markdown files in the directory
    const docFiles = findMarkdownFiles(docsDir);
    results.totalDocuments = docFiles.length;
    
    // Validate best practices in each document
    for (const docFile of docFiles) {
      // Validate architectural principles
      const principlesResults = validateArchitecturalPrinciples(docFile, options);
      results.architecturalIssues += principlesResults.issues.length;
      
      // Validate technical accuracy
      const accuracyResults = validateTechnicalAccuracy(docFile, options);
      results.technicalInaccuracies += accuracyResults.issues.length;
      
      // Validate accessibility guidelines
      const accessibilityResults = validateAccessibilityGuidelines(docFile, options);
      results.accessibilityIssues += accessibilityResults.issues?.length || 0;
      
      // Collect all issues
      const allIssues = [
        ...principlesResults.issues || [],
        ...accuracyResults.issues || [],
        ...accessibilityResults.issues || []
      ];
      
      if (allIssues.length > 0) {
        results.issues.push({
          file: docFile,
          issues: allIssues
        });
      }
    }
    
    return results;
  } catch (error) {
    debugLog('Error analyzing documentation best practices:', error);
    return {
      error: `Failed to analyze documentation best practices: ${error.message}`
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
  validateArchitecturalPrinciples,
  validateTechnicalAccuracy,
  validateAccessibilityGuidelines,
  analyzeBestPractices,
  CYBER_HAND_PRINCIPLES,
  NEXTJS_CONCEPTS
};
