'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, ShoppingBag, Eye, Gift, Package } from 'lucide-react';
import { THINDI_BUNDLES } from '@/data/bundles';
import { ThindiBundle } from '@/types/bundle';
import { useCart } from '@/context/CartContext';
import { BundleContentsModal } from './BundleContentsModal';
import { BulkEnquiryModal } from './BulkEnquiryModal';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const ThindiBoxSection: React.FC = () => {
  const { addBundle } = useCart();
  const [selectedBundle, setSelectedBundle] = useState<ThindiBundle>(THINDI_BUNDLES[0]);
  const [contentsModalOpen, setContentsModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (bundle: ThindiBundle) => {
    addBundle(bundle, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <>
      <section
        id="thindi-box"
        className="relative bg-turmeric text-jaggery pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 border-b border-jaggery/15 overflow-hidden"
        aria-label="The THINDI Box Gifting Feature"
      >
        {/* Ambient warm lighting overlay */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-turmeric-light/30 blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========================================================
              DESKTOP ASYMMETRIC TWO-COLUMN LAYOUT (Screen widths >= 1024px)
              Left: Headline, Segmented Selector, Summary, Pricing & CTAs (6 cols)
              Right: Dominant Gifting Packaging Visual Composition (6 cols)
              ======================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center">
            {/* LEFT SIDE: Brand Narrative & Commerce Selector (6 cols) */}
            <div className="lg:col-span-6 z-10">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-7 h-[2px] bg-chilli shrink-0" />
                <span className="font-sans text-xs xl:text-sm font-bold tracking-[0.22em] uppercase text-jaggery">
                  A LITTLE BIT OF EVERYTHING
                </span>
                <span className="text-xs font-kannada font-bold text-chilli">
                  · ಉಡುಗೊರೆ ಬಾಕ್ಸ್
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-display font-black text-4xl xl:text-5xl text-jaggery tracking-[-0.03em] leading-[1.06] mb-3">
                <span>One box.</span>{' '}
                <span className="text-jaggery">So many cravings.</span>
              </h2>

              {/* Kannada Accent */}
              <div className="inline-block px-3 py-1 bg-cream/80 border border-jaggery/15 rounded-sm font-kannada text-sm xl:text-base font-bold text-jaggery mb-4 shadow-xs">
                ತಿಂಡಿ ತುಂಬಿದ ಸಂತೋಷ!
              </div>

              {/* Supporting Paragraph */}
              <p className="font-sans text-base text-jaggery/90 leading-relaxed max-w-xl mb-6 text-pretty">
                From crunchy favourites to the tastes that feel like home. Meet the
                THINDI Box — an assortment of authentic Hassan snacks packed for sharing,
                festivals, and everyday cravings.
              </p>

              {/* COMPACT SEGMENTED BUNDLE SELECTOR */}
              <div className="mb-5">
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-jaggery/80 mb-2 block">
                  Select Curated Assortment:
                </label>

                <div
                  role="tablist"
                  aria-label="THINDI Box Assortments"
                  className="grid grid-cols-3 gap-2 p-1.5 rounded-lg bg-cream/60 border border-jaggery/20"
                >
                  {THINDI_BUNDLES.map((bundle) => {
                    const isSelected = bundle.id === selectedBundle.id;
                    return (
                      <button
                        key={bundle.id}
                        role="tab"
                        aria-selected={isSelected}
                        type="button"
                        onClick={() => setSelectedBundle(bundle)}
                        className={`p-2.5 rounded-md text-left transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-cream text-jaggery border border-jaggery/30 shadow-sm font-semibold'
                            : 'text-jaggery/75 hover:text-jaggery hover:bg-cream/40'
                        }`}
                      >
                        <div className="font-display font-bold text-xs truncate">
                          {bundle.name}
                        </div>
                        <div className="font-mono text-xs font-bold text-chilli mt-0.5">
                          ₹{bundle.price}
                        </div>
                        <div className="text-[10px] font-sans text-jaggery-muted truncate">
                          {bundle.itemCount} varieties
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Bundle Details Summary Strip */}
              <div className="bg-cream/95 rounded-lg border border-jaggery/20 p-4 xl:p-5 mb-6 shadow-sm">
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <h3 className="font-display font-bold text-base text-jaggery">
                    {selectedBundle.name}
                  </h3>
                  <span className="font-kannada text-xs font-bold text-chilli">
                    {selectedBundle.kannadaName}
                  </span>
                </div>

                <p className="font-sans text-xs text-jaggery-muted mb-3 leading-relaxed">
                  {selectedBundle.shortDescription}
                </p>

                {/* Contents Items Preview */}
                <div className="border-t border-b border-jaggery/10 py-2.5 my-2.5 space-y-1">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-jaggery-muted">
                    Box Assortment ({selectedBundle.totalWeight}):
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {selectedBundle.contents.map((item, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-sans font-medium text-jaggery bg-turmeric/20 px-2 py-0.5 rounded border border-jaggery/10"
                      >
                        {item.name} ({item.weight})
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setContentsModalOpen(true)}
                  className="font-sans text-xs font-semibold text-chilli hover:text-chilli-hover underline underline-offset-4 flex items-center gap-1.5 pt-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Itemized Breakdown ({selectedBundle.itemCount} items)</span>
                </button>
              </div>

              {/* Price & Primary CTA */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-jaggery/20">
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-widest font-bold text-jaggery/70 block">
                    Curated Price ({selectedBundle.totalWeight})
                  </span>
                  <div className="font-display font-black text-3xl text-jaggery">
                    ₹{selectedBundle.price}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setContentsModalOpen(true)}
                    className="font-sans text-xs font-semibold text-jaggery hover:text-chilli underline underline-offset-4 px-2 py-2 cursor-pointer"
                  >
                    View Contents
                  </button>

                  <Button
                    variant="primary"
                    size="md"
                    icon={
                      isAdded ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )
                    }
                    onClick={() => handleAddToCart(selectedBundle)}
                    className={isAdded ? 'bg-leaf hover:bg-leaf' : ''}
                  >
                    {isAdded ? 'Added Box ✓' : 'Add Box to Basket'}
                  </Button>
                </div>
              </div>

              {/* Bulk Gifting Secondary Link */}
              <div className="pt-3 flex items-center gap-2 text-xs font-sans text-jaggery/85">
                <Gift className="w-4 h-4 text-chilli shrink-0" />
                <span>Planning gifts for a wedding or celebration?</span>
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(true)}
                  className="font-semibold text-jaggery hover:text-chilli underline underline-offset-4 ml-1 cursor-pointer"
                >
                  Enquire About Bulk Orders
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Dominant Visual Gift Box Packaging Composition (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative">
                {/* Main Box Showcase Container: Kraft/Cream Box Art Direction */}
                <div className="relative rounded-lg overflow-hidden border-2 border-jaggery/25 bg-cream shadow-[0_24px_50px_-10px_rgba(45,36,30,0.22)] group">
                  <div className="relative aspect-[4/3] xl:aspect-[16/11] w-full overflow-hidden bg-cream-dark">
                    <Image
                      key={selectedBundle.id}
                      src={selectedBundle.imageSrc}
                      alt={selectedBundle.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1280px) 50vw, 650px"
                      className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02] animate-in fade-in duration-300"
                    />

                    {/* Conceptual Gifting Mockup Badge */}
                    <div className="absolute top-4 left-4 bg-jaggery/90 backdrop-blur-sm text-cream px-3 py-1 rounded text-[10px] uppercase font-sans font-bold tracking-wider border border-cream/20">
                      Curated Gifting Box · Concept Packaging
                    </div>

                    {/* Small Chakkali Seal Badge */}
                    <div className="absolute top-4 right-4 bg-cream/95 backdrop-blur-sm p-1.5 rounded-full border border-jaggery/20 shadow-md">
                      <ChakkaliMotif size={26} color="#2D241E" accentColor="#A43D2E" />
                    </div>
                  </div>

                  {/* Packaging Details Footer Strip */}
                  <div className="p-4 bg-cream border-t border-jaggery/15 flex items-center justify-between text-xs font-sans text-jaggery">
                    <div>
                      <span className="font-display font-bold block text-sm">
                        {selectedBundle.name}
                      </span>
                      <span className="text-[11px] text-jaggery-muted font-mono">
                        {selectedBundle.totalWeight} · {selectedBundle.itemCount} Varieties
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setContentsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-turmeric text-jaggery font-semibold text-xs hover:bg-turmeric-light transition-colors border border-jaggery/15 cursor-pointer"
                    >
                      <span>Inspect Items</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              MOBILE RESPONSIVE FLOW (< 1024px)
              Order: Eyebrow -> Headline -> Box Visual -> Segmented Selector -> Details -> CTA
              ======================================================== */}
          <div className="lg:hidden flex flex-col space-y-5">
            {/* 1. Mobile Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-5 h-[1.5px] bg-chilli" />
              <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-jaggery">
                A LITTLE BIT OF EVERYTHING
              </span>
            </div>

            {/* 2. Mobile Headline */}
            <h2 className="font-display font-black text-3xl sm:text-4xl text-jaggery tracking-tight leading-[1.08]">
              One box. So many cravings.
            </h2>

            {/* 3. Mobile Supporting Text + Kannada Accent */}
            <div className="space-y-2.5">
              <div className="inline-block px-3 py-0.5 bg-cream/70 border border-jaggery/20 rounded-sm font-kannada text-sm font-bold text-jaggery">
                ತಿಂಡಿ ತುಂಬಿದ ಸಂತೋಷ!
              </div>

              <p className="font-sans text-sm text-jaggery/90 leading-relaxed">
                From crunchy favourites to the tastes that feel like home. Meet the
                THINDI Box — an assortment of authentic Hassan snacks packed for sharing.
              </p>
            </div>

            {/* 4. Large Gift Box Image */}
            <div className="relative rounded-lg overflow-hidden border border-jaggery/25 bg-cream shadow-md">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  key={selectedBundle.id}
                  src={selectedBundle.imageSrc}
                  alt={selectedBundle.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover animate-in fade-in duration-300"
                />
                <div className="absolute top-3 left-3 bg-jaggery/90 text-cream px-2.5 py-0.5 rounded text-[10px] uppercase font-sans font-bold tracking-wider">
                  Concept Gifting Box
                </div>
              </div>

              <div className="p-3 bg-cream flex items-center justify-between text-xs font-sans text-jaggery border-t border-jaggery/15">
                <span className="font-bold">{selectedBundle.name}</span>
                <span className="font-mono text-chilli font-semibold">
                  {selectedBundle.totalWeight}
                </span>
              </div>
            </div>

            {/* 5. Mobile Segmented Bundle Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-jaggery/80">
                Choose Box Assortment:
              </label>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2" role="tablist" aria-label="Mobile Box Assortments">
                {THINDI_BUNDLES.map((bundle) => {
                  const isSelected = bundle.id === selectedBundle.id;
                  return (
                    <button
                      key={bundle.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedBundle(bundle)}
                      className={`min-h-[44px] p-2 sm:p-2.5 rounded-md text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cream text-jaggery border-jaggery shadow-sm font-semibold ring-1 ring-jaggery/20'
                          : 'bg-cream/40 text-jaggery/80 border-jaggery/20 hover:bg-cream/60'
                      }`}
                    >
                      <div className="font-display font-bold text-[11px] sm:text-xs leading-tight line-clamp-2">
                        {bundle.name}
                      </div>
                      <div className="font-mono text-xs font-bold text-chilli mt-1">
                        ₹{bundle.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Mobile Price & Contents Summary */}
            <div className="bg-cream/95 rounded-lg border border-jaggery/20 p-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <h4 className="font-display font-bold text-base text-jaggery">
                    {selectedBundle.name}
                  </h4>
                  <span className="font-kannada text-xs font-bold text-chilli">
                    {selectedBundle.kannadaName}
                  </span>
                </div>
                <div className="font-display font-black text-2xl text-jaggery">
                  ₹{selectedBundle.price}
                </div>
              </div>

              <p className="font-sans text-xs text-jaggery-muted">
                {selectedBundle.shortDescription}
              </p>

              <button
                type="button"
                onClick={() => setContentsModalOpen(true)}
                className="w-full text-center font-sans text-xs font-semibold text-chilli underline underline-offset-4 py-1"
              >
                Inspect Contents ({selectedBundle.itemCount} items)
              </button>
            </div>

            {/* 7. Mobile Add to Cart CTA */}
            <div>
              <Button
                variant="primary"
                size="md"
                className={`w-full justify-center ${isAdded ? 'bg-leaf hover:bg-leaf' : ''}`}
                icon={
                  isAdded ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )
                }
                onClick={() => handleAddToCart(selectedBundle)}
              >
                {isAdded ? 'Added Box to Basket ✓' : `Add ${selectedBundle.name} — ₹${selectedBundle.price}`}
              </Button>
            </div>

            {/* 8. Mobile Bulk Gifting Link */}
            <div className="text-center pt-1 text-xs font-sans text-jaggery/85">
              <span>Planning gifts for a celebration? </span>
              <button
                type="button"
                onClick={() => setBulkModalOpen(true)}
                className="font-semibold text-jaggery hover:text-chilli underline underline-offset-4"
              >
                Enquire About Bulk Orders
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* View What's Inside Modal */}
      <BundleContentsModal
        bundle={selectedBundle}
        isOpen={contentsModalOpen}
        onClose={() => setContentsModalOpen(false)}
        onAddToCart={handleAddToCart}
        isAdded={isAdded}
      />

      {/* Bulk & Celebration Enquiry Modal */}
      <BulkEnquiryModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />
    </>
  );
};
