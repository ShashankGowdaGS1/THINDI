import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PolicyPageView } from '@/components/policy/PolicyPageView';
import { POLICIES } from '@/data/policies';

export const metadata: Metadata = {
  title: 'Terms & Conditions of Sale | Retail Terms & Compliance | THINDI Hassan',
  description:
    'Legal terms governing customer orders, retail transactions, FSSAI compliance declarations, and website usage for THINDI in Karnataka, India.',
  openGraph: {
    title: 'Terms & Conditions of Sale | THINDI',
    description: 'Terms of sale and retail conditions for THINDI traditional food orders.',
  },
};

export default function TermsAndConditionsPage() {
  const policy = POLICIES.terms;

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

