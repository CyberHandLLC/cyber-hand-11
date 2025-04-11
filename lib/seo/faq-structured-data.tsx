/**
 * FAQ Structured Data Component
 *
 * Implements JSON-LD structured data for FAQs following schema.org standards
 * This improves SEO by enabling rich results in search engines
 * https://schema.org/FAQPage
 */

import type { FAQItem } from "@/data/faqs";

interface FAQPageProps {
  faqs: FAQItem[];
  url: string;
}

/**
 * Creates JSON-LD structured data for FAQ page
 *
 * @param faqs - Array of FAQ items
 * @param url - URL of the FAQ page
 */
export function FAQPageSchema({ faqs, url }: FAQPageProps) {
  // Don't render anything if no FAQs provided
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com";
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  // Create schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    url: fullUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

/**
 * Creates JSON-LD structured data for a single FAQ item
 * Used for pages that include a single FAQ section
 *
 * @param faq - Single FAQ item
 * @param url - URL of the page containing the FAQ
 */
export function SingleFAQSchema({ faq, url }: { faq: FAQItem; url: string }) {
  if (!faq) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com";
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: {
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    },
    url: fullUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
