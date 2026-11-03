'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { Button } from '../brand/Button';

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;
    }

    const ctx = gsap.context(() => {
      // Gentle, restrained entrance sequence
      gsap.from('.anim-eyebrow', {
        opacity: 0,
        y: 8,
        duration: 0.45,
        ease: 'power2.out',
        delay: 0.05,
      });

      gsap.from('.anim-title-line', {
        opacity: 0,
        y: 16,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.12,
      });

      gsap.from('.anim-kannada-detail', {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.28,
      });

      gsap.from('.anim-hero-photo', {
        opacity: 0,
        y: 16,
        duration: 0.75,
        ease: 'power2.out',
        delay: 0.2,
      });

      gsap.from('.anim-desc', {
        opacity: 0,
        y: 12,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.36,
      });

      gsap.from('.anim-cta-group', {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.44,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative bg-cream overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20 border-b border-jaggery/10"
      aria-label="THINDI Homepage Hero — The Great Karnataka Crunch"
    >
      {/* Subtle background ambient warmth */}
      <div
        className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-turmeric/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            DESKTOP HERO COMPOSITION (Screen widths >= 1024px)
            Asymmetrical campaign layout: Left ~43%, Right ~57%
            Food photography is the dominant, immersive hero.
            ======================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 items-center">
          {/* Left Portion: Editorial Typography & Brand Narrative (5 columns ~ 42-45%) */}
          <div className="lg:col-span-5 z-10 pr-2 xl:pr-4 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="anim-eyebrow flex items-center gap-2.5 mb-4 xl:mb-5">
              <span className="w-6 h-[2px] bg-chilli shrink-0" />
              <span className="font-sans text-xs xl:text-sm font-bold tracking-[0.24em] uppercase text-jaggery-muted">
                FROM HASSAN, WITH LOVE
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-4xl xl:text-5xl 2xl:text-[64px] leading-[1.04] tracking-[-0.035em] text-jaggery mb-4 xl:mb-5">
              <span className="anim-title-line block">A little crunch.</span>
              <span className="anim-title-line block text-chilli">
                A lot of Karnataka.
              </span>
            </h1>

            {/* One small, purposeful Kannada accent */}
            <div className="anim-kannada-detail mb-5">
              <span className="inline-block px-3 py-1 bg-cream-dark/80 border border-jaggery/15 rounded-sm font-kannada text-sm xl:text-base font-semibold text-jaggery tracking-wide shadow-2xs">
                ಮನೆಯ ರುಚಿ. ನಮ್ಮ ತಿಂಡಿ.
              </span>
            </div>

            {/* Supporting Copy */}
            <p className="anim-desc font-sans text-base xl:text-lg text-jaggery-muted leading-relaxed max-w-lg mb-7 text-pretty">
              Chakkali, kodubale, nippattu and more. The flavours we grew up
              loving, brought together under one roof.
            </p>

            {/* Call-to-Action Group */}
            <div className="anim-cta-group flex items-center gap-5">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                href="/shop"
                className="shadow-[0_4px_20px_rgba(164,61,46,0.22)]"
              >
                Explore Thindi
              </Button>

              <Link
                href="/our-story"
                className="font-sans text-base font-medium text-jaggery hover:text-chilli underline underline-offset-8 decoration-jaggery/30 hover:decoration-chilli transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Right Portion: Immersive Editorial Food Campaign Photography (7 columns ~ 55-58%) */}
          <div className="lg:col-span-7 relative">
            <div className="anim-hero-photo relative w-full">
              {/* Large, food-dominant campaign visual */}
              <div className="relative aspect-[16/11] xl:aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(45,36,30,0.18)] bg-cream-dark">
                <Image
                  src="/images/hero-desktop.jpg"
                  alt="The Great Karnataka Crunch — authentic golden crispy spiral chakkali in a terracotta bowl with ring kodubale and spiced nippattu crackers on fresh banana leaf in warm natural morning light"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center transform transition-transform duration-700 ease-out hover:scale-[1.015]"
                />

                {/* Subtle natural warmth vignette */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-jaggery/10 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MOBILE HERO COMPOSITION (Screen widths < 1024px)
            1. Compact Eyebrow
            2. Large Main Headline
            3. Purposeful Kannada Accent
            4. Prominent Close-up Food Photograph (No distracting captions)
            5. Brief Supporting Copy
            6. Primary Shopping CTA + Secondary Story Link
            ======================================================== */}
        <div className="lg:hidden flex flex-col space-y-4">
          {/* 1. Mobile Eyebrow */}
          <div className="anim-eyebrow flex items-center gap-2">
            <span className="w-5 h-[1.5px] bg-chilli shrink-0" />
            <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-jaggery-muted">
              FROM HASSAN, WITH LOVE
            </span>
          </div>

          {/* 2. Mobile Headline */}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-[1.08] tracking-[-0.03em] text-jaggery">
            <span className="block">A little crunch.</span>
            <span className="block text-chilli">A lot of Karnataka.</span>
          </h1>

          {/* 3. Mobile Purposeful Kannada Accent */}
          <div className="anim-kannada-detail">
            <span className="inline-block px-3 py-1 bg-cream-dark/80 border border-jaggery/15 rounded-sm font-kannada text-xs sm:text-sm font-semibold text-jaggery">
              ಮನೆಯ ರುಚಿ. ನಮ್ಮ ತಿಂಡಿ.
            </span>
          </div>

          {/* 4. Prominent Close-up Food Photograph */}
          <div className="anim-hero-photo relative pt-1 pb-2">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-xl overflow-hidden shadow-[0_16px_36px_-10px_rgba(45,36,30,0.18)] bg-cream-dark">
              <Image
                src="/images/hero-mobile.jpg"
                alt="Close-up of golden handmade chakkali, kodubale and nippattu crackers on terracotta platter with banana leaf in warm natural light"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* 5. Mobile Supporting Copy */}
          <p className="anim-desc font-sans text-sm sm:text-base text-jaggery-muted leading-relaxed text-pretty">
            Chakkali, kodubale, nippattu and more. The flavours we grew up
            loving, brought together under one roof.
          </p>

          {/* 6. Mobile Action Buttons */}
          <div className="anim-cta-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              href="/shop"
              className="w-full sm:w-auto justify-center min-h-[48px]"
            >
              Explore Thindi
            </Button>

            <Link
              href="/our-story"
              className="text-center font-sans text-sm font-medium text-jaggery py-2.5 hover:text-chilli underline underline-offset-4 decoration-jaggery/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded min-h-[44px] flex items-center justify-center"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
