"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

// Base input styles that match the cyber aesthetic
const baseInputStyles =
  "w-full rounded border bg-black/30 backdrop-blur-sm text-white/90 focus:outline-none focus:border-cyan-500/70 transition-all duration-200";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    const { theme } = useTheme();
    const borderColor = theme === "dark" ? "border-gray-700/50" : "border-gray-600/30";

    return (
      <div className="mb-4">
        {label && <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>}
        <input
          className={cn(
            baseInputStyles,
            borderColor,
            "px-4 py-2",
            error ? "border-red-500/70" : borderColor,
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    const { theme } = useTheme();
    const borderColor = theme === "dark" ? "border-gray-700/50" : "border-gray-600/30";

    return (
      <div className="mb-4">
        {label && <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>}
        <textarea
          className={cn(
            baseInputStyles,
            borderColor,
            "px-4 py-2 min-h-[120px] resize-y",
            error ? "border-red-500/70" : borderColor,
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className }) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};
