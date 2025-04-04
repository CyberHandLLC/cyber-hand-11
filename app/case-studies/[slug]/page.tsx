"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Components
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

// Data and utilities
import { caseStudies } from "@/data/case-studies";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement, StaggeredGroup, StaggeredItem } from "@/lib/animation-utils";

// Define the Theme type locally to match theme-context.tsx
type Theme = "light" | "dark";

// Types for our components
type ApproachStepProps = {
  step: string;
  index: number;
  theme: Theme;
};

type ResultItemProps = {
  result: string;
  theme: Theme;
};

type TestimonialProps = {
  quote: string;
  author: string;
  theme: Theme;
};

type SidebarCardProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onClick: () => void;
  theme: Theme;
};

type SectionHeaderProps = {
  title: string;
  theme: Theme;
};

// Component for section headers with consistent styling
const SectionHeader = ({ title, theme }: SectionHeaderProps) => (
  <div className="flex items-center mb-6">
    <div className="w-12 h-2 bg-cyan-500"></div>
    <h2 className={`text-2xl font-bold ml-4 ${getThemeStyle('text-primary', theme)}`}>
      {title}
    </h2>
  </div>
);

// Component for individual approach steps
const ApproachStep = ({ step, index, theme }: ApproachStepProps) => (
  <div className="relative">
    <div className="absolute -left-6 w-10 h-10 rounded-full bg-black border border-cyan-500/50 flex items-center justify-center">
      <span className="text-cyan-400 font-mono text-sm">{index + 1}</span>
    </div>
    <div className={`pl-8 ${getThemeStyle('text-secondary', theme)}`}>
      {step}
    </div>
  </div>
);

// Component for result items
const ResultItem = ({ result, theme }: ResultItemProps) => (
  <div className={`p-6 rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/40 to-transparent backdrop-blur-sm hover:border-cyan-500/30 transition-colors`}>
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4">
        <CheckIcon size="sm" className="text-cyan-400" />
      </div>
      <div className={getThemeStyle('text-secondary', theme)}>
        {result}
      </div>
    </div>
  </div>
);

// Component for testimonial
const Testimonial = ({ quote, author, theme }: TestimonialProps) => (
  <div className="mb-16 relative">
    <div className="absolute -top-6 -left-6 text-6xl text-cyan-500/20 font-serif">"</div>
    <div className="absolute -bottom-6 -right-6 text-6xl text-cyan-500/20 font-serif">"</div>
    
    <div className={`relative z-10 p-8 rounded-lg ${getThemeStyle('bg-secondary', theme)} border-l-2 border-cyan-500`}>
      <blockquote className={`italic text-lg ${getThemeStyle('text-secondary', theme)} mb-6`}>
        {quote}
      </blockquote>
      <div className={`font-medium ${getThemeStyle('text-primary', theme)} flex items-center`}>
        <div className="w-8 h-1 bg-cyan-500/50 mr-3"></div>
        {author}
      </div>
    </div>
  </div>
);

// Component for sidebar cards
const SidebarCard = ({ title, description, buttonText, buttonIcon, onClick, theme }: SidebarCardProps) => (
  <div className={`p-6 rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm mb-8`}>
    <h3 className={`text-xl font-semibold mb-4 text-white`}>
      {title}
    </h3>
    <p className={`mb-6 ${getThemeStyle('text-secondary', theme)}`}>
      {description}
    </p>
    <Button
      variant="primary"
      className="w-full"
      onClick={onClick}
    >
      {buttonText}
      {buttonIcon}
    </Button>
  </div>
);

