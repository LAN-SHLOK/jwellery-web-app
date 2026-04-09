import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Manrope, Playfair_Display } from 'next/font/google';

import './globals.css';
import { BRAND_CONFIG } from '@/config/brand';

const interSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const manropeSans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const cormorantSerif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  weight: ['400', '600'],
  fallback: ['Georgia', 'serif'],
});

const playfairSerif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  weight: ['400', '600'],
  fallback: ['Georgia', 'serif'],
});

const sansFamilies = {
  inter: interSans,
  manrope: manropeSans,
} as const;

const serifFamilies = {
  'cormorant-garamond': cormorantSerif,
  playfair: playfairSerif,
} as const;

const selectedSans = sansFamilies[BRAND_CONFIG.theme.fonts.sans as keyof typeof sansFamilies] ?? sansFamilies.manrope;
const selectedSerif =
  serifFamilies[BRAND_CONFIG.theme.fonts.serif as keyof typeof serifFamilies] ?? serifFamilies['cormorant-garamond'];

export const metadata: Metadata = {
  title: {
    template: `%s | ${BRAND_CONFIG.name}`,
    default: BRAND_CONFIG.name,
  },
  description: BRAND_CONFIG.tagline,
  keywords: ['22K gold jewellery', 'BIS hallmarked', 'Indian bridal jewellery', 'luxury gold jewellery', 'fine jewellery online'],
  openGraph: {
    type: 'website',
    siteName: BRAND_CONFIG.name,
    title: BRAND_CONFIG.name,
    description: BRAND_CONFIG.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://fpoczmyaqcnazidcdcei.supabase.co" />
      </head>
      <body className={`${selectedSans.variable} ${selectedSerif.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
