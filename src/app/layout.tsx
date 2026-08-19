import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/site-config';
import MetaPixel from '@/components/analytics/meta-pixel';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { ThemeScript } from '@/components/theme/theme-script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://courses.biopc.org';

// Site-wide defaults. Each page (academy home, R Programming) overrides title,
// description, canonical and OG image with its own `metadata` export.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.org} Academy - Bioinformatics Courses & Training`,
    template: `%s`,
  },
  description: `${siteConfig.orgTagline}. Live, mentor-led bioinformatics and data-analysis training for biologists.`,
  authors: [{ name: siteConfig.org, url: siteConfig.social.website }],
  creator: siteConfig.org,
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#080b1a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <MetaPixel />
        <GoogleAnalytics />
         {children}
      </body>
    </html>
  );
}
