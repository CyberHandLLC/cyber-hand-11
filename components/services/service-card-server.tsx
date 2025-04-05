/**
 * Service Card Server Component
 * 
 * This component renders the static parts of a service card.
 * It doesn't include any client-side interactivity, making it
 * efficiently renderable on the server.
 */

import React from "react";
import { CheckIcon } from "@/components/ui/icons";
import { ServiceCardClient } from "@/components/services/service-card-client";

export interface ServiceProps {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

interface ServiceCardServerProps {
  service: ServiceProps;
  _index: number;
}

export function ServiceCardServer({ 
  service,
  _index
}: ServiceCardServerProps) {
  const { 
    id, 
    title, 
    description, 
    price, 
    features, 
    icon, 
    popular 
  } = service;
  
  // Server rendering uses static CSS classes instead of theme-dependent ones
  const cardStyle = popular
    ? "relative rounded-xl p-6 transition-all duration-300 flex flex-col h-full bg-gray-800/75 dark:bg-gray-900/60 border border-gray-700/30 shadow-xl"
    : "relative rounded-xl p-6 transition-all duration-300 flex flex-col h-full bg-gray-800/75 dark:bg-gray-900/60 border border-gray-700/30 shadow-md";
    
  const badgeStyle = "absolute -top-3 right-1/2 transform translate-x-1/2 bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border border-cyan-500/30";
  const iconStyle = popular ? "mb-4 text-3xl text-cyan-500" : "mb-4 text-3xl text-gray-400";
  const titleStyle = "text-xl font-bold mb-2 text-white";
  const descriptionStyle = "text-sm mb-4 min-h-[60px] text-gray-300";
  const checkIconStyle = popular ? "mr-2 mt-0.5 text-cyan-500" : "mr-2 mt-0.5 text-gray-500";
  const featureTextStyle = "text-gray-300";
  
  return (
    <div className={cardStyle}>
      {/* Popular badge */}
      {popular && (
        <div className={badgeStyle}>
          Popular Choice
        </div>
      )}
      
      {/* Icon */}
      <div className={iconStyle}>
        {icon}
      </div>
      
      {/* Title */}
      <h3 className={titleStyle}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={descriptionStyle}>
        {description}
      </p>
      
      {/* Price */}
      <div className="mb-6 flex items-baseline">
        <span className="text-3xl font-bold text-white">{price}</span>
        <span className="text-sm ml-1 text-gray-500">/month</span>
      </div>
      
      {/* Features */}
      <ul className="mb-6 space-y-2 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <CheckIcon 
              className={checkIconStyle} 
              size="sm"
            />
            <span className={featureTextStyle}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      
      {/* Client boundary for interactive button */}
      <ServiceCardClient id={id} popular={popular || false} />
    </div>
  );
}
