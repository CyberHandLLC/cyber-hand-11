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
import { AnimatedContactInfoClient } from "./components/animated-contact-info-client";
// No skeleton imports needed with our new spinner components
import {
  FormErrorBoundaryClient,
  ContentErrorBoundaryClient,
} from "@/app/components/error-boundary-client";
import dynamic from "next/dynamic";

// Import loading components with dynamic import to maintain proper client/server separation
// Using fully resolved absolute path to fix module resolution
const LoadingWrapperClient = dynamic(
  () => import("../../app/components/ui/client/loading-wrapper-client").then(mod => mod.LoadingWrapperClient),
  { ssr: true }
);

/**
 * Define page metadata for SEO
 */
export const metadata = {
  title: "Contact Us | Cyber Hand",
  description:
    "Get in touch with Cyber Hand for web development, digital marketing, and other digital services. We're here to help transform your digital presence.",
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
 * Enhanced form loading UI with spinner
 */
function FormSkeleton() {
  return (
    <div className="rounded-lg border border-gray-700/50 p-8 bg-gray-900/30">
      {/* We know the component accepts these props but TypeScript can't verify at compile time */}
      <LoadingWrapperClient 
        height="h-80" 
        label="Loading contact form..." 
        spinnerSize={28}
      />
    </div>
  );
}

/**
 * ContactInfoSkeleton Component
 * Enhanced contact info loading UI with spinner
 */
function ContactInfoSkeleton() {
  return (
    <div className="rounded-lg border border-gray-700/50 p-8 bg-gray-900/30 h-full">
      {/* We know the component accepts these props but TypeScript can't verify at compile time */}
      <LoadingWrapperClient 
        height="h-72" 
        label="Loading contact information..." 
        spinnerSize={24}
      />
    </div>
  );
}

/**
 * ContactFormSection Component
 * Encapsulates the contact form with its suspense boundary and error handling
 */
function ContactFormSection() {
  return (
    <FormErrorBoundaryClient>
      <Suspense fallback={<FormSkeleton />}>
        <ContactForm />
      </Suspense>
    </FormErrorBoundaryClient>
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
    "Discuss partnership opportunities",
  ];

  // Using specific icon types from the component's allowed values
  const contactInfo = [
    {
      icon: "Mail" as const, // Type assertion to ensure this is a valid icon
      label: "Email",
      value: "support@cyber-hand.com",
      href: "mailto:ap@cyber-hand.com",
    },
    {
      icon: "Phone" as const, // Type assertion to ensure this is a valid icon
      label: "Phone",
      value: "(740) 748-4263",
      href: "tel:+17407484263",
    },
  ];

  return (
    <ContentErrorBoundaryClient>
      <Suspense fallback={<ContactInfoSkeleton />}>
        <AnimatedContactInfoClient reasons={reasons} contactInfo={contactInfo} />
      </Suspense>
    </ContentErrorBoundaryClient>
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
