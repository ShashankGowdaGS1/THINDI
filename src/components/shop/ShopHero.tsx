'use client';

import React from 'react';
import Image from 'next/image';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const ShopHero: React.FC = () => {
  return (
    <section
      aria-label="Shop Introduction"
      className="relative bg-cream pt-6 pb-8 sm:pt-8 sm:pb-10 border-b border-jaggery/10 overflow-hidden"
    >
      {/* Background motif accent */}
      <div
        className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 opacity-[0.035] pointer-events-none select-none"
        aria-hidden="true"
      >
        <ChakkaliMotif size={380} color="#2D241E" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* ========================================================
              LEFT COLUMN: Editorial Heading & Kannada Accent (7 cols)
              ======================================================== */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-chilli" />
              <span className="text-xs font-semibold uppercase tracking-widest text-chilli font-sans">
                Explore The Good Stuff
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-jaggery tracking-tight leading-[1.08] mb-1.5">
              All the Thindi{' '}
              <span className="text-chilli">you love.</span>
            </h1>

            {/* Kannada Accent */}
            <p className="font-kannada text-base sm:text-lg font-medium text-jaggery/65 mb-3">
              ನಿಮ್ಮ ಮೆಚ್ಚಿನ ತಿಂಡಿ
            </p>

            {/* Supporting Copy */}
            <p className="font-sans text-sm sm:text-base text-jaggery/75 max-w-xl leading-relaxed">
              From crunchy favourites to traditional sweets and pickles, find a little something for every craving. Traditional recipes prepared with care in Hassan, Karnataka.
            </p>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Compact Editorial Food Image (5 cols)
              ======================================================== */}
          <div className="lg:col-span-5 hidden sm:block">
            <div className="relative aspect-[16/10] lg:aspect-[4/3] max-h-[220px] rounded-xl overflow-hidden border border-jaggery/15 shadow-sm bg-warm-white">
              <Image
                src="/images/categories/kuruk-thindi.jpg"
                alt="Golden crispy Karnataka traditional snacks arranged on brass platter"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-jaggery/40 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-cream/90 backdrop-blur-sm border border-jaggery/10 text-[11px] font-sans text-jaggery">
                Regional Favourites · ಸಾಂಪ್ರದಾಯಿಕ ತಿಂಡಿಗಳು
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

