"use client";

/**
 * Case Study Detail Client Component
 * 
 * This component handles client-side concerns for individual case study details.
 * It wraps server-fetched data with client-side interactivity, theme support,
 * and proper error handling.
 * 
 * @file components/case-studies/case-study-detail-client.tsx
 * @module CaseStudies
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { CaseStudyHeader } from "@/components/case-studies/case-study-header";
import { CaseStudyContent } from "@/components/case-studies/case-study-content";
import { SectionContainer } from "@/components/custom/page-layout";
import { HeadingSkeleton as _HeadingSkeleton, TextSkeleton as _TextSkeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { Theme } from "@/components/case-studies/case-study-types";

interface CaseStudyDetailClientProps {
  caseStudy: CaseStudyProps;
  children?: React.ReactNode;
}

/**
 * Client wrapper for case study detail content - handles client-side concerns like routing and theme
 * This separation is important in Next.js 15 where params are Promises in server components
 */
export function CaseStudyDetailClient({ caseStudy }: CaseStudyDetailClientProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme as Theme; // Type assertion to match the expected Theme type
  
  // If case study not found, redirect to case studies page
  useEffect(() => {
    if (!caseStudy) {
      router.push('/case-studies');
    }
  }, [caseStudy, router]);

  if (!caseStudy) {
    return null;
  }

  /**
   * Error Fallback Component for Case Study Detail
   * Provides a user-friendly error handling experience with retry functionality
   */
  const CaseStudyDetailErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
      setIsRetrying(true);
      resetErrorBoundary();
      // Reset the retry state after a delay
      setTimeout(() => setIsRetrying(false), 2000);
    };

    return (
      <SectionContainer className="py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || "There was an error loading this case study content."}
          </p>
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className={`px-6 py-2 rounded-lg ${getThemeStyle('bg-primary hover:bg-primary-dark', theme)} text-white transition-colors disabled:opacity-50`}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
          <div className="mt-4">
            <Link href="/case-studies" className={`${getThemeStyle('text-primary hover:underline', theme)}`}>
              Return to all case studies
            </Link>
          </div>
        </div>
      </SectionContainer>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={CaseStudyDetailErrorFallback}>
      <article className="py-16 md:py-24">
        <CaseStudyHeader 
          caseStudy={caseStudy}
          theme={currentTheme}
        />
        
        <CaseStudyContent
          caseStudy={caseStudy}
          theme={currentTheme}
          router={router}
        />
      </article>
    </ErrorBoundary>
  );
}