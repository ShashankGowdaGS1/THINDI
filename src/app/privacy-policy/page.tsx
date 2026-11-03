import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PolicyPageView } from '@/components/policy/PolicyPageView';
import { POLICIES } from '@/data/policies';

export const metadata: Metadata = {
  title: 'Customer Privacy Policy | Data Protection & Payment Security | THINDI Hassan',
  description:
    'Read our customer privacy policy detailing how your contact details, order information, and payment data are secured by THINDI.',
  openGraph: {
    title: 'Customer Privacy Policy | THINDI',
    description: 'Privacy standards and data protection for our Karnataka customers.',
  },
};

export default function PrivacyPolicyPage() {
  const policy = POLICIES.privacy;

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

