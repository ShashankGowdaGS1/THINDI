'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, ShoppingBag, Eye, Gift, Sparkles, Package } from 'lucide-react';
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
        className="relative bg-turmeric text-jaggery pt-20 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-b border-jaggery/15 overflow-hidden"
        aria-label="The THINDI Box Gifting Feature"
      >
        {/* Ambient warm lighting overlay */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-turmeric-light/30 blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========================================================
              DESKTOP ASYMMETRIC TWO-AREA LAYOUT (Hidden on mobile < 1024px)
              Left: Headline, Copy, Bundle Selector, Price, CTAs (6 cols)
              Right: Dominant Gifting Box Visual Composition (6 cols)
              ======================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center mb-16">
            {/* LEFT SIDE: Brand Narrative & Commerce Selector (6 cols) */}
            <div className="lg:col-span-6 z-10">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-8 h-[2px] bg-chilli shrink-0" />
                <span className="font-sans text-xs xl:text-sm font-bold tracking-[0.24em] uppercase text-jaggery">
                  A LITTLE BIT OF EVERYTHING
                </span>
                <span className="text-xs font-kannada font-bold text-chilli">
                  · ಉಡುಗೊರೆ ಬಾಕ್ಸ್
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-display font-black text-5xl xl:text-6xl text-jaggery tracking-[-0.03em] leading-[1.04] mb-4">
                <span>One box.</span>
                <br />
                <span className="text-jaggery">So many cravings.</span>
              </h2>

              {/* Kannada Accent */}
              <div className="inline-block px-3.5 py-1 bg-cream/70 border border-jaggery/20 rounded-sm font-kannada text-base xl:text-lg font-bold text-jaggery mb-5 shadow-xs">
                ತಿಂಡಿ ತುಂಬಿದ ಸಂತೋಷ!
              </div>

              {/* Supporting Paragraph */}
              <p className="font-sans text-base xl:text-lg text-jaggery/90 leading-relaxed max-w-xl mb-8 text-pretty">
                From crunchy favourites to the tastes that feel like home. Meet the
                THINDI Box — an assortment of authentic Hassan snacks packed for sharing,
                festivals, and everyday cravings.
              </p>

              {/* BUNDLE SELECTOR (3 Curated Options) */}
              <div className="mb-6 space-y-2.5">
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-jaggery/80 mb-1">
                  Select Curated Assortment:
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {THINDI_BUNDLES.map((bundle) => {
                    const isSelected = bundle.id === selectedBundle.id;
                    return (
                      <button
                        key={bundle.id}
                        type="button"
                        onClick={() => setSelectedBundle(bundle)}
                        className={`p-3 rounded text-left transition-all duration-200 border cursor-pointer ${
                          isSelected
                            ? 'bg-cream text-jaggery border-jaggery shadow-md scale-[1.02]'
                            : 'bg-turmeric-light/40 text-jaggery/85 border-jaggery/25 hover:bg-cream/50 hover:border-jaggery/40'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="font-display font-bold text-sm tracking-tight leading-snug mb-0.5">
                          {bundle.name}
                        </div>
                        <div className="font-mono text-xs font-semibold text-chilli">
                          ₹{bundle.price}
                        </div>
                        <div className="font-sans text-[10px] text-jaggery-muted mt-0.5">
                          {bundle.itemCount} varieties
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Bundle Details Summary Strip */}
              <div className="bg-cream/90 rounded border border-jaggery/20 p-4 mb-6 shadow-sm">
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <h4 className="font-display font-bold text-base text-jaggery">
                    {selectedBundle.name}
                  </h4>
                  <span className="font-kannada text-xs font-bold text-chilli">
                    {selectedBundle.kannadaName}
                  </span>
                </div>

                <p className="font-sans text-xs text-jaggery-muted mb-3 leading-relaxed">
                  {selectedBundle.shortDescription}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedBundle.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-sans font-medium text-jaggery bg-turmeric/20 px-2 py-0.5 rounded border border-jaggery/10"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setContentsModalOpen(true)}
                  className="font-sans text-xs font-semibold text-chilli hover:text-chilli-hover underline underline-offset-4 flex items-center gap-1 p-0.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View What&apos;s Inside ({selectedBundle.itemCount} items)</span>
                </button>
              </div>

              {/* Price & Primary CTA */}
              <div className="flex items-center justify-between gap-4 mb-6 pt-2 border-t border-jaggery/20">
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-widest font-bold text-jaggery/70 block">
                    Assortment Price
                  </span>
                  <div className="font-display font-black text-3xl text-jaggery">
                    ₹{selectedBundle.price}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setContentsModalOpen(true)}
                    className="border border-jaggery/30 bg-cream hover:bg-cream-dark text-jaggery"
                  >
                    View Contents
                  </Button>

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
              <div className="pt-2 flex items-center gap-2 text-xs font-sans text-jaggery/85">
                <Gift className="w-4 h-4 text-chilli shrink-0" />
                <span>Planning gifts for a celebration?</span>
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(true)}
                  className="font-semibold text-jaggery hover:text-chilli underline underline-offset-4 ml-1 cursor-pointer"
                >
                  Enquire About Bulk Orders
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Dominant Visual Gift Box Composition (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative">
                {/* Main Box Showcase Container: Kraft/Cream Box Art Direction */}
                <div className="relative rounded-md overflow-hidden border-2 border-jaggery/25 bg-cream shadow-[0_24px_50px_-10px_rgba(45,36,30,0.22)] group">
                  {/* Food assortment image filling the interior */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark">
                    <Image
                      src={selectedBundle.imageSrc}
                      alt={selectedBundle.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1280px) 50vw, 600px"
                      className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />

                    {/* Conceptual Gifting Mockup Badge */}
                    <div className="absolute top-4 left-4 bg-jaggery/90 backdrop-blur-sm text-cream px-3 py-1 rounded text-[10px] uppercase font-sans font-bold tracking-wider border border-cream/20">
                      Gifting Assortment Concept · Hassan
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
                        {selectedBundle.totalWeight}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setContentsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-turmeric text-jaggery font-semibold text-xs hover:bg-turmeric-light transition-colors border border-jaggery/15"
                    >
                      <span>Inspect Items</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Decorative floating kraft packaging pill */}
                <div className="absolute -bottom-5 -left-6 bg-cream border border-jaggery/25 rounded-md px-4 py-2.5 shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-turmeric/30 flex items-center justify-center text-chilli font-bold">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider font-sans font-bold text-jaggery-muted">
                      Packaging Structure
                    </div>
                    <div className="text-xs font-sans font-bold text-jaggery">
                      Divided Kraft Carton · Sealed Pouches
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              MOBILE RESPONSIVE FLOW (< 1024px)
              Order:
              1. Eyebrow
              2. Headline
              3. Supporting text + Kannada accent
              4. Gift box image
              5. Bundle selector
              6. Price and contents
              7. Add to Cart CTA
              8. Bulk gifting link
              ======================================================== */}
          <div className="lg:hidden flex flex-col space-y-6 mb-12">
            {/* 1. Mobile Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-chilli" />
              <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-jaggery">
                A LITTLE BIT OF EVERYTHING
              </span>
            </div>

            {/* 2. Mobile Headline */}
            <h2 className="font-display font-black text-3xl sm:text-4xl text-jaggery tracking-tight leading-[1.08]">
              One box.
              <br />
              So many cravings.
            </h2>

            {/* 3. Mobile Supporting Text + Kannada Accent */}
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 bg-cream/70 border border-jaggery/20 rounded-sm font-kannada text-sm font-bold text-jaggery">
                ತಿಂಡಿ ತುಂಬಿದ ಸಂತೋಷ!
              </div>

              <p className="font-sans text-sm sm:text-base text-jaggery/90 leading-relaxed">
                From crunchy favourites to the tastes that feel like home. Meet the
                THINDI Box — an assortment of authentic Hassan snacks packed for sharing.
              </p>
            </div>

            {/* 4. Large Gift Box Image */}
            <div className="relative rounded-md overflow-hidden border border-jaggery/25 bg-cream shadow-md">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={selectedBundle.imageSrc}
                  alt={selectedBundle.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-jaggery/90 text-cream px-2.5 py-0.5 rounded text-[10px] uppercase font-sans font-bold tracking-wider">
                  Conceptual Gifting Box
                </div>
              </div>

              <div className="p-3 bg-cream flex items-center justify-between text-xs font-sans text-jaggery border-t border-jaggery/15">
                <span className="font-bold">{selectedBundle.name}</span>
                <span className="font-mono text-chilli font-semibold">
                  {selectedBundle.totalWeight}
                </span>
              </div>
            </div>

            {/* 5. Mobile Bundle Selector */}
            <div className="space-y-2">
              <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-jaggery/80">
                Choose Box Assortment:
              </div>

              <div className="grid grid-cols-3 gap-2">
                {THINDI_BUNDLES.map((bundle) => {
                  const isSelected = bundle.id === selectedBundle.id;
                  return (
                    <button
                      key={bundle.id}
                      type="button"
                      onClick={() => setSelectedBundle(bundle)}
                      className={`p-2.5 rounded text-left border transition-all ${
                        isSelected
                          ? 'bg-cream text-jaggery border-jaggery shadow-sm'
                          : 'bg-turmeric-light/35 text-jaggery/80 border-jaggery/20'
                      }`}
                    >
                      <div className="font-display font-bold text-xs leading-snug line-clamp-1">
                        {bundle.name}
                      </div>
                      <div className="font-mono text-xs font-semibold text-chilli mt-0.5">
                        ₹{bundle.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Mobile Price & Contents Summary */}
            <div className="bg-cream/90 rounded border border-jaggery/20 p-4 space-y-3">
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
                View Complete Contents ({selectedBundle.itemCount} items)
              </button>
            </div>

            {/* 7. Mobile Add to Cart CTA */}
            <div className="space-y-2.5">
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
            <div className="text-center pt-2 text-xs font-sans text-jaggery/85">
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

          {/* ========================================================
              TRANSITION INTO NEXT SECTION
              "A little care in every bite."
              ======================================================== */}
          <div className="pt-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-jaggery/25" />
              <ChakkaliMotif size={22} color="#2D241E" accentColor="#A43D2E" />
              <span className="w-12 h-[1px] bg-jaggery/25" />
            </div>

            <p className="font-display font-bold text-xl sm:text-2xl text-jaggery tracking-tight mb-1">
              A little care in every bite.
            </p>
            <p className="font-kannada text-sm font-semibold text-chilli tracking-wide">
              ಪ್ರತಿಯೊಂದು ತುತ್ತಿನಲ್ಲೂ ಪ್ರೀತಿಯ ಕಾಳಜಿ
            </p>
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
