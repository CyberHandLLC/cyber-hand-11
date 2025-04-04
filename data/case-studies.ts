import { CaseStudyProps } from "@/components/custom/case-study-card";

export const caseStudies: CaseStudyProps[] = [
  {
    id: "hvac-company",
    title: "How We Helped an HVAC Company Launch Their Brand and Dominate Local Search",
    clientName: "Protech Heating & Cooling",
    industry: "HVAC",
    location: "Orrville, OH",
    services: [
      "Brand Creation (Logo & Identity)",
      "New Website Development",
      "Google Business Profile Setup & Optimization",
      "Local SEO"
    ],
    challenge: "The client had no existing website, no established brand, and no digital footprint. They needed to stand out in a competitive local HVAC market.",
    approach: [
      "Brand Creation: Designed a professional, modern logo and consistent branding elements (colors, fonts) for a cohesive identity.",
      "Website Development: Built a brand-new, responsive website from scratch—focusing on clarity of services, easy navigation, and ways to contact the company.",
      "Google Business Profile: Claimed and optimized their listing. Encouraged satisfied customers to leave reviews. Ensured accurate business info (address, phone, hours, etc.) for local searches.",
      "Local SEO Foundations: Set up basic on-page SEO for the new site. Incorporated local keywords (e.g., \"HVAC in Orrville\") to boost discoverability."
    ],
    results: [
      "5-Star Rating on Google (63 Reviews). This helps establish immediate credibility with new customers.",
      "#1 Local Ranking for relevant HVAC searches (within their area).",
      "Professional Online Presence that didn't exist before. The client now appears reputable and established to potential local customers."
    ],
    testimonial: "We went from zero online presence to a professional website and top local ranking in a matter of weeks, thanks to CyberHand. Now, customers find us right away—and our 5-star ratings speak for themselves!",
    imageUrl: "/images/hvac-case-study.jpg",
    slug: "hvac-local-seo-success"
  }
];
