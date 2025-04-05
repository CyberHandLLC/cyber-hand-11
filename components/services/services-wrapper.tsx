"use client";

/**
 * Services Wrapper Client Component
 * 
 * This component handles the animations and interactions for the services section.
 * It wraps Server Components for better performance while maintaining all interactive features.
 */

import React from "react";
import { AnimatedElement } from "@/lib/animation-utils";
import { ServiceCardServer, type ServiceProps } from "./service-card-server";

interface ServicesWrapperProps {
  services: ServiceProps[];
}

export function ServicesWrapper({ services }: ServicesWrapperProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <AnimatedElement 
          key={service.id} 
          animation="fadeInUp"
          delay={index * 0.1}
          className="h-full transform transition-transform hover:-translate-y-2 duration-300"
        >
          <ServiceCardServer 
            service={service}
            _index={index}
          />
        </AnimatedElement>
      ))}
    </div>
  );
}
