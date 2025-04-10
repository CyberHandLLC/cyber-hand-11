/**
 * Location Data Service
 *
 * Provides location-specific data for generating unique content for each city page.
 * This helps improve SEO by ensuring each location page has unique, relevant content.
 */

import { cache } from "react";

// Define GeoLocation interface to avoid import issues
interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

// Define interfaces for location-specific data
export interface LocationContent {
  headline?: string;
  summary?: string;
  keyFeatures?: string[];
  statistics?: Record<string, string | number>;
  industries?: string[];
  testimonial?: {
    quote: string;
    author: string;
    company?: string;
  };
  nearbyCities: NearbyCity[];
  regionalServices?: {
    name: string;
    description: string;
  }[];
}

export interface NearbyCity {
  name: string;
  slug: string;
  distance: number; // in miles or kilometers
  population?: number;
}

// Predefined data for popular cities
const CITY_DATA: Record<string, Partial<LocationContent>> = {
  "new-york": {
    headline: "Premier Digital Solutions for New York Businesses",
    summary:
      "New York City is the financial capital of the world and home to countless startups and enterprises that demand cutting-edge digital solutions. Our NYC team specializes in fintech, media, and enterprise-level applications.",
    keyFeatures: [
      "Financial district expertise",
      "Media industry solutions",
      "High-volume infrastructure",
      "Enterprise-level security",
    ],
    statistics: {
      startups: "10,000+",
      fortune500: 45,
      annualGrowth: "7.2%",
    },
    industries: ["Finance", "Media", "Fashion", "Real Estate", "Technology"],
    testimonial: {
      quote:
        "Cyber Hand transformed our digital presence and helped us connect with clients all across Manhattan and beyond.",
      author: "Sarah Goldberg",
      company: "Manhattan Financial Group",
    },
    regionalServices: [
      {
        name: "NYC Startup Launchpad",
        description:
          "Comprehensive digital package designed specifically for New York startups looking to make an immediate impact.",
      },
      {
        name: "Manhattan Enterprise Solutions",
        description:
          "Enterprise-grade infrastructure and security solutions for New York's largest businesses.",
      },
    ],
  },
  "lewis-center": {
    headline: "Custom Digital Solutions for Lewis Center Businesses",
    summary:
      "Lewis Center combines suburban charm with proximity to Columbus, offering a unique environment for growing businesses. Our team understands the local market and provides tailored digital solutions to help you stand out.",
    keyFeatures: [
      "Local business focus",
      "Columbus metro area expertise",
      "Suburban market strategies",
      "Community integration",
    ],
    statistics: {
      smallBusinesses: "1,200+",
      annualGrowth: "5.8%",
      populationGrowth: "12.3%",
    },
    industries: ["Retail", "Professional Services", "Healthcare", "Education", "Real Estate"],
    testimonial: {
      quote:
        "As a Lewis Center business owner, I needed a digital partner who understood our local market. Cyber Hand delivered beyond expectations.",
      author: "Michael Reynolds",
      company: "Olentangy Family Dental",
    },
    regionalServices: [
      {
        name: "Local SEO Package",
        description:
          "Specialized SEO targeting Columbus metro area customers with location-specific strategies.",
      },
      {
        name: "Community Business Platform",
        description:
          "Digital solutions that help you connect with the Lewis Center and Olentangy community.",
      },
    ],
  },
  chicago: {
    headline: "Powerful Digital Strategies for Chicago Businesses",
    summary:
      "Chicago's diverse economy spans finance, manufacturing, technology, and logistics. Our Chicago team brings specialized expertise in these sectors, helping businesses leverage digital solutions for growth in the Windy City.",
    keyFeatures: [
      "Midwest market expertise",
      "Multi-industry solutions",
      "Enterprise and SMB focus",
      "Chicago-specific digital marketing",
    ],
    statistics: {
      enterprises: "5,600+",
      techGrowth: "9.3%",
      digitalAdSpend: "$1.2B",
    },
    industries: ["Finance", "Manufacturing", "Logistics", "Technology", "Healthcare"],
    testimonial: {
      quote:
        "Cyber Hand helped us establish a digital presence that resonates with Chicago's business community while expanding our reach throughout the Midwest.",
      author: "James Wilson",
      company: "Lakefront Innovations",
    },
  },
};

// Map of nearby cities for popular locations
const NEARBY_CITIES: Record<string, NearbyCity[]> = {
  "new-york": [
    { name: "Brooklyn", slug: "brooklyn", distance: 5, population: 2648452 },
    { name: "Queens", slug: "queens", distance: 8, population: 2272771 },
    { name: "Jersey City", slug: "jersey-city", distance: 5, population: 283927 },
    { name: "Hoboken", slug: "hoboken", distance: 4, population: 52677 },
    { name: "Yonkers", slug: "yonkers", distance: 15, population: 211569 },
  ],
  "lewis-center": [
    { name: "Columbus", slug: "columbus", distance: 15, population: 905748 },
    { name: "Dublin", slug: "dublin", distance: 10, population: 49328 },
    { name: "Westerville", slug: "westerville", distance: 8, population: 41103 },
    { name: "Delaware", slug: "delaware", distance: 12, population: 41763 },
    { name: "Powell", slug: "powell", distance: 3, population: 14163 },
  ],
  chicago: [
    { name: "Evanston", slug: "evanston", distance: 12, population: 78110 },
    { name: "Oak Park", slug: "oak-park", distance: 9, population: 52265 },
    { name: "Naperville", slug: "naperville", distance: 28, population: 149540 },
    { name: "Aurora", slug: "aurora", distance: 37, population: 180542 },
    { name: "Schaumburg", slug: "schaumburg", distance: 30, population: 78723 },
  ],
  "los-angeles": [
    { name: "Santa Monica", slug: "santa-monica", distance: 15, population: 91577 },
    { name: "Pasadena", slug: "pasadena", distance: 10, population: 138699 },
    { name: "Long Beach", slug: "long-beach", distance: 22, population: 466742 },
    { name: "Beverly Hills", slug: "beverly-hills", distance: 7, population: 34109 },
    { name: "Glendale", slug: "glendale", distance: 8, population: 196543 },
  ],
};

