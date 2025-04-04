import "./globals.css";
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import { Navbar } from "@/components/custom/navbar";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CyberHand | Next-Gen Digital Agency",
  description: "Transforming digital experiences with cutting-edge solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <ThemeProvider>
        <body className={`${inter.className} antialiased`}>
          {/* No Navbar on homepage, it will be included in each page except the landing page */}
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
