"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

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
  onSelect 
}: ServiceCardProps) {
  const { theme } = useTheme();
  
  // Calculate animation delay based on index
  const delay = index * 0.1;
  
  // Theme-based styling
  const cardClass = theme === "light"
    ? "bg-white border border-gray-200 hover:border-cyan-400"
    : "bg-[#161e29] border border-gray-800 hover:border-cyan-400";
    
  const priceClass = theme === "light"
    ? "text-gray-900"
    : "text-white";
    
  const badgeClass = theme === "light"
    ? "bg-cyan-100 text-cyan-800"
    : "bg-cyan-900/50 text-cyan-300";

  return (
    <motion.div
      className={`relative rounded-xl p-6 transition-all duration-300 flex flex-col h-full ${cardClass} ${
        popular ? "shadow-xl" : "shadow-md"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ 
        y: -5,
        transition: { delay: 0 }
      }}
    >
      {/* Popular badge - adjusted position to prevent clipping */}
      {popular && (
        <div className={`absolute -top-3 right-1/2 transform translate-x-1/2 ${badgeClass} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}>
          Popular Choice
        </div>
      )}
      
      {/* Icon */}
      <div className={`mb-4 text-3xl ${popular ? "text-cyan-500" : "text-gray-400"}`}>
        {icon}
      </div>
      
      {/* Title */}
      <h3 className={`text-xl font-bold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={`text-sm mb-4 min-h-[60px] ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
        {description}
      </p>
      
      {/* Price */}
      <div className="mb-6 flex items-baseline">
        <span className={`text-3xl font-bold ${priceClass}`}>{price}</span>
        <span className="text-sm ml-1 text-gray-500">/month</span>
      </div>
      
      {/* Features */}
      <ul className="mb-6 space-y-2 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <svg 
              className={`mr-2 h-5 w-5 mt-0.5 ${popular ? "text-cyan-500" : theme === "light" ? "text-gray-400" : "text-gray-600"}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
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
    </motion.div>
  );
}
