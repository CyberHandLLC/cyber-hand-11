'use server';

/**
 * Contact Form Server Actions
 * 
 * This module implements Server Actions for the contact form.
 * Server Actions allow forms to be submitted directly to the server
 * without client-side JavaScript, providing a more efficient and
 * progressive enhancement approach.
 */

import { z } from 'zod';

// Define validation schema for form data
const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  company: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
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
        message: 'Please check the form for errors',
      };
    }
    
    // Form data is valid, process the submission
    const _data = validatedData.data;
    
    // In a real application, this would send an email, store in database, etc.
    // Process form data here (e.g., send email or save to database)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success response
    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Error is intentionally not used but kept for potential future logging
    // Log error to server-side logging system in production
    // In development, we'd use error monitoring like Sentry
    
    // Return error response
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
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
    'Web Development',
    'Digital Marketing',
    'SEO Optimization',
    'UI/UX Design',
    'Mobile App Development',
    'Technical Consulting',
  ];
}
