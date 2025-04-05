/**
 * Contact Page - Server Component
 * 
 * This page implements the React Server Components architecture:
 * - The page itself is a Server Component
 * - Static content is rendered on the server
 * - The form uses Server Actions for submission
 * - Client interactivity is isolated to specific components
 */

import { Suspense } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { ContactForm } from "@/components/forms/contact-form";
import { AnimatedContactInfo } from "./components/animated-contact-info";
// Removed unused import: Icons

/**
 * Define page metadata for SEO
 */
export const metadata = {
  title: 'Contact Us | Cyber Hand',
  description: 'Get in touch with Cyber Hand for web development, digital marketing, and other digital services. We\'re here to help transform your digital presence.',
};

/**
 * Contact page using Server Components architecture
 * 
 * This is a Server Component that renders static content on the server
 * and delegates interactive elements to Client Components.
 */
export default function ContactPage() {
  return (
    <PageLayout>
      {/* Hero section */}
      <section className="py-24 md:py-32">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            {/* Static server-rendered content */}
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                Get in Touch
              </h1>
              
              <div className="mb-8 w-24 h-1 bg-cyan-500 mx-auto"></div>
              
              <p className="text-lg md:text-xl mb-12 text-gray-300">
                Ready to transform your digital presence? We&apos;re here to help you every step of the way.
              </p>
            </div>
            
            {/* Two column layout for form and contact info */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact form - Using Server Component with Client boundaries */}
              <div className="lg:col-span-3">
                <Suspense fallback={<div className="p-12 text-center">Loading contact form...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
              
              {/* Contact information - Uses a Client Component for animations */}
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="p-6 text-center">Loading contact information...</div>}>
                  <AnimatedContactInfo 
                    reasons={[
                      "Get a free consultation for your digital needs",
                      "Request a quote for your next project",
                      "Schedule a website audit to improve performance",
                      "Discuss partnership opportunities"
                    ]}
                    contactInfo={[
                      {
                        icon: "Mail",
                        label: "Email",
                        value: "info@cyber-hand.com",
                        href: "mailto:info@cyber-hand.com"
                      },
                      {
                        icon: "Phone",
                        label: "Phone",
                        value: "+1 (234) 567-8900",
                        href: "tel:+12345678900"
                      }
                    ]}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>
    </PageLayout>
  );
}
