"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";
import { CaseStudyProps } from "@/components/custom/case-study-card";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement, StaggeredGroup, StaggeredItem } from "@/lib/animation-utils";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

// Define the Theme type locally to match theme-context.tsx
type Theme = "light" | "dark";

// Reusable style constants to maintain DRY principles
const STYLES = {
  card: "rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm",
  cardHover: "hover:border-cyan-500/30 transition-colors",
  pill: "px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/80 text-white inline-block",
  button: "inline-flex items-center bg-black/40 border border-gray-700/30 hover:border-cyan-500/50 px-4 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm",
  accent: "bg-cyan-500",
  accentLight: "bg-cyan-500/20",
  borderAccent: "border-cyan-500",
  textAccent: "text-cyan-400",
  section: {
    spacing: "mb-16",
    contentSpacing: "space-y-8",
  },
  grid: {
    twoColumn: "grid grid-cols-1 md:grid-cols-2 gap-6",
  }
};

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
    <div className={`w-12 h-2 ${STYLES.accent}`}></div>
    <h2 className={`text-2xl font-bold ml-4 ${getThemeStyle('text-primary', theme)}`}>
      {title}
    </h2>
  </div>
);

// Component for individual approach steps
const ApproachStep = ({ step, index, theme }: ApproachStepProps) => (
  <div className="relative">
    <div className={`absolute -left-6 w-10 h-10 rounded-full bg-black border ${STYLES.borderAccent}/50 flex items-center justify-center`}>
      <span className={`${STYLES.textAccent} font-mono text-sm`}>{index + 1}</span>
    </div>
    <div className={`pl-8 ${getThemeStyle('text-secondary', theme)}`}>
      {step}
    </div>
  </div>
);

