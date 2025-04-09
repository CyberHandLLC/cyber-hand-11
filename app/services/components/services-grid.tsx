"use client";

/**
 * ServicesGrid Component
 * 
 * Client-side component that handles interactive service cards in a responsive grid.
 * Provides interactive elements for service selection.
 * Implements mobile-first responsive design approach with optimized grid layout.
 */

import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/custom/service-card";
import type { ServiceProps } from "@/data/services";

interface ServicesGridProps {
  services: ServiceProps[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const router = useRouter();

  // Handle service selection
  const handleSelectService = (serviceId: string) => {
    // Navigate to contact page with selected service
    router.push(`/contact?service=${serviceId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id}
          {...service}
          index={index}
          onSelect={handleSelectService}
          className="h-full" /* Ensure consistent height */
        />
      ))}
    </div>
  );
}
