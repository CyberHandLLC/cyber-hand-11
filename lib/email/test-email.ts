/**
 * Test script for verifying SendGrid email integration
 * 
 * This script can be run with 'tsx' to test the email functionality
 * without having to go through the entire application flow.
 */

import { sendContactFormEmail } from './email-service';
import { FormData } from '@/lib/actions/contact/contact-form';
import { emailConfig } from '@/lib/config/email';

async function testEmail() {
  console.log('🔍 Testing SendGrid email integration...');
  console.log('📧 Email Config:', {
    from: emailConfig.from,
    to: emailConfig.contactRecipient,
    apiKeyConfigured: Boolean(emailConfig.sendgridApiKey)
  });

  if (!emailConfig.sendgridApiKey) {
    console.error('❌ SendGrid API Key is not configured. Please set SENDGRID_API_KEY in your .env.local file.');
    process.exit(1);
  }

  const testData: FormData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    message: 'This is a test message from the email testing script.',
    service: 'Web Development',
  };

  try {
    console.log('📤 Sending test email...');
    const result = await sendContactFormEmail(testData);
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.error('❌ Failed to send test email:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error while testing email:', error);
    process.exit(1);
  }
}

// Run the test function
testEmail();
