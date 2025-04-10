"use client";

/**
 * ServicesMobile Component
 *
 * Client-side component that handles mobile carousel view of services.
 * Provides touch-friendly navigation and interaction.
 */

import { useRouter } from "next/navigation";
import { ServiceCarousel } from "@/components/custom/service-carousel";
import type { ServiceProps } from "@/data/services";

interface ServicesMobileProps {
  services: ServiceProps[];
}

export function ServicesMobile({ services }: ServicesMobileProps) {
  const router = useRouter();

  // Handle service selection
  const handleSelectService = (serviceId: string) => {
    // Navigate to contact page with selected service
    router.push(`/contact?service=${serviceId}`);
  };

  return <ServiceCarousel services={services} onSelectService={handleSelectService} />;
}
