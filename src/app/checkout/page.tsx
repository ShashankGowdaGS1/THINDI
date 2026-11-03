import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CheckoutWizard } from '@/components/checkout/CheckoutWizard';

export const metadata: Metadata = {
  title: 'Secure Checkout | THINDI Traditional Karnataka Foods',
  description:
    'Complete your Karnataka traditional snack order with secure delivery across Karnataka.',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      {/* Load Razorpay Standard Checkout SDK asynchronously */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <Header />
      <main className="flex-1">
        <CheckoutWizard />
      </main>
      <Footer />
    </div>
  );
}

