'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, MapPin, Heart } from 'lucide-react';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const BrandStorySection: React.FC = () => {
  return (
    <section
      id="our-story"
      className="relative bg-cream overflow-hidden border-b border-jaggery/10"
      aria-label="From Hassan, With Love — Brand Story"
    >
      {/* ========================================================
          MOMENT 01 — THE ORIGIN
          Background: Warm Cream (#F7F0E3)
          Oversized headline on the left, cinematic photography on right
          ======================================================== */}
      <div className="pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-36 lg:pb-36 border-b border-jaggery/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
            {/* Left: Oversized Editorial Headline & Narrative (6 cols) */}
            <div className="lg:col-span-6 z-10">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-8 h-[2px] bg-chilli shrink-0" />
                <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-jaggery-muted">
                  ROOTED IN HASSAN, KARNATAKA
                </span>
                <span className="text-xs font-kannada font-semibold text-chilli">
                  · ನಮ್ಮ ಹೆಮ್ಮೆ
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-[84px] leading-[0.98] tracking-[-0.035em] text-jaggery mb-6">
                <span>Every bite</span>
                <br />
                <span className="text-chilli">has a story.</span>
              </h2>

              {/* Kannada Accent */}
              <div className="inline-block px-3.5 py-1.5 bg-cream-dark/80 border border-jaggery/15 rounded-sm font-kannada text-lg font-bold text-jaggery mb-6">
                ಹಾಸನದಿಂದ, ಪ್ರೀತಿಯಿಂದ.
              </div>

              {/* Supporting Copy */}
              <p className="font-sans text-lg sm:text-xl text-jaggery-muted leading-relaxed max-w-xl mb-8 text-pretty">
                Some flavours remind you of a place. Others remind you of home. THINDI
                brings together the traditional tastes of Karnataka and the simple joy
                of sharing good food.
              </p>

              {/* Quiet Geographic Heritage Note */}
              <div className="flex items-center gap-3 text-xs font-sans text-jaggery-subtle">
                <div className="w-5 h-5 rounded-full bg-turmeric/20 flex items-center justify-center text-leaf font-bold shrink-0">
                  <MapPin className="w-3 h-3 text-leaf" />
                </div>
                <span>Hassan · The gateway to Malnad food traditions</span>
              </div>
            </div>

            {/* Right: Cinematic Heritage Food/Kitchen Photography + Inset Detail (6 cols) */}
            <div className="lg:col-span-6 relative">
              {/* Main Cinematic Image */}
              <div className="relative aspect-[4/3] rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark shadow-[0_20px_50px_-12px_rgba(45,36,30,0.14)]">
                <Image
                  src="/images/story/story-heritage.jpg"
                  alt="Traditional Karnataka savouries in a warm home-kitchen setting with brass vessels and morning sunlight"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transform transition-transform duration-700 hover:scale-[1.02]"
                />
                {/* Subtle caption */}
                <div className="absolute bottom-0 inset-x-0 bg-cream-light/95 border-t border-jaggery/10 px-4 py-2.5 flex items-center justify-between text-xs font-sans text-jaggery">
                  <span className="font-medium text-jaggery-muted">
                    Traditional morning tea-time setting
                  </span>
                  <span className="font-kannada text-chilli font-semibold">
                    ಮನೆಯ ವಾತಾವರಣ
                  </span>
                </div>
              </div>

              {/* Inset Photographic Detail (Layered Overlap on Desktop) */}
              <div className="hidden sm:block absolute -bottom-10 -left-10 w-48 xl:w-56 aspect-square rounded-md overflow-hidden border-2 border-cream bg-cream-dark shadow-[0_16px_36px_-6px_rgba(45,36,30,0.18)] z-20">
                <Image
                  src="/images/story/story-texture.jpg"
                  alt="Macro crispy texture of traditional chakkali ridges and roasted spices"
                  fill
                  sizes="230px"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-cream/90 backdrop-blur-sm p-1 rounded-full border border-jaggery/15">
                  <ChakkaliMotif size={20} color="#2D241E" accentColor="#A43D2E" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOMENT 02 — THE CRAFT
          Intimate visual composition of snack preparation
          ======================================================== */}
      <div className="bg-cream-light py-20 sm:py-28 lg:py-36 border-b border-jaggery/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Moment 2 Header */}
          <div className="max-w-2xl mb-12 sm:mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[1.5px] bg-chilli" />
              <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-jaggery-muted">
                THE CRAFT OF KARNATAKA SNACKS
              </span>
              <span className="font-kannada text-xs font-semibold text-chilli">
                · ಕೈರುಚಿಯ ಪರಂಪರೆ
              </span>
            </div>

            <h3 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-jaggery tracking-tight mb-4">
              Good food takes a little care.
            </h3>

            <p className="font-sans text-base sm:text-lg text-jaggery-muted leading-relaxed">
              From the spiral of a chakkali to the familiar spice of uppinakai, the
              foods we love are full of little details worth celebrating.
            </p>
          </div>

          {/* Intimate Composition: Large Handcraft Photo + Macro + Annotation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
            {/* Large Handcraft Photo: Hands shaping chakkali with traditional brass press (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark shadow-[0_16px_40px_-10px_rgba(45,36,30,0.12)]">
                <Image
                  src="/images/story/story-handcraft.jpg"
                  alt="Close-up of artisan hands extruding chakkali dough using traditional brass chakli mould"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transform transition-transform duration-700 hover:scale-[1.02]"
                />
                <div className="absolute top-4 left-4 bg-cream/95 backdrop-blur-sm px-3 py-1 rounded text-[10px] uppercase font-sans font-bold tracking-wider text-jaggery border border-jaggery/15">
                  Hand-Pressed Craft · ಕೈಯಿಂದ ಒತ್ತುವ ಕಲೆ
                </div>
              </div>
            </div>

            {/* Right: Editorial Annotation & Close-Up Detail (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              {/* Editorial Recipe & Craft Notes Card */}
              <div className="bg-cream rounded-md border border-jaggery/15 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-jaggery/10">
                  <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-chilli">
                    CRAFT NOTES · ತಯಾರಿಕೆಯ ಗುಟ್ಟು
                  </span>
                  <ChakkaliMotif size={22} color="#5C4E43" accentColor="#A43D2E" />
                </div>

                <div className="space-y-4 font-sans text-xs sm:text-sm text-jaggery leading-relaxed">
                  <div className="flex gap-3">
                    <span className="font-mono font-bold text-chilli shrink-0">01.</span>
                    <div>
                      <strong className="font-semibold block text-jaggery">
                        The Flour & Spices:
                      </strong>
                      <span className="text-jaggery-muted">
                        Roasted heirloom rice and hurigadale blended with cumin, toasted
                        sesame, and a touch of ajwain.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-mono font-bold text-chilli shrink-0">02.</span>
                    <div>
                      <strong className="font-semibold block text-jaggery">
                        The Star Mould:
                      </strong>
                      <span className="text-jaggery-muted">
                        A slow, deliberate circular turn extruding uniform concentric
                        star-ridges that crisp evenly.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-mono font-bold text-chilli shrink-0">03.</span>
                    <div>
                      <strong className="font-semibold block text-jaggery">
                        Gentle Heat:
                      </strong>
                      <span className="text-jaggery-muted">
                        Simmered in pure cold-pressed oil until golden, achieving a tender
                        crunch that never feels heavy.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-jaggery/10 flex items-center justify-between text-xs text-jaggery-muted">
                  <span className="font-kannada font-semibold text-leaf">
                    ತಾಳ್ಮೆಯಿಂದ ಮಾಡಿದ ಕೈರುಚಿ
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-wider">
                    Hassan Kitchen Traditions
                  </span>
                </div>
              </div>

              {/* Smaller Macro Texture Detail on Mobile & Desktop */}
              <div className="flex items-center gap-4 p-4 bg-cream rounded border border-jaggery/15">
                <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden border border-jaggery/10 bg-cream-dark">
                  <Image
                    src="/images/story/story-texture.jpg"
                    alt="Close up texture of chakkali and kodubale"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-sans tracking-widest font-bold text-jaggery-muted mb-0.5">
                    Authentic Texture
                  </div>
                  <div className="font-display font-bold text-sm text-jaggery mb-1">
                    Light, crisp & airy
                  </div>
                  <span className="font-kannada text-xs text-chilli font-medium">
                    ಗರಿಗರಿ ಸವಿ ನೆನಪು
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOMENT 03 — THE CONNECTION
          Background: Deep Jaggery (#2D241E)
          Visually powerful closing statement
          ======================================================== */}
      <div className="bg-jaggery text-cream py-20 sm:py-28 lg:py-36 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-turmeric/5 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Small decorative motif */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-12 sm:w-16 h-[1px] bg-cream/20" />
            <ChakkaliMotif size={36} color="#FAF6ED" accentColor="#E8B54B" />
            <span className="w-12 sm:w-16 h-[1px] bg-cream/20" />
          </div>

          {/* Large Headline */}
          <h3 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.04] tracking-[-0.03em] text-cream mb-6">
            <span>From Hassan.</span>
            <br />
            <span className="text-turmeric">For every thindi lover</span>
            <span className="text-chilli">.</span>
          </h3>

          {/* Supporting Copy */}
          <p className="font-sans text-lg sm:text-xl text-cream/85 font-medium max-w-xl mx-auto leading-relaxed mb-6">
            A little taste of Karnataka, made to be shared.
          </p>

          {/* Kannada Closing Line */}
          <div className="inline-block px-4 py-2 bg-cream/10 border border-cream/15 rounded font-kannada text-lg sm:text-xl font-bold text-turmeric tracking-wide mb-10">
            ನಮ್ಮ ಊರಿನ ರುಚಿ. ನಮ್ಮೆಲ್ಲರ ತಿಂಡಿ.
          </div>

          {/* Discover Our Story Link (links to /our-story) */}
          <div className="flex justify-center">
            <Link
              href="/our-story"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-cream/90 hover:text-turmeric underline underline-offset-8 decoration-cream/30 hover:decoration-turmeric transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-turmeric rounded"
            >
              <span>Read Our Full Story</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