// Component for header with diagonal split
const DiagonalSplitHeader = ({ caseStudy, theme }: { caseStudy: CaseStudyProps, theme: Theme }) => (
  <div className="relative overflow-hidden">
    {/* Navigation bar with cyber-style highlight */}
    <div className="relative z-20 pt-24 pb-4">
      <SectionContainer>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Link 
            href="/case-studies" 
            className="inline-flex items-center bg-black/40 border border-gray-700/30 hover:border-cyan-500/50 px-4 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Case Studies
          </Link>
          
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/80 text-white inline-block">
            {caseStudy.industry}
          </span>
        </div>
      </SectionContainer>
    </div>
    
    {/* Split diagonal design - restructured for better mobile display */}
    <div className="relative flex flex-col md:block">
      {/* Content side - stacked on mobile, side-by-side on desktop */}
      <div className="relative z-10 pb-12 pt-6 order-2 md:order-1">
        <SectionContainer>
          <div className="max-w-2xl">
            <AnimatedElement animation="fadeInUp" delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                {caseStudy.title}
              </h1>
              
              <div className="flex flex-wrap items-center mb-8 text-white/90 gap-4">
                <span className="text-lg">{caseStudy.clientName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 hidden md:block"></span>
                <span className="text-lg">{caseStudy.location}</span>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/20 to-transparent p-6 rounded-lg border-l-2 border-cyan-500 mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">The Challenge</h2>
                <p className="text-white/80">{caseStudy.challenge}</p>
              </div>
            </AnimatedElement>
          </div>
        </SectionContainer>
      </div>
      
      {/* Image side - full width on mobile, diagonal on desktop */}
      <div className="relative w-full md:absolute md:top-0 md:right-0 md:w-1/2 md:h-full bg-black z-0 order-1 md:order-2">
        <div className="w-full aspect-video md:h-full relative">
          {/* Gradient overlay - visible on all screens */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10 md:bg-gradient-to-r md:from-black/90 md:to-transparent"></div>
          
          {/* Diagonal clip only on desktop */}
          <div className="h-full w-full relative md:clip-diagonal">
            <Image
              src={caseStudy.imageUrl}
              alt={caseStudy.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Component for services band
const ServicesBand = ({ services, theme }: { services: string[], theme: Theme }) => (
  <div className={`${getThemeStyle('bg-secondary', theme)} py-6 border-y border-gray-800/50`}>
    <SectionContainer>
      <div className="flex flex-wrap gap-3 justify-center px-2">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="px-3 py-1.5 rounded-md border border-gray-700/30 bg-black/30 backdrop-blur-sm text-xs sm:text-sm font-medium text-white/80"
          >
            {service}
          </div>
        ))}
      </div>
    </SectionContainer>
  </div>
);

// Component for related case studies in sidebar
const RelatedCaseStudies = ({ currentStudyId, theme }: { currentStudyId: string, theme: Theme }) => (
  <div className={`p-6 rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm`}>
    <h3 className={`text-lg font-semibold mb-4 text-white`}>
      Explore More Case Studies
    </h3>
    <div className="space-y-2 mb-4">
      {caseStudies
        .filter(cs => cs.id !== currentStudyId)
        .slice(0, 2)
        .map(cs => (
          <Link 
            key={cs.id}
            href={`/case-studies/${cs.slug}`}
            className={`block p-3 rounded border border-gray-800/30 hover:border-cyan-500/30 ${getThemeStyle('text-secondary', theme)} transition-colors`}
          >
            <div className="text-sm font-medium text-white mb-1">{cs.clientName}</div>
            <div className="text-xs">{cs.industry}</div>
          </Link>
        ))}
    </div>
    <Link 
      href="/case-studies"
      className="inline-flex items-center text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
    >
      View all case studies
      <ArrowRightIcon className="ml-1 h-3 w-3" />
    </Link>
  </div>
);

// Component for bottom CTA section
const CallToAction = ({ router, theme }: { router: any, theme: Theme }) => (
  <div className="relative py-12 md:py-16 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"></div>
    
    <SectionContainer className="relative z-10">
      <div className="max-w-2xl mx-auto text-center px-4">
        <AnimatedElement animation="fadeInUp">
          <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent`}>
            Ready to achieve similar results?
          </h2>
          <p className={`mb-8 ${getThemeStyle('text-secondary', theme)}`}>
            Let's discuss how we can help your business establish a strong online presence and achieve your digital marketing goals.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/contact")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3"
          >
            Start Your Success Story
          </Button>
        </AnimatedElement>
      </div>
    </SectionContainer>
    
    {/* Decorative grid lines */}
    <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-5 pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-full w-px bg-cyan-500 justify-self-center"></div>
      ))}
    </div>
  </div>
);

// Main Case Study Page component
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Find the case study by slug
  const caseStudy = caseStudies.find(cs => cs.slug === params.slug);
  
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
      {/* Header with diagonal split design */}
      <DiagonalSplitHeader caseStudy={caseStudy} theme={theme} />
      
      {/* Services band */}
      <ServicesBand services={caseStudy.services} theme={theme} />
      
      {/* Main content with hexagonal accents */}
      <div className="py-10 md:py-16 relative overflow-hidden">
        {/* Hexagonal accent shapes - hidden on mobile for cleaner layout */}
        <div className="absolute -left-20 top-40 w-40 h-40 border border-cyan-500/20 transform rotate-45 opacity-30 hidden md:block"></div>
        <div className="absolute -right-20 bottom-40 w-60 h-60 border border-cyan-500/20 transform rotate-12 opacity-20 hidden md:block"></div>
        
        <SectionContainer className="relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Main content column */}
            <div className="lg:col-span-8">
              <StaggeredGroup>
                {/* Our Approach section with numbered steps */}
                <StaggeredItem>
                  <div className="mb-12 md:mb-16">
                    <SectionHeader title="Our Approach" theme={theme} />
                    
                    <div className="space-y-6 md:space-y-8 pl-4 border-l border-gray-800/50">
                      {caseStudy.approach.map((step, index) => (
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
                
                {/* Results section with highlight cards */}
                <StaggeredItem>
                  <div className="mb-12 md:mb-16">
                    <SectionHeader title="The Results" theme={theme} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {caseStudy.results.map((result, index) => (
                        <ResultItem 
                          key={index} 
                          result={result} 
                          theme={theme} 
                        />
                      ))}
                    </div>
                  </div>
                </StaggeredItem>
                
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
            
            {/* Sidebar column - moves to bottom on mobile */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="lg:sticky lg:top-24 space-y-6 md:space-y-8">
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
      
      {/* Inject custom styles for the diagonal clip-path */}
      <style jsx global>{`
        .clip-diagonal {
          clip-path: polygon(100% 0, 100% 100%, 0 100%, 30% 0);
        }
        
        @media (max-width: 768px) {
          .clip-diagonal {
            clip-path: none;
          }
        }
      `}</style>
    </PageLayout>
  );
}
