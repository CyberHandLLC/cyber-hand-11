import "./globals.css";
import type { Metadata, Viewport } from "next";
import { inter, orbitron } from "./font";
import { ThemeProvider } from "@/lib/theme-context";

// Web Vitals reporting will be implemented in a client component
// to avoid build errors with the app router

// Add structured metadata for better SEO
export const metadata: Metadata = {
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
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <head>
        {/* Preload critical assets */}
        <link 
          rel="preload"
          href="/images/bg-website-design-seo-marketing-ai-intergration-hosting-cyberhand.png"
          as="image"
          type="image/png"
        />
        {/* Add preconnect for potential third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <ThemeProvider>
        <body className={`${inter.className} antialiased`}>
          {/* No Navbar on homepage, it will be included in each page except the landing page */}
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
