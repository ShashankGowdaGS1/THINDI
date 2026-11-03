import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { TrackOrderView } from '@/components/tracking/TrackOrderView';

export const metadata: Metadata = {
  title: 'Track Your Order | THINDI Traditional Karnataka Foods',
  description:
    'Check real-time delivery status and courier milestones for your authentic handcrafted Karnataka snacks from Hassan.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-24 text-center text-xs text-jaggery/60">
              Loading tracking portal...
            </div>
          }
        >
          <TrackOrderView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

