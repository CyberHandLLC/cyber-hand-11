"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { CaseStudyHeader } from "@/components/case-studies/case-study-header";
import { CaseStudyContent } from "@/components/case-studies/case-study-content";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";

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
  
  // Return loading state if case study still shows as not found on client
  if (!caseStudy) {
    return (
      <PageLayout>
        <SectionContainer className="py-24">
          <div className="text-center">
            <p className={getThemeStyle('text-primary', theme)}>Loading...</p>
          </div>
        </SectionContainer>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      {/* Header section */}
      <CaseStudyHeader caseStudy={caseStudy} theme={theme} />
      
      {/* Main content section */}
      <CaseStudyContent caseStudy={caseStudy} theme={theme} router={router} />
      
      {/* Inject custom styles for the diagonal clip-path */}
      <style jsx global>{`
        .clip-diagonal {
          clip-path: polygon(100% 0, 100% 100%, 0 100%, 30% 0);
        }
        
        @media (max-width: 768px) {
          .clip-diagonal {
            clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 30%);
          }
        }
      `}</style>
    </PageLayout>
  );
}
