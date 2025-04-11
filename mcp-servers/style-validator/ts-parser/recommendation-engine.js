/**
 * Recommendation Engine for Style Validator
 * 
 * Provides actionable recommendations and documentation links for style issues
 * based on Next.js 15.2.4, React 19, Supabase, Vercel, and shadcn/ui best practices
 */

// Documentation reference URLs
const DOC_URLS = {
  // Next.js documentation
  NEXTJS_SERVER_COMPONENTS: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
  NEXTJS_CLIENT_COMPONENTS: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components',
  NEXTJS_TYPESCRIPT: 'https://nextjs.org/docs/app/building-your-application/configuring/typescript',
  NEXTJS_SUSPENSE: 'https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming',
  NEXTJS_CACHING: 'https://nextjs.org/docs/app/building-your-application/caching',

  // React documentation
  REACT_TYPE_CHECKING: 'https://react.dev/learn/typescript',
  REACT_ERROR_BOUNDARY: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
  REACT_HOOKS: 'https://react.dev/reference/react/hooks',
  
  // Supabase documentation
  SUPABASE_TYPESCRIPT: 'https://supabase.com/docs/guides/api/rest/typescript-support',
  SUPABASE_SECURITY: 'https://supabase.com/docs/guides/auth/row-level-security',
  
  // Vercel documentation
  VERCEL_PERFORMANCE: 'https://vercel.com/docs/concepts/speed-insights',
  VERCEL_EDGE_RUNTIME: 'https://vercel.com/docs/functions/edge-functions/edge-runtime',
  
  // shadcn/ui documentation
  SHADCN_USAGE: 'https://ui.shadcn.com/docs/components',
  SHADCN_STYLING: 'https://ui.shadcn.com/docs/theming',
  
  // TypeScript documentation
  TYPESCRIPT_ANY: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
  TYPESCRIPT_INTERFACES: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces',
  
  // Cyber Hand specific docs
  CYBER_HAND_MCP_VALIDATORS: '/docs/MCP-VALIDATORS.md',
  CYBER_HAND_ARCHITECTURE_OVERVIEW: '/docs/architecture/system-overview.md',
  CYBER_HAND_COMPONENT_SYSTEM: '/docs/architecture/component-system.md',
  CYBER_HAND_SERVER_COMPONENTS: '/docs/architecture/server-components.md',
  CYBER_HAND_FILE_STRUCTURE: '/docs/architecture/file-structure.md',
  CYBER_HAND_DATA_FLOW: '/docs/architecture/data-flow.md',
};

// Severity levels for categorization
const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Maps issue types to helpful recommendations with documentation links
 */
const ISSUE_RECOMMENDATIONS = {
  // TypeScript "any" type issues
  anyType: {
    severity: SEVERITY.ERROR,
    title: 'Avoid using "any" type',
    message: 'Replace "any" with proper type definitions to maintain type safety.',
    recommendation: 'Create proper TypeScript interfaces or use more specific types like "unknown" when the type cannot be determined.',
    docLinks: [
      { name: 'TypeScript - Working with Unknown Types', url: DOC_URLS.TYPESCRIPT_ANY },
      { name: 'Next.js TypeScript Guide', url: DOC_URLS.NEXTJS_TYPESCRIPT },
      { name: 'Supabase TypeScript Integration', url: DOC_URLS.SUPABASE_TYPESCRIPT }
    ]
  },
  
  // Naming convention issues
  componentNaming: {
    severity: SEVERITY.ERROR,
    title: 'Component naming convention',
    message: 'Components must use PascalCase naming convention.',
    recommendation: 'Rename the component to start with an uppercase letter and use PascalCase format.',
    docLinks: [
      { name: 'React Component Naming', url: DOC_URLS.REACT_TYPE_CHECKING },
      { name: 'Cyber Hand Style Guide', url: DOC_URLS.CYBER_HAND_STYLE_GUIDE }
    ]
  },
  
  variableNaming: {
    severity: SEVERITY.WARNING,
    title: 'Variable naming convention',
    message: 'Variables and functions should use camelCase naming convention.',
    recommendation: 'Rename variables and functions to use camelCase format.',
    docLinks: [
      { name: 'TypeScript Naming Conventions', url: DOC_URLS.TYPESCRIPT_INTERFACES },
      { name: 'Cyber Hand Style Guide', url: DOC_URLS.CYBER_HAND_STYLE_GUIDE }
    ]
  },
  
  // Unused variables issues
  unusedVariable: {
    severity: SEVERITY.WARNING,
    title: 'Unused variable without underscore prefix',
    message: 'Unused variables should have an underscore prefix.',
    recommendation: 'Either use the variable or prefix it with an underscore (_) to indicate it\'s intentionally unused.',
    docLinks: [
      { name: 'TypeScript Variable Usage', url: DOC_URLS.TYPESCRIPT_INTERFACES },
      { name: 'Cyber Hand Style Guide', url: DOC_URLS.CYBER_HAND_STYLE_GUIDE }
    ]
  },
  
  // File size issues
  fileSize: {
    severity: SEVERITY.WARNING,
    title: 'File exceeds size limit',
    message: 'Files should be under 500 lines to maintain modularity.',
    recommendation: 'Refactor the file into smaller, focused components or utilities.',
    docLinks: [
      { name: 'Next.js App Architecture', url: DOC_URLS.NEXTJS_SERVER_COMPONENTS },
      { name: 'Cyber Hand Architecture', url: DOC_URLS.CYBER_HAND_ARCHITECTURE }
    ]
  },
  
  // Server/Client Component issues
  serverComponentWithBrowserAPI: {
    severity: SEVERITY.ERROR,
    title: 'Browser API in Server Component',
    message: 'Server Components cannot use browser APIs like window or document.',
    recommendation: 'Move browser API usage to a Client Component with "use client" directive.',
    docLinks: [
      { name: 'Next.js Server Components', url: DOC_URLS.NEXTJS_SERVER_COMPONENTS },
      { name: 'Next.js Client Components', url: DOC_URLS.NEXTJS_CLIENT_COMPONENTS }
    ]
  },
  
  clientComponentWithoutDirective: {
    severity: SEVERITY.ERROR,
    title: 'Missing "use client" directive',
    message: 'Components using client-side features must have the "use client" directive.',
    recommendation: 'Add "use client" directive at the top of the file.',
    docLinks: [
      { name: 'Next.js Client Components', url: DOC_URLS.NEXTJS_CLIENT_COMPONENTS }
    ]
  },
  
  // Suspense boundaries
  missingSuspenseBoundary: {
    severity: SEVERITY.WARNING,
    title: 'Missing Suspense boundary',
    message: 'Data fetching should be wrapped with Suspense boundaries in Next.js 15.',
    recommendation: 'Wrap components that fetch data with <Suspense fallback={...}>.',
    docLinks: [
      { name: 'Next.js Loading UI and Streaming', url: DOC_URLS.NEXTJS_SUSPENSE }
    ]
  },
  
  // React hooks issues
  hookRules: {
    severity: SEVERITY.ERROR,
    title: 'Hook rules violation',
    message: 'React hooks must be called at the top level of a component.',
    recommendation: 'Move the hook to the top level of the component and don\'t call hooks inside loops, conditions, or nested functions.',
    docLinks: [
      { name: 'React Hooks Rules', url: DOC_URLS.REACT_HOOKS }
    ]
  },
  
  // Supabase issues
  supabaseClientInServerComponent: {
    severity: SEVERITY.ERROR,
    title: 'Supabase client in Server Component',
    message: 'Supabase client should be used in a separate data access function in Server Components.',
    recommendation: 'Create a dedicated async function for data fetching using Supabase, and use React\'s cache() for deduplication.',
    docLinks: [
      { name: 'Next.js Caching', url: DOC_URLS.NEXTJS_CACHING },
      { name: 'Supabase Server Component Usage', url: DOC_URLS.SUPABASE_TYPESCRIPT }
    ]
  },
  
  // Error boundaries
  missingErrorBoundary: {
    severity: SEVERITY.WARNING,
    title: 'Missing Error Boundary',
    message: 'Critical components should be wrapped with Error Boundaries to prevent cascading failures.',
    recommendation: 'Create an ErrorBoundary component and wrap important sections of your application.',
    docLinks: [
      { name: 'React Error Boundaries', url: DOC_URLS.REACT_ERROR_BOUNDARY }
    ]
  }
};

