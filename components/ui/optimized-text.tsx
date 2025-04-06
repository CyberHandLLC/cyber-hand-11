'use client';

import React, { ReactNode } from 'react';

type TextVariant = 'body' | 'heading' | 'ui';
type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextElement = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';

interface OptimizedTextProps {
  as?: TextElement;
  variant?: TextVariant;
  weight?: FontWeight;
  children: ReactNode;
  className?: string;
}

/**
 * OptimizedText Component
 * 
 * A component for rendering text with optimized font loading and display strategies.
 * This component helps reduce CLS (Cumulative Layout Shift) when fonts are loading
 * and applies proper font fallbacks based on the font variant.
 */
export default function OptimizedText({
  as: Element = 'p',
  variant = 'body',
  weight = 'normal',
  children,
  className = '',
}: OptimizedTextProps) {
  // Map font weight to Tailwind classes
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  // Create class string with the appropriate font class
  const variantClass = variant === 'heading' ? 'text-heading' : 'text-body';
  
  const combinedClasses = `${variantClass} ${weightClasses[weight]} ${className}`;

  return (
    <Element className={combinedClasses}>
      {children}
    </Element>
  );
}

/**
 * Heading Component
 * 
 * A specialized version of OptimizedText for headings.
 * Automatically applies the heading font variant and appropriate element type.
 */
export function Heading({
  level = 2,
  children,
  weight = 'bold',
  className = '',
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  weight?: FontWeight;
  className?: string;
}) {
  const Element = `h${level}` as TextElement;
  
  return (
    <OptimizedText 
      as={Element} 
      variant="heading" 
      weight={weight} 
      className={className}
    >
      {children}
    </OptimizedText>
  );
}

/**
 * BodyText Component
 * 
 * A specialized version of OptimizedText for body text.
 * Automatically applies the body font variant.
 */
export function BodyText({
  as = 'p',
  children,
  weight = 'normal',
  className = '',
}: {
  as?: TextElement;
  children: ReactNode;
  weight?: FontWeight;
  className?: string;
}) {
  return (
    <OptimizedText 
      as={as} 
      variant="body" 
      weight={weight} 
      className={className}
    >
      {children}
    </OptimizedText>
  );
}
