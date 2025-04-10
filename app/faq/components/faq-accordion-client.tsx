"use client";

/**
 * FAQ Accordion Client Component
 * 
 * Client-side component using shadcn/ui accordion for FAQ rendering
 * Follows Next.js 15.2.4 best practices for Client Components
 */

import { useState } from "react";
import { FAQCategory, FAQItem, getFaqsByCategory } from "@/data/faqs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface FAQAccordionClientProps {
  category: FAQCategory;
}

/**
 * FAQ Accordion Client component
 * Handles interactive accordion UI for FAQs by category
 */
export function FAQAccordionClient({ category }: FAQAccordionClientProps) {
  // Get FAQs for the specified category
  const categoryFaqs = getFaqsByCategory(category);
  
  // State for tracking accordion values for analytics (if needed)
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  
  // Handle accordion changes - can be used for analytics tracking
  const handleAccordionChange = (value: string) => {
    setOpenAccordion(value === openAccordion ? undefined : value);
    
    // Optional: Track FAQ interaction for analytics
    if (value !== openAccordion) {
      // Example analytics tracking
      try {
        const faq = categoryFaqs.find(f => f.id === value);
        if (faq) {
          // This could connect to your analytics system
          // Use an analytics service here instead of console.log
        }
      } catch (_error) {
        // Silently handle analytics errors
      }
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-700/30 bg-gray-900/10">
      <Accordion
        type="single"
        collapsible
        value={openAccordion}
        onValueChange={handleAccordionChange}
        className="w-full"
      >
        {categoryFaqs.map((faq: FAQItem) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">
              <h3 className="text-lg font-medium text-white pr-8">{faq.question}</h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-invert prose-cyan max-w-none">
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
