/**
 * Documentation Validator MCP Server Index
 * 
 * Exports the main functionality of the documentation validator:
 * - Freshness checking (comparing doc update times to code changes)
 * - Consistency validation (terminology, references, etc.)
 * - Best practices adherence (architectural principles, technical accuracy)
 * - Coverage analysis (identifying undocumented components/features)
 */

const freshness = require('./validators/freshness');
const consistency = require('./validators/consistency');
const bestPractices = require('./validators/best-practices');
const coverage = require('./validators/coverage');
const server = require('./standalone-server');

module.exports = {
  // Server
  server,
  
  // Main validation functions
  validateDocumentation: server.validateDocumentation,
  documentationExists: server.documentationExists,
  
  // Individual validators
  validators: {
    freshness: {
      analyzeFreshness: freshness.analyzeFreshness,
      checkDocumentationFreshness: freshness.checkDocumentationFreshness,
      compareWithGitHistory: freshness.compareWithGitHistory,
      validateFreshness: server.validateFreshness
    },
    consistency: {
      analyzeConsistency: consistency.analyzeConsistency,
      validateTerminology: consistency.validateTerminology,
      validateLinks: consistency.validateLinks,
      validateCodeExamples: consistency.validateCodeExamples,
      validateConsistency: server.validateConsistency
    },
    bestPractices: {
      analyzeBestPractices: bestPractices.analyzeBestPractices,
      validateArchitecturalPrinciples: bestPractices.validateArchitecturalPrinciples,
      validateTechnicalAccuracy: bestPractices.validateTechnicalAccuracy,
      validateAccessibilityGuidelines: bestPractices.validateAccessibilityGuidelines,
      CYBER_HAND_PRINCIPLES: bestPractices.CYBER_HAND_PRINCIPLES,
      NEXTJS_CONCEPTS: bestPractices.NEXTJS_CONCEPTS,
      validateBestPractices: server.validateBestPractices
    },
    coverage: {
      analyzeCoverage: coverage.analyzeCoverage,
      identifyUndocumentedAreas: coverage.identifyUndocumentedAreas,
      generateCoverageReport: coverage.generateCoverageReport,
      REQUIRED_DOCUMENTATION_CATEGORIES: coverage.REQUIRED_DOCUMENTATION_CATEGORIES,
      validateCoverage: server.validateCoverage
    }
  }
};
