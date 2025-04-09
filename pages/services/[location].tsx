/**
 * AMP-compatible Location Services Page
 * 
 * This page renders location-specific services in AMP format for mobile search.
 * Uses hybrid AMP mode to create both AMP and non-AMP versions.
 * - AMP version appears in Google mobile search results
 * - Non-AMP version is used for regular browsing
 */

import { useRouter } from 'next/router';
import { useAmp } from 'next/amp';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { VALID_LOCATIONS } from '../../lib/location/location-utils';

// Enable hybrid AMP mode - creates both AMP and non-AMP versions
export const config = { 
  amp: 'hybrid'
};

// Type definitions for location data
type LocationParams = {
  location: string;
};

type LocationInfo = {
  displayName: string;
  originalSlug: string;
  normalizedSlug: string;
  country?: string;
  region?: string;
  isValid: boolean;
};

// Import directly from utils to avoid App Router dependencies
async function getLocationInfo(locationSlug: string): Promise<LocationInfo> {
  if (!locationSlug) {
    return {
      isValid: false,
      displayName: '',
      originalSlug: '',
      normalizedSlug: ''
    };
  }
  
  // Normalize the slug (ensure proper format)
  const normalizedSlug = locationSlug
    .toLowerCase()
    .replace(/\\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Format for display (e.g., "new-york" -> "New York")
  const displayName = normalizedSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Check if it's in our predefined mappings
  const locationDetails = {
    'new-york': { country: 'US', region: 'NY' },
    'lewis-center': { country: 'US', region: 'OH' },
    'los-angeles': { country: 'US', region: 'CA' },
    'chicago': { country: 'US', region: 'IL' },
    'san-francisco': { country: 'US', region: 'CA' },
    'miami': { country: 'US', region: 'FL' },
    'seattle': { country: 'US', region: 'WA' },
    'austin': { country: 'US', region: 'TX' },
    'boston': { country: 'US', region: 'MA' },
    'denver': { country: 'US', region: 'CO' },
    'atlanta': { country: 'US', region: 'GA' },
  }[normalizedSlug] || { country: 'US', region: '' };
  
  return {
    isValid: true, // We're accepting all locations in this implementation
    displayName,
    originalSlug: locationSlug,
    normalizedSlug,
    ...locationDetails
  };
}

// Mock service data for simplicity - in production, fetch this from an API
const servicesList = [
  { 
    id: 'web-dev', 
    name: 'Web Development', 
    description: 'Custom websites built with the latest technologies',
    image: '/images/services/web-development.jpg'
  },
  { 
    id: 'design', 
    name: 'UI/UX Design',
    description: 'Intuitive interfaces that delight users',
    image: '/images/services/design.jpg'
  },
  { 
    id: 'marketing', 
    name: 'Digital Marketing',
    description: 'Targeted strategies to grow your online presence',
    image: '/images/services/marketing.jpg'
  },
];

// Generate static paths for all predefined locations
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: VALID_LOCATIONS.map(location => ({
      params: { location }
    })),
    // Enable fallback for dynamic locations not in the list
    fallback: true
  };
};

// Fetch location data at build time or on-demand (fallback)
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { location } = params as LocationParams;
  const locationInfo = await getLocationInfo(location);
  
  // Return 404 for truly invalid locations (though our validation is permissive)
  if (!locationInfo.isValid) {
    return {
      notFound: true
    };
  }
  
  // Return props for the page component
  return {
    props: {
      locationInfo,
      location,
      services: servicesList
    },
    // Revalidate every 24 hours
    revalidate: 86400
  };
};

