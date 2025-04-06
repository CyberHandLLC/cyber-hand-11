/**
 * Services Type Definitions
 * 
 * This file contains all type definitions related to services
 * across the Cyber Hand website.
 */

/**
 * Core Service data structure
 */
export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

/**
 * Component-specific props
 */
export interface ServiceCardProps extends ServiceProps {
  theme?: string;
  onClick?: () => void;
}

export interface ServiceCardServerProps {
  service: ServiceProps;
}

export interface ServiceCardClientProps {
  service: ServiceProps;
  onClick?: () => void;
}

export interface ServicesWrapperProps {
  services: ServiceProps[];
}

export interface ServiceCarouselProps {
  services: ServiceProps[];
}

export interface NavigationButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
}

export interface PaginationIndicatorsProps {
  totalItems: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}
