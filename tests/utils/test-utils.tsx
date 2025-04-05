/**
 * Test Utilities
 * 
 * This file provides common utilities and helper functions for testing.
 * It follows the testing & reliability requirements for the project.
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock theme provider wrapper
const MockThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Custom render function that wraps components with necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MockThemeProvider>{children}</MockThemeProvider>
    ),
    ...options,
  });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method with custom render
export { customRender as render };
