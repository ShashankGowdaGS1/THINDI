import React from 'react';
import { Header } from '@/components/navigation/Header';
import { HeroSection } from '@/components/hero/HeroSection';
import { ShopByCravingSection } from '@/components/craving/ShopByCravingSection';
import { SignaturePicksSection } from '@/components/product/SignaturePicksSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { ThindiBoxSection } from '@/components/box/ThindiBoxSection';
import { BehindEveryBite } from '@/components/home/BehindEveryBite';
import { DoorstepDeliverySection } from '@/components/delivery/DoorstepDeliverySection';
import { FestivalCampaignSection } from '@/components/home/FestivalCampaignSection';
import { CustomerFAQSection } from '@/components/home/CustomerFAQSection';
import { ClosingCTASection } from '@/components/home/ClosingCTASection';
import { Footer } from '@/components/navigation/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      {/* 1. Brand Navigation */}
      <Header />

      {/* 2. Main Homepage Flow */}
      <main className="flex-1">
        {/* Stage 1: Hero Section */}
        <HeroSection />

        {/* Stage 2: Shop by Craving Section */}
        <ShopByCravingSection />

        {/* Stage 3: Signature Products Showcase */}
        <SignaturePicksSection />

        {/* Stage 4: From Hassan, With Love (Brand Storytelling) */}
        <BrandStorySection />

        {/* Stage 5: The THINDI Box Gifting Feature */}
        <ThindiBoxSection />

        {/* Stage 6: Behind Every Bite (Interactive Macro Explorer) */}
        <BehindEveryBite />

        {/* Stage 7: Hassan to Your Doorstep (Pincode Serviceability) */}
        <DoorstepDeliverySection />

        {/* Stage 8: Festivals Taste Better Together (Seasonal Celebrations) */}
        <FestivalCampaignSection />

        {/* Stage 9: Customer Confidence & FAQs (Good Thindi. No Guesswork.) */}
        <CustomerFAQSection />

        {/* Stage 10: Closing CTA (One more bite? — There's Always Room For THINDI) */}
        <ClosingCTASection />
      </main>

      {/* Stage 10: Premium Brand Footer */}
      <Footer />
    </div>
  );
}
