/**
 * Contact Page - Server Component
 * 
 * This page leverages Next.js 15's built-in streaming capabilities with:
 * - The page itself as a Server Component
 * - Static content rendered immediately
 * - Optimized Suspense boundaries for progressive streaming
 * - Integration with route-level loading.tsx for initial loading state
 * - Client Components only for interactive elements
 * - Standardized skeleton components for consistent loading experience
 * - Comprehensive error boundaries for graceful error recovery
 */

import { Suspense } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { ContactForm } from "@/components/forms/contact-form";
import { AnimatedContactInfo } from "./components/animated-contact-info";
import { HeadingSkeleton, TextSkeleton, Skeleton } from "@/components/ui/skeleton";
import { FormErrorBoundary, ContentErrorBoundary } from "@/app/components/error-boundary";

/**
 * Define page metadata for SEO
 */
export const metadata = {
  title: 'Contact Us | Cyber Hand',
  description: 'Get in touch with Cyber Hand for web development, digital marketing, and other digital services. We\'re here to help transform your digital presence.',
};

/**
 * ContactHeader Component
 * Static content that doesn't depend on data fetching
 */
function ContactHeader() {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
        Get in Touch
      </h1>
      
      <div className="mb-8 w-24 h-1 bg-cyan-500 mx-auto"></div>
      
      <p className="text-lg md:text-xl mb-12 text-gray-300">
        Ready to transform your digital presence? We&apos;re here to help you every step of the way.
      </p>
    </div>
  );
}

/**
 * FormSkeleton Component
 * Standardized skeleton UI for the contact form while it's loading
 */
function FormSkeleton() {
  return (
    <div className="rounded-lg border border-gray-700/50 p-8 bg-gray-900/30">
      <div className="space-y-6">
        {/* Name field */}
        <div>
          <TextSkeleton className="h-5 w-20 mb-2" animationDelay="0.1s" />
          <Skeleton className="h-10 w-full" animationDelay="0.15s" />
        </div>
        
        {/* Email field */}
        <div>
          <TextSkeleton className="h-5 w-24 mb-2" animationDelay="0.2s" />
          <Skeleton className="h-10 w-full" animationDelay="0.25s" />
        </div>
        
        {/* Message field */}
        <div>
          <TextSkeleton className="h-5 w-28 mb-2" animationDelay="0.3s" />
          <Skeleton className="h-28 w-full" animationDelay="0.35s" />
        </div>
        
        {/* Submit button */}
        <Skeleton className="h-11 w-32 mt-8" animationDelay="0.4s" />
      </div>
    </div>
  );
}

/**
 * ContactInfoSkeleton Component
 * Standardized skeleton UI for the contact info while it's loading
 */
function ContactInfoSkeleton() {
  return (
    <div className="rounded-lg border border-gray-700/50 p-8 bg-gray-900/30 h-full">
      {/* Title */}
      <HeadingSkeleton level={3} className="mb-6" width="40%" animationDelay="0.1s" />
      
      {/* Reasons */}
      <div className="space-y-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start">
            <Skeleton 
              className="h-5 w-5 rounded-full mr-3 mt-1 flex-shrink-0" 
              animationDelay={`${0.15 + i * 0.1}s`} 
            />
            <TextSkeleton 
              className="h-5 w-full" 
              animationDelay={`${0.2 + i * 0.1}s`} 
            />
          </div>
        ))}
      </div>
      
      {/* Contact info items */}
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <TextSkeleton 
              className="h-5 w-24" 
              animationDelay={`${0.6 + i * 0.1}s`} 
            />
            <HeadingSkeleton 
              level={4} 
              className="h-6 w-40" 
              animationDelay={`${0.65 + i * 0.1}s`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ContactFormSection Component 
 * Encapsulates the contact form with its suspense boundary and error handling
 */
function ContactFormSection() {
  return (
    <FormErrorBoundary>
      <Suspense fallback={<FormSkeleton />}>
        <ContactForm />
      </Suspense>
    </FormErrorBoundary>
  );
}

/**
 * ContactInfoSection Component
 * Encapsulates the contact info with its suspense boundary and error handling
 */
function ContactInfoSection() {
  // Define reasonable defaults for the contact info
  const reasons = [
    "Book a free consultation for your digital needs",
    "Request a quote for your next project",
    "Schedule a website audit to improve performance",
    "Discuss partnership opportunities"
  ];
  
  // Using specific icon types from the component's allowed values
  const contactInfo = [
    {
      icon: "Mail" as const, // Type assertion to ensure this is a valid icon
      label: "Email",
      value: "info@cyber-hand.com",
      href: "mailto:info@cyber-hand.com"
    },
    {
      icon: "Phone" as const, // Type assertion to ensure this is a valid icon
      label: "Phone",
      value: "+1 (234) 567-8900",
      href: "tel:+12345678900"
    }
  ];
  
  return (
    <ContentErrorBoundary>
      <Suspense fallback={<ContactInfoSkeleton />}>
        <AnimatedContactInfo 
          reasons={reasons}
          contactInfo={contactInfo}
        />
      </Suspense>
    </ContentErrorBoundary>
  );
}

/**
 * Contact page using Next.js 15 streaming capabilities
 * 
 * This component leverages Next.js 15's built-in streaming with:
 * - Route-level loading.tsx for initial loading state
 * - Immediate rendering of static content
 * - Strategic Suspense boundaries for progressive loading
 */
export default function ContactPage() {
  return (
    <PageLayout>
      {/* Hero section */}
      <section className="py-24 md:py-32">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            {/* Static header content renders immediately */}
            <ContactHeader />
            
            {/* Two column layout for form and contact info */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact form with optimized Suspense boundary */}
              <div className="lg:col-span-3">
                <ContactFormSection />
              </div>
              
              {/* Contact information with optimized Suspense boundary */}
              <div className="lg:col-span-2">
                <ContactInfoSection />
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>
    </PageLayout>
  );
}
