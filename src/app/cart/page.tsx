import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CartPageView } from '@/components/cart/CartPageView';

export const metadata: Metadata = {
  title: 'Your Snack Box | THINDI Traditional Karnataka Foods',
  description:
    'Review your selected authentic handmade Karnataka savouries and sweets before placing your order from Hassan.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      <Header />
      <main className="flex-1">
        <CartPageView />
      </main>
      <Footer />
    </div>
  );
}

