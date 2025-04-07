/**
 * SEO Metadata Utilities
 * 
 * This module provides a standardized approach to generating metadata for pages
 * using Next.js 15's metadata API.
 */

import { Metadata } from 'next';

/**
 * MetadataProps interface for generating consistent page metadata
 */
export interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  noIndex?: boolean;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile';
  publishedAt?: string; // ISO date string
  modifiedAt?: string; // ISO date string
  authorName?: string;
  category?: string;
}

/**
 * Creates extended metadata for a page, building upon the base metadata defined in layout.tsx
 * 
 * @param props - The metadata properties for the page
 * @returns Metadata object compatible with Next.js metadata API
 */
export function createMetadata(props: MetadataProps): Metadata {
  const {
    title,
    description,
    keywords,
    image,
    noIndex,
    canonicalUrl,
    type = 'website',
    publishedAt,
    modifiedAt,
    authorName,
    category
  } = props;

  // Base site info - should match the defaults in layout.tsx
  const siteName = 'CyberHand';
  const baseTitle = title ? `${title} | CyberHand` : undefined;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com';

  // Image properties with defaults
  const imageUrl = image?.url || '/images/og-image.jpg';
  const imageWidth = image?.width || 1200;
  const imageHeight = image?.height || 630;
  const imageAlt = image?.alt || 'CyberHand - Next-Gen Digital Agency';
  const absoluteImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${baseUrl}${imageUrl}`;

  // Robots handling
  const robots = noIndex
    ? { index: false, follow: false }
    : { index: true, follow: true };

  return {
    title: baseTitle,
    description,
    keywords: keywords?.join(', '),
    
    // OpenGraph metadata
    openGraph: {
      title: baseTitle,
      description,
      url: canonicalUrl || baseUrl,
      siteName,
      images: [
        {
          url: absoluteImageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
      locale: 'en_US',
      type,
      ...(type === 'article' && {
        article: {
          publishedTime: publishedAt,
          modifiedTime: modifiedAt,
          authors: [authorName || 'CyberHand Team'],
          tags: keywords,
          section: category,
        },
      }),
    },
    
    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description,
      images: [absoluteImageUrl],
      creator: authorName || '@CyberHandAgency',
    },
    
    // Canonical URL
    alternates: canonicalUrl ? {
      canonical: canonicalUrl,
    } : undefined,
    
    // Robots
    robots,
  };
}

/**
 * Interface for case study data used in metadata generation
 */
interface CaseStudyData {
  id: string;
  slug?: string;
  title: string;
  clientName: string;
  industry: string;
  imageUrl?: string;
  challenge: string;
  services: string[];
}

/**
 * Creates metadata for a case study page
 * 
 * @param caseStudy - The case study object
 * @returns Metadata object compatible with Next.js metadata API
 */
export function createCaseStudyMetadata(caseStudy: CaseStudyData): Metadata {
  return createMetadata({
    title: caseStudy.title,
    description: caseStudy.challenge,
    keywords: [caseStudy.industry, 'case study', 'project', ...caseStudy.services],
    image: {
      url: caseStudy.imageUrl || '',
      alt: `${caseStudy.title} - ${caseStudy.clientName} Case Study by CyberHand`,
    },
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com'}/case-studies/${caseStudy.slug || caseStudy.id}`,
    type: 'article',
    // Use current date for publishedAt and modifiedAt since our case studies don't have these fields
    publishedAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    authorName: 'CyberHand Team',
    category: caseStudy.industry,
  });
}

/**
 * Interface for service data used in metadata generation
 */
interface ServiceData {
  id: string;
  slug?: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
}

/**
 * Creates metadata for a service page
 * 
 * @param service - The service object
 * @returns Metadata object compatible with Next.js metadata API
 */
export function createServiceMetadata(service: ServiceData): Metadata {
  return createMetadata({
    title: service.title,
    description: service.description,
    keywords: [...(service.keywords || []), 'service', 'digital agency'],
    image: {
      url: service.image || '',
      alt: `${service.title} - Digital Services by CyberHand`,
    },
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com'}/services/${service.slug || service.id}`,
    type: 'website', // Changed from 'product' which is not supported in OpenGraph spec
  });
}