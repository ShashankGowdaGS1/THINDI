'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldAlert,
  Clock,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { BusinessPolicy } from '@/data/policies';

interface PolicyPageViewProps {
  policy: BusinessPolicy;
}

export const PolicyPageView: React.FC<PolicyPageViewProps> = ({ policy }) => {
  const isPrelaunchReview = policy.status === 'draft' || policy.status === 'in_review';

  return (
    <div className="pb-24">
      {/* ========================================================
          POLICY HEADER
          ======================================================== */}
      <section className="bg-[#FAF5EC] border-b border-jaggery/10 pt-10 pb-12 sm:pt-16 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-sans text-jaggery/60">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-chilli transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <span className="text-jaggery font-semibold">{policy.title}</span>
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-jaggery/15 text-xs font-semibold text-jaggery">
              <FileText className="w-3.5 h-3.5 text-chilli" />
              <span>OFFICIAL STORE POLICY</span>
              <span className="text-jaggery/30">·</span>
              <span className="font-mono text-[11px] text-jaggery/70">v{policy.version}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-jaggery tracking-tight">
              {policy.title}
            </h1>
            <p className="font-kannada text-xl text-chilli font-medium">
              {policy.kannadaTitle}
            </p>

            <p className="font-sans text-sm sm:text-base text-jaggery/80 leading-relaxed pt-1">
              {policy.summary}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-jaggery/60 pt-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {policy.lastUpdated}</span>
              </span>
              <span>·</span>
              <span>Origin: Hassan, Karnataka</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRELAUNCH REVIEW NOTICE (If In Review)
          ======================================================== */}
      {isPrelaunchReview && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Administrative Prelaunch Transparency Notice:</p>
              <p className="text-amber-800 text-xs leading-relaxed">
                This document represents THINDI’s operational policy framework currently undergoing internal review by
                central kitchen management in Hassan. Final statutory retail conditions will be published upon
                regulatory sign-off prior to opening live commercial transactions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT WITH DESKTOP TABLE OF CONTENTS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Table of Contents (Desktop Sticky, 4 Cols) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 p-6 rounded-2xl bg-[#FAF5EC] border border-jaggery/15 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-jaggery font-sans">
                Table of Contents
              </h2>
              <ul className="space-y-2.5 text-xs font-sans">
                {policy.sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="text-jaggery/75 hover:text-chilli transition-colors block py-0.5"
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-jaggery/10 space-y-2 text-xs">
                <p className="font-semibold text-jaggery">Questions regarding this policy?</p>
                <Link
                  href="/faq"
                  className="text-chilli font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Read our Customer FAQs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Policy Text Sections (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {policy.sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-28 space-y-3 pb-8 border-b border-jaggery/10 last:border-b-0"
              >
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-jaggery">
                    {sec.title}
                  </h2>
                  {sec.kannadaTitle && (
                    <p className="font-kannada text-xs sm:text-sm text-chilli font-medium mt-0.5">
                      {sec.kannadaTitle}
                    </p>
                  )}
                </div>

                <div className="font-sans text-xs sm:text-sm text-jaggery/85 space-y-3 leading-relaxed">
                  {sec.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {sec.notice && (
                  <div className="p-3 bg-cream-dark/60 rounded-lg border border-jaggery/10 text-xs font-mono text-jaggery/80">
                    {sec.notice}
                  </div>
                )}
              </section>
            ))}

            {/* Bottom Help Box */}
            <div className="p-6 rounded-2xl bg-cream border border-jaggery/15 shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-jaggery flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-chilli" />
                <span>Need assistance with an existing order?</span>
              </h3>
              <p className="text-xs sm:text-sm text-jaggery/75 font-sans">
                Our support team is based in Hassan and handles courier coordination, damaged item replacements, and
                refund claims directly through our order tracking portal.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/track-order"
                  className="px-4 py-2 rounded-lg bg-chilli text-cream text-xs font-bold hover:bg-[#8B3326] transition-colors"
                >
                  Track Order & Request Help
                </Link>
                <Link
                  href="/faq"
                  className="px-4 py-2 rounded-lg border border-jaggery/20 bg-cream-dark text-jaggery text-xs font-semibold hover:bg-[#EFE5D5] transition-colors"
                >
                  View FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

