"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { motion } from "framer-motion";
import { ServiceCard } from "./service-card";
import { type ServiceProps } from "@/data/services";

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
    <div className="flex justify-center space-x-2 mt-4">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === activeIndex 
              ? 'w-6 bg-cyan-500' 
              : theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
          }`}
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
  const { theme } = useTheme();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Scroll to specific card by index
  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    
    const cardElements = carouselRef.current.getElementsByClassName('service-card-container');
    if (cardElements.length > index) {
      const card = cardElements[index] as HTMLElement;
      
      carouselRef.current.scrollTo({
        left: card.offsetLeft - 16, // Account for padding
        behavior: 'smooth'
      });
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
    setActiveIndex(index);
    scrollToCard(index);
  };
  
  // Component render
  return (
    <div className="relative">
      <div 
        ref={carouselRef}
        className="overflow-x-auto pb-10 hide-scrollbar snap-x snap-mandatory"
      >
        <div className="flex space-x-6 px-4 py-4">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`flex-shrink-0 w-[80%] snap-center service-card-container ${
                index === activeIndex ? 'scale-100' : 'scale-95 opacity-80'
              }`}
              style={{ scrollSnapAlign: 'center', transition: 'all 0.3s ease' }}
            >
              <ServiceCard
                {...service}
                index={index}
                onSelect={onSelectService}
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
      
      {/* Arrow Navigation with components */}
      <div className="flex justify-between mt-6 px-4">
        <NavigationButton 
          direction="prev"
          onClick={scrollToPrev}
          disabled={activeIndex === 0}
          theme={theme}
        />
        
        <NavigationButton 
          direction="next"
          onClick={scrollToNext}
          disabled={activeIndex === services.length - 1}
          theme={theme}
        />
      </div>
    </div>
  );
}
