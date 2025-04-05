"use client";

/**
 * Client Component Template
 * 
 * This template is for creating new React Client Components in Next.js.
 * Client Components include the "use client" directive and can use all React features.
 * 
 * Usage:
 * 1. Copy this template to components/your-component-folder/
 * 2. Rename the file and component according to your needs
 * 3. Implement the component logic and UI
 * 
 * Note: Client components should be used only when you need:
 * - Interactivity (event handlers, state, effects)
 * - Browser-only APIs
 * - Custom hooks
 * - React context
 */

import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

// Define component props with TypeScript
interface ClientComponentTemplateProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

/**
 * ClientComponentTemplate - A template for React Client Components
 * 
 * @param props - Component properties
 * @returns JSX element
 */
export default function ClientComponentTemplate({
  initialValue = "",
  onChange,
  className,
  children,
}: ClientComponentTemplateProps) {
  // Example of using React state
  const [value, setValue] = useState(initialValue);
  const { theme } = useTheme();
  
  // Example of using side effects
  useEffect(() => {
    // This code only runs in the browser, never on the server
    console.log("Component mounted with theme:", theme);
    
    // Optional cleanup function
    return () => {
      console.log("Component unmounted");
    };
  }, [theme]);
  
  // Example of handling user interaction
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Notify parent component if onChange handler was provided
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Get theme-specific styles
  const containerStyle = theme === "dark" 
    ? "bg-gray-800 text-white" 
    : "bg-white text-gray-800";
  
  return (
    <div className={cn("client-component p-4 rounded-lg", containerStyle, className)}>
      <h2 className="text-2xl font-bold mb-4">Interactive Client Component</h2>
      
      {/* Example of handling user input */}
      <div className="mb-4">
        <label htmlFor="interactive-input" className="block mb-2">
          Interactive Input:
        </label>
        <input
          id="interactive-input"
          type="text"
          value={value}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md text-black"
          placeholder="Type something..."
        />
        
        {value && (
          <p className="mt-2">
            Current value: <strong>{value}</strong>
          </p>
        )}
      </div>
      
      {/* Render children passed to the component */}
      <div className="component-children-container mt-4">
        {children}
      </div>
    </div>
  );
}
