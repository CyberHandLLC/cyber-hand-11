/**
 * Architecture Guard Rule Configuration
 *
 * This file defines the architecture validation rules for the CyberHand project
 * based on Next.js 15.2.4/React 19 best practices and project requirements.
 */

module.exports = {
  // Component naming conventions
  componentNaming: {
    // Client components should have -client suffix or be in /ui/ directory
    clientComponentNaming: {
      enabled: true,
      patterns: [{ suffix: "-client", directories: ["app"] }, { directories: ["components/ui"] }],
      severity: "warning",
    },
    // Server components shouldn't have client-specific patterns
    serverComponentRestrictions: {
      enabled: true,
      patterns: [{ noPrefix: "use", noSuffix: "-client" }],
      severity: "error",
    },
  },

  // Component organization rules
  componentOrganization: {
    // Maximum lines per file
    maxLinesPerFile: {
      enabled: true,
      limit: 500,
      severity: "warning",
    },
    // Components must be properly exported
    exportRules: {
      enabled: true,
      requireNamedOrDefaultExport: true,
      severity: "warning",
    },
  },

  // React/Next.js best practices
  reactPatterns: {
    // useEffect must have dependency array and cleanup function
    effectHooks: {
      enabled: true,
      requireDependencyArray: true,
      requireCleanupForEmptyDeps: true,
      severity: "warning",
    },
    // Suspense boundaries should be wrapped with error boundaries
    suspenseBoundaries: {
      enabled: true,
      requireErrorBoundary: true,
      severity: "warning",
    },
    // No using document/window in server components
    browserAPIs: {
      enabled: true,
      restrictInServerComponents: true,
      severity: "error",
    },
  },

  // Import/dependency rules
  dependencyRules: {
    // Restrict importing server components in client components
    restrictedImports: {
      enabled: true,
      patterns: [
        {
          source: "*/components/(?!.*-client).*",
          target: "*/components/*-client*",
          severity: "error",
        },
      ],
    },
    // Restrict using Next.js Server-only in client components
    serverOnlyImports: {
      enabled: true,
      severity: "error",
    },
  },

  // Security practices
  securityRules: {
    // No hardcoded secrets or API keys
    hardcodedSecrets: {
      enabled: true,
      patterns: [
        {
          pattern: "(api[_-]?key|secret|password|token).*['\"][a-zA-Z0-9_\\-]{20,}['\"]",
          severity: "error",
        },
      ],
    },
    // Use environment variables properly
    environmentVariables: {
      enabled: true,
      enforceNaming: true,
      severity: "warning",
    },
  },

  // Style and formatting rules (as architecture/structural concerns)
  structuralStyle: {
    // Consistent use of semicolons
    semicolons: {
      enabled: true,
      severity: "warning",
    },
    // Limit line length
    lineLength: {
      enabled: true,
      maxLength: 100,
      severity: "warning",
    },
    // Require type annotations for functions
    typeAnnotations: {
      enabled: true,
      requireForFunctions: true,
      severity: "warning",
    },
  },

  // Next.js 15 specific rules
  nextjsRules: {
    // Properly use Next.js' streaming patterns
    streamingPatterns: {
      enabled: true,
      requireSuspenseBoundaries: true,
      severity: "warning",
    },
    // Use React's cache() for deduplication
    cacheDeduplication: {
      enabled: true,
      severity: "warning",
    },
    // Separate UI components from data fetching
    separateDataFetching: {
      enabled: true,
      severity: "warning",
    },
  },
};
