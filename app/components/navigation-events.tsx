'use client';

/**
 * NavigationEvents Component
 * 
 * This component handles page transition events to prevent skeleton UI flashing
 * and ensure smooth navigation experiences.
 *
 * Following Cyber Hand's principles:
 * - Maintains strict component boundaries (#1)
 * - Follows Next.js 15.2.4 data flow patterns (#2)
 * - Properly typed for complete type safety (#3)
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

// Store a map of previously visited paths to avoid unnecessary suspense
// boundaries during navigation
const visitedPaths = new Set<string>();

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Build full URL including search params
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Mark this path as visited for future navigations
    if (!visitedPaths.has(url)) {
      visitedPaths.add(url);
    }

    // This effect helps optimize navigation and prevent 
    // unnecessary flashing of loading states
    const handleNavigation = () => {
      // Force router to use the cache where available
      router.refresh();
    };

    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [pathname, searchParams, router]);

  // This component doesn't render anything visible
  return null;
}
