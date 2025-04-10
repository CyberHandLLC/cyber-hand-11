/**
 * Jest configuration file
 *
 * This configuration file sets up Jest for testing React components with Next.js.
 * It includes appropriate transformers for TypeScript and module name mapping
 * to handle Next.js imports and path aliases.
 */

const nextJest = require("next/jest");

// Providing the path to your Next.js app to load next.config.js and .env files
const createJestConfig = nextJest({
  dir: "./",
});

// Jest configuration object
const customJestConfig = {
  // Setup files to run before each test
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "<rootDir>/coverage",

  // Collect coverage from these directories
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],

  // Module name mapper to handle CSS imports and path aliases
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": "<rootDir>/__mocks__/fileMock.js",

    // Handle path aliases (same as in tsconfig.json)
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Directories to ignore when searching for tests
  modulePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],

  // Transform TypeScript files
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },

  // Additional resolver options
  // This ensures that test paths are properly resolved
  moduleDirectories: ["node_modules", "<rootDir>"],
};

// createJestConfig is exported to allow async loading, export directly if you uncomment the line below
module.exports = createJestConfig(customJestConfig);
