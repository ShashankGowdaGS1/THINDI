'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { ThindiWordmark } from '../brand/ThindiWordmark';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';
import { siteConfig, NavItem } from '@/data/siteConfig';
import { UpcomingNoticeModal } from '../brand/UpcomingNoticeModal';
import { ContactInquiryModal } from '../home/ContactInquiryModal';

export const Footer: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [noticeModal, setNoticeModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
  });

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.action === 'contact') {
      e.preventDefault();
      setIsContactOpen(true);
    } else if (item.action === 'notice') {
      e.preventDefault();
      setNoticeModal({
        isOpen: true,
        title: item.noticeTitle || item.label,
        description: item.noticeDescription || '',
      });
    }
  };

  return (
    <footer
      aria-label="Site Footer"
      className="relative bg-jaggery text-cream pt-16 sm:pt-20 lg:pt-24 pb-8 overflow-hidden border-t border-cream/10"
    >
      {/* Subtle background motif glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-leaf/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            MAIN FOOTER GRID (4 Areas)
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16">
          {/* Area 1: Brand & Hassan Origin (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <ThindiWordmark size="lg" theme="dark" asLink={false} />

              <p className="font-sans text-cream/75 text-sm sm:text-base leading-relaxed max-w-sm mt-5">
                {siteConfig.brand.tagline} Handcrafted traditional snacks made with cold-pressed oils, age-old recipes, and honest Karnataka heritage.
              </p>

              {/* Verified Location */}
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cream/5 border border-cream/10 text-xs text-cream/70">
                <MapPin className="w-3.5 h-3.5 text-turmeric shrink-0" />
                <span>{siteConfig.brand.location}</span>
                <span className="text-cream/30">·</span>
                <span className="font-kannada text-turmeric/90">ಹಾಸನ</span>
              </div>
            </div>

            <p className="text-xs text-cream/40 font-sans mt-8 lg:mt-0">
              {siteConfig.brand.sublocationNote}
            </p>
          </div>

          {/* Area 2: Explore Navigation (2 Cols on Desktop) */}
          <div className="lg:col-span-2">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-turmeric mb-5">
              Explore
            </h3>
            <ul className="space-y-3.5">
              {siteConfig.navigation.explore.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href || '#'}
                    className="font-sans text-sm sm:text-base text-cream/75 hover:text-turmeric hover:translate-x-0.5 inline-block transition-all duration-150 py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Area 3: Customer Care & Transparency (3 Cols on Desktop) */}
          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-turmeric mb-5">
              Customer Care
            </h3>
            <ul className="space-y-3.5">
              {siteConfig.navigation.customerHelp.map((item) => (
                <li key={item.label}>
                  {item.action === 'contact' ? (
                    <button
                      type="button"
                      onClick={(e) => handleNavClick(item, e)}
                      className="font-sans text-sm sm:text-base text-cream/75 hover:text-turmeric hover:translate-x-0.5 inline-flex items-center gap-1.5 transition-all duration-150 py-1 cursor-pointer text-left"
                    >
                      <span>{item.label}</span>
                    </button>
                  ) : item.action === 'notice' ? (
                    <button
                      type="button"
                      onClick={(e) => handleNavClick(item, e)}
                      className="font-sans text-sm sm:text-base text-cream/75 hover:text-turmeric hover:translate-x-0.5 inline-flex items-center gap-1.5 transition-all duration-150 py-1 cursor-pointer text-left"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cream/10 text-cream/50">
                        Info
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="font-sans text-sm sm:text-base text-cream/75 hover:text-turmeric hover:translate-x-0.5 inline-flex items-center gap-1.5 transition-all duration-150 py-1"
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Area 4: Operations & Genuine Communications (2 Cols on Desktop) */}
          <div className="lg:col-span-2">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-turmeric mb-5">
              From Our Ooru
            </h3>
            <p className="font-sans text-xs sm:text-sm text-cream/65 leading-relaxed mb-4">
              We prepare each batch with care in Hassan. Enquiries submitted on our website are reviewed directly by our kitchen and dispatch operations.
            </p>

            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-turmeric hover:text-cream transition-colors duration-150 underline underline-offset-4 cursor-pointer"
            >
              <span>Write to Hassan desk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            PHASE 4: DISTINCTIVE OVERSIZED THINDI WORDMARK
            Architectural, high-fashion brand identity conclusion
            ======================================================== */}
        <div
          className="border-t border-cream/10 pt-8 sm:pt-12 pb-4 text-center select-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="flex items-baseline justify-center">
            <span className="font-display font-black tracking-[-0.04em] text-[16vw] sm:text-[14vw] lg:text-[160px] xl:text-[180px] leading-none text-cream/[0.06] hover:text-cream/[0.09] transition-colors duration-700 uppercase">
              THINDI
            </span>
            <span className="font-kannada font-bold text-[6vw] sm:text-[5vw] lg:text-[60px] leading-none text-turmeric/[0.08] ml-2 sm:ml-4">
              ತಿಂಡಿ
            </span>
          </div>
        </div>

        {/* ========================================================
            FOOTER BOTTOM: Copyright, Heritage & Legal
            ======================================================== */}
        <div className="pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-cream/50 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {siteConfig.legal.brandOwner}. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-cream/45">
            <span>Origin: Hassan, Karnataka</span>
            <span>·</span>
            <span className="font-kannada text-turmeric/60">ಹಾಸನದ ಸಾಂಪ್ರದಾಯಿಕ ತಿಂಡಿಗಳು</span>
          </div>
        </div>
      </div>

      {/* Customer Contact Inquiry Modal */}
      <ContactInquiryModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Informational Policy Modal */}
      <UpcomingNoticeModal
        isOpen={noticeModal.isOpen}
        onClose={() => setNoticeModal({ ...noticeModal, isOpen: false })}
        featureTitle={noticeModal.title}
        featureDescription={noticeModal.description}
      />
    </footer>
  );
};

