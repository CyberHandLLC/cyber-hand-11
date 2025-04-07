"use client";

/**
 * Error Display Component
 * 
 * A reusable component for displaying error messages in the UI instead
 * of using console logging. This approach is compliant with strict
 * ESLint configurations that disallow console statements.
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ErrorLevel = 'error' | 'warning' | 'info';

export interface ErrorMessage {
  id: string;
  level: ErrorLevel;
  message: string;
  timestamp: number;
}

interface ErrorDisplayProps {
  message?: ErrorMessage | null;
  className?: string;
  autoDismiss?: boolean;
  dismissDuration?: number;
}

/**
 * Component to display error messages in the UI
 */
export function ErrorDisplay({
  message,
  className,
  autoDismiss = true,
  dismissDuration = 5000
}: ErrorDisplayProps) {
  const [visible, setVisible] = useState(Boolean(message));
  
  useEffect(() => {
    setVisible(Boolean(message));
    
    if (message && autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, dismissDuration);
      
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, dismissDuration]);
  
  if (!message || !visible) return null;
  
  const bgColor = 
    message.level === 'error' ? 'bg-red-600/90 dark:bg-red-900/90' :
    message.level === 'warning' ? 'bg-amber-600/90 dark:bg-amber-800/90' :
    'bg-blue-600/90 dark:bg-blue-800/90';
  
  return (
    <div 
      className={cn(
        'p-3 rounded-md text-white text-sm shadow-md',
        bgColor,
        className
      )}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium">
            {message.level === 'error' ? 'Error' : 
             message.level === 'warning' ? 'Warning' : 'Info'}
          </p>
          <p className="mt-1">{message.message}</p>
        </div>
        
        <button 
          className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}