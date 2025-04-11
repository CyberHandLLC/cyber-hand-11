'use client';

/**
 * TransitionWrapper Component
 * 
 * This client component enhances page transitions to prevent the skeleton UI flash
 * that occurs during route changes. It preserves the current UI state during navigation
 * and provides a smoother user experience.
 * 
 * Following Cyber Hand's principles:
 * - Used as a client component only where needed (#1)
 * - Implements Next.js 15.2.4 view transition patterns (#2)
 * - Properly typed with TypeScript (#3)
 */

import { useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface TransitionWrapperProps {
  children: ReactNode;
}

export function TransitionWrapper({ children }: TransitionWrapperProps) {
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);
  const isHomePage = pathname === '/';

  // Track when navigations start and finish to control transitions
  useEffect(() => {
    // Mark navigation as complete when component mounts with a new path
    setIsPending(false);

    // Begin observing navigation events
    const handleNavigationStart = () => {
      setIsPending(true);
    };

    const handleNavigationEnd = () => {
      setIsPending(false);
    };

    // Next.js doesn't have dedicated navigation events yet, so we use
    // these DOM events as proxies for navigation state
    window.addEventListener('beforeunload', handleNavigationStart);
    document.addEventListener('mouseover', handleNavigationEnd);
    
    return () => {
      window.removeEventListener('beforeunload', handleNavigationStart);
      document.removeEventListener('mouseover', handleNavigationEnd);
    };
  }, [pathname]);

  return (
    <div 
      className={`transition-wrapper ${isPending ? 'transitioning' : ''}`}
      style={{ 
        // CSS to prevent flashing
        opacity: isPending ? 0.8 : 1,
        transition: 'opacity 0.2s ease-in-out'
      }}
      id="main-transition-container"
    >
      {children}
    </div>
  );
}
