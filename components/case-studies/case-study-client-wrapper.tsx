"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { CaseStudyHeader } from "@/components/case-studies/case-study-header";
import { CaseStudyContent } from "@/components/case-studies/case-study-content";
import { SectionContainer } from "@/components/custom/page-layout";
import { HeadingSkeleton, TextSkeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";

interface CaseStudyClientWrapperProps {
  caseStudy: CaseStudyProps;
  children?: React.ReactNode;
}

/**
 * Client wrapper for case study content - handles client-side concerns like routing and theme
 * This separation is important in Next.js 15 where params are Promises in server components
 */
export function CaseStudyClientWrapper({ caseStudy }: CaseStudyClientWrapperProps) {
  const router = useRouter();
  const { theme } = useTheme();

  // If case study not found, redirect to case studies page
  useEffect(() => {
    if (!caseStudy) {
      router.push("/case-studies");
    }
  }, [caseStudy, router]);

  // Return enhanced loading state if case study still shows as not found on client
  if (!caseStudy) {
    return (
      <SectionContainer className="py-24">
        <div className="text-center space-y-4">
          <HeadingSkeleton level={2} width="50%" className="mx-auto" />
          <TextSkeleton width="75%" className="mx-auto" />
        </div>
      </SectionContainer>
    );
  }

  /**
   * Error fallback component - handles errors within the client components
   */
  const CaseStudyClientErrorFallback = ({
    error,
    resetErrorBoundary,
  }: {
    error: Error;
    resetErrorBoundary: () => void;
  }) => {
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
            className={`px-6 py-2 rounded-lg ${getThemeStyle("bg-primary hover:bg-primary-dark", theme)} text-white transition-colors disabled:opacity-50`}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
          <div className="mt-4">
            <Link
              href="/case-studies"
              className={`${getThemeStyle("text-primary hover:underline", theme)}`}
            >
              Return to all case studies
            </Link>
          </div>
        </div>
      </SectionContainer>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={CaseStudyClientErrorFallback}>
      {/* Header section */}
      <CaseStudyHeader caseStudy={caseStudy} theme={theme} />

      {/* Main content section */}
      <CaseStudyContent caseStudy={caseStudy} theme={theme} router={router} />

      {/* Inject custom styles for the diagonal clip-path */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .clip-diagonal {
          clip-path: polygon(100% 0, 100% 100%, 0 100%, 30% 0);
        }
        
        @media (max-width: 768px) {
          .clip-diagonal {
            clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 30%);
          }
        }
      `,
        }}
      />
    </ErrorBoundary>
  );
}