// Component for result items
const ResultItem = ({ result, theme }: ResultItemProps) => (
  <div className={`p-6 ${STYLES.card} ${STYLES.cardHover}`}>
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${STYLES.accentLight} flex items-center justify-center mr-4`}>
        <CheckIcon size="sm" className={STYLES.textAccent} />
      </div>
      <div className={getThemeStyle('text-secondary', theme)}>
        {result}
      </div>
    </div>
  </div>
);

// Component for testimonial
const Testimonial = ({ quote, author, theme }: TestimonialProps) => (
  <div className={STYLES.section.spacing + " relative"}>
    <div className="absolute -top-6 -left-6 text-6xl text-cyan-500/20 font-serif">"</div>
    <div className="absolute -bottom-6 -right-6 text-6xl text-cyan-500/20 font-serif">"</div>
    
    <div className={`relative z-10 p-8 rounded-lg ${getThemeStyle('bg-secondary', theme)} border-l-2 ${STYLES.borderAccent}`}>
      <blockquote className={`italic text-lg ${getThemeStyle('text-secondary', theme)} mb-6`}>
        {quote}
      </blockquote>
      <div className={`font-medium ${getThemeStyle('text-primary', theme)} flex items-center`}>
        <div className={`w-8 h-1 ${STYLES.accent}/50 mr-3`}></div>
        {author}
      </div>
    </div>
  </div>
);

// Component for sidebar cards
const SidebarCard = ({ title, description, buttonText, buttonIcon, onClick, theme }: SidebarCardProps) => (
  <div className={`p-6 ${STYLES.card} mb-8`}>
    <h3 className="text-xl font-semibold mb-4 text-white">
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
        <div className="flex justify-between items-center">
          <Link 
            href="/case-studies" 
            className={STYLES.button}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Case Studies
          </Link>
          
          <span className={STYLES.pill}>
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
          <Image
            src={caseStudy.imageUrl}
            alt={caseStudy.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        
        {/* Content below image on mobile */}
        <SectionContainer className="relative z-10 pb-8">
          <div className="w-full">
            <AnimatedElement animation="fadeInUp" delay={0.1}>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                {caseStudy.title}
              </h1>
              
              <div className="flex items-center mb-8 text-white/90">
                <span className="text-base mr-4">{caseStudy.clientName}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${STYLES.accent}`}></span>
                <span className="text-base ml-4">{caseStudy.location}</span>
              </div>
              
              <div className={`bg-gradient-to-r from-cyan-500/20 to-transparent p-6 rounded-lg border-l-2 ${STYLES.borderAccent} mb-8`}>
                <h2 className="text-xl font-semibold text-white mb-3">The Challenge</h2>
                <p className="text-white/80">{caseStudy.challenge}</p>
              </div>
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                  {caseStudy.title}
                </h1>
                
                <div className="flex items-center mb-8 text-white/90">
                  <span className="text-lg mr-4">{caseStudy.clientName}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${STYLES.accent}`}></span>
                  <span className="text-lg ml-4">{caseStudy.location}</span>
                </div>
                
                <div className={`bg-gradient-to-r from-cyan-500/20 to-transparent p-6 rounded-lg border-l-2 ${STYLES.borderAccent} mb-8`}>
                  <h2 className="text-xl font-semibold text-white mb-3">The Challenge</h2>
                  <p className="text-white/80">{caseStudy.challenge}</p>
                </div>
              </AnimatedElement>
            </div>
          </SectionContainer>
        </div>
        
        {/* Image side with diagonal effect - desktop only */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black z-0 clip-diagonal">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
          <div className="h-full w-full relative">
            <Image
              src={caseStudy.imageUrl}
              alt={caseStudy.title}
              fill
              className="object-contain"
              sizes="50vw"
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
const RelatedCaseStudies = ({ currentStudyId, theme }: { currentStudyId: string, theme: Theme }) => (
  <div className={`p-6 ${STYLES.card}`}>
    <h3 className="text-lg font-semibold mb-4 text-white">
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
            className={`block p-3 rounded border border-gray-800/30 ${STYLES.cardHover} ${getThemeStyle('text-secondary', theme)}`}
          >
            <div className="text-sm font-medium text-white mb-1">{cs.clientName}</div>
            <div className="text-xs">{cs.industry}</div>
          </Link>
        ))}
    </div>
    <Link 
      href="/case-studies"
      className={`inline-flex items-center text-sm ${STYLES.textAccent} hover:text-cyan-400 transition-colors`}
    >
      View all case studies
      <ArrowRightIcon className="ml-1 h-3 w-3" />
    </Link>
  </div>
);

// Component for bottom CTA section
const CallToAction = ({ router, theme }: { router: any, theme: Theme }) => (
  <div className="relative py-16 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"></div>
    
    <SectionContainer className="relative z-10">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedElement animation="fadeInUp">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to achieve similar results?
          </h2>
          <p className={`mb-8 ${getThemeStyle('text-secondary', theme)}`}>
            Let's discuss how we can help your business establish a strong online presence and achieve your digital marketing goals.
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
        <div key={i} className={`h-full w-px ${STYLES.accent} justify-self-center`}></div>
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
      <div className="py-16 relative overflow-hidden">
        {/* Hexagonal accent shapes */}
        <div className={`absolute -left-20 top-40 w-40 h-40 border ${STYLES.borderAccent}/20 transform rotate-45 opacity-30`}></div>
        <div className={`absolute -right-20 bottom-40 w-60 h-60 border ${STYLES.borderAccent}/20 transform rotate-12 opacity-20`}></div>
        
        <SectionContainer className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main content column */}
            <div className="lg:col-span-8">
              <StaggeredGroup>
                {/* Our Approach section with numbered steps */}
                <StaggeredItem>
                  <div className={STYLES.section.spacing}>
                    <SectionHeader title="Our Approach" theme={theme} />
                    
                    <div className={`${STYLES.section.contentSpacing} pl-4 border-l border-gray-800/50`}>
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
                  <div className={STYLES.section.spacing}>
                    <SectionHeader title="The Results" theme={theme} />
                    
                    <div className={STYLES.grid.twoColumn}>
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
