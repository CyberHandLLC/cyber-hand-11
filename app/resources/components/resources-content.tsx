"use client";

/**
 * Resources Content Component
 * 
 * Client-side component that handles interactive elements of the resources page.
 */

import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement } from "@/lib/animation-utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export function ResourcesContent() {
  const { theme } = useTheme();
  
  // List of upcoming resources
  const upcomingResources = [
    "Digital Marketing Guides & Templates",
    "Web Development Best Practices",
    "SEO Strategy Workbooks",
    "Social Media Content Calendars",
    "Conversion Rate Optimization Checklists"
  ];
  
  return (
    <div className="max-w-3xl mx-auto text-center">
      <AnimatedElement animation="fadeInUp" delay={0.1}>
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
          Resources Coming Soon
        </h1>
        
        <div className="mb-8 w-24 h-1 bg-cyan-500 mx-auto"></div>
        
        <p className={`text-lg md:text-xl mb-8 ${getThemeStyle('text-secondary', theme)}`}>
          We&#39;re building a comprehensive library of resources to help you excel in digital marketing and web development.
        </p>
        
        <div className="rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm p-8 mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">What&apos;s Coming</h2>
          </div>
          
          <div className="space-y-3 text-left">
            {upcomingResources.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                </div>
                <p className={getThemeStyle('text-secondary', theme)}>{item}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className={`text-sm italic mb-4 ${getThemeStyle('text-secondary', theme)}`}>
              Want to be notified when our resources are available?
            </p>
            
            <Link href="/contact">
              <Button 
                variant="primary" 
                size="lg"
                className="px-6"
              >
                Contact Us
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedElement>
      
      <AnimatedElement animation="fadeIn" delay={0.4}>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/services"
            className="inline-flex items-center bg-black/40 border border-gray-700/30 hover:border-cyan-500/50 px-4 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            Explore Our Services
          </Link>
          
          <Link 
            href="/case-studies"
            className="inline-flex items-center bg-black/40 border border-gray-700/30 hover:border-cyan-500/50 px-4 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            View Case Studies
          </Link>
        </div>
      </AnimatedElement>
    </div>
  );
}
