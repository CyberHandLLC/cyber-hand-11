/**
 * Get Started Page Loading UI Component
 * 
 * This component provides a skeleton UI for the get-started page
 * while the main content is streaming in. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function GetStartedLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container px-4">
        <div className="rounded-xl p-8 w-full max-w-md mx-auto border border-gray-800/30 bg-[#161e29]/30 backdrop-blur-sm cyber-shadow-md">
          {/* Header placeholder */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200/30 rounded-lg mx-auto mb-2 w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-300/20 rounded mx-auto w-56 animate-pulse"></div>
          </div>
          
          {/* Form placeholders */}
          <div className="space-y-4">
            {/* Name field placeholder */}
            <div>
              <div className="h-4 bg-cyan-400/20 rounded mb-1 w-24 animate-pulse"></div>
              <div className="h-12 bg-gray-900/50 border border-gray-700/50 rounded w-full animate-pulse"></div>
            </div>
            
            {/* Email field placeholder */}
            <div>
              <div className="h-4 bg-cyan-400/20 rounded mb-1 w-16 animate-pulse"></div>
              <div className="h-12 bg-gray-900/50 border border-gray-700/50 rounded w-full animate-pulse"></div>
            </div>
            
            {/* Password field placeholder */}
            <div>
              <div className="h-4 bg-cyan-400/20 rounded mb-1 w-20 animate-pulse"></div>
              <div className="h-12 bg-gray-900/50 border border-gray-700/50 rounded w-full animate-pulse"></div>
            </div>
            
            {/* Button placeholder */}
            <div className="h-12 bg-cyan-500/30 rounded w-full mt-6 animate-pulse"></div>
          </div>
          
          {/* Toggle link placeholder */}
          <div className="text-center mt-8">
            <div className="h-4 bg-cyan-400/20 rounded mx-auto w-48 animate-pulse"></div>
          </div>
          
          {/* Back link placeholder */}
          <div className="text-center mt-6">
            <div className="h-8 bg-gray-700/20 rounded-lg w-28 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
