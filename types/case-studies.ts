/**
 * Case Studies Type Definitions
 * 
 * This file contains all type definitions related to case studies
 * across the Cyber Hand website.
 */

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Define the Theme type locally to match theme-context.tsx
export type Theme = "light" | "dark";

/**
 * Core Case Study data structure
 */
export interface CaseStudyProps {
  id: string;
  slug?: string; // Optional slug for URL-friendly identifiers
  title: string;
  clientName: string;
  industry: string;
  location: string;
  services: string[];
  challenge: string;
  approach: string[];
  results: string[];
  testimonial?: string;
  imageUrl?: string; // Optional image URL for case study visuals
}

/**
 * Component-specific props
 */
export interface CaseStudyCardProps {
  caseStudy: CaseStudyProps;
  onClick?: () => void;
}

export type CaseStudyHeaderProps = {
  caseStudy: CaseStudyProps;
  theme: Theme;
};

export type CaseStudyContentProps = {
  caseStudy: CaseStudyProps;
  theme: Theme;
  router: AppRouterInstance;
};

export type ApproachStepProps = {
  step: string;
  index: number;
  theme: Theme;
};

export type ResultItemProps = {
  result: string;
  theme: Theme;
};

export type TestimonialProps = {
  quote: string;
  author: string;
  company: string;
  theme: Theme;
};
