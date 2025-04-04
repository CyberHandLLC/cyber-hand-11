"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement } from "@/lib/animation-utils";
import { ArrowLeftIcon } from "@/components/ui/icons";
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
      {/* Hero section */}
      <div className="w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10"></div>
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
        
        <div className="relative w-full h-[50vh] md:h-[60vh]">
          <Image
            src={caseStudy.imageUrl}
            alt={caseStudy.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full z-20 flex items-center">
          <SectionContainer className="py-16">
            <AnimatedElement animation="fadeInUp" className="max-w-3xl">
              <Link 
                href="/case-studies" 
                className={`inline-flex items-center text-sm font-medium text-white/80 hover:text-white mb-8 transition-colors`}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Case Studies
              </Link>
              
              <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/80 text-white inline-block mb-4`}>
                {caseStudy.industry}
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                {caseStudy.title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/90">
                {caseStudy.clientName} • {caseStudy.location}
              </p>
            </AnimatedElement>
          </SectionContainer>
        </div>
      </div>
      
      {/* Case study content */}
      <SectionContainer className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-2">
              <h2 className={`text-2xl font-bold mb-6 ${getThemeStyle('text-primary', theme)}`}>
                The Challenge
              </h2>
              <p className={`mb-8 leading-relaxed ${getThemeStyle('text-secondary', theme)}`}>
                {caseStudy.challenge}
              </p>
              
              <h2 className={`text-2xl font-bold mb-6 ${getThemeStyle('text-primary', theme)}`}>
                Our Approach
              </h2>
              <div className="space-y-4 mb-8">
                {caseStudy.approach.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className={`${getThemeStyle('text-secondary', theme)}`}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
              
              <h2 className={`text-2xl font-bold mb-6 ${getThemeStyle('text-primary', theme)}`}>
                The Results
              </h2>
              <ul className="space-y-4 mb-8">
                {caseStudy.results.map((result, index) => (
                  <li key={index} className="flex">
                    <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 mr-3`}></span>
                    <span className={`${getThemeStyle('text-secondary', theme)}`}>
                      {result}
                    </span>
                  </li>
                ))}
              </ul>
              
              {caseStudy.testimonial && (
                <div className={`${getThemeStyle('bg-secondary', theme)} p-6 rounded-lg border-l-4 border-cyan-500 my-8`}>
                  <blockquote className={`italic text-lg ${getThemeStyle('text-secondary', theme)}`}>
                    "{caseStudy.testimonial}"
                  </blockquote>
                  <div className={`mt-4 font-medium ${getThemeStyle('text-primary', theme)}`}>
                    — {caseStudy.clientName}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className={`sticky top-24 p-6 rounded-lg ${getThemeStyle('bg-secondary', theme)}`}>
                <h3 className={`text-lg font-bold mb-4 ${getThemeStyle('text-primary', theme)}`}>
                  Services Provided
                </h3>
                <ul className="space-y-2 mb-6">
                  {caseStudy.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 mr-3`}></span>
                      <span className={`text-sm ${getThemeStyle('text-secondary', theme)}`}>
                        {service}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push("/contact")}
                >
                  Get Similar Results
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related case studies (future enhancement) */}
          {/* Call to action */}
          <div className={`text-center p-8 rounded-xl ${getThemeStyle('bg-secondary', theme)} mt-16`}>
            <h2 className={`text-2xl font-bold mb-4 ${getThemeStyle('text-primary', theme)}`}>
              Ready to achieve similar results?
            </h2>
            <p className={`mb-6 max-w-2xl mx-auto ${getThemeStyle('text-secondary', theme)}`}>
              Let's discuss how we can help your business establish a strong online presence and achieve your digital marketing goals.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/contact")}
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}
