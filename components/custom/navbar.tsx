"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { Button as _Button } from "@/components/ui/button";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement } from "@/lib/animation-utils";
import { MenuIcon, XIcon, MoonIcon, SunIcon } from "@/components/ui/icons";

// Define reusable types
type NavItem = {
  path: string;
  label: string;
};

// Define reusable styled components
type NavLinkProps = {
  href: string;
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  mobile?: boolean;
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => pathname === path;
  
  // Navigation items array to avoid repetition
  const navigationItems: NavItem[] = [
    { path: '/services', label: 'Services' },
    { path: '/case-studies', label: 'Case Studies' },
    { path: '/resources', label: 'Resources' },
    { path: '/contact', label: 'Contact' },
  ];
  
  // NavLink component to avoid repetition
  const NavLink = ({ href, active, onClick, children, className = "", mobile = false }: NavLinkProps) => {
    // Get theme styles based on mobile vs desktop
    const activeStyle = getThemeStyle(mobile ? 'nav-link-active' : 'nav-link-active', theme);
    const inactiveStyle = getThemeStyle(mobile ? 'nav-link-inactive' : 'nav-link-inactive', theme);
    const baseStyle = mobile 
      ? "block py-2 px-4 rounded-md text-sm font-medium transition-colors"
      : "text-sm font-medium transition-colors";
    
    return (
      <Link 
        href={href} 
        className={`${baseStyle} ${active ? activeStyle : inactiveStyle} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  };
  
  // Theme toggle button component to avoid repetition
  const ThemeToggleButton = ({ className = "" }) => (
    <button 
      onClick={toggleTheme}
      className={`toggle-theme-button ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon size="sm" />
      ) : (
        <SunIcon size="sm" />
      )}
    </button>
  );
  
  // Login/Sign Up buttons
  const AuthButtons = () => (
    <div className="flex items-center">
      <Link href="/login" className="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-colors mr-2">
        Log In
      </Link>
      <Link href="/signup" className="px-5 py-2 rounded-full text-sm font-medium bg-white hover:bg-gray-100 text-gray-900 transition-colors">
        Sign up
      </Link>
    </div>
  );
  
  // Logo component
  const Logo = () => (
    <Link href="/" className="flex items-center" onClick={closeMenu}>
      <div className="w-8 h-8 grid place-items-center">
        <div className="flex flex-wrap gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    </Link>
  );
  
  return (
    <AnimatedElement
      animation="fadeInDown"
      className="fixed top-4 left-0 right-0 z-50 flex justify-center"
    >
      <nav className="flex items-center rounded-full px-4 py-2 backdrop-blur-md bg-black/30 border border-gray-700/30 shadow-xl">
        {/* Logo/Brand */}
        <div className="flex items-center pr-4">
          <Logo />
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 mr-6">
          {navigationItems.map((item) => (
            <NavLink 
              key={item.path}
              href={item.path} 
              active={isActive(item.path)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon size="md" /> : <MenuIcon size="md" />}
          </button>
        </div>
        
        {/* Auth Buttons */}
        <div className="hidden md:block ml-auto">
          <AuthButtons />
        </div>
        
        {/* Theme toggle button */}
        <div className="ml-4">
          <ThemeToggleButton />
        </div>
      </nav>
      
      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={closeMenu}></div>
          <div className="absolute top-20 left-0 right-0 mx-auto w-11/12 max-w-sm rounded-lg bg-gray-900 shadow-lg">
            <div className="p-4 space-y-4">
              {navigationItems.map((item) => (
                <NavLink 
                  key={item.path}
                  href={item.path} 
                  active={isActive(item.path)}
                  onClick={closeMenu}
                  mobile={true}
                >
                  {item.label}
                </NavLink>
              ))}
              
              <div className="pt-4 border-t border-gray-700">
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedElement>
  );
}
