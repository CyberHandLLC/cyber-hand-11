/**
 * Case Study Detail Loading UI Component
 *
 * This component provides a skeleton UI for the case study detail page
 * while content is streaming in. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function CaseStudyDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header placeholder */}
      <div className="mb-10">
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-6 w-3/4"></div>
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8 w-1/2"></div>
      </div>

      {/* Hero image placeholder */}
      <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-10 w-full"></div>

      {/* Content placeholders */}
      <div className="space-y-4 mb-16">
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-4/5"></div>
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4"></div>
      </div>

      {/* Stats section placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-1/3"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-2"></div>
          </div>
        ))}
      </div>

      {/* Related case studies placeholder */}
      <div className="mt-16">
        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-8 w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-48 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
