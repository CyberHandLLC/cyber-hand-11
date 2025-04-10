/**
 * Contact Page Loading UI Component
 *
 * This component provides a skeleton UI for the contact page
 * while the main content is streaming in. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function ContactLoading() {
  return (
    <div className="py-24 md:py-32 px-4">
      {/* Header skeleton */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-48 mx-auto mb-6"></div>
          <div className="w-24 h-1 bg-cyan-500/30 mx-auto mb-8"></div>
          <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4 mx-auto mb-12"></div>
        </div>

        {/* Two column layout for form and contact info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact form skeleton */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-700/50 p-8 bg-gray-900/30">
              {/* Form fields skeleton */}
              <div className="space-y-6">
                {/* Name field */}
                <div>
                  <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-20 mb-2"></div>
                  <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
                </div>

                {/* Email field */}
                <div>
                  <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-16 mb-2"></div>
                  <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
                </div>

                {/* Subject field */}
                <div>
                  <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-24 mb-2"></div>
                  <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
                </div>

                {/* Message field */}
                <div>
                  <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-28 mb-2"></div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
                </div>

                {/* Submit button */}
                <div className="h-12 bg-cyan-500/30 rounded animate-pulse w-40"></div>
              </div>
            </div>
          </div>

          {/* Contact information skeleton */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-700/50 p-6 bg-gray-900/30">
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-36 mb-6"></div>

              {/* Reasons list */}
              <div className="space-y-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="h-4 w-4 bg-cyan-500/30 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-5/6"></div>
                  </div>
                ))}
              </div>

              {/* Contact info items */}
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-32 mb-4"></div>
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="h-10 w-10 bg-gray-800 rounded-full mr-4 flex-shrink-0"></div>
                    <div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-16 mb-2"></div>
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
