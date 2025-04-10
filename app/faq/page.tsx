/**
 * FAQ Page - Server Component
 * 
 * Implements Next.js 15.2.4 best practices:
 * - Server Component for initial page rendering
 * - Client Component islands for interactive elements
 * - Suspense boundaries for streaming
 * - SEO optimization with structured data
 * - TypeScript interfaces for type safety
 */

import { Suspense } from "react";
import { Metadata } from "next";
import { FAQPageSchema } from "@/lib/seo/faq-structured-data";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { WebPageSchema } from "@/lib/seo/structured-data";
import { ContentErrorBoundary } from "@/app/components/error-boundary";
import { FAQAccordionClient } from "./components/faq-accordion-client";
import { faqs, faqCategories, type FAQCategory } from "@/data/faqs";
import { HeadingSkeleton } from "@/components/ui/skeleton";

// Page metadata following Next.js 15.2.4 pattern
export const metadata: Metadata = {
  title: "Frequently Asked Questions | Cyber Hand",
  description: "Find answers to common questions about our digital services, processes, and technologies.",
  keywords: ["FAQ", "questions", "answers", "digital services", "web development"],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | Cyber Hand",
    description: "Find answers to common questions about our digital services, processes, and technologies.",
    url: "/faq",
    siteName: "Cyber Hand",
    type: "website",
  },
};

/**
 * AccordionSkeleton Component
 * Loading state for FAQ accordions
 */
function AccordionSkeleton() {
  return (
    <div className="mb-12 space-y-4">
      <HeadingSkeleton level={3} width="40%" className="mb-4" />
      <div className="space-y-3 border rounded-lg border-gray-700/30 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-b border-gray-700/30 last:border-0 py-5">
            <div className="flex justify-between">
              <HeadingSkeleton level={4} width="80%" />
              <div className="h-5 w-5 rounded-full bg-gray-700/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * FAQ Page Component
 * Main page component with Server Component pattern
 */
export default function FAQPage() {
  // Group FAQs by category for the UI
  const categories = Object.keys(faqCategories) as FAQCategory[];
  
  return (
    <PageLayout>
      {/* SEO optimization with structured data */}
      <FAQPageSchema faqs={faqs} url="/faq" />
      <WebPageSchema
        title="Frequently Asked Questions | Cyber Hand"
        description="Find answers to common questions about our digital services, processes, and technologies."
        url="/faq"
        datePublished="2025-01-01"
        dateModified={new Date().toISOString()}
      />
      
      {/* Hero section */}
      <SectionContainer className="pt-20 lg:pt-28 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg mb-16">
          Find answers to common questions about our services, processes, and technologies.
          If you don&apos;t see your question here, feel free to <a href="/contact" className="text-cyan-400 hover:underline">contact us</a>.
        </p>
      </SectionContainer>

      {/* FAQ Categories */}
      <SectionContainer className="pb-20">
        <div className="grid grid-cols-1 gap-12">
          {categories.map((category) => (
            <ContentErrorBoundary key={category}>
              <Suspense fallback={<AccordionSkeleton />}>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">{faqCategories[category]}</h2>
                  <FAQAccordionClient category={category} />
                </div>
              </Suspense>
            </ContentErrorBoundary>
          ))}
        </div>
      </SectionContainer>
    </PageLayout>
  );
}
