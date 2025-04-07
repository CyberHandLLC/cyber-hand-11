/**
 * Contact Page - Server Component
 * 
 * This page leverages Next.js 15's built-in streaming capabilities with:
 * - The page itself as a Server Component
 * - Static content rendered immediately
 * - Optimized Suspense boundaries for progressive streaming
 * - Integration with route-level loading.tsx for initial loading state
 * - Client Components only for interactive elements
 */

import { Suspense } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { ContactForm } from "@/components/forms/contact-form";
import { AnimatedContactInfo } from "./components/animated-contact-info";

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
 * Skeleton UI for the contact form while it's loading
 */
function FormSkeleton() {
  return (
    <div className="rounded-lg border border-gray-700/50 p-8 bg-gray-900/30">
      <div className="space-y-6">
        {/* Name field */}
        <div>
          <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-20 mb-2"></div>
          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        </div>
        
        {/* Email field */}
        <div>
          <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-16 mb-2"></div>
          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        </div>
        
        {/* Message field */}
        <div>
          <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-28 mb-2"></div>
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        </div>
        
        {/* Submit button */}
        <div className="h-12 bg-cyan-500/30 rounded animate-pulse w-40"></div>
      </div>
    </div>
  );
}

/**
 * ContactInfoSkeleton Component
 * Skeleton UI for the contact information while it's loading
 */
function ContactInfoSkeleton() {
  return (
    <div className="rounded-lg border border-gray-700/50 p-6 bg-gray-900/30">
      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-36 mb-6"></div>
      
      {/* Reasons list */}
      <div className="space-y-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="flex items-center"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="h-4 w-4 bg-cyan-500/30 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-5/6"></div>
          </div>
        ))}
      </div>
      
      {/* Contact info items */}
      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-32 mb-4"></div>
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div 
            key={i} 
            className="flex items-center"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="h-10 w-10 bg-gray-800 rounded-full mr-4 flex-shrink-0"></div>
            <div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-16 mb-2"></div>
              <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-32"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ContactFormSection Component
 * Async component for contact form with proper Suspense boundary
 */
function ContactFormSection() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ContactForm />
    </Suspense>
  );
}

/**
 * ContactInfoSection Component
 * Async component for contact information with proper Suspense boundary
 */
function ContactInfoSection() {
  // Define reasons and contact info here to be properly streamed
  const reasons = [
    "Get a free consultation for your digital needs",
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
    <Suspense fallback={<ContactInfoSkeleton />}>
      <AnimatedContactInfo 
        reasons={reasons}
        contactInfo={contactInfo}
      />
    </Suspense>
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
