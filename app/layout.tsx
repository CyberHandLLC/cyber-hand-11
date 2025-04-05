import "./globals.css";
import type { Metadata, Viewport } from "next";
import { inter, orbitron } from "./font";
import { ThemeProvider } from "@/lib/theme-context";

// Performance optimization metadata
export const metadata: Metadata = {
  title: "CyberHand | Next-Gen Digital Agency",
  description: "Transforming digital experiences with cutting-edge solutions",
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
