/**
 * Shared Component Type Definitions
 * 
 * This file contains shared type definitions used by multiple
 * components across the Cyber Hand website.
 */

import { ReactNode } from 'react';

/**
 * UI Component Types
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

/**
 * Layout Component Types
 */
export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export interface PageLayoutClientProps {
  children: ReactNode;
  className?: string;
  theme?: string;
  animateElements?: boolean;
}

export interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  decorative?: boolean;
  dark?: boolean;
  contained?: boolean;
}

export interface DecorativeElementsProps {
  theme?: string;
  position?: 'top' | 'bottom' | 'both';
}

/**
 * Image Component Types
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  quality?: number;
  blurDataURL?: string;
}

export interface StaticImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animation Component Types
 */
export interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

/**
 * Template Component Types
 */
export interface ServerComponentTemplateProps {
  title?: string;
  description?: string;
}

export interface ClientComponentTemplateProps {
  title?: string;
  onClick?: () => void;
}