/**
 * Generate nearby cities for any location using geo coordinates
 * For cities not in our predefined list, this will use a distance-based algorithm
 */
function generateNearbyCities(
  location: string,
  _coordinates?: { latitude: number; longitude: number }
): NearbyCity[] {
  // First check if we have predefined nearby cities
  if (NEARBY_CITIES[location]) {
    return NEARBY_CITIES[location];
  }

  // For dynamic locations, generate a list of plausible nearby cities
  // For now, this is a simplified version that returns a selection of major cities as "nearby"
  const majorCities = [
    {
      name: "New York",
      slug: "new-york",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 8804190,
    },
    {
      name: "Los Angeles",
      slug: "los-angeles",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 3898747,
    },
    {
      name: "Chicago",
      slug: "chicago",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 2746388,
    },
    {
      name: "Houston",
      slug: "houston",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 2304580,
    },
    {
      name: "Phoenix",
      slug: "phoenix",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 1608139,
    },
    {
      name: "Philadelphia",
      slug: "philadelphia",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 1603797,
    },
    {
      name: "San Antonio",
      slug: "san-antonio",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 1434625,
    },
    {
      name: "San Diego",
      slug: "san-diego",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 1386932,
    },
    {
      name: "Dallas",
      slug: "dallas",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 1304379,
    },
    {
      name: "San Jose",
      slug: "san-jose",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 1013240,
    },
    {
      name: "Austin",
      slug: "austin",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 961855,
    },
    {
      name: "Jacksonville",
      slug: "jacksonville",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 949611,
    },
    {
      name: "Fort Worth",
      slug: "fort-worth",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 918915,
    },
    {
      name: "Columbus",
      slug: "columbus",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 905748,
    },
    {
      name: "Indianapolis",
      slug: "indianapolis",
      distance: Math.floor(Math.random() * 500) + 100,
      population: 887642,
    },
  ];

  // Shuffle and take a subset
  return majorCities
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Generate a location summary for any city
 */
function generateLocationSummary(displayName: string): string {
  const summaries = [
    `${displayName} is a growing market with unique opportunities for businesses looking to expand their digital presence. Our team provides tailored solutions to help you connect with local customers and stand out from the competition.`,
    `Businesses in ${displayName} face unique challenges and opportunities in today's digital landscape. Our specialized services help you navigate these challenges and leverage local market knowledge for growth.`,
    `The ${displayName} area has a distinctive business environment with its own digital trends and consumer behaviors. Our team has the expertise to help you succeed in this specific market.`,
    `${displayName} combines its unique character with growing digital opportunities. We offer specialized services designed specifically for businesses in this region looking to maximize their online potential.`,
    `In ${displayName}, businesses need digital solutions that resonate with the local community while enabling broader reach. Our tailored approach helps you achieve both local relevance and wider visibility.`,
  ];

  // Return a deterministic but seemingly random summary based on the location name
  const index = displayName.length % summaries.length;
  return summaries[index];
}

/**
 * Generate key industries for any location
 */
function generateIndustries(displayName: string): string[] {
  const allIndustries = [
    "Retail",
    "Healthcare",
    "Education",
    "Technology",
    "Manufacturing",
    "Financial Services",
    "Hospitality",
    "Real Estate",
    "Construction",
    "Professional Services",
    "Transportation",
    "Agriculture",
    "Energy",
    "Entertainment",
    "Food & Beverage",
    "Tourism",
  ];

  // Use the city name to generate a deterministic but seemingly random selection
  const seed = displayName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...allIndustries].sort((a, b) => {
    const seedA = (seed + a.length) % allIndustries.length;
    const seedB = (seed + b.length) % allIndustries.length;
    return seedA - seedB;
  });

  // Return 4-6 industries
  const count = 4 + (seed % 3);
  return shuffled.slice(0, count);
}

/**
 * Fetch location-specific content with caching
 */
export const getLocationContent = cache(
  async (
    location: string,
    displayName: string,
    geoLocation?: GeoLocation
  ): Promise<LocationContent> => {
    // Try to get predefined content
    const predefinedContent = CITY_DATA[location];

    if (predefinedContent) {
      return {
        ...predefinedContent,
        nearbyCities: NEARBY_CITIES[location] || generateNearbyCities(location),
      } as LocationContent;
    }

    // For non-predefined locations, generate unique content
    const coords = geoLocation
      ? {
          latitude: geoLocation.latitude || 0,
          longitude: geoLocation.longitude || 0,
        }
      : undefined;

    // Generate dynamic content for this location
    return {
      headline: `Custom Digital Solutions for ${displayName} Businesses`,
      summary: generateLocationSummary(displayName),
      keyFeatures: [
        `${displayName} market expertise`,
        "Customized local digital strategies",
        "Regional business knowledge",
        "Community-focused solutions",
      ],
      industries: generateIndustries(displayName),
      nearbyCities: generateNearbyCities(location, coords),
      regionalServices: [
        {
          name: `${displayName} Business Growth Package`,
          description: `Comprehensive digital solutions tailored specifically for businesses in ${displayName}.`,
        },
        {
          name: "Local SEO Services",
          description: `Advanced search engine optimization targeting customers in the ${displayName} area.`,
        },
      ],
    };
  }
);
