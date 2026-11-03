'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const ClosingCTASection: React.FC = () => {
  return (
    <section
      id="closing-cta"
      aria-label="Closing Campaign — There's Always Room For THINDI"
      className="relative bg-leaf text-cream py-20 sm:py-24 lg:py-28 overflow-hidden"
    >
      {/* Subtle ambient motif in background */}
      <div
        className="absolute -bottom-24 -left-24 opacity-[0.04] pointer-events-none select-none"
        aria-hidden="true"
      >
        <ChakkaliMotif size={480} color="#F7F0E3" />
      </div>

      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-turmeric/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* ========================================================
              LEFT COLUMN: Editorial Typography & Primary CTA (~50%)
              ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left order-2 lg:order-1">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-8 h-[2px] bg-turmeric shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-widest text-turmeric font-sans">
                There&apos;s Always Room For THINDI
              </span>
            </div>

            {/* Primary Headline */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream tracking-tight leading-[1.05] mb-3">
              One more bite?
            </h2>

            {/* Kannada Accent */}
            <p className="font-kannada text-2xl sm:text-3xl font-semibold text-turmeric/95 mb-4">
              ತಿಂಡಿ ಬೇಕಾ?
            </p>

            {/* Supporting Copy */}
            <p className="font-sans text-base sm:text-lg text-cream/80 leading-relaxed max-w-lg mb-8">
              Your next snack-time favourite might be just a click away. Handcrafted with traditional Hassan patience, pure cold-pressed oils, and zero compromises.
            </p>

            {/* Primary CTA & Hassan Heritage Cue */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                href="/shop"
                variant="primary"
                size="lg"
                className="bg-turmeric text-jaggery hover:bg-turmeric/90 shadow-[0_4px_16px_rgba(232,181,75,0.25)] hover:shadow-[0_6px_22px_rgba(232,181,75,0.35)] justify-center font-bold"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Explore All THINDI
              </Button>

              <span className="text-xs font-sans text-cream/60 text-center sm:text-left self-center">
                Dispatches directly from our Hassan kitchen
              </span>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Authentic Assortment Photography (~50%)
              ======================================================== */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative framing */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden border border-cream/20 shadow-2xl bg-jaggery/40">
                <Image
                  src="/images/closing/closing-platter.jpg"
                  alt="Assortment of golden-brown Hassan chakkali, kodubale, and crunchy nippattu snacks on a traditional serving platter"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-center transform transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay at base for contrast */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-jaggery/60 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Regional badge pill */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-5 sm:left-5 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-jaggery/85 backdrop-blur-md border border-cream/15 text-cream text-xs">
                  <span className="w-2 h-2 rounded-full bg-turmeric animate-pulse" />
                  <span className="font-serif font-medium">Hassan Savouries Platter</span>
                  <span className="text-cream/40">·</span>
                  <span className="font-kannada text-turmeric/90">ಹಾಸನದ ತಿಂಡಿಗಳು</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

