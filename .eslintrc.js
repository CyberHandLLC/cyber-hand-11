/**
 * ESLint Configuration for Cyber Hand
 *
 * Configured for Next.js 15.2.4 with TypeScript and React Server Components
 * - Extends Next.js recommended config
 * - Adds support for AMP-specific properties
 * - Enforces TypeScript best practices
 */

module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    // Allow AMP-specific props
    "react/no-unknown-property": [
      "off",
      {
        ignore: ["amp-custom", "custom-element", "layout", "sizing"],
      },
    ],

    // Enforce TypeScript best practices
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],

    // Performance recommendations
    "@next/next/no-img-element": "warn",

    // Code quality
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "warn",
  },
  ignorePatterns: [".next/", "node_modules/", "public/"],
};
