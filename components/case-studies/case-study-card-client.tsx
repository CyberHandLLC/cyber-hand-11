"use client";

/**
 * Client Component counterpart for Case Study Card
 * 
 * This component handles only the interactive parts of the card
 * keeping client-side JavaScript to a minimum
 */

import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';
import { ArrowRightIcon } from '@/components/ui/icons';

interface CaseStudyCardClientProps {
  slug: string;
}

export function CaseStudyCardClient({ slug }: CaseStudyCardClientProps) {
  const { theme } = useTheme();
  
  // Apply theme-specific styling for the link
  const linkStyle = theme === 'dark' 
    ? 'text-cyan-400 hover:text-cyan-300' 
    : 'text-cyan-600 hover:text-cyan-700';
  
  return (
    <Link 
      href={`/case-studies/${slug}`}
      className={`inline-flex items-center text-sm font-medium ${linkStyle} transition-colors`}
    >
      View Case Study
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
