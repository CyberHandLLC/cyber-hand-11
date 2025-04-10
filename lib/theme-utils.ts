/**
 * Theme utilities for centralized styling based on theme
 */

// Theme type definition
export type Theme = "light" | "dark";

// Reusable theme style patterns
interface ThemeStyleSet {
  light: string;
  dark: string;
}

// Defines all theme-based style variations used across the app
const themeStyles: Record<string, ThemeStyleSet> = {
  // Background styles
  "bg-primary": {
    light: "bg-white",
    dark: "bg-[#161e29]",
  },
  "bg-secondary": {
    light: "bg-gray-50",
    dark: "bg-[#0c1117]",
  },
  "bg-card": {
    light: "bg-white border border-gray-200 hover:border-cyan-400",
    dark: "bg-[#161e29] border border-gray-800 hover:border-cyan-400",
  },
  "bg-accent": {
    light: "bg-cyan-100",
    dark: "bg-cyan-900/50",
  },

  // Text styles
  "text-primary": {
    light: "text-gray-900",
    dark: "text-white",
  },
  "text-secondary": {
    light: "text-gray-600",
    dark: "text-gray-300",
  },
  "text-muted": {
    light: "text-gray-400",
    dark: "text-gray-600",
  },
  "text-accent": {
    light: "text-cyan-800",
    dark: "text-cyan-300",
  },

  // Button styles
  "button-primary": {
    light: "bg-cyan-500 text-white hover:bg-cyan-600",
    dark: "bg-cyan-600 text-white hover:bg-cyan-700",
  },
  "button-secondary": {
    light: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    dark: "bg-gray-800 text-white hover:bg-gray-700",
  },
  "button-outline": {
    light: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    dark: "border border-gray-700 text-gray-300 hover:bg-gray-800",
  },

  // Interactive element styles
  "nav-link-active": {
    light: "text-cyan-700 font-medium",
    dark: "text-white font-medium",
  },
  "nav-link-inactive": {
    light: "text-gray-600 hover:text-cyan-700",
    dark: "text-gray-400 hover:text-white",
  },
  badge: {
    light: "bg-cyan-100 text-cyan-800",
    dark: "bg-cyan-900/50 text-cyan-300",
  },
};

/**
 * Gets the appropriate theme-based style for the given component
 * @param styleKey - The key for the style in the themeStyles object
 * @param theme - The current theme ('light' or 'dark')
 * @returns The theme-specific CSS classes
 */
export function getThemeStyle(styleKey: string, theme: Theme): string {
  if (!themeStyles[styleKey]) {
    console.warn(`Theme style '${styleKey}' not found`);
    return "";
  }

  return themeStyles[styleKey][theme];
}

/**
 * Conditionally applies theme styles with fallback for custom classes
 * @param styleKey - The key for the style in the themeStyles object
 * @param theme - The current theme ('light' or 'dark')
 * @param fallback - Fallback style to use if theme style is not found
 * @returns The theme-specific CSS classes or fallback
 */
export function applyThemeStyle(
  styleKey: string,
  theme: Theme,
  fallback?: { light: string; dark: string }
): string {
  if (themeStyles[styleKey]) {
    return themeStyles[styleKey][theme];
  }

  if (fallback) {
    return fallback[theme];
  }

  return "";
}

/**
 * Creates a theme-aware style function that automatically applies the current theme
 * @param theme - The current theme ('light' or 'dark')
 * @returns A function that gets styles for the current theme
 */
export function createThemeStyler(theme: Theme) {
  return (styleKey: string, fallback?: { light: string; dark: string }): string => {
    return applyThemeStyle(styleKey, theme, fallback);
  };
}