// AMP-compatible service card component
function ServiceCard({ service, location, isAmp }: { 
  service: any, 
  location: string, 
  isAmp: boolean 
}) {
  if (isAmp) {
    return (
      <div className="amp-service-card">
        <h3>{service.name}</h3>
        {/* Use dangerouslySetInnerHTML for AMP components in Next.js */}
        <div
          dangerouslySetInnerHTML={{
            __html: `<amp-img 
              alt="${service.name} services in ${location}"
              src="${service.image}"
              width="300"
              height="200"
              layout="responsive">
            </amp-img>`
          }}
        />
        <p>{service.description}</p>
      </div>
    );
  }
  
  // Non-AMP version has more interactive elements
  return (
    <div className="service-card">
      <h3>{service.name}</h3>
      <img src={service.image} alt={`${service.name} services in ${location}`} />
      <p>{service.description}</p>
      <button>Learn More</button>
    </div>
  );
}

// Main page component
export default function AMPLocationPage({ 
  locationInfo, 
  location,
  services
}: { 
  locationInfo: LocationInfo, 
  location: string,
  services: any[]
}) {
  const isAmp = useAmp();
  const router = useRouter();
  const { displayName } = locationInfo;
  
  // Show loading state for fallback pages
  if (router.isFallback) {
    return <div>Loading location information...</div>;
  }
  
  // Set canonical URL to the App Router version
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com';
  const canonicalUrl = `${siteUrl}/services/${location}`;
  
  // Add AMP boilerplate if in AMP mode
  const ampBoilerplate = isAmp ? (
    <>
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-img" src="https://cdn.ampproject.org/v0/amp-img-0.1.js"></script>
    </>
  ) : null;
  
  return (
    <div className={isAmp ? 'amp-container' : 'container'}>
      <Head>
        <title>Services in {displayName} | Cyber Hand</title>
        <meta name="description" content={`Explore our digital agency services tailored for ${displayName}. Web development, UI/UX design, and digital marketing solutions.`} />
        <link rel="canonical" href={canonicalUrl} />
        {ampBoilerplate}
        
        {/* AMP-specific schema.org structured data */}
        {isAmp && (
          <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": `Cyber Hand Digital Agency - ${displayName}`,
                "description": `Digital agency services in ${displayName}`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": displayName,
                  "addressRegion": locationInfo.region || "",
                  "addressCountry": locationInfo.country || "US"
                },
                "url": canonicalUrl,
                "telephone": "+1-555-123-4567",
                "priceRange": "$$"
              })
            }}
          />
        )}
        
        {/* AMP-specific styles (must be inline) */}
        {isAmp && (
          <style amp-custom>{`
            .amp-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            h1 {
              font-size: 24px;
              color: #333;
              margin-bottom: 16px;
            }
            h2 {
              font-size: 20px;
              color: #444;
              margin: 24px 0 16px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              color: #555;
              margin-bottom: 16px;
            }
            .amp-service-card {
              margin-bottom: 24px;
              border: 1px solid #eee;
              border-radius: 8px;
              padding: 16px;
            }
            .amp-service-card h3 {
              font-size: 18px;
              color: #333;
              margin-top: 0;
              margin-bottom: 12px;
            }
            .amp-service-card p {
              margin-bottom: 0;
            }
            .location-services {
              margin-top: 32px;
            }
            .cta-section {
              background-color: #f8f8f8;
              padding: 24px;
              border-radius: 8px;
              margin-top: 32px;
              text-align: center;
            }
            .cta-section h2 {
              margin-top: 0;
            }
          `}</style>
        )}
      </Head>
      
      <main>
        <h1>Services in {displayName}</h1>
        
        <div className="intro">
          <p>
            Explore our digital agency services tailored for {displayName}. 
            We offer web development, UI/UX design, and digital marketing solutions 
            specifically optimized for businesses in {displayName}.
          </p>
        </div>
        
        <div className="location-services">
          <h2>Our Services in {displayName}</h2>
          
          {services.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              location={displayName} 
              isAmp={isAmp} 
            />
          ))}
        </div>
        
        <div className="cta-section">
          <h2>Ready to get started?</h2>
          <p>Contact us today to discuss your project needs in {displayName}.</p>
          {!isAmp && (
            <button>Contact Us</button>
          )}
          {isAmp && (
            <a href={`${siteUrl}/contact?location=${location}`}>Contact Us</a>
          )}
        </div>
      </main>
    </div>
  );
}
