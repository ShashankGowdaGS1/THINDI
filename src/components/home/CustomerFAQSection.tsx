'use client';

import React, { useState } from 'react';
import { Plus, Minus, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { getPublishedFaqs } from '@/data/faqs';
import { FAQItem } from '@/types/faq';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';
import { ContactInquiryModal } from './ContactInquiryModal';

export const CustomerFAQSection: React.FC = () => {
  const publishedFaqs = getPublishedFaqs();
  // First published question is open by default per design specification
  const [openId, setOpenId] = useState<string | null>(
    publishedFaqs[0]?.id || null
  );
  const [isContactOpen, setIsContactOpen] = useState(false);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Helper label for contextual in-page routing
  const getRouteLabel = (route: string) => {
    switch (route) {
      case '#doorstep-delivery':
        return 'Check your pincode in our delivery checker';
      case '#signature-picks':
        return 'Explore ingredients on signature snacks';
      case '#thindi-box':
        return 'View festive snack gift boxes';
      default:
        return 'View related details';
    }
  };

  return (
    <section
      id="faqs"
      aria-label="Good Thindi. No Guesswork. — Frequently Asked Questions"
      className="relative bg-cream text-jaggery pt-20 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-t border-jaggery/10 overflow-hidden"
    >
      {/* Subtle ambient motif in background */}
      <div
        className="absolute top-12 -right-16 opacity-[0.035] pointer-events-none select-none -z-0"
        aria-hidden="true"
      >
        <ChakkaliMotif size={440} color="#2D241E" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            TWO-COLUMN EDITORIAL COMPOSITION (Desktop: Left ~40%, Right ~60%)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
          {/* ========================================================
              LEFT COLUMN: Editorial Narrative, Headline & Support CTA
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-[2px] bg-leaf" />
                <span className="text-xs font-semibold uppercase tracking-widest text-leaf font-sans">
                  A Little Help Before You Order
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-jaggery tracking-tight leading-[1.1] mb-3">
                Good thindi.
                <br />
                <span className="text-chilli">No guesswork.</span>
              </h2>

              {/* Kannada Accent Detail */}
              <p className="font-kannada text-lg text-jaggery/60 font-medium mb-5">
                ಇನ್ನೂ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?
              </p>

              {/* Supporting Copy */}
              <p className="font-sans text-base sm:text-lg text-jaggery/75 leading-relaxed max-w-md">
                The little things you might want to know before filling your snack box. Honest ingredients, straightforward storage, and our Hassan roots.
              </p>
            </div>

            {/* Minimal Customer Support Block (Editorial, not a generic card) */}
            <div className="mt-10 lg:mt-16 pt-8 border-t border-jaggery/15">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-turmeric/20 text-jaggery flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-jaggery">
                    Still have a question?
                  </h3>
                  <p className="font-sans text-sm text-jaggery/70 mt-1 mb-4 leading-relaxed">
                    We&apos;re happy to help you find the information you need. Our team in Hassan reviews and replies directly to genuine queries.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsContactOpen(true)}
                    className="hover:border-chilli hover:text-chilli"
                  >
                    Contact THINDI
                  </Button>
                </div>
              </div>

              {/* Verified Hassan origin footnote */}
              <div className="mt-6 flex items-center gap-2 text-xs text-jaggery/55">
                <MapPin className="w-3.5 h-3.5 text-leaf shrink-0" />
                <span>Central kitchen & operations based in Hassan, Karnataka.</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Clean Divider-Separated FAQ Accordion
              ======================================================== */}
          <div className="lg:col-span-7">
            <div className="border-t border-jaggery/15 divide-y divide-jaggery/15">
              {publishedFaqs.map((faq: FAQItem, index: number) => {
                const isOpen = openId === faq.id;
                const panelId = `faq-panel-${faq.id}`;
                const buttonId = `faq-trigger-${faq.id}`;

                return (
                  <div key={faq.id} className="py-5 sm:py-6 group">
                    {/* Accessible Button Trigger */}
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(faq.id)}
                      className="w-full flex items-start justify-between text-left gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf/50 focus-visible:ring-offset-2 rounded-sm"
                    >
                      <div className="pr-4">
                        <span className="text-xs font-mono font-medium text-jaggery/40 block mb-1">
                          0{index + 1}
                        </span>
                        <span
                          className={`font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors duration-200 ${
                            isOpen ? 'text-chilli' : 'text-jaggery group-hover:text-chilli'
                          }`}
                        >
                          {faq.question}
                        </span>
                        {faq.kannadaQuestion && (
                          <span className="block font-kannada text-xs sm:text-sm text-jaggery/50 mt-0.5">
                            {faq.kannadaQuestion}
                          </span>
                        )}
                      </div>

                      {/* Minimal Plus/Minus Indicator */}
                      <div
                        className={`w-8 h-8 rounded-full border border-jaggery/20 flex items-center justify-center shrink-0 transition-transform duration-200 mt-1 ${
                          isOpen ? 'bg-chilli text-cream border-chilli rotate-90' : 'bg-transparent text-jaggery group-hover:border-jaggery'
                        }`}
                        aria-hidden="true"
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Smooth Expandable Answer Panel */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="font-sans text-sm sm:text-base text-jaggery/85 leading-relaxed">
                        {faq.answer}
                      </p>

                      {/* Kannada Translation Accent */}
                      {faq.kannadaAnswer && (
                        <p className="font-kannada text-xs sm:text-sm text-jaggery/60 mt-2.5 leading-relaxed bg-jaggery/[0.03] p-2.5 rounded border-l-2 border-turmeric">
                          {faq.kannadaAnswer}
                        </p>
                      )}

                      {/* Contextual In-Page Navigation Link */}
                      {faq.relatedRoute && (
                        <div className="mt-3.5">
                          <a
                            href={faq.relatedRoute}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-leaf hover:text-chilli transition-colors duration-150 group/link"
                          >
                            <span>{getRouteLabel(faq.relatedRoute)}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:translate-x-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            STAGE 9 CLOSING TRANSITION
            Minimal typographic transition toward closing CTA
            ======================================================== */}
        <div className="mt-20 pt-12 border-t border-jaggery/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ChakkaliMotif size={24} color="#2D241E" />
            <span className="font-serif italic text-lg sm:text-xl text-jaggery/50 font-medium tracking-wide">
              Crafted in Hassan
            </span>
            <span className="hidden sm:inline text-jaggery/30">·</span>
            <span className="font-kannada text-sm text-jaggery/45">
              ಹಾಸನದ ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿ
            </span>
          </div>

          <div className="text-xs font-sans text-jaggery/45 tracking-wider uppercase">
            Hassan Tradition · Homemade Style
          </div>
        </div>
      </div>

      {/* Customer Contact Inquiry Modal */}
      <ContactInquiryModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </section>
  );
};

