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
  import('@/app/components/test-component-content-client').then(mod => mod.TestComponentContent), {
    ssr: true,
    loading: () => <TestComponentSkeleton />
  }
)

/**
 * Data fetching functions using React's cache() for deduplication
 * Each function separated to allow parallel data fetching and streaming
 * Following Cyber Hand Principle 2: Follow Next.js 15.2.4 Data Flow Patterns
 */
const getData1 = cache(async () => {
  // Simulate primary data fetch (1 second)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { id: '1', title: 'Section 1 - Item A' },
    { id: '2', title: 'Section 1 - Item B' },
  ];
});

const getData2 = cache(async () => {
  // Simulate secondary data fetch (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    { id: '3', title: 'Section 2 - Item C' },
    { id: '4', title: 'Section 2 - Item D' },
  ];
});

/**
 * Combined data fetch for client component
 * Uses Promise.all for parallel fetching per Cyber Hand principles
 */
const getCombinedData = cache(async () => {
  // Fetch data in parallel using Promise.all
  const [data1, data2] = await Promise.all([
    getData1(),
    getData2()
  ]);
  
  return [...data1, ...data2];
});

/**
 * Server Component for data fetching and rendering
 * 
 * Implements parallel data fetching with proper Suspense boundary
 * to enable streaming in Next.js 15.2.4. Follows the architecture
 * pattern of keeping data fetching in Server Components.
 * 
 * @returns {Promise<JSX.Element>} A server-rendered component with proper suspense boundaries
 */
export default function TestComponent() {
  return (
    <div className="bg-slate-900 p-6 rounded-lg shadow-lg contain-card">
      <h2 className="text-xl font-bold mb-4 text-white">Test Component</h2>
      <p className="text-gray-300 mb-4">
        This component demonstrates proper Server/Client component separation and data fetching.
      </p>
      
      {/* More strategic Suspense boundary using separate data streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First data section with its own Suspense boundary */}
        <Suspense fallback={<DataSectionSkeleton />}>
          <DataSection1 />
        </Suspense>
        
        {/* Second data section with its own Suspense boundary */}
        <Suspense fallback={<DataSectionSkeleton />}>
          <DataSection2 />
        </Suspense>
      </div>
      
      {/* Client component with its own Suspense boundary */}
      <Suspense fallback={<TestComponentSkeleton />}>
        <TestComponentContentWrapper />
      </Suspense>
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
    <div className="animate-pulse mt-4 pt-4 border-t border-gray-800">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
  );
}

/**
 * Loading skeleton for data sections
 */
function DataSectionSkeleton() {
  return (
    <div className="animate-pulse bg-gray-800 p-3 rounded-lg">
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-10 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-10 bg-gray-700 rounded w-full"></div>
    </div>
  );
}

/**
 * DataSection1 Component - Server Component with its own data fetch
 * This follows the Next.js 15.2.4 data fetching pattern with proper streaming
 */
async function DataSection1() {
  // Fetch data using the cache function
  const data = await getData1();
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-3">Section 1</h3>
      <ul className="space-y-2">
        {data.map(item => (
          <li key={item.id} className="p-2 bg-gray-700 rounded text-gray-200">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * DataSection2 Component - Server Component with its own data fetch
 * This allows content to stream in as it becomes available
 */
async function DataSection2() {
  // Fetch data using the cache function
  const data = await getData2();
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-3">Section 2</h3>
      <ul className="space-y-2">
        {data.map(item => (
          <li key={item.id} className="p-2 bg-gray-700 rounded text-gray-200">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * TestComponentContentWrapper - Wrapper for client component with combined data
 * This ensures proper data fetching separation from UI rendering
 */
async function TestComponentContentWrapper() {
  // Fetch combined data for the client component
  const combinedData = await getCombinedData();
  
  return (
    <div className="mt-6 pt-4 border-t border-gray-800">
      <h3 className="text-lg font-medium text-white mb-3">Interactive Content</h3>
      <TestComponentContent data={combinedData} />
    </div>
  );
}
