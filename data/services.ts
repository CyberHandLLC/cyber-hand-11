// Service types and data
export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

// Services data with pricing information
export const services: ServiceProps[] = [
  {
    id: "website-development",
    title: "Website Development",
    description: "Modern, responsive websites built with cutting-edge technologies",
    price: "$69",
    features: [
      "Responsive design",
      "SEO optimized",
      "Mobile-friendly",
      "Regular updates",
      "24/7 technical support",
    ],
    icon: "🌐",
  },
  {
    id: "google-ads",
    title: "Google Ads Management",
    description: "Strategic ad campaigns to maximize your ROI and reach your target audience",
    price: "$199",
    features: [
      "Keyword research",
      "Ad creation",
      "Performance monitoring",
      "Conversion tracking",
      "Monthly reporting",
    ],
    icon: "📊",
    popular: true,
  },
  {
    id: "social-media",
    title: "Social Media Content",
    description: "Engaging content creation for multiple platforms to grow your audience",
    price: "$199",
    features: [
      "Content calendar",
      "Custom graphics",
      "Community management",
      "Performance analytics",
      "Growth strategies",
    ],
    icon: "📱",
  },
  {
    id: "enhanced-seo",
    title: "Enhanced SEO",
    description: "Boost your visibility with our advanced SEO techniques and strategies",
    price: "$199",
    features: [
      "Keyword optimization",
      "Content strategy",
      "Technical SEO",
      "Backlink building",
      "Rank tracking",
    ],
    icon: "🔍",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description: "Next-gen AI solutions to automate and enhance your business processes",
    price: "$299",
    features: [
      "Custom AI solutions",
      "Chatbot development",
      "Process automation",
      "Data analysis",
      "Ongoing optimization",
    ],
    icon: "🤖",
  },
];