/**
 * Generates an actionable recommendation for a style issue
 * @param {string} issueType - The type of issue identified
 * @param {object} issueDetails - Details about the issue (location, code snippet, etc.)
 * @returns {object} A formatted recommendation object
 */
function generateRecommendation(issueType, issueDetails = {}) {
  // Get the base recommendation for this issue type
  const baseRecommendation = ISSUE_RECOMMENDATIONS[issueType] || {
    severity: SEVERITY.INFO,
    title: 'Style issue',
    message: 'An unspecified style issue was detected.',
    recommendation: 'Review the code for potential improvements.',
    docLinks: []
  };
  
  // Create a formatted recommendation
  const recommendation = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: issueType,
    severity: baseRecommendation.severity,
    title: baseRecommendation.title,
    message: baseRecommendation.message,
    recommendation: baseRecommendation.recommendation,
    docLinks: baseRecommendation.docLinks,
    location: {
      file: issueDetails.file || '',
      line: issueDetails.line || 0,
      column: issueDetails.column || 0,
      snippet: issueDetails.snippet || ''
    },
    timestamp: new Date().toISOString()
  };
  
  return recommendation;
}

/**
 * Categorizes issues by severity
 * @param {Array} issues - The list of issues to categorize
 * @returns {object} Issues grouped by severity
 */
function categorizeIssuesBySeverity(issues) {
  const categorized = {
    errors: [],
    warnings: [],
    info: []
  };
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case SEVERITY.ERROR:
        categorized.errors.push(issue);
        break;
      case SEVERITY.WARNING:
        categorized.warnings.push(issue);
        break;
      default:
        categorized.info.push(issue);
    }
  });
  
  return categorized;
}

/**
 * Generates a summary report of issues
 * @param {Array} issues - The list of issues to summarize
 * @returns {string} A formatted summary
 */
function generateSummaryReport(issues) {
  const categorized = categorizeIssuesBySeverity(issues);
  
  return `
# Style Validation Report

## Summary
- ${categorized.errors.length} errors
- ${categorized.warnings.length} warnings
- ${categorized.info.length} informational items

## Next Steps
${categorized.errors.length > 0 ? '- Fix all errors to ensure proper functionality' : '- No critical errors found!'}
${categorized.warnings.length > 0 ? '- Address warnings to improve code quality' : '- No warnings found!'}
${issues.length > 0 ? '- See detailed recommendations for each issue below' : '- Code follows Cyber Hand style guidelines!'}
  `;
}

module.exports = {
  SEVERITY,
  DOC_URLS,
  ISSUE_RECOMMENDATIONS,
  generateRecommendation,
  categorizeIssuesBySeverity,
  generateSummaryReport
};
