import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { FAQPageView } from '@/components/faq/FAQPageView';

export const metadata: Metadata = {
  title: 'Customer FAQs | Questions? Let’s Sort Them | THINDI Hassan',
  description:
    'Find answers to common customer questions about THINDI products, Hassan kitchen origin, Karnataka shipping coverage, ingredients, and gift boxes.',
  openGraph: {
    title: 'Customer FAQs | THINDI Traditional Food',
    description: 'Everything you need to know about our products, ordering, and delivery.',
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
      <Header />
      <main className="flex-1">
        <FAQPageView />
      </main>
      <Footer />
    </div>
  );
}

