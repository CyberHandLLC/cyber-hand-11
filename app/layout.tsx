import "./globals.css";
import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts"; // Updated import path to use new fonts.ts
import { Providers } from "./providers";
import { PerformanceWrapper } from "./performance-wrapper";
import { BaseStructuredData } from "@/lib/seo/structured-data";
import { getLocationData } from "@/lib/location/location-service";

/**
 * Root Layout Component - Server Component
 *
 * Next.js 15 layout best practices:
 * - Server Component by default for improved performance
 * - Comprehensive metadata setup with separate viewport config
 * - Font optimization using next/font system
 * - Providers isolated to client-only needs
 * - Performance monitoring with Web Vitals
 */

// Structured metadata for better SEO
export const metadata: Metadata = {
  // Base URL for resolving relative URLs for social media images
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com"), // Use a placeholder domain that's clearly not production

  title: "CyberHand | Next-Gen Digital Agency",
  description: "Transforming digital experiences with cutting-edge solutions",
  keywords: "digital agency, web development, SEO, digital marketing, UI/UX design",
  authors: [{ name: "CyberHand Team" }],
  creator: "CyberHand",
  publisher: "CyberHand LLC",
  
  // Favicon configuration using CyberHand logo
  icons: {
    icon: [
      { url: "/images/cyberhand-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/cyberhand-logo.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/images/cyberhand-logo.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "mask-icon", url: "/images/cyberhand-logo.png" }
    ]
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "CyberHand | Next-Gen Digital Agency",
    description: "Transforming digital experiences with cutting-edge solutions",
    url: "/", // Use relative URL that depends on metadataBase
    siteName: "CyberHand",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CyberHand - Next-Gen Digital Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberHand | Next-Gen Digital Agency",
    description: "Transforming digital experiences with cutting-edge solutions",
    images: ["/images/twitter-image.jpg"],
  },
};

// Viewport configuration (moved from metadata per Next.js 15 requirements)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1117" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontVariables.orbitron} ${fontVariables.inter}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <BaseStructuredData />

        {/* DNS prefetch for common external domains */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased text-body">
        {/* Apply performance optimizations and providers at the root level */}
        <Providers locationData={getLocationData()}>
          <PerformanceWrapper>
            {/* No Navbar on homepage, it will be included in each page except the landing page */}
            {children}
          </PerformanceWrapper>
        </Providers>
      </body>
    </html>
  );
}
