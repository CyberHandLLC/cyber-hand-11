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

/**
 * ServiceCarousel component for displaying services in a mobile-friendly carousel
 */
export function ServiceCarousel({ services, onSelectService }: ServiceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Navigation functions
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
              className={`flex-shrink-0 w-[80%] snap-center service-card-container ${index === activeIndex ? 'scale-100' : 'scale-95 opacity-80'}`}
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
      
      {/* Pagination Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              scrollToCard(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-cyan-500' : theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}
            aria-label={`Go to service ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Arrow Navigation */}
      <div className="flex justify-between mt-6 px-4">
        <button 
          onClick={scrollToPrev}
          disabled={activeIndex === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-white shadow-md' : 'bg-gray-800'} ${activeIndex === 0 ? 'opacity-50' : ''}`}
          aria-label="Previous service"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={scrollToNext}
          disabled={activeIndex === services.length - 1}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-cyan-500 text-white shadow-md ${activeIndex === services.length - 1 ? 'opacity-50' : ''}`}
          aria-label="Next service"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
