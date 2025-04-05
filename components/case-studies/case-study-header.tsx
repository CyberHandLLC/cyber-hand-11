"use client";

import { CaseStudyHeaderProps } from "./case-study-types";
import { CASE_STUDY_STYLES } from "@/lib/case-study-styles";
import { AnimatedElement } from "@/lib/animation-utils";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { CaseStudyImage } from "./case-study-image";
import Link from "next/link";
import { SectionContainer } from "@/components/custom/page-layout";
import { ChallengeSection, ClientInfo } from "./common-elements";

// Reusable header for case studies with mobile/desktop responsive design
export const CaseStudyHeader = ({ caseStudy, theme }: CaseStudyHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Navigation bar with cyber-style highlight */}
      <div className="relative z-20 pt-24 pb-4">
        <SectionContainer>
          <div className="flex justify-between items-center">
            <Link 
              href="/case-studies" 
              className={CASE_STUDY_STYLES.button}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
            
            <span className={CASE_STUDY_STYLES.pill}>
              {caseStudy.industry}
            </span>
          </div>
        </SectionContainer>
      </div>
      
      {/* Different layouts for mobile and desktop */}
      <div className="relative">
        {/* Mobile layout - stacked design (image on top, content below) */}
        <div className="md:hidden">
          {/* Image container */}
          <div className="relative w-full h-[30vh] mb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 z-10"></div>
            {caseStudy.imageUrl && (
              <CaseStudyImage
                src={caseStudy.imageUrl}
                alt={caseStudy.title}
                variant="hero"
                position={0}
                objectFit="cover"
                aspectRatio="16/9"
                placeholderColor="#0f172a"
              />
            )}
          </div>
          
          {/* Content below image on mobile */}
          <SectionContainer className="relative z-10 pb-8">
            <div className="w-full">
              <AnimatedElement animation="fadeInUp" delay={0.1}>
                <h1 className={`text-2xl sm:text-3xl ${CASE_STUDY_STYLES.headings.h1} mb-6`}>
                  {caseStudy.title}
                </h1>
                
                <ClientInfo 
                  clientName={caseStudy.clientName} 
                  location={caseStudy.location} 
                />
                
                <ChallengeSection 
                  challenge={caseStudy.challenge} 
                  _theme={theme} 
                />
              </AnimatedElement>
            </div>
          </SectionContainer>
        </div>
        
        {/* Desktop layout - diagonal split design */}
        <div className="hidden md:block relative">
          {/* Content side */}
          <div className="relative z-10 pb-12 pt-6">
            <SectionContainer>
              <div className="max-w-2xl">
                <AnimatedElement animation="fadeInUp" delay={0.1}>
                  <h1 className={`text-3xl sm:text-4xl md:text-5xl ${CASE_STUDY_STYLES.headings.h1} mb-6`}>
                    {caseStudy.title}
                  </h1>
                  
                  <ClientInfo 
                    clientName={caseStudy.clientName} 
                    location={caseStudy.location} 
                  />
                  
                  <ChallengeSection 
                    challenge={caseStudy.challenge} 
                    _theme={theme} 
                  />
                </AnimatedElement>
              </div>
            </SectionContainer>
          </div>
          
          {/* Image side with diagonal effect - desktop only */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-black z-0 clip-diagonal">
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
            <div className="h-full w-full relative">
              {caseStudy.imageUrl && (
                <CaseStudyImage
                  src={caseStudy.imageUrl}
                  alt={caseStudy.title}
                  variant="hero"
                  position={0}
                  objectFit="contain"
                  placeholderColor="#0f172a"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
