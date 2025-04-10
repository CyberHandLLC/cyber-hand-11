/**
 * Mock for the theme context
 *
 * This mock provides default implementations of the theme context hooks and functions
 * for use in testing environments.
 */

const useTheme = jest.fn().mockReturnValue({
  theme: "dark",
  setTheme: jest.fn(),
  isDarkTheme: true,
  isLightTheme: false,
  isSystemTheme: false,
});

const ThemeProvider = ({ children }) => children;

module.exports = {
  useTheme,
  ThemeProvider,
};
