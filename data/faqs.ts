/**
 * FAQ Data Module
 * 
 * Structured FAQ data for the website, organized by categories
 * This follows the Q&A schema pattern for SEO optimization:
 * https://schema.org/FAQPage
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

export type FAQCategory = 
  | 'services' 
  | 'pricing' 
  | 'process'
  | 'technology'
  | 'support';

// Categorized FAQ data
export const faqCategories: Record<FAQCategory, string> = {
  services: 'Our Services',
  pricing: 'Pricing & Payments',
  process: 'Our Process',
  technology: 'Technology',
  support: 'Support & Maintenance'
};

// FAQ items with structured data for SEO
export const faqs: FAQItem[] = [
  {
    id: 'services-1',
    question: 'What digital services does Cyber Hand offer?',
    answer: 'Cyber Hand provides a full range of digital services including web development, UI/UX design, digital marketing, SEO optimization, and custom application development. We specialize in creating high-performance websites and applications that deliver exceptional user experiences.',
    category: 'services'
  },
  {
    id: 'services-2',
    question: 'Do you work with specific industries or business types?',
    answer: 'We work with businesses across various industries including healthcare, finance, education, e-commerce, and technology. Whether you\'re a startup, small business, or enterprise, our solutions are tailored to your specific needs and industry requirements.',
    category: 'services'
  },
  {
    id: 'pricing-1',
    question: 'How do you structure your pricing?',
    answer: 'Our pricing is transparent and project-based, determined by the scope, complexity, and timeline of your requirements. We offer flexible packages to accommodate different budget needs, with options for ongoing support and maintenance after project completion.',
    category: 'pricing'
  },
  {
    id: 'pricing-2',
    question: 'Do you offer ongoing maintenance packages?',
    answer: 'Yes, we offer various maintenance packages to keep your digital assets secure, up-to-date, and performing optimally. These include regular updates, security monitoring, performance optimization, and content updates, all available on monthly or annual subscription models.',
    category: 'pricing'
  },
  {
    id: 'process-1',
    question: 'What is your typical project process?',
    answer: 'Our process follows a structured methodology: Discovery (understanding your needs), Strategy (planning solutions), Design (creating the visual experience), Development (building the solution), Testing (ensuring quality), and Launch (deploying your project). We provide ongoing support afterwards to ensure long-term success.',
    category: 'process'
  },
  {
    id: 'process-2',
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary depending on scope and complexity. A standard website typically takes 6-8 weeks from concept to launch, while more complex applications can take 3-6 months. We provide detailed timelines during the proposal phase and keep you updated throughout the project.',
    category: 'process'
  },
  {
    id: 'technology-1',
    question: 'What technologies do you specialize in?',
    answer: 'We specialize in modern web technologies including Next.js, React, TypeScript, Node.js, and various cloud platforms. For databases, we work with SQL and NoSQL solutions including PostgreSQL, MongoDB, and Supabase. Our technology stack is always chosen to best meet your project requirements and performance goals.',
    category: 'technology'
  },
  {
    id: 'technology-2',
    question: 'Is my website going to be mobile-friendly?',
    answer: 'Absolutely. All our websites are built with a mobile-first approach, ensuring they work seamlessly across all devices and screen sizes. We implement responsive design principles and thoroughly test on various devices to guarantee optimal performance and user experience everywhere.',
    category: 'technology'
  },
  {
    id: 'support-1',
    question: 'What kind of support do you provide after launch?',
    answer: 'After launch, we provide technical support, regular maintenance, security updates, and assistance with content updates. Our support packages include different service levels to match your needs, from basic maintenance to comprehensive management of your digital presence.',
    category: 'support'
  },
  {
    id: 'support-2',
    question: 'How quickly do you respond to support requests?',
    answer: 'We pride ourselves on responsive support with initial response times of 24 hours or less for standard requests. For urgent issues, our premium support plans offer expedited response within 4-8 hours. Each support request is tracked and managed through our dedicated ticketing system.',
    category: 'support'
  }
];

// Helper function to get FAQs by category
export function getFaqsByCategory(category: FAQCategory): FAQItem[] {
  return faqs.filter(faq => faq.category === category);
}

// Helper function to get all FAQs grouped by category
export function getFaqsGroupedByCategory(): Record<FAQCategory, FAQItem[]> {
  return Object.values(faqCategories).reduce((acc, _, index) => {
    const category = Object.keys(faqCategories)[index] as FAQCategory;
    acc[category] = getFaqsByCategory(category);
    return acc;
  }, {} as Record<FAQCategory, FAQItem[]>);
}
