'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Sparkles, Check, Info } from 'lucide-react';
import { BEHIND_EVERY_BITE_ITEMS, BehindEveryBiteItem } from '@/data/behindEveryBite';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const BehindEveryBite: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem: BehindEveryBiteItem = BEHIND_EVERY_BITE_ITEMS[activeIndex];

  return (
    <section
      id="behind-every-bite"
      className="relative bg-jaggery text-cream pt-20 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-b border-cream/10 overflow-hidden"
      aria-label="Behind Every Bite — Product Anatomy"
    >
      {/* Subtle warm ambient glow in dark canvas */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-turmeric/5 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            DESKTOP COMPOSITION (Screen widths >= 1024px)
            Left: 58% Large Food Photography Canvas
            Right: 42% Interactive Editorial Index & Information Panel
            ======================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start">
          {/* LEFT: Food Photography Canvas (7 cols ~ 58%) */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="relative rounded-md overflow-hidden border border-cream/15 bg-jaggery-dark shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)]">
              {/* Main Macro Photograph */}
              <div className="relative aspect-[4/3] xl:aspect-[16/11] w-full overflow-hidden">
                <Image
                  key={activeItem.id}
                  src={activeItem.imageSrc}
                  alt={activeItem.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1280px) 58vw, 720px"
                  className="object-cover transform transition-all duration-700 ease-out hover:scale-[1.03] animate-in fade-in duration-300"
                />

                {/* Macro Annotation Badge */}
                <div className="absolute top-4 left-4 bg-jaggery/90 backdrop-blur-md px-3 py-1.5 rounded-sm border border-cream/20 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-turmeric animate-pulse" />
                  <span className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-cream/90">
                    Macro Texture Detail · Hassan Kitchen Specimen
                  </span>
                </div>

                {/* Decorative Chakkali Seal */}
                <div className="absolute bottom-4 right-4 bg-jaggery/85 backdrop-blur-md p-2 rounded-full border border-cream/20 shadow-md">
                  <ChakkaliMotif size={28} color="#FAF6ED" accentColor="#E8B54B" />
                </div>
              </div>

              {/* Minimal Photographic Caption Strip */}
              <div className="p-4 bg-jaggery border-t border-cream/10 flex items-center justify-between text-xs font-sans text-cream/80">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-turmeric font-bold">
                    {activeItem.number}
                  </span>
                  <span className="font-semibold text-cream">
                    {activeItem.name}
                  </span>
                  <span className="font-kannada text-turmeric">
                    ({activeItem.kannadaName})
                  </span>
                </div>

                <span className="font-kannada text-xs text-cream/60">
                  {activeItem.verifiedDetails.kannadaTexture}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Editorial Index (5 cols ~ 42%) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Header Block */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-[1.5px] bg-turmeric shrink-0" />
                <span className="font-sans text-xs font-bold tracking-[0.24em] uppercase text-turmeric">
                  THE LITTLE DETAILS
                </span>
                <span className="text-xs font-kannada font-semibold text-cream/70">
                  · ಒಂದೊಂದು ತುತ್ತಿನಲ್ಲೂ ರುಚಿ
                </span>
              </div>

              <h2 className="font-display font-black text-4xl xl:text-5xl text-cream tracking-[-0.03em] leading-[1.05] mb-4">
                <span>It&apos;s all in</span>
                <br />
                <span className="text-turmeric">the crunch.</span>
              </h2>

              <p className="font-sans text-base text-cream/80 leading-relaxed text-pretty">
                The spiral of a chakkali. The golden edges of a kodubale. The familiar
                texture of nippattu. Little details that make traditional thindi special.
              </p>
            </div>

            {/* Editorial Numbered Table-of-Contents Index */}
            <div
              className="border-y border-cream/15 divide-y divide-cream/10 mb-8"
              role="tablist"
              aria-label="Behind Every Bite Product Index"
            >
              {BEHIND_EVERY_BITE_ITEMS.map((item, idx) => {
                const isSelected = idx === activeIndex;

                return (
                  <button
                    key={item.id}
                    role="tab"
                    id={`tab-${item.id}`}
                    aria-selected={isSelected}
                    aria-controls={`panel-${item.id}`}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full py-4 text-left transition-all duration-200 flex items-center justify-between group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-turmeric px-1.5 ${
                      isSelected ? 'text-cream' : 'text-cream/60 hover:text-cream/90'
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      {/* Monospace Index Number */}
                      <span
                        className={`font-mono text-sm tracking-wider font-bold transition-colors ${
                          isSelected ? 'text-turmeric' : 'text-cream/40 group-hover:text-cream/70'
                        }`}
                      >
                        {item.number}
                      </span>

                      {/* Product Name & Kannada Script */}
                      <span
                        className={`font-display text-xl xl:text-2xl tracking-tight transition-transform duration-200 ${
                          isSelected
                            ? 'font-black text-cream translate-x-1'
                            : 'font-medium group-hover:translate-x-0.5'
                        }`}
                      >
                        {item.name}
                      </span>

                      <span
                        className={`font-kannada text-base font-semibold transition-colors ${
                          isSelected ? 'text-turmeric' : 'text-cream/40'
                        }`}
                      >
                        {item.kannadaName}
                      </span>
                    </div>

                    {/* Active State Indicator (Not color alone: directional arrow + active pill) */}
                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-turmeric">
                          <span>Active</span>
                          <span className="w-4 h-[1.5px] bg-turmeric" />
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-cream/20 group-hover:text-cream/60 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* PRODUCT INFORMATION PANEL (Data-driven from activeItem) */}
            <div
              id={`panel-${activeItem.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeItem.id}`}
              className="space-y-6 animate-in fade-in duration-200"
            >
              {/* Editorial Description */}
              <div>
                <p className="font-display font-medium text-lg xl:text-xl text-cream/95 leading-snug italic">
                  &ldquo;{activeItem.editorialDescription}&rdquo;
                </p>
              </div>

              {/* Verified Product Facts Strip */}
              <div className="border-t border-cream/15 pt-5 space-y-4">
                {/* Texture Profile */}
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-turmeric block mb-1">
                    Texture Profile
                  </span>
                  <p className="font-sans text-xs xl:text-sm text-cream/80 leading-relaxed">
                    {activeItem.verifiedDetails.textureProfile}
                  </p>
                </div>

                {/* Key Ingredients */}
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-turmeric block mb-1.5">
                    Verified Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.verifiedDetails.keyIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-sans font-medium text-cream/90 bg-cream/10 px-2 py-0.5 rounded border border-cream/10"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pack Sizes & Storage */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-turmeric block mb-1">
                      Available Packs
                    </span>
                    <span className="font-sans text-xs text-cream/80 font-medium">
                      {activeItem.verifiedDetails.packSizes.join(' · ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-turmeric block mb-1">
                      Storage
                    </span>
                    <span className="font-sans text-xs text-cream/80 leading-tight block">
                      Airtight container after opening
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link: Explore this Thindi (smooth scroll to signature picks section) */}
              <div className="pt-4 border-t border-cream/10 flex items-center justify-between">
                <a
                  href="#signature-picks"
                  className="inline-flex items-center gap-2 font-sans text-sm font-bold text-turmeric hover:text-turmeric-light transition-colors group focus:outline-none focus-visible:ring-1 focus-visible:ring-turmeric rounded"
                >
                  <span>Explore {activeItem.name} in Picks</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>

                <span className="text-[11px] font-sans text-cream/40 uppercase tracking-widest">
                  Hassan, Karnataka
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MOBILE DELIBERATE ARRANGEMENT (< 1024px)
            Recommended Order:
            1. Eyebrow
            2. Headline
            3. Short supporting copy
            4. Large product photograph
            5. Horizontal/compact product selector
            6. Selected product description
            7. Verified product details
            8. Product link
            ======================================================== */}
        <div className="lg:hidden flex flex-col space-y-6">
          {/* 1. Mobile Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-turmeric" />
            <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-turmeric">
              THE LITTLE DETAILS
            </span>
            <span className="text-xs font-kannada font-semibold text-cream/70">
              · ಒಂದೊಂದು ತುತ್ತಿನಲ್ಲೂ ರುಚಿ
            </span>
          </div>

          {/* 2. Mobile Headline */}
          <h2 className="font-display font-black text-3xl sm:text-4xl text-cream tracking-tight leading-[1.08]">
            It&apos;s all in
            <br />
            <span className="text-turmeric">the crunch.</span>
          </h2>

          {/* 3. Short Supporting Copy */}
          <p className="font-sans text-sm text-cream/80 leading-relaxed">
            The spiral of a chakkali. The golden edges of a kodubale. The familiar
            texture of nippattu. Little details that make traditional thindi special.
          </p>

          {/* 4. Large Product Photograph */}
          <div className="relative rounded-md overflow-hidden border border-cream/15 bg-jaggery-dark shadow-md">
            <div className="relative aspect-[4/3] w-full">
              <Image
                key={activeItem.id}
                src={activeItem.imageSrc}
                alt={activeItem.imageAlt}
                fill
                sizes="100vw"
                className="object-cover animate-in fade-in duration-300"
              />
              <div className="absolute top-3 left-3 bg-jaggery/90 backdrop-blur-sm text-cream px-2.5 py-0.5 rounded text-[10px] uppercase font-sans font-bold tracking-wider border border-cream/20">
                Macro Detail · {activeItem.name}
              </div>
            </div>

            <div className="p-3 bg-jaggery border-t border-cream/10 flex items-center justify-between text-xs font-sans text-cream">
              <span className="font-bold">{activeItem.name} ({activeItem.kannadaName})</span>
              <span className="font-kannada text-turmeric text-[11px]">
                {activeItem.verifiedDetails.kannadaTexture}
              </span>
            </div>
          </div>

          {/* 5. Horizontal / Compact Product Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-sans tracking-widest font-bold text-turmeric">
              Select Snack to Inspect:
            </span>

            <div className="grid grid-cols-3 gap-2" role="tablist">
              {BEHIND_EVERY_BITE_ITEMS.map((item, idx) => {
                const isSelected = idx === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveIndex(idx)}
                    className={`p-2.5 rounded text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cream text-jaggery border-cream font-bold shadow-sm'
                        : 'bg-cream/10 text-cream/80 border-cream/15 hover:bg-cream/20'
                    }`}
                  >
                    <div className="font-mono text-[10px] leading-tight opacity-75">
                      {item.number}
                    </div>
                    <div className="font-display font-bold text-xs sm:text-sm truncate">
                      {item.name}
                    </div>
                    <div className="font-kannada text-[11px] opacity-80">
                      {item.kannadaName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Selected Product Description */}
          <div className="p-4 bg-cream/5 border border-cream/10 rounded">
            <p className="font-display font-medium text-base text-cream italic leading-snug">
              &ldquo;{activeItem.editorialDescription}&rdquo;
            </p>
          </div>

          {/* 7. Verified Product Details */}
          <div className="space-y-3.5 border-t border-cream/10 pt-4">
            <div>
              <span className="text-[10px] uppercase font-sans tracking-wider font-bold text-turmeric block mb-0.5">
                Texture
              </span>
              <p className="font-sans text-xs text-cream/80">
                {activeItem.verifiedDetails.textureProfile}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-sans tracking-wider font-bold text-turmeric block mb-1">
                Ingredients
              </span>
              <div className="flex flex-wrap gap-1">
                {activeItem.verifiedDetails.keyIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-sans font-medium text-cream/90 bg-cream/10 px-2 py-0.5 rounded border border-cream/10"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-cream/70 pt-1">
              <span>Packs: <strong>{activeItem.verifiedDetails.packSizes.join(' / ')}</strong></span>
              <span>Origin: <strong>{activeItem.verifiedDetails.origin}</strong></span>
            </div>
          </div>

          {/* 8. Mobile Product Link */}
          <div className="pt-2">
            <a
              href="#signature-picks"
              className="inline-flex items-center justify-between w-full p-3 rounded bg-turmeric text-jaggery font-sans text-xs font-bold hover:bg-turmeric-light transition-colors"
            >
              <span>Explore {activeItem.name} in Picks</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ========================================================
            CONNECTION TO NEXT SECTION
            Transition toward planned "Hassan to Your Doorstep" section
            ======================================================== */}
        <div className="pt-16 sm:pt-20 text-center border-t border-cream/10 mt-16 sm:mt-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-12 h-[1px] bg-cream/20" />
            <ChakkaliMotif size={20} color="#FAF6ED" accentColor="#E8B54B" />
            <span className="w-12 h-[1px] bg-cream/20" />
          </div>

          <p className="font-display font-medium text-lg sm:text-xl text-cream/90 tracking-tight mb-1">
            Coming next: Hassan to Your Doorstep
          </p>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-turmeric font-semibold">
            Statewide distribution & fresh batch schedules preparing
          </p>
        </div>
      </div>
    </section>
  );
};

