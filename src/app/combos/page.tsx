import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CombosPageView } from '@/components/combos/CombosPageView';

import { getSiteUrl } from '@/data/siteConfig';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'THINDI Boxes & Curated Assortments | Gifting & Sharing | Hassan, Karnataka',
  description:
    'Discover curated THINDI gift boxes for sharing, celebrations, and festive moments. Traditional Hassan savouries, sweets, and fryums delivered across Karnataka.',
  alternates: {
    canonical: '/combos',
  },
  openGraph: {
    title: 'A Box Full of Good Thindi | THINDI Gift Bundles',
    description:
      'Curated snack assortments packed in signature Kraft gift cartons from Hassan, Karnataka.',
    url: `${siteUrl}/combos`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/thindi-boxes/celebration-box.png`,
        width: 1024,
        height: 768,
        alt: 'THINDI Celebration Box gift packaging with five traditional Karnataka snack varieties',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THINDI Boxes & Curated Assortments | Gifting & Sharing',
    description:
      'Curated snack assortments packed in signature Kraft gift cartons from Hassan, Karnataka.',
    images: [`${siteUrl}/images/thindi-boxes/celebration-box.png`],
  },
};

export default function CombosPage() {
  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
      <Header />
      <main className="flex-1">
        <CombosPageView />
      </main>
      <Footer />
    </div>
  );
}

