import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ShopHero } from '@/components/shop/ShopHero';
import { ShopCatalogue } from '@/components/shop/ShopCatalogue';
import { ShopClosing } from '@/components/shop/ShopClosing';

import { getSiteUrl } from '@/data/siteConfig';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Shop All Thindi | Authentic Karnataka Traditional Snacks from Hassan',
  description:
    'From crunchy chakkali, kodubale and nippattu to traditional obbattu, kajjaya, and sun-matured pickles. Explore authentic Karnataka flavours handcrafted in Hassan.',
  keywords: [
    'Shop Thindi',
    'Karnataka traditional snacks',
    'Chakkali buy online',
    'Kodubale Hassan',
    'Nippattu online',
    'Obbattu Karnataka',
    'Uppinakai Hassan',
    'Akki Sandige',
  ],
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop All Thindi | Authentic Karnataka Traditional Snacks from Hassan',
    description:
      'Explore authentic Karnataka traditional snacks prepared in Hassan. Chakkali, Kodubale, Nippattu, Sandige and more.',
    url: `${siteUrl}/shop`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/categories/kuruk-thindi.jpg`,
        width: 1200,
        height: 800,
        alt: 'THINDI traditional Karnataka snacks assortment — Chakkali, Kodubale, and Nippattu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Thindi | Authentic Karnataka Traditional Snacks',
    description:
      'Handcrafted traditional Karnataka snacks from Hassan. Explore Chakkali, Kodubale, Nippattu, and more.',
    images: [`${siteUrl}/images/categories/kuruk-thindi.jpg`],
  },
};

function ShopCatalogueSkeleton() {
  return (
    <div className="py-12 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-48 bg-jaggery/10 rounded-full animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-warm-white rounded-xl border border-jaggery/10 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] bg-jaggery/10 rounded-lg" />
              <div className="h-5 w-3/4 bg-jaggery/10 rounded" />
              <div className="h-4 w-1/2 bg-jaggery/10 rounded" />
              <div className="h-10 bg-jaggery/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      {/* Brand Navigation */}
      <Header />

      {/* Main Shop Flow */}
      <main className="flex-1">
        {/* Compact Editorial Shop Hero */}
        <ShopHero />

        {/* Interactive Filter, Search & Product Grid */}
        <Suspense fallback={<ShopCatalogueSkeleton />}>
          <ShopCatalogue />
        </Suspense>

        {/* Shop Closing & Gift-Box Cue */}
        <ShopClosing />
      </main>

      {/* Brand Shared Footer */}
      <Footer />
    </div>
  );
}

