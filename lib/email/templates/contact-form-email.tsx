import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from '@react-email/components';
import { FormData } from '@/lib/actions/contact/contact-form';
import { emailConfig } from '@/lib/config/email';

interface ContactFormEmailProps {
  formData: FormData;
  date: string;
}

export const ContactFormEmail = ({
  formData,
  date,
}: ContactFormEmailProps) => {
  const { name, email, company, message, service } = formData;

  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission from {name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            New Contact Form Submission
          </Heading>
          <Text style={styles.text}>
            Someone has sent a message through the contact form on {emailConfig.siteName}.
          </Text>
          
          <Section style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            <Text style={styles.fieldLabel}>Name:</Text>
            <Text style={styles.fieldValue}>{name}</Text>
            
            <Text style={styles.fieldLabel}>Email:</Text>
            <Text style={styles.fieldValue}>
              <a href={`mailto:${email}`} style={styles.link}>
                {email}
              </a>
            </Text>
            
            {company && (
              <>
                <Text style={styles.fieldLabel}>Company:</Text>
                <Text style={styles.fieldValue}>{company}</Text>
              </>
            )}
            
            {service && (
              <>
                <Text style={styles.fieldLabel}>Service Interested In:</Text>
                <Text style={styles.fieldValue}>{service}</Text>
              </>
            )}
          </Section>
          
          <Section style={styles.section}>
            <Text style={styles.sectionTitle}>Message</Text>
            <Text style={styles.message}>{message}</Text>
          </Section>
          
          <Hr style={styles.hr} />
          
          <Text style={styles.footer}>
            This email was sent from the contact form on {emailConfig.siteName} ({emailConfig.siteUrl}) on {date}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Email styles
const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0',
    maxWidth: '580px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '20px',
    color: '#1a1a1a',
  },
  text: {
    margin: '16px 0',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#3c4149',
  },
  section: {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    marginBottom: '20px',
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '16px',
    color: '#1a1a1a',
  },
  fieldLabel: {
    fontSize: '14px',
    color: '#737373',
    marginBottom: '4px',
    marginTop: '16px',
  },
  fieldValue: {
    fontSize: '16px',
    color: '#1a1a1a',
    margin: '0 0 8px',
  },
  message: {
    fontSize: '16px',
    color: '#1a1a1a',
    lineHeight: '24px',
    whiteSpace: 'pre-wrap',
  },
  hr: {
    borderColor: '#e0e0e0',
    margin: '20px 0',
  },
  footer: {
    fontSize: '13px',
    color: '#737373',
    textAlign: 'center' as const,
  },
  link: {
    color: '#0078d4',
    textDecoration: 'none',
  },
};

export default ContactFormEmail;
