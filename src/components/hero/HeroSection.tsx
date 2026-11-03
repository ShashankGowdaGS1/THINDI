'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';
import { UpcomingNoticeModal } from '../brand/UpcomingNoticeModal';

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
        y: 12,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.1,
      });

      gsap.from('.anim-title-line', {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.anim-kannada-detail', {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.45,
      });

      gsap.from('.anim-desc', {
        opacity: 0,
        y: 16,
        duration: 0.75,
        ease: 'power2.out',
        delay: 0.55,
      });

      gsap.from('.anim-cta-group', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.65,
      });

      gsap.from('.anim-hero-photo', {
        opacity: 0,
        scale: 0.97,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.3,
      });

      gsap.from('.anim-chakkali-detail', {
        opacity: 0,
        rotation: -45,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.6,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        className="relative bg-cream overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-24 border-b border-jaggery/10"
        aria-label="THINDI Homepage Hero"
      >
        {/* Subtle background ambient warmth */}
        <div
          className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-turmeric/10 blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========================================================
              DESKTOP HERO COMPOSITION (Screen widths >= 1024px)
              Asymmetrical, editorial food campaign layout
              ======================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12 items-center">
            {/* Left Portion: Editorial Typography & Brand Narrative (7 columns) */}
            <div className="lg:col-span-7 xl:col-span-7 z-10 pr-4 xl:pr-6">
              {/* Eyebrow */}
              <div className="anim-eyebrow flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-chilli shrink-0" />
                <span className="font-sans text-xs xl:text-sm font-bold tracking-[0.22em] uppercase text-jaggery-muted">
                  FROM HASSAN, WITH LOVE
                </span>
                <span className="text-xs font-kannada font-medium text-chilli">
                  · ಹಾಸನದ ಕೈರುಚಿ
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-5xl xl:text-[76px] leading-[1.04] tracking-[-0.035em] text-jaggery mb-6">
                <span className="anim-title-line block">A little crunch.</span>
                <span className="anim-title-line block text-chilli">
                  A lot of Karnataka.
                </span>
              </h1>

              {/* Kannada Heritage Detail */}
              <div className="anim-kannada-detail flex items-center gap-3 mb-6">
                <span className="inline-block px-3 py-1 bg-cream-dark/80 border border-jaggery/15 rounded-sm font-kannada text-base font-semibold text-jaggery tracking-wide">
                  ಮನೆಯ ರುಚಿ. ನಮ್ಮ ತಿಂಡಿ.
                </span>
                <span className="text-xs font-sans text-jaggery-muted tracking-wide italic">
                  (The authentic taste of home)
                </span>
              </div>

              {/* Supporting Copy */}
              <p className="anim-desc font-sans text-lg xl:text-xl text-jaggery-muted leading-relaxed max-w-xl mb-8 text-pretty">
                Chakkali, kodubale, nippattu, obbattu and more. The flavours we grew up
                loving, brought together under one roof.
              </p>

              {/* Call-to-Action Group */}
              <div className="anim-cta-group flex flex-wrap items-center gap-6">
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

                {/* Restrained Chakkali geometric vector detail */}
                <div
                  className="anim-chakkali-detail ml-auto hidden xl:flex items-center gap-2 pl-4 border-l border-jaggery/15 text-jaggery/70"
                  title="Authentic hand-pressed spiral chakkali"
                >
                  <ChakkaliMotif size={44} color="#2D241E" accentColor="#A43D2E" />
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-jaggery-muted leading-tight">
                    Traditional<br />Artisan Craft
                  </span>
                </div>
              </div>
            </div>

            {/* Right Portion: Art-directed Editorial Photography (5 columns) */}
            <div className="lg:col-span-5 xl:col-span-5 relative">
              <div className="anim-hero-photo relative">
                {/* Main Food Photograph Container with refined studio framing */}
                <div className="relative rounded-lg overflow-hidden border border-jaggery/15 bg-cream-dark shadow-[0_24px_50px_-12px_rgba(45,36,30,0.18)]">
                  <Image
                    src="/images/hero-desktop.jpg"
                    alt="Authentic Karnataka traditional snacks — golden crispy spiral chakkali, ring kodubale, and nippattu arranged in brass and terracotta vessels on fresh banana leaf"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />

                  {/* Refined Photographic Caption Strip */}
                  <div className="bg-cream-light/95 border-t border-jaggery/10 px-4 py-3 flex items-center justify-between text-xs font-sans text-jaggery">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-chilli" />
                      <span className="font-semibold text-jaggery tracking-wide">
                        Chakkali · Kodubale · Nippattu
                      </span>
                    </div>
                    <span className="font-kannada text-xs font-medium text-jaggery-muted">
                      ಗರಿಗರಿ ತಿಂಡಿಗಳು
                    </span>
                  </div>
                </div>

                {/* Subtle Floating Heritage Accent Badge */}
                <div className="absolute -bottom-4 -left-6 bg-cream border border-jaggery/20 rounded-md px-3.5 py-2.5 shadow-lg flex items-center gap-3 z-20">
                  <div className="w-7 h-7 rounded-full bg-turmeric/20 flex items-center justify-center text-leaf font-bold">
                    <Sparkles className="w-4 h-4 text-leaf" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider font-sans font-bold text-jaggery-muted">
                      Heritage Origin
                    </div>
                    <div className="text-xs font-sans font-bold text-jaggery">
                      Hassan Kitchens · 100% Traditional
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              MOBILE HERO COMPOSITION (Screen widths < 1024px)
              Thoughtfully composed for mobile reading rhythms:
              Headline -> Hero Photograph -> Kannada Accent -> Copy -> CTA
              ======================================================== */}
          <div className="lg:hidden flex flex-col">
            {/* 1. Mobile Eyebrow */}
            <div className="anim-eyebrow flex items-center gap-2 mb-3">
              <span className="w-6 h-[1.5px] bg-chilli shrink-0" />
              <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-jaggery-muted">
                FROM HASSAN, WITH LOVE
              </span>
              <span className="text-[11px] font-kannada font-medium text-chilli">
                · ಹಾಸನ
              </span>
            </div>

            {/* 2. Mobile Compact Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-[1.08] tracking-[-0.03em] text-jaggery mb-4">
              <span className="block">A little crunch.</span>
              <span className="block text-chilli">A lot of Karnataka.</span>
            </h1>

            {/* 3. Mobile Hero Photography (Portrait / Vertical balanced framing) */}
            <div className="anim-hero-photo relative my-3">
              <div className="relative rounded-lg overflow-hidden border border-jaggery/15 bg-cream-dark shadow-[0_16px_32px_-8px_rgba(45,36,30,0.16)]">
                <Image
                  src="/images/hero-mobile.jpg"
                  alt="Traditional Karnataka snacks: handmade chakkali, kodubale and nippattu in rustic terracotta vessels on fresh banana leaf"
                  width={600}
                  height={800}
                  priority
                  className="w-full h-auto max-h-[380px] sm:max-h-[460px] object-cover"
                  sizes="100vw"
                />

                {/* Mobile Photo Overlay Detail */}
                <div className="bg-cream-light/95 border-t border-jaggery/10 px-3 py-2 flex items-center justify-between text-[11px] font-sans text-jaggery">
                  <span className="font-medium">
                    Chakkali · Kodubale · Nippattu
                  </span>
                  <span className="font-kannada text-chilli font-semibold">
                    ಗರಿಗರಿ ತಿಂಡಿಗಳು
                  </span>
                </div>
              </div>

              {/* Small circular chakkali emblem on mobile */}
              <div className="absolute top-3 right-3 bg-cream/90 backdrop-blur-sm p-1.5 rounded-full border border-jaggery/15 shadow-sm">
                <ChakkaliMotif size={28} color="#2D241E" accentColor="#A43D2E" />
              </div>
            </div>

            {/* 4. Mobile Kannada Accent Detail */}
            <div className="anim-kannada-detail mt-3 mb-3">
              <span className="inline-block px-3 py-1 bg-cream-dark/90 border border-jaggery/15 rounded-sm font-kannada text-sm font-semibold text-jaggery">
                ಮನೆಯ ರುಚಿ. ನಮ್ಮ ತಿಂಡಿ.
              </span>
            </div>

            {/* 5. Mobile Supporting Copy */}
            <p className="anim-desc font-sans text-base text-jaggery-muted leading-relaxed mb-6">
              Chakkali, kodubale, nippattu, obbattu and more. The flavours we grew up
              loving, brought together under one roof.
            </p>

            {/* 6. Mobile Action Buttons */}
            <div className="anim-cta-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                href="/shop"
                className="w-full sm:w-auto"
              >
                Explore Thindi
              </Button>

              <Link
                href="/our-story"
                className="text-center font-sans text-sm font-medium text-jaggery py-2.5 hover:text-chilli underline underline-offset-4 decoration-jaggery/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Feature Notice Modal */}
      <UpcomingNoticeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        featureTitle="THINDI Heritage Collection"
        featureDescription="From Hassan, with love. We are putting the finishing touches on our signature snacks, packaging, and Karnataka distribution network. Stay tuned for our inaugural dispatch."
      />
    </>
  );
};

