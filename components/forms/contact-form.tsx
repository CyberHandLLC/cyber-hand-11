/**
 * Contact Form Server Component
 * 
 * This is a Server Component that wraps the client-side form.
 * It fetches the necessary data (available services) on the server
 * and passes it to the client component, demonstrating the
 * Server Components architecture pattern.
 */

import React from "react";
import { ContactFormClient } from "./contact-form-client";
import { getAvailableServices } from "@/lib/actions/contact/contact-form";

interface ContactFormProps {
  initialService?: string;
}

export async function ContactForm({ initialService }: ContactFormProps) {
  // Fetch available services on the server
  // This data fetching happens during server rendering and doesn't
  // require any client-side JavaScript
  const availableServices = await getAvailableServices();
  
  return (
    <div className="bg-gray-50/50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Get In Touch</h2>
      
      {/* Pass the server-fetched data to the client component */}
      <ContactFormClient 
        initialService={initialService}
        availableServices={availableServices}
      />
    </div>
  );
}
