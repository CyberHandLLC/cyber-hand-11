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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear any previous errors for this field
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
          <CheckCircleIcon className="text-green-600 dark:text-green-400" size="lg" />
        </div>
        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Message Sent!</h3>
        <p className="text-green-700 dark:text-green-400">{response.message}</p>
        <Button 
          variant="outline"
          className="mt-4" 
          onClick={() => setResponse(null)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }
  
  // Input field classes that change based on validation errors
  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full rounded-md border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";
    return fieldErrors[fieldName]
      ? `${baseClass} border-red-500 dark:border-red-700`
      : `${baseClass} border-gray-300 dark:border-gray-700`;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Show general error message if present */}
      {response && !response.success && response.message && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
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
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name[0]}</p>
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
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email[0]}</p>
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
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.message[0]}</p>
        )}
      </div>
      
      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          variant="primary"
          className="w-full md:w-auto"
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
