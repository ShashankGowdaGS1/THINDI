import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Sans, Anek_Kannada } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'THINDI | Authentic Karnataka Traditional Snacks — Hassan, Karnataka',
  description:
    'A little crunch. A lot of Karnataka. Authentic chakkali, kodubale, nippattu, obbattu and traditional homemade flavours originating from Hassan, Karnataka.',
  keywords: [
    'Thindi',
    'Karnataka snacks',
    'Chakkali',
    'Kodubale',
    'Nippattu',
    'Hassan Karnataka',
    'Traditional South Indian savouries',
  ],
  authors: [{ name: 'THINDI Foods' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/images/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F0E3',
  width: 'device-width',
  initialScale: 1,
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
      <body className="bg-cream text-jaggery antialiased selection:bg-chilli selection:text-cream">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

