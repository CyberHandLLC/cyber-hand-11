"use client";

/**
 * Contact Form Client Component
 *
 * This component handles the client-side aspects of the contact form:
 * - Form state management
 * - User input handling
 * - Error displays
 * - Loading states
 *
 * It uses the Server Action for form submission, providing a hybrid
 * approach that combines client-side interactivity with server-side processing.
 */

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormData, FormResponse, submitContactForm } from "@/lib/actions/contact/contact-form";
import { CheckCircleIcon } from "@/components/ui/icons";

interface ContactFormProps {
  initialService?: string;
  availableServices: string[];
}

export function ContactFormClient({ initialService, availableServices }: ContactFormProps) {
  // Form state management
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
    service: initialService || "",
  });

  // Form submission state
  const [response, setResponse] = useState<FormResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  // Field error tracking
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear any previous errors for this field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Use transition to avoid blocking the UI during submission
    startTransition(async () => {
      const result = await submitContactForm(formData);

      if (result.success) {
        // Clear form on success
        setFormData({
          name: "",
          email: "",
          company: "",
          message: "",
          service: "",
        });
      }

      // Store response data including any validation errors
      setResponse(result);
      setFieldErrors(result.errors || {});
    });
  };

  // Display success message when form is submitted successfully
  if (response?.success) {
    return (
      <div className="bg-cyan-50/80 dark:bg-slate-900/90 border border-cyan-300/30 dark:border-cyan-700/40 rounded-lg p-6 text-center shadow-lg animate-fade-in relative overflow-hidden">
        {/* Decorative success accent lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-cyan-500 to-transparent"></div>
        
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-cyan-100/90 dark:bg-cyan-900/30 mb-4 shadow-glow p-3 animate-pulse-glow">
          <CheckCircleIcon className="text-cyan-600 dark:text-cyan-400" size="lg" />
        </div>
        <h3 className="text-xl font-medium text-slate-800 dark:text-cyan-300 mb-2">
          Message Sent!
        </h3>
        <p className="text-slate-700 dark:text-slate-300">{response.message}</p>
        <Button 
          variant="outline" 
          className="mt-6 border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 transition-all duration-300" 
          onClick={() => setResponse(null)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  // Input field classes that change based on validation errors
  const getInputClass = (fieldName: string) => {
    const baseClass =
      "w-full rounded-md bg-transparent px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-cyan-400/70 transition-all duration-200";
    return fieldErrors[fieldName]
      ? `${baseClass} border-red-500 dark:border-red-700 shadow-sm shadow-red-500/20 dark:shadow-red-700/10`
      : `${baseClass} border-cyan-500/30 dark:border-cyan-700/40 shadow-sm hover:shadow-cyan-400/20 focus:shadow-cyan-400/30`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* Subtle grid background for depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none -z-10"></div>

      {/* Show general error message if present */}
      {response && !response.success && response.message && (
        <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-300/50 dark:border-red-700/50 rounded-lg p-4 text-red-700 dark:text-red-400 shadow-sm animate-fade-in">
          {response.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={getInputClass("name")}
            placeholder="Your Name"
            disabled={isPending}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fade-in">{fieldErrors.name[0]}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={getInputClass("email")}
            placeholder="your.email@example.com"
            disabled={isPending}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fade-in">{fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Field */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company || ""}
            onChange={handleChange}
            className={getInputClass("company")}
            placeholder="Your Company (Optional)"
            disabled={isPending}
          />
        </div>

        {/* Service Field */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium mb-1">
            Service You&apos;re Interested In
          </label>
          <select
            id="service"
            name="service"
            value={formData.service || ""}
            onChange={handleChange}
            className={getInputClass("service")}
            disabled={isPending}
          >
            <option value="">Select a Service (Optional)</option>
            {availableServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={getInputClass("message")}
          placeholder="How can we help you?"
          disabled={isPending}
        ></textarea>
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fade-in">{fieldErrors.message[0]}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-0 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300" 
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </Button>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          We&apos;ll never share your information with third parties.
        </p>
      </div>
    </form>
  );
}
