"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { ServiceCard } from "./service-card";
import { type ServiceProps } from "@/data/services";
import { useSwipeable } from "react-swipeable"; // Will be added to package.json if not already there

interface ServiceCarouselProps {
  services: ServiceProps[];
  onSelectService: (id: string) => void;
}

// Type definitions for child components
interface NavigationButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
  theme: string;
}

interface PaginationIndicatorsProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  theme: string;
}

/**
 * Navigation button component for carousel
 */
const NavigationButton = ({ direction, onClick, disabled, theme }: NavigationButtonProps) => {
  const isPrev = direction === 'prev';
  const buttonClass = isPrev 
    ? `w-12 h-12 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-white shadow-md' : 'bg-gray-800'} ${disabled ? 'opacity-50' : ''}`
    : `w-12 h-12 rounded-full flex items-center justify-center bg-cyan-500 text-white shadow-md ${disabled ? 'opacity-50' : ''}`;

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      aria-label={isPrev ? "Previous service" : "Next service"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={isPrev ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
        />
      </svg>
    </button>
  );
};

/**
 * Pagination indicators component for carousel
 */
const PaginationIndicators = ({ total, activeIndex, onSelect, theme }: PaginationIndicatorsProps) => {
  return (
    <div className="flex justify-center space-x-2 mt-4 px-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-cyan-500' : `w-2.5 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`} touch-manipulation`}
          aria-label={`Go to service ${index + 1}`}
        />
      ))}
    </div>
  );
};

/**
 * ServiceCarousel component for displaying services in a mobile-friendly carousel
 */
export function ServiceCarousel({ services, onSelectService }: ServiceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { theme } = useTheme();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Scroll to specific card by index with improved handling
  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    
    setIsTransitioning(true);
    const cardElements = carouselRef.current.getElementsByClassName('service-card-container');
    if (cardElements.length > index) {
      const card = cardElements[index] as HTMLElement;
      
      carouselRef.current.scrollTo({
        left: card.offsetLeft - 16, // Account for padding
        behavior: 'smooth'
      });
      
      // Clear transitioning state after animation completes
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };
  
  // Navigation handlers
  const scrollToPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      scrollToCard(activeIndex - 1);
    }
  };
  
  const scrollToNext = () => {
    if (activeIndex < services.length - 1) {
      setActiveIndex(activeIndex + 1);
      scrollToCard(activeIndex + 1);
    }
  };
  
  // Handler for pagination indicator selection
  const handleIndicatorSelect = (index: number) => {
    if (isTransitioning) return; // Prevent interaction during transition
    setActiveIndex(index);
    scrollToCard(index);
  };
  
  // Set up swipe handlers for touch devices
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isTransitioning && scrollToNext(),
    onSwipedRight: () => !isTransitioning && scrollToPrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
    trackTouch: true,
  });
  
  // Handle scroll events to update active index based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current || isTransitioning) return;
      
      const scrollLeft = carouselRef.current.scrollLeft;
      const containerWidth = carouselRef.current.offsetWidth;
      const approxIndex = Math.round(scrollLeft / containerWidth);
      
      if (approxIndex !== activeIndex && approxIndex >= 0 && approxIndex < services.length) {
        setActiveIndex(approxIndex);
      }
    };
    
    const ref = carouselRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [services.length, activeIndex, isTransitioning]);
  
  // Component render
  return (
    <div className="relative" {...swipeHandlers}>
      <div 
        ref={carouselRef}
        className="overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory -mx-4 px-4"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="flex space-x-4 sm:space-x-6 py-2">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`flex-shrink-0 w-[85%] sm:w-[80%] snap-center service-card-container ${
                index === activeIndex ? 'scale-100' : 'scale-95 opacity-75'
              }`}
              style={{ scrollSnapAlign: 'center', transition: 'all 0.3s ease' }}
            >
              <ServiceCard
                {...service}
                index={index}
                onSelect={onSelectService}
                className="shadow-lg" /* Add shadow for better visual separation */
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Indicators as a component */}
      <PaginationIndicators 
        total={services.length}
        activeIndex={activeIndex}
        onSelect={handleIndicatorSelect}
        theme={theme}
      />
      
      {/* Arrow Navigation with components - Better spacing for mobile */}
      <div className="flex justify-between mt-4 sm:mt-6 px-4">
        <NavigationButton 
          direction="prev"
          onClick={scrollToPrev}
          disabled={isTransitioning || activeIndex === 0}
          theme={theme}
        />
        
        <NavigationButton 
          direction="next"
          onClick={scrollToNext}
          disabled={isTransitioning || activeIndex === services.length - 1}
          theme={theme}
        />
      </div>
    </div>
  );
}
