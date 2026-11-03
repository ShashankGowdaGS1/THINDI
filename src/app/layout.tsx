import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Sans, Anek_Kannada } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import { getSiteUrl } from '@/data/siteConfig';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const anekKannada = Anek_Kannada({
  subsets: ['kannada', 'latin'],
  variable: '--font-anek-kannada',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'THINDI | Traditional Karnataka Snacks from Hassan',
    template: '%s | THINDI',
  },
  description:
    'A little crunch. A lot of Karnataka. Discover Chakkali, Kodubale, Nippattu, Obbattu and more traditional Karnataka flavours.',
  applicationName: 'THINDI',
  authors: [{ name: 'THINDI Foods', url: siteUrl }],
  creator: 'THINDI Foods',
  publisher: 'THINDI Foods',
  keywords: [
    'Thindi',
    'Karnataka snacks',
    'Chakkali',
    'Kodubale',
    'Nippattu',
    'Obbattu',
    'Hassan Karnataka',
    'Traditional South Indian savouries',
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'THINDI | Traditional Karnataka Snacks from Hassan',
    description:
      'A little crunch. A lot of Karnataka. Discover Chakkali, Kodubale, Nippattu, Obbattu and more traditional Karnataka flavours.',
    url: siteUrl,
    siteName: 'THINDI',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/social/thindi-social-preview-v1.jpg`,
        width: 1200,
        height: 630,
        alt: 'THINDI — Traditional Karnataka Snacks from Hassan, Karnataka',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THINDI | Traditional Karnataka Snacks from Hassan',
    description:
      'A little crunch. A lot of Karnataka. Discover Chakkali, Kodubale, Nippattu, Obbattu and more traditional Karnataka flavours.',
    images: [`${siteUrl}/images/social/thindi-social-preview-v1.jpg`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#F7F0E3',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'THINDI',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
        width: 912,
        height: 289,
      },
      description: 'Authentic Karnataka traditional snacks originating from Hassan, Karnataka.',
      areaServed: {
        '@type': 'State',
        name: 'Karnataka',
      },
      knowsAbout: ['Karnataka snacks', 'Chakkali', 'Kodubale', 'Nippattu', 'Traditional sweets'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'THINDI',
      description: 'A little crunch. A lot of Karnataka.',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: ['en', 'kn'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} ${anekKannada.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream text-jaggery antialiased selection:bg-chilli selection:text-cream">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
