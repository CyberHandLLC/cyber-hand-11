"use client";

import { CaseStudyContentProps } from "./case-study-types";
import { CASE_STUDY_STYLES } from "@/lib/case-study-styles";
import { SectionContainer } from "@/components/custom/page-layout";
import { getThemeStyle } from "@/lib/theme-utils";
import { StaggeredGroup, StaggeredItem, AnimatedElement } from "@/lib/animation-utils";
import { SectionHeader, ApproachStep, ResultItem, Testimonial, SidebarCard } from "./common-elements";
import { caseStudies } from "@/data/case-studies";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

// Component for services band
const ServicesBand = ({ services, theme }: { services: string[], theme: any }) => (
  <div className={`${getThemeStyle('bg-secondary', theme)} py-6 border-y border-gray-800/50`}>
    <SectionContainer>
      <div className="flex flex-wrap gap-4 justify-center">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="px-4 py-2 rounded-md border border-gray-700/30 bg-black/30 backdrop-blur-sm text-sm font-medium text-white/80"
          >
            {service}
          </div>
        ))}
      </div>
    </SectionContainer>
  </div>
);

// Component for related case studies in sidebar
const RelatedCaseStudies = ({ currentStudyId, theme }: { currentStudyId: string, theme: any }) => {
  const relatedStudies = caseStudies
    .filter(cs => cs.id !== currentStudyId)
    .slice(0, 2);
    
  // Don't render if there are no related studies
  if (relatedStudies.length === 0) return null;
  
  return (
    <div className={`p-6 ${CASE_STUDY_STYLES.card}`}>
      <h3 className={`text-lg ${CASE_STUDY_STYLES.headings.h3} mb-4 text-white`}>
        Explore More Case Studies
      </h3>
      <div className="space-y-2 mb-4">
        {relatedStudies.map(cs => (
          <Link 
            key={cs.id}
            href={`/case-studies/${cs.slug}`}
            className={`block p-3 rounded border border-gray-800/30 ${CASE_STUDY_STYLES.cardHover} ${getThemeStyle('text-secondary', theme)}`}
          >
            <div className="text-sm font-medium text-white mb-1">{cs.clientName}</div>
            <div className="text-xs">{cs.industry}</div>
          </Link>
        ))}
      </div>
      <Link 
        href="/case-studies"
        className={`inline-flex items-center text-sm ${CASE_STUDY_STYLES.textAccent} hover:text-cyan-400 transition-colors`}
      >
        View all case studies
        <ArrowRightIcon className="ml-1 h-3 w-3" />
      </Link>
    </div>
  );
};

// Component for approach section
const ApproachSection = ({ approach, theme }: { approach: string[], theme: any }) => (
  <StaggeredItem>
    <div className={CASE_STUDY_STYLES.section.spacing}>
      <SectionHeader title="Our Approach" theme={theme} />
      
      <div className={`${CASE_STUDY_STYLES.section.contentSpacing} pl-4 border-l border-gray-800/50`}>
        {approach.map((step, index) => (
          <ApproachStep 
            key={index} 
            step={step} 
            index={index} 
            theme={theme} 
          />
        ))}
      </div>
    </div>
  </StaggeredItem>
);

// Component for results section
const ResultsSection = ({ results, theme }: { results: string[], theme: any }) => (
  <StaggeredItem>
    <div className={CASE_STUDY_STYLES.section.spacing}>
      <SectionHeader title="The Results" theme={theme} />
      
      <div className={CASE_STUDY_STYLES.grid.twoColumn}>
        {results.map((result, index) => (
          <ResultItem 
            key={index} 
            result={result} 
            theme={theme} 
          />
        ))}
      </div>
    </div>
  </StaggeredItem>
);

// Component for bottom CTA section
const CallToAction = ({ router, theme }: { router: any, theme: any }) => (
  <div className="relative py-16 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"></div>
    
    <SectionContainer className="relative z-10">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedElement animation="fadeInUp">
          <h2 className={`text-2xl md:text-3xl ${CASE_STUDY_STYLES.headings.h2} mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent`}>
            Ready to achieve similar results?
          </h2>
          <p className={`mb-8 ${getThemeStyle('text-secondary', theme)}`}>
            Let&apos;s discuss how we can help your business establish a strong online presence and achieve your digital marketing goals.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/contact")}
            className="px-8 py-3"
          >
            Start Your Success Story
          </Button>
        </AnimatedElement>
      </div>
    </SectionContainer>
    
    {/* Decorative grid lines */}
    <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-5 pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`h-full w-px ${CASE_STUDY_STYLES.accent} justify-self-center`}></div>
      ))}
    </div>
  </div>
);

// Main case study content
export const CaseStudyContent = ({ caseStudy, theme, router }: CaseStudyContentProps) => {
  return (
    <>
      {/* Services band */}
      <ServicesBand services={caseStudy.services} theme={theme} />
      
      {/* Main content with hexagonal accents */}
      <div className="py-16 relative overflow-hidden">
        {/* Hexagonal accent shapes */}
        <div className={`absolute -left-20 top-40 w-40 h-40 border ${CASE_STUDY_STYLES.borderAccent}/20 transform rotate-45 opacity-30`}></div>
        <div className={`absolute -right-20 bottom-40 w-60 h-60 border ${CASE_STUDY_STYLES.borderAccent}/20 transform rotate-12 opacity-20`}></div>
        
        <SectionContainer className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main content column */}
            <div className="lg:col-span-8">
              <StaggeredGroup>
                {/* Our Approach section with numbered steps */}
                <ApproachSection approach={caseStudy.approach} theme={theme} />
                
                {/* Results section with highlight cards */}
                <ResultsSection results={caseStudy.results} theme={theme} />
                
                {/* Testimonial with modern highlight design */}
                {caseStudy.testimonial && (
                  <StaggeredItem>
                    <Testimonial 
                      quote={caseStudy.testimonial} 
                      author={caseStudy.clientName} 
                      theme={theme} 
                    />
                  </StaggeredItem>
                )}
              </StaggeredGroup>
            </div>
            
            {/* Sidebar column */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                {/* Get similar results card */}
                <SidebarCard
                  title="Want Similar Results?"
                  description="Let's discuss how we can help your business achieve the same level of success with our specialized services."
                  buttonText="Get in Touch"
                  buttonIcon={<ArrowRightIcon className="ml-2 h-4 w-4" />}
                  onClick={() => router.push("/contact")}
                  theme={theme}
                />
                
                {/* Related case studies teaser */}
                <RelatedCaseStudies currentStudyId={caseStudy.id} theme={theme} />
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
      
      {/* Call to action section with diagonal design */}
      <CallToAction router={router} theme={theme} />
    </>
  );
};
