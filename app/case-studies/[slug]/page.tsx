"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement, StaggeredGroup, StaggeredItem } from "@/lib/animation-utils";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

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
      {/* Modern header with diagonal split design */}
      <div className="relative overflow-hidden">
        {/* Navigation bar with cyber-style highlight */}
        <div className="relative z-20 pt-24 pb-4">
          <SectionContainer>
            <div className="flex justify-between items-center">
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
        
        {/* Split diagonal design */}
        <div className="relative">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span className="text-lg ml-4">{caseStudy.location}</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-500/20 to-transparent p-6 rounded-lg border-l-2 border-cyan-500 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-3">The Challenge</h2>
                    <p className="text-white/80">{caseStudy.challenge}</p>
                  </div>
                </AnimatedElement>
              </div>
            </SectionContainer>
          </div>
          
          {/* Image side - positioned with clip-path for diagonal effect */}
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-black z-0 clip-diagonal">
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
            <div className="h-full w-full relative">
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
      
      {/* Services band */}
      <div className={`${getThemeStyle('bg-secondary', theme)} py-6 border-y border-gray-800/50`}>
        <SectionContainer>
          <div className="flex flex-wrap gap-4 justify-center">
            {caseStudy.services.map((service, index) => (
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
      
      {/* Main content with hexagonal accents */}
      <div className="py-16 relative overflow-hidden">
        {/* Hexagonal accent shapes */}
        <div className="absolute -left-20 top-40 w-40 h-40 border border-cyan-500/20 transform rotate-45 opacity-30"></div>
        <div className="absolute -right-20 bottom-40 w-60 h-60 border border-cyan-500/20 transform rotate-12 opacity-20"></div>
        
        <SectionContainer className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main content column */}
            <div className="lg:col-span-8">
              <StaggeredGroup>
                {/* Our Approach section with numbered steps */}
                <StaggeredItem>
                  <div className="mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-2 bg-cyan-500"></div>
                      <h2 className={`text-2xl font-bold ml-4 ${getThemeStyle('text-primary', theme)}`}>
                        Our Approach
                      </h2>
                    </div>
                    
                    <div className="space-y-8 pl-4 border-l border-gray-800/50">
                      {caseStudy.approach.map((step, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-6 w-10 h-10 rounded-full bg-black border border-cyan-500/50 flex items-center justify-center">
                            <span className="text-cyan-400 font-mono text-sm">{index + 1}</span>
                          </div>
                          <div className={`pl-8 ${getThemeStyle('text-secondary', theme)}`}>
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </StaggeredItem>
                
                {/* Results section with highlight cards */}
                <StaggeredItem>
                  <div className="mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-2 bg-cyan-500"></div>
                      <h2 className={`text-2xl font-bold ml-4 ${getThemeStyle('text-primary', theme)}`}>
                        The Results
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {caseStudy.results.map((result, index) => (
                        <div 
                          key={index} 
                          className={`p-6 rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/40 to-transparent backdrop-blur-sm hover:border-cyan-500/30 transition-colors`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4">
                              <CheckIcon size="sm" className="text-cyan-400" />
                            </div>
                            <div className={getThemeStyle('text-secondary', theme)}>
                              {result}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </StaggeredItem>
                
                {/* Testimonial with modern highlight design */}
                {caseStudy.testimonial && (
                  <StaggeredItem>
                    <div className="mb-16 relative">
                      <div className="absolute -top-6 -left-6 text-6xl text-cyan-500/20 font-serif">"</div>
                      <div className="absolute -bottom-6 -right-6 text-6xl text-cyan-500/20 font-serif">"</div>
                      
                      <div className={`relative z-10 p-8 rounded-lg ${getThemeStyle('bg-secondary', theme)} border-l-2 border-cyan-500`}>
                        <blockquote className={`italic text-lg ${getThemeStyle('text-secondary', theme)} mb-6`}>
                          {caseStudy.testimonial}
                        </blockquote>
                        <div className={`font-medium ${getThemeStyle('text-primary', theme)} flex items-center`}>
                          <div className="w-8 h-1 bg-cyan-500/50 mr-3"></div>
                          {caseStudy.clientName}
                        </div>
                      </div>
                    </div>
                  </StaggeredItem>
                )}
              </StaggeredGroup>
            </div>
            
            {/* Sidebar column */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                {/* Get similar results card */}
                <div className={`p-6 rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm mb-8`}>
                  <h3 className={`text-xl font-semibold mb-4 text-white`}>
                    Want Similar Results?
                  </h3>
                  <p className={`mb-6 ${getThemeStyle('text-secondary', theme)}`}>
                    Let's discuss how we can help your business achieve the same level of success with our specialized services.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push("/contact")}
                  >
                    Get in Touch
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Related case studies teaser */}
                <div className={`p-6 rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm`}>
                  <h3 className={`text-lg font-semibold mb-4 text-white`}>
                    Explore More Case Studies
                  </h3>
                  <div className="space-y-2 mb-4">
                    {caseStudies
                      .filter(cs => cs.id !== caseStudy.id)
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
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
      
      {/* Call to action section with diagonal design */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-cyan-900/20"></div>
        
        <SectionContainer className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <AnimatedElement animation="fadeInUp">
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent`}>
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
            <div key={i} className="h-full w-px bg-cyan-500 justify-self-center"></div>
          ))}
        </div>
      </div>
      
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
