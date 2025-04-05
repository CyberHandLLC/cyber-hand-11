import { NextFont } from 'next/dist/compiled/@next/font';
import { Inter, Orbitron } from 'next/font/google';

// Font optimization: preload critical fonts with display swap
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700'],
});
