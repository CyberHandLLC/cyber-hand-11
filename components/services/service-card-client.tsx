"use client";

/**
 * Service Card Client Component
 * 
 * This component handles only the interactive parts of the service card,
 * specifically the "Request Service" button with its onClick handler.
 * By isolating just the interactive elements to a Client Component,
 * we minimize client-side JavaScript while maintaining full functionality.
 */

import React from "react";
import { Button } from "@/components/ui/button";

interface ServiceCardClientProps {
  id: string;
  popular: boolean;
}

export function ServiceCardClient({ 
  id, 
  popular 
}: ServiceCardClientProps) {
  // Client-side handler for selecting a service
  const handleSelect = (_serviceId: string) => {
    // Track selection for analytics
    if (typeof window !== 'undefined') {
      // In a real implementation, this would call an analytics service
      // For example: analyticsService.trackServiceSelection(serviceId);
    }
    
    // Scroll to contact form
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <Button
      variant={popular ? "primary" : "outline"}
      className="w-full mt-auto"
      onClick={() => handleSelect(id)}
    >
      Request Service
    </Button>
  );
}
