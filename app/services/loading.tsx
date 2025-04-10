/**
 * Services Page Loading UI Component
 *
 * This component provides a skeleton UI for the services page
 * while the main content is streaming in. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function ServicesLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero section with title */}
      <div className="container px-4 max-w-7xl mx-auto pt-20 lg:pt-28 text-center">
        <div className="h-10 bg-gradient-to-r from-gray-200/30 to-gray-400/20 rounded-lg mx-auto mb-6 w-1/2 max-w-md animate-pulse"></div>
        <div className="h-5 bg-gray-300/20 rounded mx-auto mb-4 w-2/3 max-w-2xl animate-pulse"></div>
        <div className="h-5 bg-gray-300/20 rounded mx-auto mb-16 w-1/2 max-w-xl animate-pulse"></div>
      </div>

      <div className="container px-4 max-w-7xl mx-auto">
        {/* Service Cards Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-800/30 bg-gray-900/30 p-6 h-96 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Card icon placeholder */}
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 mb-4"></div>

              {/* Title placeholder */}
              <div className="h-6 bg-gray-200/30 rounded mb-3 w-3/4"></div>

              {/* Description placeholder */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-300/20 rounded w-full"></div>
                <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300/20 rounded w-4/5"></div>
              </div>

              {/* Features placeholders */}
              <div className="space-y-2 mb-8">
                <div className="h-4 bg-gray-300/20 rounded w-full"></div>
                <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300/20 rounded w-4/5"></div>
              </div>

              {/* Price placeholder */}
              <div className="h-8 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-lg w-1/2 mx-auto mb-4"></div>

              {/* Button placeholder */}
              <div className="h-10 bg-cyan-500/30 rounded-md w-full"></div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel Placeholder */}
        <div className="md:hidden flex overflow-x-hidden">
          <div className="w-full rounded-xl border border-gray-800/30 bg-gray-900/30 p-6 h-96 animate-pulse">
            {/* Card icon placeholder */}
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 mb-4"></div>

            {/* Title placeholder */}
            <div className="h-6 bg-gray-200/30 rounded mb-3 w-3/4"></div>

            {/* Description placeholder */}
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-300/20 rounded w-full"></div>
              <div className="h-4 bg-gray-300/20 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300/20 rounded w-4/5"></div>
            </div>

            {/* Carousel controls placeholder */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-600/50"></div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center p-8 rounded-xl border border-gray-800/30 bg-gray-900/30">
          <div className="h-8 bg-gray-200/30 rounded mx-auto mb-4 w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-300/20 rounded mx-auto mb-2 w-full max-w-lg animate-pulse"></div>
          <div className="h-4 bg-gray-300/20 rounded mx-auto mb-6 w-2/3 max-w-md animate-pulse"></div>
          <div className="h-12 bg-cyan-500/30 rounded-lg w-32 mx-auto"></div>
        </div>

        {/* Back link placeholder */}
        <div className="text-center mt-10 pb-10">
          <div className="h-8 bg-gray-700/20 rounded-lg w-28 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
