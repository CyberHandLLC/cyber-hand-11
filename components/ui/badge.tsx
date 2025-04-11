/**
 * Badge Component
 *
 * A reusable badge component with various style variants
 * for displaying tags, status indicators, or categories.
 *
 * Following Cyber Hand Project Rules:
 * - TypeScript return type annotations
 * - Placed in the /ui/ directory for better organization
 * - Reusable across the application
 */

import { ReactNode, ButtonHTMLAttributes, ReactElement } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Badge component for displaying tags, categories, or status indicators
 *
 * @param {BadgeProps} props - Component properties
 * @returns {ReactElement} Rendered badge component
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps): ReactElement {
  // Base classes for all badges
  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors";

  // Size-specific classes
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  // Variant-specific classes
  const variantClasses = {
    default: "bg-gray-800/80 text-gray-100 hover:bg-gray-800",
    primary: "bg-blue-600/80 text-white hover:bg-blue-700/90",
    secondary: "bg-gray-900/60 text-gray-200 hover:bg-gray-800/80",
    outline: "bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-900/40",
    ghost: "bg-transparent text-gray-300 hover:bg-gray-900/30 hover:text-gray-100",
  };

  // Combine all classes
  const badgeClasses = twMerge(baseClasses, sizeClasses[size], variantClasses[variant], className);

  return (
    <button className={badgeClasses} type="button" {...props}>
      {children}
    </button>
  );
}
