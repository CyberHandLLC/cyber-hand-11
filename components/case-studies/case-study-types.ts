import { CaseStudyProps } from "@/components/custom/case-study-card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Define the Theme type locally to match theme-context.tsx
export type Theme = "light" | "dark";

// Component type definitions
export type CaseStudyHeaderProps = {
  caseStudy: CaseStudyProps;
  theme: Theme;
};

export type CaseStudyContentProps = {
  caseStudy: CaseStudyProps;
  theme: Theme;
  router: AppRouterInstance;
};

export type ApproachStepProps = {
  step: string;
  index: number;
  theme: Theme;
};

export type ResultItemProps = {
  result: string;
  theme: Theme;
};

export type TestimonialProps = {
  quote: string;
  author: string;
  theme: Theme;
};

export type SidebarCardProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onClick: () => void;
  theme: Theme;
};

export type SectionHeaderProps = {
  title: string;
  theme: Theme;
};
