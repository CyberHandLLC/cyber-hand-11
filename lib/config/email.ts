/**
 * Email configuration for Cyber Hand
 *
 * This module defines the email configuration settings for the application.
 * It includes environment variable validation and email-related constants.
 * Updated to use SendGrid for improved email deliverability and analytics.
 */

// Email configuration object with SendGrid settings
export const emailConfig = {
  // SendGrid API key
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  
  // Email addresses
  from: process.env.EMAIL_FROM || 'Cyber Hand <info@cyber-hand.com>',
  contactRecipient: process.env.CONTACT_EMAIL_RECIPIENT || 'info@cyber-hand.com',
  
  // Application settings
  siteName: 'Cyber Hand',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com',
};

// Validate that required email configuration is present
export function validateEmailConfig(): boolean {
  // Check if SendGrid API key is present
  if (!emailConfig.sendgridApiKey) {
    console.error('Missing required email configuration: SENDGRID_API_KEY');
    return false;
  }
  
  // Check if FROM email is configured
  if (!emailConfig.from) {
    console.error('Missing required email configuration: EMAIL_FROM');
    return false;
  }
  
  // Check if recipient email is configured
  if (!emailConfig.contactRecipient) {
    console.error('Missing required email configuration: CONTACT_EMAIL_RECIPIENT');
    return false;
  }
  
  return true;
}
