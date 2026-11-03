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
                  activeCampaign.id === 'deepavali' ? 'text-cream/90' : 'text-jaggery-muted'
                }`}
              >
                Explore Celebrations:
              </div>

              <div className="space-y-2">
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
                      className={`w-full py-3 px-3.5 rounded-md flex items-center justify-between text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 ${
                        activeCampaign.id === 'deepavali'
                          ? isSelected
                            ? 'bg-[#F7F0E3] text-[#2D241E] border-2 border-[#F7F0E3] shadow-md font-bold focus-visible:ring-turmeric'
                            : 'bg-[#6B1D12] text-[#F7F0E3] border border-cream/20 hover:bg-[#58150B] hover:text-white font-medium focus-visible:ring-turmeric'
                          : isSelected
                          ? 'bg-[#2D241E] text-[#F7F0E3] border-2 border-[#2D241E] shadow-md font-bold focus-visible:ring-chilli'
                          : 'bg-cream-dark/80 text-jaggery border border-jaggery/20 hover:bg-cream-deep font-medium focus-visible:ring-chilli'
                      }`}
                    >
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-xs font-bold ${
                            activeCampaign.id === 'deepavali'
                              ? isSelected
                                ? 'text-chilli'
                                : 'text-turmeric'
                              : isSelected
                              ? 'text-turmeric'
                              : 'text-chilli'
                          }`}
                        >
                          {c.indexNumber}
                        </span>
                        <span className="font-display text-base xl:text-lg tracking-tight">
                          {c.name}
                        </span>
                        <span
                          className={`font-kannada text-xs ${
                            activeCampaign.id === 'deepavali'
                              ? isSelected
                                ? 'text-[#2D241E]/80'
                                : 'text-cream/90'
                              : isSelected
                              ? 'text-cream/90'
                              : 'text-jaggery-muted'
                          }`}
                        >
                          {c.kannadaName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <span
                            className={`text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded ${
                              activeCampaign.id === 'deepavali'
                                ? 'bg-cream-dark text-[#2D241E]'
                                : 'bg-jaggery-dark text-turmeric'
                            }`}
                          >
                            <Check className="w-3 h-3 text-current" aria-hidden="true" />
                            <span>Viewing</span>
                          </span>
                        ) : (
                          <ArrowRight
                            className={`w-3.5 h-3.5 ${
                              activeCampaign.id === 'deepavali'
                                ? 'text-[#F7F0E3] opacity-80'
                                : 'text-jaggery opacity-60'
                            }`}
                            aria-hidden="true"
                          />
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
                icon={<ArrowRight className="w-4 h-4 text-current" aria-hidden="true" />}
                className={
                  activeCampaign.id === 'deepavali'
                    ? 'bg-[#2D241E] text-[#F7F0E3] hover:bg-[#365541] hover:text-white active:bg-[#253B2D] active:text-white font-semibold min-h-[48px] shadow-md focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D241E]'
                    : 'min-h-[48px] font-semibold'
                }
              >
                {activeCampaign.ctaText}
              </Button>

              <span
                className={`text-xs font-sans tracking-wide ${
                  activeCampaign.id === 'deepavali' ? 'text-cream/90' : 'text-jaggery-muted'
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
          <div className="space-y-2">
            <span
              className={`text-[10px] uppercase font-sans tracking-widest font-bold ${
                activeCampaign.id === 'deepavali' ? 'text-cream/90' : 'text-jaggery-muted'
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
                    id={`mobile-tab-festival-${c.id}`}
                    aria-selected={isSelected}
                    aria-controls={`mobile-panel-festival-${c.id}`}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-2.5 rounded-md text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 ${
                      activeCampaign.id === 'deepavali'
                        ? isSelected
                          ? 'bg-[#F7F0E3] text-[#2D241E] border-2 border-[#F7F0E3] font-bold shadow-sm focus-visible:ring-turmeric'
                          : 'bg-[#6B1D12] text-[#F7F0E3] border border-cream/20 hover:bg-[#58150B] hover:text-white font-medium focus-visible:ring-turmeric'
                        : isSelected
                        ? 'bg-[#2D241E] text-[#F7F0E3] border-2 border-[#2D241E] font-bold shadow-sm focus-visible:ring-chilli'
                        : 'bg-cream-dark/80 text-jaggery border border-jaggery/20 hover:bg-cream-deep font-medium focus-visible:ring-chilli'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-mono text-[10px] font-bold ${
                          activeCampaign.id === 'deepavali'
                            ? isSelected
                              ? 'text-chilli'
                              : 'text-turmeric'
                            : isSelected
                            ? 'text-turmeric'
                            : 'text-chilli'
                        }`}
                      >
                        {c.indexNumber}
                      </span>
                      {isSelected ? (
                        <span
                          className={`inline-flex items-center gap-0.5 text-[9px] font-sans font-bold uppercase tracking-wider px-1 py-0.2 rounded ${
                            activeCampaign.id === 'deepavali'
                              ? 'bg-cream-dark text-[#2D241E]'
                              : 'bg-jaggery-dark text-turmeric'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 text-current" aria-hidden="true" />
                          <span className="sr-only">Active</span>
                        </span>
                      ) : null}
                    </div>
                    <div className="font-display text-xs truncate">
                      {c.name}
                    </div>
                    <div
                      className={`font-kannada text-[11px] truncate ${
                        activeCampaign.id === 'deepavali'
                          ? isSelected
                            ? 'text-[#2D241E]/80'
                            : 'text-cream/90'
                          : isSelected
                          ? 'text-cream/90'
                          : 'text-jaggery-muted'
                      }`}
                    >
                      {c.kannadaName}
                    </div>
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
              icon={<ArrowRight className="w-4 h-4 text-current" aria-hidden="true" />}
              className={`w-full justify-center min-h-[48px] font-semibold ${
                activeCampaign.id === 'deepavali'
                  ? 'bg-[#2D241E] text-[#F7F0E3] hover:bg-[#365541] hover:text-white active:bg-[#253B2D] active:text-white shadow-md focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D241E]'
                  : ''
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

