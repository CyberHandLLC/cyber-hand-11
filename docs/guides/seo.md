# SEO Implementation Guide

> This document outlines our approach to Search Engine Optimization (SEO) in the Cyber Hand website using Next.js 15's Metadata API and SEO best practices.

## Table of Contents

1. [Introduction](#introduction)
2. [Next.js 15 Metadata API](#nextjs-15-metadata-api)
3. [Basic Implementation](#basic-implementation)
4. [Dynamic Metadata](#dynamic-metadata)
5. [Structured Data (JSON-LD)](#structured-data-json-ld)
6. [Image Optimization](#image-optimization)
7. [Performance Considerations](#performance-considerations)
8. [Canonical URLs](#canonical-urls)
9. [Verification Approach](#verification-approach)
10. [Best Practices Checklist](#best-practices-checklist)

## Introduction

SEO is critical for ensuring our website is discoverable and properly presented in search engine results. Next.js 15 provides powerful built-in features for implementing SEO best practices, particularly through its Metadata API. This guide explains how we implement SEO throughout the Cyber Hand website.

## Next.js 15 Metadata API

Next.js 15's Metadata API provides a powerful way to define metadata for our pages. There are two primary approaches:

1. **Static Metadata**: Defined directly in page or layout files
2. **Dynamic Metadata**: Generated on-demand using the `generateMetadata` function

This API allows us to set:

- Page titles and descriptions
- Open Graph metadata for social sharing
- Twitter card metadata
- Canonical URLs
- Robots directives
- Icons and app manifests
- And more

## Basic Implementation

### Static Metadata

For pages with static content, define metadata directly in the page or layout file:

```tsx
// app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Cyber Hand',
  description: 'Learn about Cyber Hand, our mission, and our team.',
  openGraph: {
    title: 'About Cyber Hand',
    description: 'Learn about Cyber Hand, our mission, and our team.',
    url: 'https://cyber-hand.com/about',
    siteName: 'Cyber Hand',
    images: [
      {
        url: 'https://cyber-hand.com/images/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Cyber Hand team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Cyber Hand',
    description: 'Learn about Cyber Hand, our mission, and our team.',
    creator: '@cyberhand',
    images: ['https://cyber-hand.com/images/about-og.jpg'],
  },
  alternates: {
    canonical: 'https://cyber-hand.com/about',
  },
};

export default function AboutPage() {
  return (
    // page content
  );
}
```

### Layout-Based Metadata

For shared metadata across multiple pages, define metadata in a layout file:

```tsx
// app/blog/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Cyber Hand Blog",
    default: "Cyber Hand Blog", // for the blog index page
  },
  description: "Insights and articles from the Cyber Hand team",
  openGraph: {
    title: {
      template: "%s | Cyber Hand Blog",
      default: "Cyber Hand Blog",
    },
    description: "Insights and articles from the Cyber Hand team",
    type: "website",
    siteName: "Cyber Hand",
  },
};

export default function BlogLayout({ children }) {
  return <div className="blog-layout">{children}</div>;
}
```

In this case, individual blog post pages can define their own titles, which will be inserted into the template provided by the layout.

## Dynamic Metadata

For dynamic routes and pages that require fetched data for their metadata, use the `generateMetadata` function:

```tsx
// app/case-studies/[slug]/page.tsx
import { Metadata, ResolvingMetadata } from 'next';
import { getCaseStudyBySlug } from '@/lib/case-studies';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch case study data
  const caseStudy = await getCaseStudyBySlug(params.slug);

  // Return 404 if case study doesn't exist
  if (!caseStudy) {
    return notFound();
  }

  // Get parent metadata (from layout)
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.summary,
      images: [
        {
          url: caseStudy.coverImage,
          width: 1200,
          height: 630,
          alt: caseStudy.title,
        },
        ...previousImages,
      ],
      type: 'article',
      publishedTime: caseStudy.publishedAt,
      tags: caseStudy.tags,
    },
    alternates: {
      canonical: `https://cyber-hand.com/case-studies/${caseStudy.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return notFound();
  }

  return (
    // Page content
  );
}
```

## Structured Data (JSON-LD)

Adding structured data helps search engines understand our content better. Next.js 15 allows us to easily integrate JSON-LD:

```tsx
// app/case-studies/[slug]/page.tsx
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";

export default async function CaseStudyPage({ params }) {
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.title,
    description: caseStudy.summary,
    image: caseStudy.coverImage,
    datePublished: caseStudy.publishedAt,
    author: {
      "@type": "Organization",
      name: "Cyber Hand",
      url: "https://cyber-hand.com",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Page content */}
    </>
  );
}

// components/json-ld.tsx
export function JsonLd({ data }: { data: any }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
```

We implement various schema types depending on the content:

- Organization schema for the homepage
- Article schema for blog posts
- FAQPage schema for FAQ sections
- Product schema for product pages
- BreadcrumbList schema for navigation paths

## Image Optimization

Next.js 15's Image component automatically optimizes images for better Core Web Vitals, which directly impacts SEO:

```tsx
// components/optimized-image.tsx
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      // If no width/height, fill the container
      {...(!width && !height ? { fill: true } : {})}
      {...props}
    />
  );
}
```

For hero images or content visible above the fold, always use the `priority` prop to preload the image:

```tsx
<OptimizedImage src="/images/hero.jpg" alt="Hero image" width={1200} height={600} priority />
```

## Performance Considerations

Performance is a critical SEO factor. Our Next.js 15 implementation includes:

1. **Server Components** for faster page loads
2. **Streaming** for improved TTFB and LCP
3. **Route Handlers** with optimized caching
4. **Font optimization** using `next/font` for zero layout shift

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

// Load Inter font optimized for performance
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Use 'swap' to prevent text from being invisible while the font loads
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Canonical URLs

We implement canonical URLs to prevent duplicate content issues:

```tsx
// Layout or page component
export const metadata = {
  alternates: {
    canonical: "https://cyber-hand.com/path/to/page",
  },
};
```

For dynamic pages, set the canonical URL in the `generateMetadata` function:

```tsx
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://cyber-hand.com/path/${params.slug}`,
    },
  };
}
```

## Verification Approach

To verify our SEO implementation:

1. Use the [Google Rich Results Test](https://search.google.com/test/rich-results) to validate structured data
2. Check metadata with browser developer tools or SEO extensions
3. Verify Core Web Vitals using Lighthouse
4. Ensure proper indexing with Google Search Console

## Best Practices Checklist

- [ ] Every page has a unique `title` and `description`
- [ ] Dynamic pages use `generateMetadata` for SEO attributes
- [ ] All images include descriptive `alt` text
- [ ] Structured data (JSON-LD) is implemented for key content types
- [ ] Canonical URLs are defined for all pages
- [ ] Core Web Vitals scores are maintained at 90+ in Lighthouse
- [ ] Semantic HTML is used for better content structure
- [ ] `robots.txt` and sitemap.xml are properly configured
- [ ] All metadata is verified in page source
- [ ] Performance optimizations are applied for faster page loads

By following these guidelines, we ensure the Cyber Hand website is optimized for search engines while providing a great user experience.
