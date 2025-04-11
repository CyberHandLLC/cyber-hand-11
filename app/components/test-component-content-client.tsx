'use client';

/**
 * Client Component for Test Component
 * 
 * This file contains the client-side component with interactivity.
 * Following Cyber Hand's principles of keeping client components at leaf nodes
 * and proper separation of client/server components.
 * 
 * @module components/test-component-content-client
 */

import { useState } from 'react';

/**
 * Data item interface for type safety across components
 * Following Cyber Hand's Principle 3: Enforce Complete Type Safety
 */
export interface TestDataItem {
  id: string;
  title: string;
}

/**
 * Props interface for TestComponentContent
 * Following Cyber Hand's principle of complete type safety with
 * proper TypeScript interfaces instead of 'any'
 */
export interface TestComponentContentProps {
  data: Array<TestDataItem>
}

/**
 * Client Component for interactive elements only (leaf node)
 * 
 * Follows Cyber Hand's principle of putting 'use client' directive
 * only in components that require interactivity. Keeps client
 * components at leaf nodes of the component tree for optimal performance.
 * 
 * @param {TestComponentContentProps} props - Component props with data array
 * @returns {JSX.Element} Interactive client-rendered component
 */
export function TestComponentContent({ data }: TestComponentContentProps) {
  // Client-side state for interactivity
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <div className="test-component-content">
      <ul>
        {data.map((item) => (
          <li 
            key={item.id}
            className={selected === item.id ? 'selected' : ''}
            onClick={() => setSelected(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
