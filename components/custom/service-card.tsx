"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement } from "@/lib/animation-utils";
import { CheckIcon } from "@/components/ui/icons";

export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

interface ServiceCardProps extends ServiceProps {
  index: number;
  onSelect: (id: string) => void;
  className?: string; // Optional className for additional styling
}

export function ServiceCard({
  id,
  title,
  description,
  price,
  features,
  icon,
  popular,
  index,
  onSelect,
  className = "", // Default to empty string if not provided
}: ServiceCardProps) {
  const { theme } = useTheme();

  // Calculate animation delay based on index
  const delay = index * 0.1;

  return (
    <AnimatedElement
      animation="fadeInUp"
      delay={delay}
      className={`relative rounded-xl p-4 sm:p-6 transition-all duration-300 flex flex-col h-full ${getThemeStyle("bg-card", theme)} ${
        popular ? "shadow-xl" : "shadow-md"
      } ${className}`}
    >
      {/* Popular badge - adjusted position to prevent clipping */}
      {popular && (
        <div
          className={`absolute -top-3 right-1/2 transform translate-x-1/2 ${getThemeStyle("badge", theme)} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}
        >
          Popular Choice
        </div>
      )}

      {/* Icon */}
      <div className={`mb-4 text-3xl ${popular ? "text-cyan-500" : "text-gray-400"}`}>{icon}</div>

      {/* Title */}
      <h3 className={`text-xl font-bold mb-2 ${getThemeStyle("text-primary", theme)}`}>{title}</h3>

      {/* Description - Adjusted for better mobile readability */}
      <p
        className={`text-xs sm:text-sm mb-3 sm:mb-4 min-h-[40px] sm:min-h-[60px] ${getThemeStyle("text-secondary", theme)}`}
      >
        {description}
      </p>

      {/* Price - Responsive typography */}
      <div className="mb-4 sm:mb-6 flex items-baseline">
        <span className={`text-2xl sm:text-3xl font-bold ${getThemeStyle("text-primary", theme)}`}>
          {price}
        </span>
        <span className="text-xs sm:text-sm ml-1 text-gray-500">/month</span>
      </div>

      {/* Features - Improved spacing for mobile */}
      <ul className="mb-4 sm:mb-6 space-y-1 sm:space-y-2 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <CheckIcon
              className={`mr-1.5 sm:mr-2 mt-0.5 ${popular ? "text-cyan-500" : getThemeStyle("text-muted", theme)}`}
              size="sm"
            />
            <span className={`text-xs sm:text-sm ${getThemeStyle("text-secondary", theme)}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <Button
        variant={popular ? "primary" : "outline"}
        className="w-full mt-auto"
        onClick={() => onSelect(id)}
      >
        Request Service
      </Button>
    </AnimatedElement>
  );
}
