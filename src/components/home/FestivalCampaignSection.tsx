'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Check, Calendar, Star } from 'lucide-react';
import { FESTIVAL_CAMPAIGNS, determineActiveCampaign } from '@/data/campaigns';
import { FestivalCampaign, CampaignId } from '@/types/campaign';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const FestivalCampaignSection: React.FC = () => {
  // Initialize with date-based active campaign in Asia/Kolkata timezone
  const [selectedId, setSelectedId] = useState<CampaignId>(() => determineActiveCampaign());
  const activeCampaign: FestivalCampaign =
    FESTIVAL_CAMPAIGNS.find((c) => c.id === selectedId) || FESTIVAL_CAMPAIGNS[2];

  return (
    <section
      id="festivals"
      className={`relative pt-20 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-b transition-colors duration-500 overflow-hidden ${
        activeCampaign.id === 'deepavali'
          ? 'bg-chilli text-cream border-cream/20'
          : activeCampaign.id === 'ugadi'
          ? 'bg-cream text-jaggery border-leaf/20'
          : 'bg-cream text-jaggery border-jaggery/15'
      }`}
      aria-label="Festivals Taste Better Together — Seasonal Celebrations"
    >
      {/* Decorative ambient background warm glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-turmeric/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            DESKTOP UNIFIED CAMPAIGN COMPOSITION (Hidden on mobile < 1024px)
            Left: 45% Campaign Typography, Selector & CTAs
            Right: 55% Large Festive Food Photography Canvas
            ======================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center mb-16">
          {/* LEFT: Campaign Identity, Dynamic Headline & Selector (5 cols) */}
          <div className="lg:col-span-5 z-10 flex flex-col justify-start">
            {/* Campaign Eyebrow */}
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className={`w-8 h-[2px] shrink-0 ${
                  activeCampaign.id === 'deepavali' ? 'bg-turmeric' : 'bg-chilli'
                }`}
              />
              <span
                className={`font-sans text-xs xl:text-sm font-bold tracking-[0.24em] uppercase ${
                  activeCampaign.id === 'deepavali' ? 'text-turmeric' : 'text-jaggery-muted'
                }`}
              >
                {activeCampaign.eyebrow}
              </span>
            </div>

            {/* Main Headline (Dynamic per seasonal variant) */}
            <h2 className="font-display font-black text-5xl xl:text-6xl tracking-[-0.03em] leading-[1.04] mb-4">
              <span className="block">{activeCampaign.headlineLine1}</span>
              <span
                className={`block ${
                  activeCampaign.id === 'deepavali'
                    ? 'text-turmeric'
                    : activeCampaign.id === 'ugadi'
                    ? 'text-leaf'
                    : 'text-chilli'
                }`}
              >
                {activeCampaign.headlineLine2}
              </span>
            </h2>

            {/* Kannada Accent Badge */}
            <div
              className={`inline-block px-3.5 py-1.5 rounded-sm font-kannada text-base xl:text-lg font-bold mb-5 shadow-xs w-fit ${
                activeCampaign.id === 'deepavali'
                  ? 'bg-cream/15 text-turmeric border border-cream/20'
                  : 'bg-cream-dark/80 text-jaggery border border-jaggery/15'
              }`}
            >
              {activeCampaign.kannadaAccent}
            </div>

            {/* Supporting Copy */}
            <p
              className={`font-sans text-base xl:text-lg leading-relaxed max-w-xl mb-8 text-pretty ${
                activeCampaign.id === 'deepavali' ? 'text-cream/90' : 'text-jaggery-muted'
              }`}
            >
              {activeCampaign.description}
            </p>

            {/* EDITORIAL CAMPAIGN SELECTOR (Index Style: 01 / 02 / 03) */}
            <div className="mb-8 space-y-2" role="tablist" aria-label="Seasonal Festival Variants">
              <div
                className={`text-[10px] uppercase font-sans tracking-[0.2em] font-bold ${
                  activeCampaign.id === 'deepavali' ? 'text-cream/60' : 'text-jaggery-muted'
                }`}
              >
                Explore Celebrations:
              </div>

              <div
                className={`border-y divide-y ${
                  activeCampaign.id === 'deepavali'
                    ? 'border-cream/20 divide-cream/15'
                    : 'border-jaggery/20 divide-jaggery/10'
                }`}
              >
                {FESTIVAL_CAMPAIGNS.map((c) => {
                  const isSelected = c.id === activeCampaign.id;

                  return (
                    <button
                      key={c.id}
                      role="tab"
                      id={`tab-festival-${c.id}`}
                      aria-selected={isSelected}
                      aria-controls={`panel-festival-${c.id}`}
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full py-3 px-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 ${
                        activeCampaign.id === 'deepavali'
                          ? 'focus-visible:ring-turmeric'
                          : 'focus-visible:ring-chilli'
                      } ${
                        isSelected
                          ? activeCampaign.id === 'deepavali'
                            ? 'text-cream font-bold'
                            : 'text-jaggery font-bold'
                          : activeCampaign.id === 'deepavali'
                          ? 'text-cream/50 hover:text-cream/80'
                          : 'text-jaggery-muted hover:text-jaggery'
                      }`}
                    >
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isSelected
                              ? activeCampaign.id === 'deepavali'
                                ? 'text-turmeric'
                                : 'text-chilli'
                              : 'opacity-50'
                          }`}
                        >
                          {c.indexNumber}
                        </span>
                        <span className="font-display text-lg tracking-tight">
                          {c.name}
                        </span>
                        <span className="font-kannada text-xs opacity-75">
                          {c.kannadaName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <span
                            className={`text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-1 ${
                              activeCampaign.id === 'deepavali' ? 'text-turmeric' : 'text-chilli'
                            }`}
                          >
                            <span>Viewing</span>
                            <span className="w-3 h-[1.5px] bg-current" />
                          </span>
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-70" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button (Links to valid collection destination) */}
            <div className="flex items-center gap-4">
              <Button
                variant={activeCampaign.id === 'deepavali' ? 'secondary' : 'primary'}
                size="md"
                href={activeCampaign.ctaLink}
                icon={<ArrowRight className="w-4 h-4" />}
                className={
                  activeCampaign.id === 'deepavali'
                    ? 'bg-cream text-jaggery hover:bg-cream-dark shadow-md'
                    : ''
                }
              >
                {activeCampaign.ctaText}
              </Button>

              <span
                className={`text-xs font-sans tracking-wide ${
                  activeCampaign.id === 'deepavali' ? 'text-cream/70' : 'text-jaggery-muted'
                }`}
              >
                {activeCampaign.statusText}
              </span>
            </div>
          </div>

          {/* RIGHT: Large Festive Food Photography Canvas (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-md overflow-hidden border shadow-[0_24px_50px_-12px_rgba(45,36,30,0.25)] group">
              <div className="relative aspect-[4/3] xl:aspect-[16/11] w-full overflow-hidden bg-cream-dark">
                <Image
                  key={activeCampaign.id}
                  src={activeCampaign.heroImage}
                  alt={activeCampaign.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1280px) 58vw, 750px"
                  className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02] animate-in fade-in duration-300"
                />

                {/* Festival Campaign Identity Overlay Badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded text-[10px] uppercase font-sans font-bold tracking-wider backdrop-blur-md border ${
                    activeCampaign.id === 'deepavali'
                      ? 'bg-jaggery/90 text-cream border-cream/20'
                      : 'bg-cream/95 text-jaggery border-jaggery/15'
                  }`}
                >
                  Habba at Home · {activeCampaign.name}
                </div>

                {/* Chakkali Festive Seal */}
                <div className="absolute top-4 right-4 bg-cream/95 backdrop-blur-sm p-1.5 rounded-full border border-jaggery/20 shadow-md">
                  <ChakkaliMotif
                    size={26}
                    color="#2D241E"
                    accentColor={activeCampaign.id === 'deepavali' ? '#E8B54B' : '#A43D2E'}
                  />
                </div>
              </div>

              {/* Photographic Caption Footer */}
              <div
                className={`p-4 border-t flex items-center justify-between text-xs font-sans ${
                  activeCampaign.id === 'deepavali'
                    ? 'bg-jaggery/95 text-cream border-cream/15'
                    : 'bg-cream text-jaggery border-jaggery/15'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{activeCampaign.name} Celebrations</span>
                  <span className="opacity-40">·</span>
                  <span className="opacity-80">Hassan Traditional Kitchens</span>
                </div>
                <span className="font-kannada font-bold text-turmeric">
                  {activeCampaign.kannadaName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MOBILE RESPONSIVE COMPOSITION (< 1024px)
            Order:
            1. Eyebrow
            2. Headline
            3. Large festive food photograph
            4. Supporting copy + Kannada accent
            5. Campaign selector
            6. Primary CTA
            ======================================================== */}
        <div className="lg:hidden flex flex-col space-y-6 mb-12">
          {/* 1. Mobile Eyebrow */}
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-[1.5px] ${
                activeCampaign.id === 'deepavali' ? 'bg-turmeric' : 'bg-chilli'
              }`}
            />
            <span
              className={`font-sans text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase ${
                activeCampaign.id === 'deepavali' ? 'text-turmeric' : 'text-jaggery-muted'
              }`}
            >
              {activeCampaign.eyebrow}
            </span>
          </div>

          {/* 2. Mobile Headline */}
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-[1.08]">
            <span className="block">{activeCampaign.headlineLine1}</span>
            <span
              className={`block ${
                activeCampaign.id === 'deepavali'
                  ? 'text-turmeric'
                  : activeCampaign.id === 'ugadi'
                  ? 'text-leaf'
                  : 'text-chilli'
              }`}
            >
              {activeCampaign.headlineLine2}
            </span>
          </h2>

          {/* 3. Large Festive Food Photograph */}
          <div className="relative rounded-md overflow-hidden border shadow-md">
            <div className="relative aspect-[4/3] w-full bg-cream-dark">
              <Image
                key={activeCampaign.id}
                src={activeCampaign.heroImage}
                alt={activeCampaign.imageAlt}
                fill
                sizes="100vw"
                className="object-cover animate-in fade-in duration-300"
              />
              <div className="absolute top-3 left-3 bg-jaggery/90 text-cream px-2.5 py-0.5 rounded text-[10px] uppercase font-sans font-bold tracking-wider">
                Habba at Home · {activeCampaign.name}
              </div>
            </div>

            <div
              className={`p-3 border-t flex items-center justify-between text-xs font-sans ${
                activeCampaign.id === 'deepavali'
                  ? 'bg-jaggery text-cream border-cream/15'
                  : 'bg-cream text-jaggery border-jaggery/15'
              }`}
            >
              <span className="font-semibold">{activeCampaign.name}</span>
              <span className="font-kannada font-bold text-turmeric">
                {activeCampaign.kannadaName}
              </span>
            </div>
          </div>

          {/* 4. Supporting Copy & Kannada Accent */}
          <div className="space-y-3">
            <div
              className={`inline-block px-3 py-1 rounded-sm font-kannada text-sm font-bold ${
                activeCampaign.id === 'deepavali'
                  ? 'bg-cream/15 text-turmeric border border-cream/20'
                  : 'bg-cream-dark/80 text-jaggery border border-jaggery/15'
              }`}
            >
              {activeCampaign.kannadaAccent}
            </div>

            <p
              className={`font-sans text-sm leading-relaxed ${
                activeCampaign.id === 'deepavali' ? 'text-cream/90' : 'text-jaggery-muted'
              }`}
            >
              {activeCampaign.description}
            </p>
          </div>

          {/* 5. Mobile Campaign Selector */}
          <div className="space-y-1.5">
            <span
              className={`text-[10px] uppercase font-sans tracking-widest font-bold ${
                activeCampaign.id === 'deepavali' ? 'text-cream/60' : 'text-jaggery-muted'
              }`}
            >
              Select Celebration:
            </span>

            <div className="grid grid-cols-3 gap-2" role="tablist">
              {FESTIVAL_CAMPAIGNS.map((c) => {
                const isSelected = c.id === activeCampaign.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-2.5 rounded text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cream text-jaggery border-cream font-bold shadow-sm'
                        : activeCampaign.id === 'deepavali'
                        ? 'bg-cream/10 text-cream/80 border-cream/20'
                        : 'bg-cream-dark/60 text-jaggery/80 border-jaggery/20'
                    }`}
                  >
                    <div className="font-mono text-[10px] opacity-75">{c.indexNumber}</div>
                    <div className="font-display font-bold text-xs truncate">{c.name}</div>
                    <div className="font-kannada text-[11px] opacity-80">{c.kannadaName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Mobile CTA */}
          <div>
            <Button
              variant={activeCampaign.id === 'deepavali' ? 'secondary' : 'primary'}
              size="md"
              href={activeCampaign.ctaLink}
              icon={<ArrowRight className="w-4 h-4" />}
              className={`w-full justify-center ${
                activeCampaign.id === 'deepavali' ? 'bg-cream text-jaggery shadow-md' : ''
              }`}
            >
              {activeCampaign.ctaText}
            </Button>
          </div>
        </div>

        {/* ========================================================
            TRANSITION TOWARD FINAL FAQ & FOOTER
            Gentle transition preparing for the upcoming FAQ section
            ======================================================== */}
        <div
          className={`pt-12 text-center border-t mt-12 ${
            activeCampaign.id === 'deepavali' ? 'border-cream/20' : 'border-jaggery/15'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span
              className={`w-12 h-[1px] ${
                activeCampaign.id === 'deepavali' ? 'bg-cream/20' : 'bg-jaggery/20'
              }`}
            />
            <ChakkaliMotif
              size={20}
              color={activeCampaign.id === 'deepavali' ? '#FAF6ED' : '#2D241E'}
              accentColor="#E8B54B"
            />
            <span
              className={`w-12 h-[1px] ${
                activeCampaign.id === 'deepavali' ? 'bg-cream/20' : 'bg-jaggery/20'
              }`}
            />
          </div>

          <p className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-1">
            Questions about our kitchens?
          </p>
          <p
            className={`font-sans text-xs uppercase tracking-[0.2em] font-semibold ${
              activeCampaign.id === 'deepavali' ? 'text-turmeric' : 'text-jaggery-muted'
            }`}
          >
            Hassan kitchen batches, ingredients & statewide ordering guide ahead
          </p>
        </div>
      </div>
    </section>
  );
};

