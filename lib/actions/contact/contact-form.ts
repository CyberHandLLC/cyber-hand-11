"use server";

/**
 * Contact Form Server Actions
 *
 * This module implements Server Actions for the contact form.
 * Server Actions allow forms to be submitted directly to the server
 * without client-side JavaScript, providing a more efficient and
 * progressive enhancement approach.
 * 
 * Email functionality has been added to send real emails using Nodemailer
 * and React Email components, following Next.js 15.2.4 best practices.
 */

import { z } from "zod";
import { sendContactFormEmail } from "@/lib/email/email-service";

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

export type FormResponse = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

/**
 * Submit contact form data
 *
 * This Server Action handles form submission, validation, processing, and email sending.
 * It can be called directly from a form using the action attribute or from client components.
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

    const data = validatedData.data;

    // Send email notification using our email service
    const emailResult = await sendContactFormEmail(data);
    
    if (!emailResult.success) {
      console.error("Failed to send contact form email:", emailResult.error);
      
      // Return a user-friendly error message while logging the actual error
      return {
        success: false,
        message: "We couldn't send your message at this time. Please try again later or contact us directly.",
      };
    }

    // Return success response
    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    // Log the error for monitoring and debugging
    console.error("Unexpected error in contact form submission:", error);

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
 */
export async function getAvailableServices(): Promise<string[]> {
  // In a real application, this would fetch from a database or API
  return [
    "Web Development",
    "Digital Marketing",
    "SEO Optimization",
    "UI/UX Design",
    "Mobile App Development",
    "Technical Consulting",
  ];
}
