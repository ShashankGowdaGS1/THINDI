'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Home, ArrowRight, ShieldCheck, Package, CheckCircle2 } from 'lucide-react';
import { PincodeChecker } from './PincodeChecker';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const DoorstepDeliverySection: React.FC = () => {
  return (
    <section
      id="doorstep-delivery"
      className="relative bg-cream pt-20 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-b border-jaggery/10 overflow-hidden text-jaggery"
      aria-label="Hassan to Your Doorstep"
    >
      {/* Subtle organic ambient gradient */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-leaf/5 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            DESKTOP ASYMMETRIC TWO-AREA LAYOUT (Hidden on mobile < 1024px)
            Left: Brand Delivery Story & Pincode Checker (6 cols)
            Right: Packaging Delivery Composition (6 cols)
            ======================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start mb-16">
          {/* LEFT AREA: Delivery Story, Illustrative Route & Checker (6 cols) */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-start">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-8 h-[2px] bg-leaf shrink-0" />
              <span className="font-sans text-xs xl:text-sm font-bold tracking-[0.24em] uppercase text-leaf">
                FROM HASSAN, WITH LOVE
              </span>
              <span className="text-xs font-kannada font-bold text-chilli">
                · ನಮ್ಮ ಊರಿನಿಂದ
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-display font-black text-5xl xl:text-6xl text-jaggery tracking-[-0.03em] leading-[1.04] mb-4">
              <span>From our ooru.</span>
              <br />
              <span className="text-leaf">To your doorstep.</span>
            </h2>

            {/* Kannada Accent */}
            <div className="inline-block px-3.5 py-1 bg-cream-dark/80 border border-jaggery/15 rounded-sm font-kannada text-base xl:text-lg font-bold text-jaggery mb-5 shadow-xs w-fit">
              ಹಾಸನದಿಂದ ನಿಮ್ಮ ಮನೆಗೆ.
            </div>

            {/* Supporting Copy */}
            <p className="font-sans text-base xl:text-lg text-jaggery-muted leading-relaxed max-w-xl mb-6 text-pretty">
              Your favourite Karnataka flavours, a little closer to home. Check if
              THINDI can reach your address.
            </p>

            {/* Illustrative Route Graphic: Hassan -> Your Home */}
            <div className="mb-8 p-3.5 bg-cream-light rounded border border-jaggery/15 flex items-center justify-between gap-3 text-xs font-sans text-jaggery">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-leaf text-cream flex items-center justify-center font-bold text-[10px]">
                  H
                </span>
                <div>
                  <span className="font-bold block">Hassan Kitchens</span>
                  <span className="text-[10px] text-jaggery-muted font-mono">
                    Origin Hub · 573201
                  </span>
                </div>
              </div>

              {/* Curved/Dotted connecting path */}
              <div className="flex-1 flex items-center justify-center px-3">
                <div className="w-full border-t border-dashed border-leaf/40 relative flex items-center justify-center">
                  <span className="px-2 bg-cream-light text-[10px] text-leaf font-bold tracking-widest uppercase">
                    Statewide Route
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-turmeric text-jaggery flex items-center justify-center font-bold text-[10px]">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div className="text-right">
                  <span className="font-bold block">Your Doorstep</span>
                  <span className="text-[10px] text-jaggery-muted">
                    Karnataka Pincode
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Interactive Feature: Pincode Checker */}
            <PincodeChecker />
          </div>

          {/* RIGHT AREA: Product Delivery Packaging Visual (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative sticky top-28">
              {/* Packaging Showcase Image Container */}
              <div className="relative rounded-md overflow-hidden border border-jaggery/20 bg-cream-dark shadow-[0_24px_50px_-10px_rgba(45,36,30,0.15)] group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark">
                  <Image
                    src="/images/delivery/delivery-box.jpg"
                    alt="Carefully packed THINDI shipping carton containing sealed chakkali and kodubale pouches ready for Karnataka doorstep dispatch"
                    fill
                    priority
                    sizes="(max-width: 1280px) 50vw, 600px"
                    className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />

                  {/* Packaging Identity Badge */}
                  <div className="absolute top-4 left-4 bg-jaggery/90 backdrop-blur-sm text-cream px-3 py-1 rounded text-[10px] uppercase font-sans font-bold tracking-wider border border-cream/20">
                    Dispatch Preparation · Hassan
                  </div>

                  {/* Chakkali Seal Badge */}
                  <div className="absolute top-4 right-4 bg-cream/95 backdrop-blur-sm p-1.5 rounded-full border border-jaggery/20 shadow-md">
                    <ChakkaliMotif size={26} color="#2D241E" accentColor="#365541" />
                  </div>
                </div>

                {/* Packaging Details Footer */}
                <div className="p-4 bg-cream border-t border-jaggery/15 flex items-center justify-between text-xs font-sans text-jaggery">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-leaf shrink-0" />
                    <span className="font-semibold">
                      Sealed Food-Grade Pouches · Sturdy Kraft Carton
                    </span>
                  </div>
                  <span className="font-kannada text-xs font-semibold text-leaf">
                    ತಾಜಾತನದ ರಕ್ಷಣೆ
                  </span>
                </div>
              </div>

              {/* Floating Dispatch Assurance Badge */}
              <div className="absolute -bottom-5 -left-6 bg-cream border border-jaggery/20 rounded-md px-4 py-2.5 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-leaf/15 flex items-center justify-center text-leaf font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider font-sans font-bold text-jaggery-muted">
                    Careful Packing
                  </div>
                  <div className="text-xs font-sans font-bold text-jaggery">
                    Prepared for Doorstep Transit
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
            3. Supporting copy + Kannada accent
            4. Packaging visual
            5. Pincode checker
            6. Delivery clarification
            ======================================================== */}
        <div className="lg:hidden flex flex-col space-y-6 mb-12">
          {/* 1. Mobile Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-leaf" />
            <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-leaf">
              FROM HASSAN, WITH LOVE
            </span>
          </div>

          {/* 2. Mobile Headline */}
          <h2 className="font-display font-black text-3xl sm:text-4xl text-jaggery tracking-tight leading-[1.08]">
            From our ooru.
            <br />
            <span className="text-leaf">To your doorstep.</span>
          </h2>

          {/* 3. Mobile Supporting Copy + Kannada Accent */}
          <div className="space-y-2.5">
            <div className="inline-block px-3 py-1 bg-cream-dark/80 border border-jaggery/15 rounded-sm font-kannada text-sm font-bold text-jaggery">
              ಹಾಸನದಿಂದ ನಿಮ್ಮ ಮನೆಗೆ.
            </div>

            <p className="font-sans text-sm text-jaggery-muted leading-relaxed">
              Your favourite Karnataka flavours, a little closer to home. Check if
              THINDI can reach your address.
            </p>
          </div>

          {/* 4. Packaging Visual */}
          <div className="relative rounded-md overflow-hidden border border-jaggery/20 bg-cream shadow-md">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/delivery/delivery-box.jpg"
                alt="THINDI shipping packaging ready for delivery"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-jaggery/90 text-cream px-2.5 py-0.5 rounded text-[10px] uppercase font-sans font-bold tracking-wider">
                Hassan Kitchen Dispatch
              </div>
            </div>

            <div className="p-3 bg-cream border-t border-jaggery/15 flex items-center justify-between text-xs font-sans text-jaggery">
              <span className="font-semibold">Sealed Food-Grade Packaging</span>
              <span className="font-kannada text-leaf font-bold">ತಾಜಾತನ</span>
            </div>
          </div>

          {/* 5. Mobile Pincode Checker */}
          <PincodeChecker />
        </div>

        {/* ========================================================
            SUPPORTING DELIVERY POLICY CLARIFICATION (Bottom Strip)
            Transparent business communication, no false promises
            ======================================================== */}
        <div className="pt-10 sm:pt-14 border-t border-jaggery/15 mt-10 sm:mt-16">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-jaggery-muted text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-leaf shrink-0" />
              <span>
                <strong>Location-Dependent:</strong> Initial rollout focuses statewide across Karnataka districts.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-turmeric shrink-0" />
              <span>
                <strong>Product-Specific Rules:</strong> Fragile crisps and pickles include cushioned packaging.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-chilli shrink-0" />
              <span>
                <strong>Checkout Revalidation:</strong> Final courier schedules confirmed at order placement.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
