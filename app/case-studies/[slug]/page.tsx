"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";

// Import modular components
import { CaseStudyHeader } from "@/components/case-studies/case-study-header";
import { CaseStudyContent } from "@/components/case-studies/case-study-content";

// Main Case Study Page component
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Find the case study by slug
  const caseStudy = caseStudies.find(cs => cs.id === params.slug || cs.slug === params.slug);
  
  // If case study not found, redirect to case studies page
  useEffect(() => {
    if (!caseStudy) {
      router.push("/case-studies");
    }
  }, [caseStudy, router]);
  
  // Return loading state if case study not found
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
