/**
 * Test component for MCP orchestration validation
 * 
 * This component demonstrates Cyber Hand's Next.js 15.2.4/React 19 principles including:
 * - Server Component for data fetching with proper caching
 * - Client Component only at leaf nodes
 * - Suspense boundaries for streaming
 * - TypeScript interfaces for type safety
 * 
 * @module components/test-component
 */

import { cache } from 'react'
import { Suspense } from 'react'
// Import client component using dynamic import with Next.js pattern
import dynamic from 'next/dynamic'

/**
 * TypeScript interface for test data items
 * Following Cyber Hand's Principle 3: Enforce Complete Type Safety
 */
export interface TestDataItem {
  id: string;
  title: string;
}

/**
 * Dynamic import of client component following Next.js 15.2.4 best practices
 * This enforces strict component boundaries (Principle 1) by keeping
 * interactive components as leaf nodes
 */
const TestComponentContent = dynamic<{data: Array<TestDataItem>}>(() => 
  import('./test-component-content-client').then(mod => mod.TestComponentContent), {
    ssr: true,
    loading: () => <TestComponentSkeleton />
  }
)

/**
 * Data fetching function using React's cache() for deduplication
 * 
 * Follows Next.js 15.2.4 patterns with explicit opt-in caching
 * using revalidation time and cache tags for invalidation
 * 
 * @returns {Promise<Array<{id: string, title: string}>>} Fetched data array
 */
const fetchData = cache(async () => {
  // Simulated data fetch with proper Next.js 15.2.4 patterns
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60, tags: ['test-data'] }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
})

/**
 * Server Component for data fetching and rendering
 * 
 * Implements parallel data fetching with proper Suspense boundary
 * to enable streaming in Next.js 15.2.4. Follows the architecture
 * pattern of keeping data fetching in Server Components.
 * 
 * @returns {Promise<JSX.Element>} A server-rendered component with proper suspense boundaries
 */
export default async function TestComponent() {
  // Proper parallel data fetching
  const data = await fetchData()
  
  return (
    <section className="test-component">
      <h2>Test Component</h2>
      <Suspense fallback={<TestComponentSkeleton />}>
        <TestComponentContent data={data} />
      </Suspense>
    </section>
  )
}

/**
 * Skeleton component for loading state in Suspense boundary
 * 
 * Implements recommended skeleton loader pattern from Cyber Hand guidelines
 * to maintain good UX during streaming/loading. Uses animate-pulse for 
 * visual indication of loading state.
 * 
 * @returns {JSX.Element} Skeleton UI placeholder that matches content structure
 */
function TestComponentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}


