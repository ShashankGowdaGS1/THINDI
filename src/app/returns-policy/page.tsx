import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PolicyPageView } from '@/components/policy/PolicyPageView';
import { POLICIES } from '@/data/policies';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy | Replacements & Transit Protection | THINDI Hassan',
  description:
    'Learn how THINDI handles damaged deliveries, missing items, and refund processing under verified consumer protection standards.',
  openGraph: {
    title: 'Returns & Refund Policy | THINDI',
    description: 'Fair customer protection and remedies for food deliveries in Karnataka.',
  },
};

export default function ReturnsPolicyPage() {
  const policy = POLICIES.returns;

  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
      <Header />
      <main className="flex-1">
        <PolicyPageView policy={policy} />
      </main>
      <Footer />
    </div>
  );
}

