"use client";

/**
 * ServicesCTA Component
 * 
 * Client-side component that handles call-to-action section in the services page.
 * Provides interactive navigation to contact page and home page.
 */

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

export function ServicesCTA() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Theme-based styling for text and card elements
  const textClass = theme === 'light'
    ? "text-gray-800"
    : "text-white";
    
  const subtitleClass = theme === 'light'
    ? "text-gray-600"
    : "text-gray-300";
    
  const ctaCardClass = theme === 'light' 
    ? 'bg-white shadow-xl' 
    : 'bg-gray-900/50 border border-gray-800';

  return (
    <>
      {/* CTA Section */}
      <div 
        className={`mt-20 text-center p-8 rounded-xl ${ctaCardClass}`}
      >
        <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${textClass}`}>Need a custom solution?</h2>
        <p className={`${subtitleClass} max-w-2xl mx-auto mb-6`}>
          We can create a tailored package that perfectly fits your business needs and budget.
        </p>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => router.push('/contact')}
          className="px-8"
        >
          Contact Us
        </Button>
      </div>
      
      {/* Back link */}
      <div className="text-center mt-10 pb-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </div>
    </>
  );
}
