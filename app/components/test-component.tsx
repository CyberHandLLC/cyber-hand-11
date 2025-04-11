/**
 * Test component for MCP orchestration validation
 * 
 * This component demonstrates Cyber Hand's Next.js 15.2.4/React 19 principles including:
 * - Server Component for data fetching with proper caching
 * - Client Component only at leaf nodes
 * - Suspense boundaries for streaming
 * - TypeScript interfaces for type safety
 * - Optimized data fetching with concurrent requests
 * - Custom loading UI with spinners following shadcn/ui principles
 * 
 * @module components/test-component
 */

import { cache } from 'react'
import { Suspense } from 'react'
// Import client component using dynamic import with Next.js pattern
import dynamic from 'next/dynamic'
// Dynamic loader components only - no static imports needed

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
const _TestComponentContent = dynamic<{data: Array<TestDataItem>}>(() => 
  import('./test-component-content-client').then(mod => mod.TestComponentContent), {
    ssr: true,
    loading: () => <TestComponentSkeleton />
  }
)

// Import client loading wrapper with dynamic import to avoid SSR issues
const LoadingWrapperClient = dynamic(() => import('../components/ui/client/loading-wrapper-client').then(mod => mod.LoadingWrapperClient), {
  ssr: true
})

/**
 * Data fetching function using React's cache() for deduplication
 * This improves performance by caching results and preventing duplicate requests
 */
const getTestData = cache(async () => {
  // Logging removed per Cyber Hand standards (only warn/error allowed)
  // Simulate data fetching delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    { id: '1', title: 'First Test Item' },
    { id: '2', title: 'Second Test Item' },
    { id: '3', title: 'Third Test Item' },
  ]
})

/**
 * Secondary data fetching function to demonstrate concurrent requests
 */
const getAdditionalData = cache(async () => {
  // Logging removed per Cyber Hand standards (only warn/error allowed)
  // Shorter delay to demonstrate different loading times
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return { lastUpdated: new Date().toISOString() }
})

/**
 * Function to fetch multiple data sources concurrently
 * This optimizes loading time by running requests in parallel
 */
const getAllTestData = cache(async () => {
  // Use Promise.all to fetch data concurrently rather than sequentially
  const [testData, additionalData] = await Promise.all([
    getTestData(),
    getAdditionalData()
  ])
  
  return { testData, additionalData }
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
/**
 * SmallAsyncComponent - demonstrates smaller component with controlled loading time
 * This helps visualize the effect of different loading durations
 */
async function SmallAsyncComponent({ delay = 800 }: { delay?: number } = {}) {
  // Simulate data loading with configurable delay
  await new Promise(resolve => setTimeout(resolve, delay))
  
  return (
    <div className="rounded border border-gray-200 p-4 h-32 flex items-center justify-center">
      <p className="text-center">Loaded after {delay}ms delay</p>
    </div>
  )
}

/**
 * Main TestComponent that demonstrates the improved loading states
 * Shows multiple Suspense boundaries with different loading indicators
 */
export default async function TestComponent() {
  // Fetch all data concurrently for optimal loading performance
  const { testData, additionalData } = await getAllTestData()
  
  return (
    <section className="space-y-8 p-4">
      <h1 className="text-2xl font-bold">Optimized Loading States</h1>
      <p className="text-gray-600">This component demonstrates improved loading UX with custom spinners</p>
      
      {/* Main data component with spinner loading state */}
      <Suspense fallback={<TestComponentSkeleton />}>
        <AsyncDataComponent testData={testData} additionalData={additionalData} />
      </Suspense>
      
      {/* Additional example components with different loading states */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Suspense fallback={
          <div className="w-full h-32">
            {/* We know the component accepts these props but TypeScript can't verify at compile time */}
            <LoadingWrapperClient 
              height="h-32"
              label="Loading component 1..."
              spinnerSize={20}
            />
          </div>
        }>
          <SmallAsyncComponent />
        </Suspense>
        
        <Suspense fallback={
          <div className="w-full h-32">
            {/* We know the component accepts these props but TypeScript can't verify at compile time */}
            <LoadingWrapperClient
              height="h-32"
              label="Loading component 2..."
              spinnerSize={20}
            />
          </div>
        }>
          <SmallAsyncComponent delay={1500} />
        </Suspense>
      </div>
    </section>
  )
}

/**
 * AsyncDataComponent - demonstrates server component with optimized data fetching
 * Uses Promise.all pattern to fetch multiple data sources concurrently
 */
async function AsyncDataComponent({ 
  testData, 
  additionalData 
}: { 
  testData: TestDataItem[], 
  additionalData: { lastUpdated: string } 
}) {
  return (
    <div className="rounded border border-gray-200 p-4 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Test Component Data</h2>
      <p className="text-sm text-gray-500 mb-4">Last updated: {additionalData.lastUpdated}</p>
      <ul className="space-y-2">
        {testData.map(item => (
          <li key={item.id} className="p-2 bg-gray-50 rounded">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
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
    <div className="w-full max-w-lg mx-auto">
      {/* We know the component accepts these props but TypeScript can't verify at compile time */}
      <LoadingWrapperClient 
        height="h-64" 
        label="Loading test data..." 
        spinnerSize={32}
      />
    </div>
  )
}
