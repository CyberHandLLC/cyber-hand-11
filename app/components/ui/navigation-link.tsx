'use client';

/**
 * Navigation Link Component with prefetching
 * 
 * Optimized link component that prefetches pages on hover to reduce
 * perceived loading times during navigation.
 * 
 * Following Cyber Hand's Core Principles: Performance Requirements
 * 
 * @module components/ui/navigation-link
 */

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exactMatch?: boolean;
  onClick?: () => void;
  prefetch?: boolean;
  ariaLabel?: string;
  isExternal?: boolean;
}

export function NavigationLink({
  href,
  children,
  className = '',
  activeClassName = 'text-cyan-400',
  exactMatch = false,
  onClick,
  prefetch = true,
  ariaLabel,
  isExternal = false,
}: NavigationLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine if this link is for the active page
  const isActive = exactMatch 
    ? pathname === href
    : pathname.startsWith(href) && href !== '/'; // Prevent '/' from matching everything
  
  // Combine classes based on active state
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();
  
  // Handle prefetching on hover/focus
  const handlePrefetch = () => {
    if (prefetch && !isExternal) {
      router.prefetch(href);
    }
  };
  
  // Handle click with any custom onClick handler
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    
    // Apply the transitioning-out class to the main content
    const mainContent = document.querySelector('.page-transition-container');
    if (mainContent && !isExternal) {
      e.preventDefault();
      mainContent.classList.add('page-transitioning-out');
      
      // Navigate after animation completes
      setTimeout(() => {
        router.push(href);
      }, 200); // Match the fadeOut animation duration
    }
  };
  
  // For external links, use regular anchor tags
  if (isExternal) {
    return (
      <a
        href={href}
        className={combinedClassName}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  
  // For internal navigation, use Next.js Link with prefetching
  return (
    <Link 
      href={href} 
      className={combinedClassName}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
