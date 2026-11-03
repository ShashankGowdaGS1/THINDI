import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ContactPageView } from '@/components/contact/ContactPageView';

export const metadata: Metadata = {
  title: 'Contact Us & Kitchen Care | THINDI Traditional Karnataka Foods',
  description:
    'Get in touch with THINDI in Hassan, Karnataka. Enquiries about traditional snacks, orders, and customer support.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      <Header />
      <main className="flex-1">
        <ContactPageView />
      </main>
      <Footer />
    </div>
  );
}

