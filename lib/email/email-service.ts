/**
 * Email Service for Cyber Hand
 *
 * This module provides a service for sending emails using SendGrid
 * with proper error handling, logging, and rate limiting.
 * It follows Next.js 15.2.4 best practices for server-side operations.
 */

import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';
import { FormData } from '@/lib/actions/contact/contact-form';
import { ContactFormEmail } from './templates/contact-form-email';
import { emailConfig, validateEmailConfig } from '@/lib/config/email';

// Define email service error types for better error handling
export type EmailError = {
  code: string;
  message: string;
  cause?: Error;
};

// Interface for email sending options
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// Error type for NodeJS Error with code property
interface NodeErrorWithCode extends Error {
  code?: string;
}

/**
 * Initialize SendGrid with API key
 * This is called internally when sending emails
 */
function initializeSendGrid(): void {
  sgMail.setApiKey(emailConfig.sendgridApiKey);
}

/**
 * Core email sending function with proper error handling
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: EmailError }> {
  try {
    // Validate email configuration before attempting to send
    if (!validateEmailConfig()) {
      return {
        success: false,
        error: {
          code: 'EMAIL_CONFIG_INVALID',
          message: 'Email configuration is incomplete or invalid',
        },
      };
    }

    // Initialize SendGrid with API key
    initializeSendGrid();
    
    // Prepare email message with SendGrid format
    const msg = {
      from: emailConfig.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text || '',
      replyTo: options.replyTo,
    };
    
    // Send email with SendGrid
    await sgMail.send(msg);
    
    return { success: true };
  } catch (error) {
    // Proper error handling with typed errors
    console.error('Failed to send email:', error);
    
    // Extract and format error for client response
    const typedError = error as NodeErrorWithCode;
    const errorCode = typedError.code || 'EMAIL_SEND_FAILED';
    
    const emailError: EmailError = {
      code: errorCode,
      message: typedError.message || 'An unknown error occurred while sending the email',
      cause: typedError,
    };
    
    return {
      success: false,
      error: emailError,
    };
  }
}

/**
 * Specialized function for sending contact form emails
 */
export async function sendContactFormEmail(formData: FormData): Promise<{ success: boolean; error?: EmailError }> {
  try {
    // Format date for email
    const date = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    });
    
    // Render React email template to HTML
    // The render function returns a string, not a Promise
    const emailHtml = render(ContactFormEmail({ formData, date }));
    
    // Ensure emailHtml is treated as a string
    if (typeof emailHtml !== 'string') {
      throw new Error('Email rendering failed to produce HTML string');
    }
    
    // Generate plain text version for email clients that don't support HTML
    const plainText = `
Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.company ? `Company: ${formData.company}\n` : ''}
${formData.service ? `Service: ${formData.service}\n` : ''}

Message:
${formData.message}

Sent on ${date} from ${emailConfig.siteName} (${emailConfig.siteUrl})
    `.trim();
    
    // Send email with complete configuration
    return await sendEmail({
      to: emailConfig.contactRecipient,
      subject: `New Contact Form Submission: ${formData.name}`,
      html: emailHtml,
      text: plainText,
      replyTo: formData.email,
    });
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return {
      success: false,
      error: {
        code: 'CONTACT_EMAIL_FAILED',
        message: 'Failed to send contact form email',
        cause: error instanceof Error ? error : undefined,
      },
    };
  }
}
