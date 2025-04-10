/**
 * Test Pattern Validator
 *
 * Validates that test files follow Next.js 15.2.4/React 19 testing best practices
 * Ensures proper test coverage for Server Components, Client Components, and API routes
 */

const fs = require("fs");
const path = require("path");

/**
 * Validate that test files correctly test React 19 and Next.js 15.2.4 features
 * @param {string} testFilePath - Path to the test file
 * @param {string} content - Content of the test file
 * @returns {Object} Validation results with errors and warnings
 */
function validateTestPatterns(testFilePath, content) {
  const errors = [];
  const warnings = [];

  // Determine what's being tested by analyzing the file path
  const isServerComponentTest = testFilePath.includes("/app/") && !testFilePath.includes("client");
  const isClientComponentTest =
    testFilePath.includes("client") || testFilePath.includes("/components/");
  const isApiRouteTest = testFilePath.includes("/api/") || testFilePath.includes("route");

  // Check for proper testing libraries
  const hasVitest =
    content.includes("vitest") || content.includes("expect(") || content.includes("describe(");
  const hasReactTesting = content.includes("@testing-library/react") || content.includes("render(");
  const hasJest = content.includes("jest");
  const hasFetchMock =
    content.includes("fetch-mock") || content.includes("jest.mock") || content.includes("vi.mock");

  // Server Component Test validations
  if (isServerComponentTest) {
    // Ensure proper server component testing patterns for Next.js 15
    if (!content.includes("generateMetadata") && content.includes("metadata")) {
      warnings.push(
        "Server Component tests should validate metadata generation if the component uses it"
      );
    }

    if (content.includes("await") && !content.includes("expect") && !content.includes("assert")) {
      warnings.push("Server Component test has async code but lacks assertions on the result");
    }

    // Check for data fetching mocks
    if ((content.includes("fetch(") || content.includes("supabase")) && !hasFetchMock) {
      errors.push(
        "Server Component with data fetching needs proper fetch/Supabase mocking in tests"
      );
    }

    // Check for cache() testing
    if (content.includes("cache(") && !content.includes("mock") && !content.includes("spy")) {
      warnings.push("Tests for components using cache() should verify caching behavior");
    }
  }

  // Client Component Test validations
  if (isClientComponentTest) {
    // Ensure client components are tested with React Testing Library
    if (!hasReactTesting) {
      warnings.push("Client Component tests should use React Testing Library for DOM interactions");
    }

    // Check for event handling tests
    if (
      (content.includes("onClick") || content.includes("onChange")) &&
      !content.includes("fireEvent") &&
      !content.includes("user.")
    ) {
      warnings.push("Client Component with event handlers should test user interactions");
    }

    // Check for React 19 hooks testing
    if (content.includes("useTransition") && !content.includes("act(")) {
      errors.push("Tests for components using useTransition should wrap state updates in act()");
    }

    // Check for Suspense testing
    if (
      content.includes("Suspense") &&
      !content.includes("suspense") &&
      !content.includes("waitFor")
    ) {
      warnings.push(
        "Tests for components with Suspense should use waitFor or similar to test loading states"
      );
    }
  }

  // API Route Test validations
  if (isApiRouteTest) {
    // Check for proper request/response testing
    if (!content.includes("Request") || !content.includes("response")) {
      errors.push("API route tests should validate Request and Response objects");
    }

    // Check for auth testing if auth appears to be used
    if (
      (content.includes("auth") || content.includes("session")) &&
      !content.includes("mockSession") &&
      !content.includes("auth.")
    ) {
      warnings.push("API route with authentication should mock auth/session state in tests");
    }

    // Check for Supabase RLS testing
    if (
      content.includes("supabase") &&
      !content.includes("mockUser") &&
      !content.includes("auth.userId")
    ) {
      warnings.push("Tests for API routes using Supabase should mock RLS context");
    }
  }

  // General test structure validations
  if (!content.includes("describe(") && !content.includes("test(") && !content.includes("it(")) {
    warnings.push("Tests should use describe/test/it blocks for better organization");
  }

  if (content.includes("test(") && !content.includes("expect(") && !content.includes("assert")) {
    errors.push("Test contains test blocks but no assertions");
  }

  // Check for proper assertion count
  const assertionMatches = content.match(/expect\(/g) || [];
  if (assertionMatches.length < 1 && content.includes("test(")) {
    warnings.push("Tests should include multiple assertions to thoroughly validate behavior");
  }

  return { errors, warnings };
}

/**
 * Validate test coverage for a component or feature
 * @param {string} componentPath - Path to the component being tested
 * @param {Array<string>} testFiles - Array of paths to test files for this component
 * @returns {Object} Coverage validation results
 */
function validateTestCoverage(componentPath, testFiles) {
  const errors = [];
  const warnings = [];

  // No test files found
  if (testFiles.length === 0) {
    warnings.push(`No test files found for ${componentPath}`);
    return { errors, warnings };
  }

  // Read component to determine what should be tested
  try {
    const componentContent = fs.readFileSync(componentPath, "utf8");

    // Check if key areas are covered by tests
    const hasDataFetching =
      componentContent.includes("fetch(") ||
      componentContent.includes("supabase") ||
      componentContent.includes("api");

    const hasInteractivity =
      componentContent.includes("onClick") ||
      componentContent.includes("onChange") ||
      componentContent.includes("useState");

    const hasSuspense = componentContent.includes("Suspense");

    const hasFormHandling =
      componentContent.includes("<form") || componentContent.includes("onSubmit");

    // Count test files that cover each area
    let dataFetchingTestCount = 0;
    let interactivityTestCount = 0;
    let suspenseTestCount = 0;
    let formHandlingTestCount = 0;

    for (const testFile of testFiles) {
      const testContent = fs.readFileSync(testFile, "utf8");

      if (
        testContent.includes("fetch") ||
        testContent.includes("mock") ||
        testContent.includes("api")
      ) {
        dataFetchingTestCount++;
      }

      if (
        testContent.includes("click") ||
        testContent.includes("change") ||
        testContent.includes("fireEvent")
      ) {
        interactivityTestCount++;
      }

      if (
        testContent.includes("Suspense") ||
        testContent.includes("waitFor") ||
        testContent.includes("loading")
      ) {
        suspenseTestCount++;
      }

      if (testContent.includes("form") || testContent.includes("submit")) {
        formHandlingTestCount++;
      }
    }

    // Check coverage
    if (hasDataFetching && dataFetchingTestCount === 0) {
      warnings.push(`Component has data fetching but no tests cover this functionality`);
    }

    if (hasInteractivity && interactivityTestCount === 0) {
      warnings.push(`Component has interactive elements but no tests for user interactions`);
    }

    if (hasSuspense && suspenseTestCount === 0) {
      warnings.push(`Component uses Suspense but loading states are not tested`);
    }

    if (hasFormHandling && formHandlingTestCount === 0) {
      warnings.push(`Component has form handling but form submission is not tested`);
    }
  } catch (error) {
    errors.push(`Error analyzing test coverage: ${error.message}`);
  }

  return { errors, warnings };
}

/**
 * Find all test files for a given component
 * @param {string} componentPath - Path to the component
 * @param {string} testRoot - Root directory for tests
 * @returns {Array<string>} Array of test file paths
 */
function findTestFilesForComponent(componentPath, testRoot = "__tests__") {
  const testFiles = [];
  const componentName = path.basename(componentPath, path.extname(componentPath));

  try {
    // Common test file patterns
    const patterns = [
      `${componentName}.test.tsx`,
      `${componentName}.test.ts`,
      `${componentName}.spec.tsx`,
      `${componentName}.spec.ts`,
    ];

    // Look in component directory
    const componentDir = path.dirname(componentPath);
    for (const pattern of patterns) {
      const testPath = path.join(componentDir, pattern);
      if (fs.existsSync(testPath)) {
        testFiles.push(testPath);
      }
    }

    // Look in __tests__ directory next to component
    const testDir = path.join(componentDir, testRoot);
    if (fs.existsSync(testDir)) {
      for (const pattern of patterns) {
        const testPath = path.join(testDir, pattern);
        if (fs.existsSync(testPath)) {
          testFiles.push(testPath);
        }
      }
    }

    // Look in dedicated tests directory structure (if exists)
    const projectRoot = process.cwd();
    const testDirectory = path.join(projectRoot, testRoot);

    if (fs.existsSync(testDirectory)) {
      // Get component's relative path to project
      const relativeComponentPath = path.relative(projectRoot, componentPath);
      const relativeDir = path.dirname(relativeComponentPath);

      // Look for test that matches structure
      const mirroredTestDir = path.join(testDirectory, relativeDir);
      if (fs.existsSync(mirroredTestDir)) {
        for (const pattern of patterns) {
          const testPath = path.join(mirroredTestDir, pattern);
          if (fs.existsSync(testPath)) {
            testFiles.push(testPath);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error finding test files: ${error.message}`);
  }

  return testFiles;
}

module.exports = {
  validateTestPatterns,
  validateTestCoverage,
  findTestFilesForComponent,
};
