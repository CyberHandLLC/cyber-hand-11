"use client";

/**
 * FAQ Accordion - Client Component
 * 
 * Interactive accordion component for displaying FAQ items
 * Uses client-side interactivity for toggling answers
 */

import { useState } from "react";
import type { FAQItem } from "@/data/faqs";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  faq: FAQItem;
  isOpen?: boolean;
  toggleFaq?: (id: string) => void;
  className?: string;
}

export function FAQAccordion({ faq, isOpen = false, toggleFaq, className }: FAQAccordionProps) {
  // Local state if no toggle function is provided
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  
  // Determine if the accordion is controlled or uncontrolled
  const isControlled = typeof toggleFaq === 'function';
  const isExpanded = isControlled ? isOpen : localIsOpen;
  
  // Handle click to toggle accordion
  const handleToggle = () => {
    if (isControlled && toggleFaq) {
      toggleFaq(faq.id);
    } else {
      setLocalIsOpen(prev => !prev);
    }
  };
  
  return (
    <div 
      className={cn(
        "border-b border-gray-700/30 last:border-0",
        className
      )}
    >
      <button
        className="flex justify-between items-center w-full py-5 px-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={`faq-content-${faq.id}`}
      >
        <h3 className="text-lg font-medium text-white pr-8">{faq.question}</h3>
        <span 
          className={cn(
            "flex items-center justify-center h-6 w-6 text-cyan-500 transition-transform duration-200", 
            isExpanded ? "transform rotate-180" : ""
          )}
          aria-hidden="true"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      
      <div 
        id={`faq-content-${faq.id}`}
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-96 opacity-100 pb-5 px-4" : "max-h-0 opacity-0"
        )}
        aria-hidden={!isExpanded}
      >
        <div className="prose prose-invert prose-cyan max-w-none">
          <p className="text-gray-300">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * FAQ Accordion Group - Client Component
 * 
 * Container for multiple FAQ accordions with state management
 */
interface FAQAccordionGroupProps {
  faqs: FAQItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function FAQAccordionGroup({ faqs, allowMultiple = false, className }: FAQAccordionGroupProps) {
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});
  
  // Toggle a specific FAQ open/closed
  const toggleFaq = (id: string) => {
    setOpenFaqs(prev => {
      // If allowing multiple open accordions, toggle the clicked one
      if (allowMultiple) {
        return { ...prev, [id]: !prev[id] };
      }
      
      // If only allowing one open accordion at a time
      // Close all except the clicked one, which gets toggled
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
      
      return { ...allClosed, [id]: !prev[id] };
    });
  };
  
  return (
    <div className={cn("divide-y divide-gray-700/30 rounded-lg", className)}>
      {faqs.map((faq) => (
        <FAQAccordion
          key={faq.id}
          faq={faq}
          isOpen={!!openFaqs[faq.id]}
          toggleFaq={toggleFaq}
        />
      ))}
    </div>
  );
}
