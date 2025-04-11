'use client';

/**
 * Spinner Component - Client Component
 * 
 * A customizable loading spinner following shadcn/ui design principles.
 * This is a client component for interactive loading states.
 * 
 * @module components/ui/client/spinner
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * SpinnerProps interface for type safety
 * Following Cyber Hand's Principle 3: Enforce Complete Type Safety
 */
export interface SpinnerProps {
  /** Classes to apply to the spinner */
  className?: string;
  /** Size of the spinner in pixels */
  size?: number;
  /** Optional text to display alongside the spinner */
  text?: string;
  /** Text position relative to spinner (top, bottom, left, right) */
  textPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Whether this spinner is covering the entire parent component */
  fullWidth?: boolean;
}

/**
 * Spinner component for loading states
 * Uses Lucide React's Loader2 icon with customizable styling
 */
export function Spinner({
  className,
  size = 24,
  text,
  textPosition = 'right',
  fullWidth = false,
}: SpinnerProps) {
  const containerClasses = cn(
    'flex items-center justify-center',
    {
      'w-full': fullWidth,
      'flex-col': textPosition === 'top' || textPosition === 'bottom',
      'flex-col-reverse': textPosition === 'top',
      'flex-row': textPosition === 'left' || textPosition === 'right',
      'flex-row-reverse': textPosition === 'left',
    },
    className
  );

  const textClasses = cn('text-sm text-muted-foreground', {
    'mt-2': textPosition === 'bottom',
    'mb-2': textPosition === 'top',
    'ml-2': textPosition === 'right',
    'mr-2': textPosition === 'left',
  });

  return (
    <div className={containerClasses}>
      <Loader2 
        className="animate-spin" 
        size={size} 
        aria-hidden="true"
      />
      {text && <span className={textClasses}>{text}</span>}
    </div>
  );
}
