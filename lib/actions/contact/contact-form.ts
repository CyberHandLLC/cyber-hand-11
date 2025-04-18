"use server";

/**
 * Contact Form Server Actions
 *
 * This module implements Server Actions for the contact form.
 * Server Actions allow forms to be submitted directly to the server
 * without client-side JavaScript, providing a more efficient and
 * progressive enhancement approach.
 *
 * Following Next.js 15.2.4 best practices:
 * - Uses Zod for schema validation
 * - Type-safe environment variables
 * - Proper error handling with structured responses
 * - Uses a single email provider (Postmark) for consistency
 */

import { z } from "zod";
import { ServerClient } from "postmark";
import { cache } from "react";

// Create a type-safe way to access environment variables
const env = {
  postmarkServerToken: process.env.POSTMARK_SERVER_TOKEN,
  fromEmail: process.env.POSTMARK_FROM_EMAIL || "ap@cyber-hand.com",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@cyber-hand.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com",
};

// Define validation schema for form data
const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  service: z.string().optional(),
});

// Types for form data and response
export type FormData = z.infer<typeof FormSchema>;

export interface FormResponse {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  code?: string; // For more specific error handling on the client
}

/**
 * Submit contact form data
 *
 * This Server Action handles form submission, validation, and processing.
 * It can be called directly from a form using the action attribute.
 */
export async function submitContactForm(formData: FormData): Promise<FormResponse> {
  try {
    // Validate form data
    const validatedData = FormSchema.safeParse(formData);

    if (!validatedData.success) {
      // Return validation errors
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Please check the form for errors",
      };
    }

    // Form data is valid, process the submission
    const data = validatedData.data;

    // Check if Postmark token is configured
    if (!env.postmarkServerToken) {
      console.error("Postmark server token is not configured");
      return {
        success: false,
        message: "Email configuration error. Please contact the administrator.",
      };
    }

    try {
      // Get cached Postmark client
      const client = getPostmarkClient(env.postmarkServerToken);

      // Prepare email content
      const emailContent = {
        From: env.fromEmail,
        To: env.contactEmail,
        Subject: `New Contact Form Submission from ${data.name}`,
        TextBody: `
          Name: ${data.name}
          Email: ${data.email}
          ${data.company ? `Company: ${data.company}\n` : ""}
          ${data.service ? `Service: ${data.service}\n` : ""}
          
          Message:
          ${data.message}
          
          Sent from the contact form at ${env.siteUrl}
        `,
        HtmlBody: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
          ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><em>Sent from the contact form at ${env.siteUrl}</em></p>
        `,
        MessageStream: "outbound",
      };

      // Send the email
      const response = await client.sendEmail(emailContent);

      if (response.ErrorCode !== 0) {
        throw new Error(`Postmark error: ${response.Message}`);
      }

      // Return success response
      return {
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
      };
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return {
        success: false,
        message: "Unable to send your message at this time. Please try again later.",
      };
    }
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Contact form error:", error);

    // Return a user-friendly error response
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Get available services (for form dropdown)
 *
 * This Server Action fetches the list of services for the contact form.
 * Cached using React's cache() to optimize performance across requests.
 */
export const getAvailableServices = cache(async (): Promise<string[]> => {
  // In a real application, this would fetch from a database or API
  // Using React's cache() for request deduplication
  return [
    "Web Development",
    "Digital Marketing",
    "SEO Optimization",
    "UI/UX Design",
    "Mobile App Development",
    "Technical Consulting",
  ];
});

/**
 * Create a cached Postmark client to prevent recreating it on each request
 */
const getPostmarkClient = cache((serverToken: string): ServerClient => {
  if (!serverToken) {
    throw new Error("Postmark server token is required");
  }
  return new ServerClient(serverToken);
});
