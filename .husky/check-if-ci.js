// This script checks if the current environment is a CI environment
// If it is, it will throw an error to prevent husky from being installed

// Check for common CI environment variables
const isCI = 
  process.env.CI === 'true' || 
  process.env.CONTINUOUS_INTEGRATION === 'true' ||
  process.env.VERCEL === '1' ||
  process.env.NETLIFY === 'true' ||
  process.env.GITHUB_ACTIONS === 'true' ||
  process.env.GITLAB_CI === 'true' ||
  process.env.CIRCLECI === 'true' ||
  process.env.TRAVIS === 'true';

if (isCI) {
  console.log('CI environment detected, skipping husky setup');
  process.exit(1); // Exit with error to trigger the fallback
} else {
  console.log('Development environment detected, proceeding with husky setup');
  process.exit(0); // Exit normally to continue husky setup
}
