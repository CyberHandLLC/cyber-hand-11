"use client";

/**
 * Client-side Providers Component
 * 
 * Wraps the application with various context providers.
 * This component should be imported in your root layout.
 */

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}