/**
 * Homepage Loading UI Component
 * 
 * This component provides a skeleton UI for the homepage
 * while the main content is streaming in. It leverages Next.js 15's built-in
 * loading.js pattern for route-level loading states.
 */

export default function HomeLoading() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-circuit-bg">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      
      {/* Content container with loading animation */}
      <div className="relative z-20 px-4 py-16 sm:px-6 lg:px-8 w-full max-w-4xl text-center">
        {/* Logo placeholder */}
        <div className="w-48 h-16 bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse"></div>
        
        {/* Headline placeholder */}
        <div className="h-16 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-lg mx-auto mb-8 w-3/4 max-w-2xl animate-pulse"></div>
        
        {/* Subtitle placeholder */}
        <div className="h-6 bg-gray-700 rounded mx-auto mb-8 w-1/2 max-w-md animate-pulse"></div>
        
        {/* Button placeholders */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <div className="w-32 h-12 bg-cyan-500/40 rounded animate-pulse"></div>
          <div className="w-32 h-12 bg-gray-700/50 border border-gray-600 rounded animate-pulse"></div>
        </div>
        
        {/* Circuit effect placeholders */}
        <div className="absolute inset-0 z-5 opacity-30 pointer-events-none">
          {/* Using Tailwind's built-in animations */}
          <div className="absolute h-px w-20 bg-cyan-500/20 animate-pulse" 
               style={{ top: '20%', left: '10%', transform: 'rotate(45deg)' }}></div>
          <div className="absolute h-px w-40 bg-cyan-500/20 animate-pulse" 
               style={{ top: '40%', left: '25%', transform: 'rotate(45deg)' }}></div>
          <div className="absolute h-px w-32 bg-cyan-500/20 animate-pulse" 
               style={{ top: '60%', left: '15%', transform: 'rotate(45deg)' }}></div>
          <div className="absolute h-px w-24 bg-cyan-500/20 animate-pulse" 
               style={{ top: '80%', left: '30%', transform: 'rotate(45deg)' }}></div>
          
          {/* Glowing dots using existing Tailwind animations */}
          <div className="absolute h-2 w-2 rounded-full bg-cyan-400/30 animate-pulse-glow"
               style={{ top: '30%', right: '20%' }}></div>
          <div className="absolute h-2 w-2 rounded-full bg-cyan-400/30 animate-pulse-glow-2"
               style={{ top: '50%', right: '35%' }}></div>
          <div className="absolute h-2 w-2 rounded-full bg-cyan-400/30 animate-pulse-glow"
               style={{ top: '70%', right: '25%' }}></div>
        </div>
      </div>
    </div>
  );
}
