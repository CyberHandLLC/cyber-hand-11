/**
 * Resources Page Loading UI Component
 *
 * This component provides a skeleton UI for the resources page
 * while the main content is streaming in. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function ResourcesLoading() {
  return (
    <div className="py-24 md:py-32">
      <div className="container px-4 max-w-5xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title placeholder */}
          <div className="h-12 bg-gradient-to-r from-gray-200/30 to-gray-400/20 rounded-lg mx-auto mb-6 w-3/4 max-w-lg animate-pulse"></div>

          {/* Divider placeholder */}
          <div className="mb-8 w-24 h-1 bg-cyan-500/30 mx-auto"></div>

          {/* Subtitle placeholder */}
          <div className="h-6 bg-gray-300/20 rounded mx-auto mb-4 w-5/6 animate-pulse"></div>
          <div className="h-6 bg-gray-300/20 rounded mx-auto mb-8 w-4/5 animate-pulse"></div>

          {/* Box container placeholder */}
          <div className="rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm p-8 mb-12">
            {/* Box header */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200/30 rounded w-40 animate-pulse"></div>
            </div>

            {/* Grid items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 mt-1 mr-3 animate-pulse"></div>
                  <div className="h-5 bg-gray-300/20 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Call to action placeholder */}
            <div className="text-center mt-8">
              <div className="h-4 bg-gray-300/20 rounded mx-auto mb-4 w-64 animate-pulse"></div>
              <div className="h-10 bg-cyan-500/30 rounded-md w-40 mx-auto animate-pulse"></div>
            </div>
          </div>

          {/* Bottom links placeholder */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="h-10 w-40 rounded-md bg-black/40 border border-gray-700/30 animate-pulse"></div>
            <div className="h-10 w-40 rounded-md bg-black/40 border border-gray-700/30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
