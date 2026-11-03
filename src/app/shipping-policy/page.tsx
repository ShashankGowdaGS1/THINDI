import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PolicyPageView } from '@/components/policy/PolicyPageView';
import { POLICIES } from '@/data/policies';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Statewide Karnataka Orders | THINDI Hassan',
  description:
    'Read about THINDI dispatch procedures from our Hassan central kitchen, packaging protections for traditional foods, and estimated transit times across Karnataka.',
  openGraph: {
    title: 'Shipping & Delivery Policy | THINDI',
    description: 'Guidelines on packing, dispatch, and delivery across Karnataka.',
  },
};

export default function ShippingPolicyPage() {
  const policy = POLICIES.shipping;

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

