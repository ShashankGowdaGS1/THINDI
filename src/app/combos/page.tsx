import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CombosPageView } from '@/components/combos/CombosPageView';

export const metadata: Metadata = {
  title: 'THINDI Boxes & Curated Assortments | Gifting & Sharing | Hassan, Karnataka',
  description:
    'Discover curated THINDI gift boxes for sharing, celebrations, and festive moments. Traditional Hassan savouries, sweets, and fryums delivered across Karnataka.',
  openGraph: {
    title: 'A Box Full of Good Thindi | THINDI Gift Bundles',
    description:
      'Curated snack assortments packed in signature Kraft gift cartons from Hassan, Karnataka.',
    images: ['/images/box/thindi-box.jpg'],
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

