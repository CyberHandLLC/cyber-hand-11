/**
 * Mock Empty Module
 * 
 * This file provides empty mock implementations for problematic imports
 * during build time. It allows Next.js to build without failing on imports
 * that are only needed for testing or development purposes.
 */

// Default export as empty object
module.exports = {};

// Common exports that might be imported
module.exports.fetchProductData = () => Promise.resolve({});
module.exports.fetchUserData = () => Promise.resolve({});
module.exports.default = {};

// Mock React component
module.exports.TestComponent = () => null;
module.exports.ProductCard = () => null;
