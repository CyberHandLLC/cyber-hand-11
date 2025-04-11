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
    <div className="bg-background/95 dark:bg-slate-900/70 border border-cyan-500/20 dark:border-cyan-700/30 rounded-lg p-6 shadow-md relative overflow-hidden">
      {/* Decorative elements for cyberpunk aesthetic */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/40 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-cyan-500/40 to-transparent"></div>

      <h2 className="text-2xl font-bold mb-6 text-center cyber-gradient-text">Get In Touch</h2>

      {/* Pass the server-fetched data to the client component */}
      <ContactFormClient initialService={initialService} availableServices={availableServices} />
    </div>
  );
}
