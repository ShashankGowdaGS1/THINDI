'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Gift,
  ShoppingBag,
  Check,
  Eye,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { THINDI_BUNDLES } from '@/data/bundles';
import { ThindiBundle } from '@/types/bundle';
import { useCart } from '@/context/CartContext';
import { BundleContentsModal } from '@/components/box/BundleContentsModal';
import { BulkEnquiryModal } from '@/components/box/BulkEnquiryModal';

const GIFTING_FAQS = [
  {
    q: 'Can I send a THINDI Box as a surprise gift to someone in Karnataka?',
    a: 'Yes! Simply enter the recipient’s full delivery address and phone number during checkout. We package every THINDI Box securely in our signature Kraft gifting carton.',
  },
  {
    q: 'How fresh will the snacks stay during delivery transit?',
    a: 'Every savoury pack inside the box is hermetically sealed in multi-layer barrier foil immediately after cooling in our Hassan central kitchen. Snacks stay crisp for at least 60 days.',
  },
  {
    q: 'Do you offer bulk orders for weddings, family functions, or corporate gifting?',
    a: 'Yes! We regularly fulfill large orders across Karnataka. Click "Request Bulk Gifting" to submit your recipient count and dates, and our team will get in touch directly from Hassan.',
  },
  {
    q: 'What shipping precautions are taken for fragile sandige or pickle jars?',
    a: 'Sandige pouches are cushioned with inner cardboard dividers, while glass and ceramic pickle jars are packed in shock-absorbent sleeves to prevent transit leaks.',
  },
];

