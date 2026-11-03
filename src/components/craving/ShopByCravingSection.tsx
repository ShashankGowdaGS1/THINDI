'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';
import { CRAVING_CATEGORIES, CravingCategory } from '@/data/categories';
import { CategoryPreviewModal } from './CategoryPreviewModal';

export const ShopByCravingSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CravingCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = (category: CravingCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const kuruk = CRAVING_CATEGORIES[0];
  const sihi = CRAVING_CATEGORIES[1];
  const uppinakai = CRAVING_CATEGORIES[2];
  const appala = CRAVING_CATEGORIES[3];

  return (
    <>
      <section
        id="shop-by-craving"
        className="relative bg-cream pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 border-b border-jaggery/10 overflow-hidden"
        aria-label="Shop by Craving"
      >
        {/* Subtle background ambient warmth */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-turmeric/10 blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========================================================
              SECTION HEADER
              Eyebrow, Kannada accent, large headline, supporting copy
              ======================================================== */}
          <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-6 h-[1.5px] bg-chilli" />
              <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.24em] uppercase text-jaggery-muted">
                THE GOOD STUFF
              </span>
              <span className="text-xs font-kannada font-medium text-chilli">
                · ನಮ್ಮ ತಿಂಡಿ ವಿಭಾಗಗಳು
              </span>
            </div>

            {/* Primary Headline with Kannada Accent */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-5">
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-jaggery tracking-[-0.03em] leading-[1.05]">
                Yen Thindi Beku?
              </h2>
              <span className="font-kannada text-2xl sm:text-3xl lg:text-4xl font-bold text-chilli tracking-wide">
                ಏನ್ ತಿಂಡಿ ಬೇಕು?
              </span>
            </div>

            {/* Supporting Copy */}
            <p className="font-sans text-base sm:text-lg lg:text-xl text-jaggery-muted leading-relaxed max-w-2xl text-pretty">
              Crunchy cravings, sweet memories, and everything in between. Pick your kind
              of Thindi.
            </p>
          </div>

          {/* ========================================================
              DESKTOP ASYMMETRIC EDITORIAL GRID (Hidden on mobile/tablet < 1024px)
              - 01 Kuruk Thindi: Large expansive feature on the left (7 cols)
              - 02 Sihi Thindi: Wide medium block upper right (5 cols)
              - 03 & 04 Uppinakai / Appala & Sandige: Paired blocks lower right
              ======================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 items-stretch mb-16">
            {/* Left Column: 01 Kuruk Thindi (Large Hero Feature) */}
            <div className="lg:col-span-7 flex flex-col">
              <button
                type="button"
                onClick={() => handleCategoryClick(kuruk)}
                className="group relative flex-1 min-h-[640px] w-full rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli hover:border-jaggery/40 cursor-pointer shadow-[0_12px_32px_-8px_rgba(45,36,30,0.12)]"
                aria-label={`View ${kuruk.title} (${kuruk.kannadaTitle}) collection`}
              >
                {/* Background Food Photography */}
                <div className="absolute inset-0">
                  <Image
                    src={kuruk.imageSrc}
                    alt={kuruk.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1280px) 58vw, 700px"
                    className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Controlled editorial scrim for 100% readable typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
                  <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-jaggery/25 to-transparent" />
                </div>

                {/* Top Bar inside card */}
                <div className="relative z-10 p-5 xl:p-6 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-cream/20">
                    {kuruk.number}
                  </span>
                  <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-cream/15">
                    {kuruk.kannadaBadge}
                  </span>
                </div>

                {/* Bottom Content inside card */}
                <div className="relative z-10 mt-auto p-6 sm:p-8 xl:p-10 text-cream">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-display font-black text-3xl xl:text-4xl tracking-tight text-cream transition-transform duration-300 group-hover:translate-x-1">
                      {kuruk.title}
                    </h3>
                    <span className="font-kannada text-2xl xl:text-3xl font-bold text-turmeric">
                      {kuruk.kannadaTitle}
                    </span>
                  </div>

                  <p className="font-sans text-base text-cream/85 font-medium mb-4">
                    {kuruk.description}
                  </p>

                  {/* Food varieties tag list */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {kuruk.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-sans font-medium text-cream/95 bg-cream/15 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-cream/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Link action affordance */}
                  <div className="flex items-center gap-2 text-sm font-sans font-semibold text-cream group-hover:text-turmeric transition-colors">
                    <span>Explore Kuruk Thindi</span>
                    <div className="w-7 h-7 rounded-full bg-cream/15 group-hover:bg-turmeric group-hover:text-jaggery flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Column: 02 Sihi Thindi (Top) + 03 & 04 (Bottom row) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6 xl:gap-8">
              {/* 02 Sihi Thindi (Upper Right Medium Composition) */}
              <button
                type="button"
                onClick={() => handleCategoryClick(sihi)}
                className="group relative min-h-[300px] xl:min-h-[310px] w-full rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli hover:border-jaggery/40 cursor-pointer shadow-[0_8px_24px_-6px_rgba(45,36,30,0.10)]"
                aria-label={`View ${sihi.title} (${sihi.kannadaTitle}) collection`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={sihi.imageSrc}
                    alt={sihi.imageAlt}
                    fill
                    sizes="(max-width: 1280px) 42vw, 500px"
                    className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
                </div>

                {/* Top Bar */}
                <div className="relative z-10 p-5 xl:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-cream/20">
                      {sihi.number}
                    </span>
                    <span className="text-[11px] uppercase font-sans tracking-[0.18em] font-semibold text-cream/90 bg-jaggery/60 backdrop-blur-sm px-2.5 py-0.5 rounded-sm border border-cream/15">
                      {sihi.badge}
                    </span>
                  </div>

                  <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 backdrop-blur-sm px-2.5 py-0.5 rounded-sm border border-cream/15">
                    {sihi.kannadaBadge}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 mt-auto p-5 xl:p-6 text-cream">
                  <div className="flex items-baseline gap-2.5 mb-1.5">
                    <h3 className="font-display font-black text-2xl xl:text-3xl tracking-tight text-cream transition-transform duration-300 group-hover:translate-x-1">
                      {sihi.title}
                    </h3>
                    <span className="font-kannada text-xl xl:text-2xl font-bold text-turmeric">
                      {sihi.kannadaTitle}
                    </span>
                  </div>

                  <p className="font-sans text-xs xl:text-sm text-cream/85 font-medium mb-3">
                    {sihi.description} · Obbattu & Kajjaya
                  </p>

                  <div className="flex items-center gap-2 text-xs font-sans font-semibold text-cream group-hover:text-turmeric transition-colors">
                    <span>Explore Sweets</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Lower Right Sub-Grid: 03 Uppinakai & 04 Appala & Sandige */}
              <div className="grid grid-cols-2 gap-4 xl:gap-6">
                {/* 03 Uppinakai */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick(uppinakai)}
                  className="group relative min-h-[300px] xl:min-h-[310px] w-full rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli hover:border-jaggery/40 cursor-pointer shadow-[0_8px_24px_-6px_rgba(45,36,30,0.10)]"
                  aria-label={`View ${uppinakai.title} (${uppinakai.kannadaTitle}) collection`}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={uppinakai.imageSrc}
                      alt={uppinakai.imageAlt}
                      fill
                      sizes="(max-width: 1280px) 21vw, 250px"
                      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
                  </div>

                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-cream/20">
                      {uppinakai.number}
                    </span>
                    <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-cream/15">
                      ಉಪ್ಪಿನಕಾಯಿ
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto p-4 text-cream">
                    <h3 className="font-display font-black text-xl xl:text-2xl tracking-tight text-cream mb-0.5 group-hover:translate-x-0.5 transition-transform">
                      {uppinakai.title}
                    </h3>
                    <p className="font-sans text-xs text-cream/80 mb-3 line-clamp-1">
                      {uppinakai.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-cream group-hover:text-turmeric transition-colors">
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* 04 Appala & Sandige */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick(appala)}
                  className="group relative min-h-[300px] xl:min-h-[310px] w-full rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli hover:border-jaggery/40 cursor-pointer shadow-[0_8px_24px_-6px_rgba(45,36,30,0.10)]"
                  aria-label={`View ${appala.title} (${appala.kannadaTitle}) collection`}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={appala.imageSrc}
                      alt={appala.imageAlt}
                      fill
                      sizes="(max-width: 1280px) 21vw, 250px"
                      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
                  </div>

                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-cream/20">
                      {appala.number}
                    </span>
                    <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-cream/15">
                      ಅಪ್ಪಳ · ಸಂಡಿಗೆ
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto p-4 text-cream">
                    <h3 className="font-display font-black text-xl xl:text-2xl tracking-tight text-cream mb-0.5 group-hover:translate-x-0.5 transition-transform">
                      {appala.title}
                    </h3>
                    <p className="font-sans text-xs text-cream/80 mb-3 line-clamp-1">
                      {appala.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-cream group-hover:text-turmeric transition-colors">
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              MOBILE & TABLET EDITORIAL ARRANGEMENT (< 1024px)
              Specific mobile flow:
              1. Hero category feature (Kuruk Thindi)
              2. Sweets feature (Sihi Thindi)
              3. Pickles & Fryums (Uppinakai & Appala/Sandige)
              No hover required; clear tap targets; comfortable spacing.
              ======================================================== */}
          <div className="lg:hidden flex flex-col space-y-6 mb-12">
            {/* 01 Kuruk Thindi - Mobile Prominent Feature */}
            <button
              type="button"
              onClick={() => handleCategoryClick(kuruk)}
              className="group relative w-full min-h-[380px] sm:min-h-[440px] rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli cursor-pointer shadow-md"
              aria-label={`View ${kuruk.title} (${kuruk.kannadaTitle})`}
            >
              <div className="absolute inset-0">
                <Image
                  src={kuruk.imageSrc}
                  alt={kuruk.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
              </div>

              <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 px-2 py-0.5 rounded-sm">
                    {kuruk.number}
                  </span>
                  <span className="text-[11px] uppercase font-sans tracking-widest font-semibold text-cream/90 bg-jaggery/60 px-2 py-0.5 rounded-sm">
                    {kuruk.badge}
                  </span>
                </div>
                <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 px-2 py-0.5 rounded-sm">
                  {kuruk.kannadaBadge}
                </span>
              </div>

              <div className="relative z-10 mt-auto p-5 sm:p-6 text-cream">
                <div className="flex items-baseline gap-2.5 mb-1.5">
                  <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-cream">
                    {kuruk.title}
                  </h3>
                  <span className="font-kannada text-xl sm:text-2xl font-bold text-turmeric">
                    {kuruk.kannadaTitle}
                  </span>
                </div>

                <p className="font-sans text-sm text-cream/85 mb-3">
                  {kuruk.description} · Chakkali, Kodubale & Nippattu
                </p>

                <div className="flex items-center gap-2 text-xs font-sans font-semibold text-turmeric">
                  <span>Explore Kuruk Thindi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>

            {/* 02 Sihi Thindi - Mobile Feature */}
            <button
              type="button"
              onClick={() => handleCategoryClick(sihi)}
              className="group relative w-full min-h-[280px] sm:min-h-[320px] rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli cursor-pointer shadow-md"
              aria-label={`View ${sihi.title} (${sihi.kannadaTitle})`}
            >
              <div className="absolute inset-0">
                <Image
                  src={sihi.imageSrc}
                  alt={sihi.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
              </div>

              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 px-2 py-0.5 rounded-sm">
                    {sihi.number}
                  </span>
                  <span className="text-[11px] uppercase font-sans tracking-widest font-semibold text-cream/90 bg-jaggery/60 px-2 py-0.5 rounded-sm">
                    {sihi.badge}
                  </span>
                </div>
                <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 px-2 py-0.5 rounded-sm">
                  {sihi.kannadaBadge}
                </span>
              </div>

              <div className="relative z-10 mt-auto p-4 sm:p-5 text-cream">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight text-cream">
                    {sihi.title}
                  </h3>
                  <span className="font-kannada text-lg sm:text-xl font-bold text-turmeric">
                    {sihi.kannadaTitle}
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-cream/85 mb-2.5">
                  {sihi.description} · Obbattu & Kajjaya
                </p>
                <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-turmeric">
                  <span>Explore Sweets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>

            {/* 03 & 04 Mobile Paired Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 03 Uppinakai */}
              <button
                type="button"
                onClick={() => handleCategoryClick(uppinakai)}
                className="group relative min-h-[240px] rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli cursor-pointer shadow-sm"
                aria-label={`View ${uppinakai.title} (${uppinakai.kannadaTitle})`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={uppinakai.imageSrc}
                    alt={uppinakai.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
                </div>

                <div className="relative z-10 p-3.5 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 px-2 py-0.5 rounded-sm">
                    {uppinakai.number}
                  </span>
                  <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 px-2 py-0.5 rounded-sm">
                    ಉಪ್ಪಿನಕಾಯಿ
                  </span>
                </div>

                <div className="relative z-10 mt-auto p-4 text-cream">
                  <h3 className="font-display font-black text-lg sm:text-xl tracking-tight text-cream mb-0.5">
                    {uppinakai.title}
                  </h3>
                  <p className="font-sans text-xs text-cream/80 mb-2">
                    {uppinakai.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-sans font-semibold text-turmeric">
                    <span>Explore Pickles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* 04 Appala & Sandige */}
              <button
                type="button"
                onClick={() => handleCategoryClick(appala)}
                className="group relative min-h-[240px] rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli cursor-pointer shadow-sm"
                aria-label={`View ${appala.title} (${appala.kannadaTitle})`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={appala.imageSrc}
                    alt={appala.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jaggery/85 via-jaggery/25 to-transparent" />
                </div>

                <div className="relative z-10 p-3.5 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cream bg-jaggery/80 px-2 py-0.5 rounded-sm">
                    {appala.number}
                  </span>
                  <span className="font-kannada text-xs font-semibold text-turmeric bg-jaggery/70 px-2 py-0.5 rounded-sm">
                    ಅಪ್ಪಳ · ಸಂಡಿಗೆ
                  </span>
                </div>

                <div className="relative z-10 mt-auto p-4 text-cream">
                  <h3 className="font-display font-black text-lg sm:text-xl tracking-tight text-cream mb-0.5">
                    {appala.title}
                  </h3>
                  <p className="font-sans text-xs text-cream/80 mb-2">
                    {appala.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-sans font-semibold text-turmeric">
                    <span>Explore Fryums</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Preview Modal */}
      <CategoryPreviewModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
      />
    </>
  );
};

