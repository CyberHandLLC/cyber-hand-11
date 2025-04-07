import "./globals.css";
import type { Metadata, Viewport } from "next";
import { fontVariables, fontFallbacks } from "./font";
import { ThemeProvider } from "@/lib/theme-context";
import { PerformanceWrapper } from "./performance-wrapper";
import { BaseStructuredData } from "@/lib/seo/structured-data";

// Web Vitals reporting is implemented in the PerformanceWrapper client component
// to avoid build errors with the app router

// Add structured metadata for better SEO
export const metadata: Metadata = {
  // Base URL for resolving relative URLs for social media images
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cyber-hand.com'),
  
  title: "CyberHand | Next-Gen Digital Agency",
  description: "Transforming digital experiences with cutting-edge solutions",
  keywords: "digital agency, web development, SEO, digital marketing, UI/UX design",
  authors: [{ name: "CyberHand Team" }],
  creator: "CyberHand",
  publisher: "CyberHand LLC",
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
    url: "https://cyberhand.com",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontVariables.orbitron} ${fontVariables.inter}`}>
      <head>
        {/* Critical assets preloading - removed unused image preload */}
        
        {/* Font optimization: Preconnect to font domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* JSON-LD Structured Data */}
        <BaseStructuredData />
        
        {/* Font display optimization - Add font-display settings for fallback fonts */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Font fallback optimization to reduce CLS */
          :root {
            --font-sans: ${fontFallbacks.sans};
            --font-display: ${fontFallbacks.display};
            --font-mono: ${fontFallbacks.mono};
          }
          
          /* Font loading optimization */
          @font-face {
            font-family: 'Inter Fallback';
            src: local('Arial');
            ascent-override: 90%;
            descent-override: 25%;
            line-gap-override: normal;
            size-adjust: 107%;
          }
          
          @font-face {
            font-family: 'Orbitron Fallback';
            src: local('Arial');
            ascent-override: 85%;
            descent-override: 22%;
            line-gap-override: normal;
            size-adjust: 115%;
          }
          
          /* Apply optimizations to prevent layout shifts */
          .font-adjustment-active .text-body {
            font-family: 'Inter', 'Inter Fallback', var(--font-sans);
          }
          
          .font-adjustment-active .text-heading {
            font-family: 'Orbitron', 'Orbitron Fallback', var(--font-display);
          }
        ` }} />
        
        {/* Critical CSS is now included directly in the build, no preload needed */}
        
        {/* Resource hints - logo.svg prefetch removed due to 404 error */}
        
        {/* DNS prefetch for common external domains */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <ThemeProvider>
        <body className="font-adjustment-active antialiased text-body">
          {/* Apply performance optimizations at the root level */}
          <PerformanceWrapper>
            {/* No Navbar on homepage, it will be included in each page except the landing page */}
            {children}
          </PerformanceWrapper>
        </body>
      </ThemeProvider>
    </html>
  );
}
