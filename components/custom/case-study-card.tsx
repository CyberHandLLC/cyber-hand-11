"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { getThemeStyle } from '@/lib/theme-utils';
import { AnimatedElement } from '@/lib/animation-utils';
import { ArrowRightIcon } from '@/components/ui/icons';

export interface CaseStudyProps {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  location: string;
  services: string[];
  challenge: string;
  approach: string[];
  results: string[];
  testimonial?: string;
  imageUrl: string;
  slug: string;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudyProps;
  index: number;
}

export function CaseStudyCard({ caseStudy, index }: CaseStudyCardProps) {
  const { theme } = useTheme();
  const delay = index * 0.1;
  
  return (
    <AnimatedElement
      animation="fadeInUp"
      delay={delay}
      className={`relative rounded-xl overflow-hidden ${getThemeStyle('bg-card', theme)} h-full flex flex-col`}
    >
      {/* Image container with overlay */}
      <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
        <Image 
          src={caseStudy.imageUrl}
          alt={caseStudy.clientName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index < 2} // Prioritize loading the first two images
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Industry badge */}
        <div className={`absolute top-4 left-4 ${getThemeStyle('badge', theme)} px-3 py-1 rounded-full text-xs font-semibold`}>
          {caseStudy.industry}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className={`text-xl font-bold mb-2 ${getThemeStyle('text-primary', theme)}`}>
          {caseStudy.title}
        </h3>
        
        <p className={`text-sm mb-4 ${getThemeStyle('text-secondary', theme)}`}>
          {caseStudy.challenge.substring(0, 120)}
          {caseStudy.challenge.length > 120 ? '...' : ''}
        </p>
        
        {/* Results preview */}
        <div className="mt-auto">
          <div className={`text-sm font-semibold mb-2 ${getThemeStyle('text-primary', theme)}`}>
            Key Results:
          </div>
          
          <ul className={`text-sm space-y-1 mb-4 ${getThemeStyle('text-secondary', theme)}`}>
            {caseStudy.results.slice(0, 2).map((result, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 mr-2"></span>
                {result.length > 60 ? `${result.substring(0, 60)}...` : result}
              </li>
            ))}
          </ul>
          
          <Link 
            href={`/case-studies/${caseStudy.slug}`}
            className={`inline-flex items-center text-sm font-medium text-cyan-500 hover:text-cyan-600 transition-colors`}
          >
            View Case Study
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </AnimatedElement>
  );
}
