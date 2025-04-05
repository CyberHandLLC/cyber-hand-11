"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CyberLogo({ className = "", size = "md" }: CyberLogoProps) {
  return (
    <div className={cn("relative", className)}>
      <motion.h2 
        className={cn(
          "font-orbitron font-bold tracking-wider cyber-gradient-text animate-text-flicker",
          size === "sm" && "text-2xl sm:text-3xl",
          size === "md" && "text-3xl sm:text-4xl md:text-5xl",
          size === "lg" && "text-4xl sm:text-5xl md:text-6xl",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span>CYBER</span>
        <span className="relative">
          HAND
          <motion.span 
            className="absolute -top-1 -right-1 h-[2px] w-[2px] rounded-full bg-cyan-400"
            animate={{
              boxShadow: [
                "0 0 2px 1px rgba(6,182,212,0.5)",
                "0 0 3px 2px rgba(6,182,212,0.7)",
                "0 0 2px 1px rgba(6,182,212,0.5)",
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </span>
      </motion.h2>
      
      {/* Circuit line decoration */}
      <div className="absolute h-[1px] bg-cyan-500/50 bottom-0 left-0 right-0" />
      <div className="absolute h-[1px] bg-cyan-500/30 -bottom-1 left-2 right-2" />
      <div className="absolute h-[1px] bg-cyan-500/20 -bottom-2 left-4 right-4" />
    </div>
  );
}
