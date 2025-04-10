"use client";

import { AnimatedElement as _AnimatedElement } from "@/lib/animation-utils";
import { getThemeStyle } from "@/lib/theme-utils";
import { CASE_STUDY_STYLES } from "@/lib/case-study-styles";
import {
  SectionHeaderProps,
  ApproachStepProps,
  ResultItemProps,
  TestimonialProps,
  SidebarCardProps,
  Theme,
} from "./case-study-types";
import { ArrowRightIcon as _ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

// Component for section headers with consistent styling
export const SectionHeader = ({ title, theme }: SectionHeaderProps) => (
  <div className="flex items-center mb-6">
    <div className={`w-12 h-2 ${CASE_STUDY_STYLES.accent}`}></div>
    <h2
      className={`text-2xl ${CASE_STUDY_STYLES.headings.h2} ml-4 ${getThemeStyle("text-primary", theme)}`}
    >
      {title}
    </h2>
  </div>
);

// Component for individual approach steps
export const ApproachStep = ({ step, index, theme }: ApproachStepProps) => (
  <div className="relative">
    <div
      className={`absolute -left-6 w-10 h-10 rounded-full bg-black border ${CASE_STUDY_STYLES.borderAccent}/50 flex items-center justify-center`}
    >
      <span className={`${CASE_STUDY_STYLES.textAccent} font-mono text-sm`}>{index + 1}</span>
    </div>
    <div className={`pl-8 ${getThemeStyle("text-secondary", theme)}`}>{step}</div>
  </div>
);

// Component for result items
export const ResultItem = ({ result, theme }: ResultItemProps) => (
  <div className={`p-6 ${CASE_STUDY_STYLES.card} ${CASE_STUDY_STYLES.cardHover}`}>
    <div className="flex items-start">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${CASE_STUDY_STYLES.accentLight} flex items-center justify-center mr-4`}
      >
        <CheckIcon size="sm" className={CASE_STUDY_STYLES.textAccent} />
      </div>
      <div className={getThemeStyle("text-secondary", theme)}>{result}</div>
    </div>
  </div>
);

// Component for testimonial
export const Testimonial = ({ quote, author, theme }: TestimonialProps) => (
  <div className={CASE_STUDY_STYLES.section.spacing + " relative"}>
    <div className="absolute -top-6 -left-6 text-6xl text-cyan-500/20 font-serif">&ldquo;</div>
    <div className="absolute -bottom-6 -right-6 text-6xl text-cyan-500/20 font-serif">&rdquo;</div>

    <div
      className={`relative z-10 p-8 rounded-lg ${getThemeStyle("bg-secondary", theme)} border-l-2 ${CASE_STUDY_STYLES.borderAccent}`}
    >
      <blockquote className={`italic text-lg ${getThemeStyle("text-secondary", theme)} mb-6`}>
        {quote}
      </blockquote>
      <div className={`font-medium ${getThemeStyle("text-primary", theme)} flex items-center`}>
        <div className={`w-8 h-1 ${CASE_STUDY_STYLES.accent}/50 mr-3`}></div>
        {author}
      </div>
    </div>
  </div>
);

// Component for sidebar cards
export const SidebarCard = ({
  title,
  description,
  buttonText,
  buttonIcon,
  onClick,
  theme,
}: SidebarCardProps) => (
  <div className={`p-6 ${CASE_STUDY_STYLES.card} mb-8`}>
    <h3 className={`text-xl ${CASE_STUDY_STYLES.headings.h3} mb-4 text-white`}>{title}</h3>
    <p className={`mb-6 ${getThemeStyle("text-secondary", theme)}`}>{description}</p>
    <Button variant="primary" className="w-full" onClick={onClick}>
      {buttonText}
      {buttonIcon}
    </Button>
  </div>
);

// The challenge section - reusable across case studies
export const ChallengeSection = ({ challenge, _theme }: { challenge: string; _theme: Theme }) => (
  <div
    className={`bg-gradient-to-r from-cyan-500/20 to-transparent p-6 rounded-lg border-l-2 ${CASE_STUDY_STYLES.borderAccent} mb-8`}
  >
    <h2 className={`text-xl ${CASE_STUDY_STYLES.headings.h3} text-white mb-3`}>The Challenge</h2>
    <p className="text-white/80">{challenge}</p>
  </div>
);

// Client info section - reusable across case studies
export const ClientInfo = ({ clientName, location }: { clientName: string; location: string }) => (
  <div className="flex items-center mb-8 text-white/90">
    <span className="text-base md:text-lg mr-4">{clientName}</span>
    <span className={`w-1.5 h-1.5 rounded-full ${CASE_STUDY_STYLES.accent}`}></span>
    <span className="text-base md:text-lg ml-4">{location}</span>
  </div>
);
