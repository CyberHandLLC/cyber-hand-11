/**
 * Case Studies Loading UI Component
 * 
 * This component provides a skeleton UI for the case studies page
 * while the main content is loading. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function CaseStudiesLoading() {
  return (
    <div className="py-24 px-4 md:px-6">
      {/* Static header placeholder */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-4 w-1/2 mx-auto"></div>
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4 mx-auto"></div>
      </div>
      
      {/* Filter placeholder */}
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8"></div>
      
      {/* Grid placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
