/**
 * Server Component Template
 *
 * This template is for creating new React Server Components in Next.js.
 * Server Components run only on the server and can fetch data directly.
 *
 * Usage:
 * 1. Copy this template to components/your-component-folder/
 * 2. Rename the file and component according to your needs
 * 3. Implement the component logic and UI
 *
 * Note: Server components cannot:
 * - Use hooks (useState, useEffect, etc.)
 * - Add event listeners (onClick, onChange, etc.)
 * - Use browser-only APIs
 * - Use Context (directly)
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Define component props with TypeScript
interface ServerComponentTemplateProps {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * ServerComponentTemplate - A template for React Server Components
 *
 * @param props - Component properties
 * @returns JSX element
 */
export default async function ServerComponentTemplate({
  title,
  description,
  className,
  children,
}: ServerComponentTemplateProps) {
  // Server-side data fetching example (no useEffect needed)
  // This code only runs on the server, never in the browser
  const data = await fetchSampleData();

  return (
    <div className={cn("server-component", className)}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {description && <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>}

      {/* Example of using server-fetched data */}
      {data && (
        <div className="server-data-container">
          <h3 className="text-lg font-semibold">Server Data</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Render children passed to the component */}
      <div className="component-children-container mt-4">{children}</div>
    </div>
  );
}

/**
 * Example data fetching function - replace with your actual data source
 * Since this runs on the server, you can connect directly to databases,
 * APIs, etc. without exposing credentials to the client
 *
 * NEXT.JS DATA FETCHING BEST PRACTICES:
 * 1. Use React's cache() to deduplicate requests
 * 2. Use parallel data fetching when possible
 * 3. Implement proper error handling
 * 4. Consider streaming responses for large datasets
 *
 * Example with fetch caching:
 * import { cache } from 'react'
 *
 * export const getDataById = cache(async (id: string) => {
 *   const res = await fetch(`https://api.example.com/data/${id}`)
 *   return res.json()
 * })
 */
async function fetchSampleData() {
  try {
    // Use fetch with Next.js automatic request deduplication
    // const res = await fetch('https://api.example.com/data', { next: { revalidate: 3600 } })
    // if (!res.ok) throw new Error('Failed to fetch data')
    // return res.json()

    // This is just a placeholder
    return {
      id: 1,
      message: "This data was fetched on the server",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately
    return null;
  }
}
