/**
 * SharedHeader Component - Server Component
 * 
 * This component provides a persistent header across page navigations
 * following Next.js 15.2.4 best practices and Cyber Hand's principles.
 * 
 * @module components/ui/shared-header
 */

import Image from 'next/image';
import { cache } from 'react';
import { NavigationLink } from './navigation-link';

// Type-safe site navigation data
interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

/**
 * Cache the navigation data to prevent unnecessary re-rendering
 * following Cyber Hand Principle 2: Follow Next.js 15.2.4 Data Flow Patterns
 */
const getNavigationItems = cache((): NavigationItem[] => {
  return [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Resources', href: '/resources' },
    { label: 'Contact', href: '/contact' },
    { label: 'Get Started', href: '/get-started' }
  ];
});

export function SharedHeader() {
  const navigationItems = getNavigationItems();
  
  return (
    <header className="fixed w-full top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and branding */}
        <NavigationLink 
          href="/"
          className="relative flex items-center"
          prefetch={true}
          exactMatch={true}
        >
          <Image
            src="/images/cyberhand-logo.png"
            alt="CyberHand Logo"
            width={40}
            height={40}
            className="mr-2"
            priority={true}
          />
          <span className="font-orbitron text-lg font-bold text-white">CyberHand</span>
        </NavigationLink>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.href}
              href={item.href}
              className="text-gray-300 hover:text-white font-medium transition-colors"
              activeClassName="text-cyan-400 font-semibold"
              prefetch={true}
              isExternal={item.isExternal}
              ariaLabel={`Navigate to ${item.label}`}
            >
              {item.label}
            </NavigationLink>
          ))}
        </nav>
        
        {/* Mobile menu button - would be implemented as a client component */}
        <div className="md:hidden">
          <button 
            className="text-gray-300 hover:text-white" 
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
