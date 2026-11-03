'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Gift,
  ShoppingBag,
  Check,
  Eye,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
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
    <div className="space-y-16 pb-24">
      {/* ========================================================
          1. HERO INTRO
          ======================================================== */}
      <section className="relative bg-turmeric text-jaggery pt-12 pb-16 md:pt-20 md:pb-24 border-b border-jaggery/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/70 border border-jaggery/20 text-xs font-bold uppercase tracking-wider text-jaggery shadow-xs">
                <Gift className="w-3.5 h-3.5 text-chilli" />
                <span>CURATED HASSAN GIFT CARTONS · ಉಡುಗೊರೆ ಪೆಟ್ಟಿಗೆ</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-jaggery tracking-tight leading-[1.08]">
                  A box full of
                  <span className="block text-chilli">good thindi.</span>
                </h1>
                <p className="font-kannada text-xl text-jaggery/90 font-medium">
                  ಸಂಭ್ರಮದ ಕ್ಷಣಗಳಿಗೆ ತಿಂಡಿಯ ಉಡುಗೊರೆ
                </p>
              </div>

              <p className="font-sans text-base sm:text-lg text-jaggery/90 max-w-xl leading-relaxed">
                Discover curated snack assortments for sharing, gifting and every little celebration.
                Traditional chakkali, crisp kodubale, spicy nippattu, and sun-dried treats hand-packed in Hassan.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-jaggery">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cream/60 border border-jaggery/15">
                  <Check className="w-3.5 h-3.5 text-leaf" />
                  <span>Sealed for crispness</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cream/60 border border-jaggery/15">
                  <Truck className="w-3.5 h-3.5 text-leaf" />
                  <span>Statewide Karnataka shipping</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cream/60 border border-jaggery/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-leaf" />
                  <span>Zero palm oil</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden border-2 border-jaggery/20 shadow-lg bg-cream">
                <Image
                  src="/images/box/thindi-box.jpg"
                  alt="Open THINDI Box gift carton with authentic Karnataka savouries"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CURATED BUNDLE OPTIONS (Packaging-Led Layout)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-chilli font-sans">
            AVAILABLE ASSORTMENTS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery mt-1">
            Choose Your THINDI Box
          </h2>
          <p className="text-sm text-jaggery/70 mt-2 font-sans">
            Each box is curated for distinct snacking moments — from afternoon tea to festive family gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {THINDI_BUNDLES.map((bundle) => {
            const isAdded = !!addedMap[bundle.id];

            return (
              <div
                key={bundle.id}
                className="bg-[#FFFCF7] rounded-2xl border border-jaggery/15 shadow-sm hover:border-chilli/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Top Image & Badge */}
                  <div className="relative aspect-16/10 overflow-hidden bg-cream-dark">
                    <Image
                      src={bundle.imageSrc}
                      alt={bundle.imageAlt || bundle.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cream/90 backdrop-blur-xs text-[11px] font-mono font-bold text-jaggery border border-jaggery/15">
                      {bundle.totalWeight}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-serif text-2xl font-bold text-jaggery">
                          {bundle.name}
                        </h3>
                      </div>
                      <p className="font-kannada text-sm text-chilli font-medium mt-0.5">
                        {bundle.kannadaName}
                      </p>
                      <p className="text-xs font-mono text-jaggery/50 mt-1">
                        SKU: {bundle.sku} · {bundle.itemCount} Assorted Packs
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-jaggery/75 font-sans leading-relaxed">
                      {bundle.shortDescription}
                    </p>

                    {/* Contents Itemized Preview */}
                    <div className="p-3.5 rounded-xl bg-cream border border-jaggery/10 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-jaggery/70">
                        Box Contents:
                      </p>
                      <ul className="space-y-1 text-xs text-jaggery/85">
                        {bundle.contents.map((item, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span className="font-mono text-jaggery/60 text-[11px]">
                              {item.weight}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 pt-3 border-t border-jaggery/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-sans text-jaggery/60 uppercase block">
                      Price per Box
                    </span>
                    <span className="font-serif text-2xl font-bold text-chilli">
                      ₹{bundle.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectingBundle(bundle)}
                      className="p-2.5 rounded-lg border border-jaggery/20 hover:bg-cream text-jaggery transition-colors cursor-pointer"
                      title="Inspect box details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(bundle)}
                      className={`px-4 py-2.5 rounded-lg font-sans font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-leaf text-cream'
                          : 'bg-chilli text-cream hover:bg-[#8B3326] shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart</span>
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

            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-cream">
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-jaggery mt-1">
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
                  className="w-full flex items-center justify-between text-left gap-4 font-serif text-base sm:text-lg font-bold text-jaggery hover:text-chilli transition-colors cursor-pointer"
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
            setInspectingBundle(null);
          }}
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

