/**
 * JSON-LD Structured Data Components
 *
 * This module provides React components for generating JSON-LD structured data
 * for different page types according to Schema.org specifications.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/advanced/structured-data
 */

import React from "react";
import {
  Organization,
  WithContext,
  WebSite,
  WebPage,
  BreadcrumbList,
  Article,
  Service,
} from "schema-dts";

/**
 * Renders organization structured data
 *
 * @returns A script element with JSON-LD organization data
 */
export function OrganizationSchema() {
  const organizationData: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CyberHand",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com"}/images/logo.svg`,
    sameAs: [
      "https://twitter.com/CyberHandAgency",
      "https://www.linkedin.com/company/cyberhand",
      "https://github.com/CyberHandLLC",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      email: "hello@cyber-hand.com",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Tech Avenue",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94103",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}

/**
 * Renders website structured data
 *
 * @returns A script element with JSON-LD website data
 */
export function WebsiteSchema() {
  const websiteData: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CyberHand",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com"}/search?q={search_term_string}`,
      // Update the query input format to match schema-dts type definitions
      query: "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  );
}

interface WebPageSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string;
}

/**
 * Renders webpage structured data
 *
 * @param props - The webpage schema properties
 * @returns A script element with JSON-LD webpage data
 */
export function WebPageSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
}: WebPageSchemaProps) {
  const webpageData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    datePublished,
    dateModified,
    isPartOf: {
      "@type": "WebSite",
      name: "CyberHand",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com",
    },
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl.startsWith("http")
          ? imageUrl
          : `${process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com"}${imageUrl}`,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "CyberHand",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com"}/images/logo.svg`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageData) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: {
    name: string;
    url: string;
  }[];
}

/**
 * Renders breadcrumb structured data
 *
 * @param props - The breadcrumb schema properties
 * @returns A script element with JSON-LD breadcrumb data
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com";

  const breadcrumbData: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  category?: string;
  tags?: string[];
}

/**
 * Renders article structured data (for case studies, blog posts, etc.)
 *
 * @param props - The article schema properties
 * @returns A script element with JSON-LD article data
 */
export function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  category,
  tags,
}: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com";

  const articleData: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "CyberHand",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.svg`,
      },
    },
    url: url.startsWith("http") ? url : `${baseUrl}${url}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${baseUrl}${url}`,
    },
    ...(category && { articleSection: category }),
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  provider?: string;
  serviceArea?: string;
  price?: string;
  priceCurrency?: string;
}

/**
 * Renders service structured data (for service pages)
 *
 * @param props - The service schema properties
 * @returns A script element with JSON-LD service data
 */
export function ServiceSchema({
  name,
  description,
  url,
  imageUrl,
  provider = "CyberHand",
  serviceArea = "Worldwide",
  price,
  priceCurrency = "USD",
}: ServiceSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cyber-hand.com";

  const serviceData: WithContext<Service> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: url.startsWith("http") ? url : `${baseUrl}${url}`,
    provider: {
      "@type": "Organization",
      name: provider,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.svg`,
      },
    },
    serviceArea: {
      "@type": "Place",
      name: serviceArea,
    },
    ...(imageUrl && {
      image: imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`,
    }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
    />
  );
}

/**
 * Main SEO component that combines all structured data
 *
 * This component can be placed in the layout for base structured data
 * and extended with page-specific schemas as needed.
 */
export function BaseStructuredData() {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
    </>
  );
}
