'use client'

/**
 * Client component for TestComponent
 * 
 * Extracted to its own file following Next.js 15.2.4 best practices and
 * Cyber Hand's principle of maintaining strict component boundaries.
 */

import { useState } from 'react'

/**
 * Props interface for TestComponentContent
 * Following Cyber Hand's principle of complete type safety with
 * proper TypeScript interfaces instead of 'any'
 */
interface TestComponentContentProps {
  data: Array<{ id: string; title: string }>
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
  const [selected, setSelected] = useState<string | null>(null)
  
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
  )
}