export const CombosPageView: React.FC = () => {
  const { addBundle } = useCart();
  const [inspectingBundle, setInspectingBundle] = useState<ThindiBundle | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleAddToCart = (bundle: ThindiBundle) => {
    addBundle(bundle, 1);
    setAddedMap((prev) => ({ ...prev, [bundle.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [bundle.id]: false }));
    }, 1600);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      {/* ========================================================
          1. HERO INTRO — A BOX FULL OF KARNATAKA
          ======================================================== */}
      <section className="relative bg-turmeric text-jaggery pt-10 pb-14 sm:pt-16 sm:pb-20 border-b border-jaggery/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column (42-45% desktop width) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream/80 border border-jaggery/20 text-xs font-bold uppercase tracking-wider text-jaggery shadow-xs">
                <Gift className="w-3.5 h-3.5 text-chilli" />
                <span>A BOX FULL OF KARNATAKA · ಉಡುಗೊರೆ ಪೆಟ್ಟಿಗೆ</span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[54px] text-jaggery tracking-tight leading-[1.06]">
                  A box full of
                  <span className="block text-chilli">good thindi.</span>
                </h1>
                <p className="font-kannada text-lg sm:text-xl text-jaggery/90 font-medium">
                  ಸಂಭ್ರಮದ ಕ್ಷಣಗಳಿಗೆ ತಿಂಡಿಯ ಉಡುಗೊರೆ
                </p>
              </div>

              {/* Shortened Supporting Copy */}
              <p className="font-sans text-base sm:text-lg text-jaggery/85 max-w-xl leading-relaxed">
                Traditional Karnataka favourites, beautifully brought together for sharing, gifting and every little celebration.
              </p>

              {/* Mobile-Only Celebration Box Photograph (Between description and CTA) */}
              <div className="block lg:hidden my-6">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-jaggery/20 shadow-lg bg-[#FAF5EC]">
                  <Image
                    src="/images/thindi-boxes/celebration-box.png"
                    alt="THINDI Celebration Box gift packaging with five traditional Karnataka snack varieties"
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Primary CTA Button */}
              <div className="pt-1">
                <a
                  href="#boxes-assortments"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-jaggery text-cream font-sans font-bold text-sm hover:bg-leaf transition-colors min-h-[48px] shadow-sm cursor-pointer"
                >
                  <span>Explore THINDI Boxes</span>
                  <ArrowRight className="w-4 h-4 text-turmeric" />
                </a>
              </div>
            </div>

            {/* Right Desktop Visual Column (55-58% desktop width) */}
            <div className="hidden lg:block lg:col-span-7">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-jaggery/20 shadow-xl bg-[#FAF5EC]">
                <Image
                  src="/images/thindi-boxes/celebration-box.png"
                  alt="THINDI Celebration Box gift packaging with five traditional Karnataka snack varieties"
                  fill
                  priority
                  sizes="(max-width: 1280px) 55vw, 680px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CURATED BUNDLE ASSORTMENTS (Photography-Led Merchandise)
          ======================================================== */}
      <section id="boxes-assortments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-chilli font-sans">
            AVAILABLE ASSORTMENTS
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-jaggery mt-1 tracking-tight">
            Choose Your THINDI Box
          </h2>
          <p className="text-sm sm:text-base text-jaggery/75 mt-2 font-sans">
            Three thoughtfully arranged assortments for different occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {THINDI_BUNDLES.map((bundle) => {
            const isAdded = !!addedMap[bundle.id];

            return (
              <div
                key={bundle.id}
                className="bg-[#FFFDF9] rounded-2xl border border-jaggery/15 shadow-sm hover:border-chilli/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Top Large Photography (55-60% Visual Emphasis) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF5EC] border-b border-jaggery/10 group">
                    <Image
                      src={bundle.imageSrc}
                      alt={bundle.imageAlt || bundle.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-2 group-hover:scale-102 transition-transform duration-300"
                    />
                    {/* Weight & Variety Badges */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cream/95 backdrop-blur-xs text-[11px] font-mono font-bold text-jaggery border border-jaggery/15 shadow-xs">
                      {bundle.totalWeight}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-turmeric/90 backdrop-blur-xs text-[11px] font-sans font-bold text-jaggery border border-jaggery/15 shadow-xs">
                      {bundle.itemCount} Varieties
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3.5">
                    <div>
                      <h3 className="font-display font-black text-2xl text-jaggery tracking-tight">
                        {bundle.name}
                      </h3>
                      <p className="font-kannada text-sm text-chilli font-semibold mt-0.5">
                        {bundle.kannadaName}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-jaggery/75 font-sans leading-relaxed line-clamp-2">
                      {bundle.shortDescription}
                    </p>

                    {/* Snacks Summary */}
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-jaggery/60 block mb-1.5 font-sans">
                        Assortment Includes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {bundle.contents.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center text-[11px] font-medium text-jaggery/85 bg-cream px-2 py-0.5 rounded border border-jaggery/10"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-5 bg-cream/40 border-t border-jaggery/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-sans text-jaggery/60 uppercase font-semibold block">
                      Price per Box
                    </span>
                    <span className="font-display font-black text-2xl text-chilli">
                      ₹{bundle.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectingBundle(bundle)}
                      className="px-3 py-2.5 rounded-lg border border-jaggery/20 hover:bg-cream text-jaggery text-xs font-bold font-sans flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                      aria-label={`View contents of ${bundle.name}`}
                    >
                      <Eye className="w-4 h-4 text-jaggery/70" />
                      <span>View Contents</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(bundle)}
                      className={`px-4 py-2.5 rounded-lg font-sans font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px] shadow-xs ${
                        isAdded
                          ? 'bg-leaf text-cream'
                          : 'bg-chilli text-cream hover:bg-[#8B3326]'
                      }`}
                      aria-label={`Add ${bundle.name} to cart`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added ✓</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add Box</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. BULK & CORPORATE GIFTING BANNER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-jaggery text-cream relative overflow-hidden border border-cream/10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/10 text-xs font-semibold text-turmeric uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5 text-turmeric" />
              <span>Bulk & Celebration Gifting</span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-4xl text-cream tracking-tight">
              Planning a wedding, festival dispatch, or corporate gesture?
            </h3>

            <p className="text-sm sm:text-base text-cream/80 font-sans leading-relaxed">
              We pack customized Thindi boxes with personal gift message inserts and coordinated dispatches to
              addresses across Karnataka. Tell us your requirements and schedule.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setBulkModalOpen(true)}
                className="px-6 py-3 rounded-lg bg-turmeric text-jaggery font-sans font-bold text-sm hover:bg-turmeric-light transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Request Bulk Gifting Information</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Background Ambient Motif */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-chilli/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ========================================================
          4. SHORT GIFTING FAQ
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-chilli font-sans">
            FREQUENT QUESTIONS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-jaggery mt-1 tracking-tight">
            Gifting & Delivery FAQs
          </h2>
        </div>

        <div className="divide-y divide-jaggery/10 border-y border-jaggery/10">
          {GIFTING_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-display text-base sm:text-lg font-bold text-jaggery hover:text-chilli transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-chilli' : 'text-jaggery/40'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs sm:text-sm text-jaggery/80 font-sans leading-relaxed pr-8">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-jaggery/60">
          Have more questions? Visit our{' '}
          <Link href="/faq" className="text-chilli font-semibold hover:underline">
            Comprehensive Customer FAQ Page →
          </Link>
        </div>
      </section>

      {/* Modals */}
      {inspectingBundle && (
        <BundleContentsModal
          bundle={inspectingBundle}
          isOpen={true}
          onClose={() => setInspectingBundle(null)}
          onAddToCart={() => {
            handleAddToCart(inspectingBundle);
          }}
          isAdded={!!addedMap[inspectingBundle.id]}
        />
      )}

      {bulkModalOpen && (
        <BulkEnquiryModal
          isOpen={true}
          onClose={() => setBulkModalOpen(false)}
        />
      )}
    </div>
  );
};
