"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => pathname === path;
  
  // Theme-based styles with transparent background
  const navBgClass = theme === 'light' 
    ? "bg-transparent backdrop-blur-sm border-b border-gray-200/30" 
    : "bg-transparent backdrop-blur-sm border-b border-gray-800/30";
    
  const navLinkActiveClass = theme === 'light'
    ? 'text-black bg-white/20'
    : 'text-white bg-black/20';
    
  const navLinkClass = theme === 'light'
    ? 'text-gray-800 hover:text-black'
    : 'text-gray-200 hover:text-white';
    
  const hamburgerClass = theme === 'light'
    ? 'text-gray-800 hover:text-black'
    : 'text-gray-200 hover:text-white';
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand name instead of logo as requested */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl" onClick={closeMenu}>
              CyberHand
            </Link>
          </div>
          
          {/* Mobile menu button - 48px touch target for mobile */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center w-12 h-12 rounded-md ${hamburgerClass} focus:outline-none`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link 
              href="/services" 
              className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/services') ? navLinkActiveClass : navLinkClass}`}
            >
              Services
            </Link>
            <Link 
              href="/case-study" 
              className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/case-study') ? navLinkActiveClass : navLinkClass}`}
            >
              Case Study
            </Link>
            <Link 
              href="/resources" 
              className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/resources') ? navLinkActiveClass : navLinkClass}`}
            >
              Resources
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/contact') ? navLinkActiveClass : navLinkClass}`}
            >
              Contact
            </Link>
            
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme}
              className={`ml-4 p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-200'}`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                </svg>
              )}
            </button>
            
            {/* Get Started button */}
            <Button
              variant="primary"
              size="sm"
              className="ml-4"
              onClick={() => window.location.href = '/get-started'}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 ${theme === 'light' ? 'bg-white border-t border-gray-200' : 'bg-[#1a2c38] border-t border-gray-800'}`}>
            <Link 
              href="/services" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/services') ? navLinkActiveClass : navLinkClass}`}
              onClick={closeMenu}
            >
              Services
            </Link>
            <Link 
              href="/case-study" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/case-study') ? navLinkActiveClass : navLinkClass}`}
              onClick={closeMenu}
            >
              Case Study
            </Link>
            <Link 
              href="/resources" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/resources') ? navLinkActiveClass : navLinkClass}`}
              onClick={closeMenu}
            >
              Resources
            </Link>
            <Link 
              href="/contact" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? navLinkActiveClass : navLinkClass}`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            
            <div className="flex items-center justify-between px-3 py-2">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-200'}`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  closeMenu();
                  window.location.href = '/get-started';
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
