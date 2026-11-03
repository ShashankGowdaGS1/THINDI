'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { getAllFaqs } from '@/data/faqs';
import { FAQItem } from '@/types/faq';
import { ContactInquiryModal } from '@/components/home/ContactInquiryModal';

const CATEGORY_GROUPS = [
  { id: 'all', label: 'All Questions', kannadaLabel: 'ಎಲ್ಲ ಪ್ರಶ್ನೆಗಳು' },
  { id: 'products', label: 'Products & Ingredients', kannadaLabel: 'ತಿಂಡಿ & ಪದಾರ್ಥಗಳು' },
  { id: 'orders', label: 'Orders & Payments', kannadaLabel: 'ಆರ್ಡರ್ & ಪಾವತಿ' },
  { id: 'shipping', label: 'Shipping & Delivery', kannadaLabel: 'ರವಾನೆ & ಡೆಲಿವರಿ' },
  { id: 'returns', label: 'Returns & Refunds', kannadaLabel: 'ಮರುಪಾವತಿ ನೀತಿ' },
  { id: 'gifting', label: 'Gift Boxes', kannadaLabel: 'ಉಡುಗೊರೆ ಬಾಕ್ಸ್‌ಗಳು' },
  { id: 'contact', label: 'Contact & Support', kannadaLabel: 'ಸಂಪರ್ಕ & ಸಹಾಯ' },
];

function matchesGroup(faq: FAQItem, group: string): boolean {
  if (group === 'all') return true;
  if (group === 'products') return faq.category === 'origin' || faq.category === 'ingredients' || faq.category === 'storage';
  if (group === 'orders') return faq.category === 'orders';
  if (group === 'shipping') return faq.category === 'shipping';
  if (group === 'returns') return faq.category === 'policy';
  if (group === 'gifting') return faq.category === 'gifting';
  if (group === 'contact') return faq.category === 'contact';
  return false;
}

export const FAQPageView: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['origin-hassan', 'delivery-karnataka']));
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const allFaqs = useMemo(() => getAllFaqs(), []);

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      // Category group filter
      if (!matchesGroup(faq, selectedGroup)) return false;

      // Keyword search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQ =
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          (faq.kannadaQuestion && faq.kannadaQuestion.includes(q)) ||
          (faq.kannadaAnswer && faq.kannadaAnswer.includes(q));
        if (!matchesQ) return false;
      }

      return true;
    });
  }, [allFaqs, selectedGroup, searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-12 pb-24">
      {/* ========================================================
          HERO BANNER
          ======================================================== */}
      <section className="bg-[#FAF5EC] border-b border-jaggery/10 pt-12 pb-14 sm:pt-20 sm:pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream border border-jaggery/15 text-xs font-bold uppercase tracking-wider text-chilli shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE · ಪ್ರಶ್ನೋತ್ತರಗಳು</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-jaggery tracking-tight">
            Questions? Let's sort them.
          </h1>

          <p className="font-sans text-base sm:text-lg text-jaggery/75 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our products, ordering and delivery across Karnataka.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-jaggery/40" />
            <input
              type="text"
              placeholder="Search by keyword, e.g. shipping, shelf life, UPI, gift box..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm border border-jaggery/20 rounded-xl bg-cream text-jaggery placeholder-jaggery/40 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-chilli"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          CATEGORY TABS & ACCORDION LIST
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORY_GROUPS.map((cat) => {
            const isActive = selectedGroup === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedGroup(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                  isActive
                    ? 'bg-chilli text-cream font-bold shadow-xs'
                    : 'bg-[#FAF5EC] border border-jaggery/15 text-jaggery/80 hover:bg-cream hover:border-chilli/40'
                }`}
              >
                <span>{cat.label}</span>
                <span className="hidden sm:inline font-kannada text-[11px] opacity-75 ml-1.5">
                  ({cat.kannadaLabel})
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-jaggery/60 pt-2 border-t border-jaggery/10 font-sans">
          <span>
            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-chilli font-semibold hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Accordions */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.has(faq.id);
              const isDraft = !faq.published;

              return (
                <article
                  key={faq.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isDraft
                      ? 'bg-amber-50/40 border-amber-200'
                      : isOpen
                      ? 'bg-[#FFFCF7] border-jaggery/30 shadow-xs'
                      : 'bg-[#FAF5EC] border-jaggery/15 hover:border-jaggery/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-base sm:text-lg font-bold text-jaggery">
                          {faq.question}
                        </h2>
                        {isDraft && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Draft Policy (Under Review)</span>
                          </span>
                        )}
                      </div>
                      {faq.kannadaQuestion && (
                        <p className="font-kannada text-xs sm:text-sm text-chilli font-medium">
                          {faq.kannadaQuestion}
                        </p>
                      )}
                    </div>

                    <div
                      className={`p-1.5 rounded-full shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-chilli text-cream' : 'bg-jaggery/10 text-jaggery'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-1 border-t border-jaggery/10 space-y-3 font-sans text-xs sm:text-sm text-jaggery/85 leading-relaxed">
                      <p>{faq.answer}</p>
                      {faq.kannadaAnswer && (
                        <p className="font-kannada text-xs sm:text-sm text-jaggery/70 pt-1 border-t border-jaggery/5">
                          {faq.kannadaAnswer}
                        </p>
                      )}
                      {faq.relatedRoute && (
                        <div className="pt-2">
                          <Link
                            href={faq.relatedRoute.startsWith('#') ? `/${faq.relatedRoute}` : faq.relatedRoute}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-chilli hover:underline"
                          >
                            <span>Learn more in this section</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#FAF5EC] rounded-2xl border border-jaggery/10 space-y-3">
            <HelpCircle className="w-10 h-10 text-jaggery/30 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-jaggery">
              No matching questions found
            </h3>
            <p className="text-xs text-jaggery/70 max-w-sm mx-auto">
              We couldn’t find an answer matching "{searchQuery}". You can submit a direct question to our team below.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-lg bg-chilli text-cream text-xs font-semibold hover:bg-[#8B3326]"
            >
              Clear Search Query
            </button>
          </div>
        )}

        {/* ========================================================
            STILL HAVE QUESTIONS / CONTACT CTA
            ======================================================== */}
        <div className="p-8 rounded-2xl bg-cream border border-jaggery/15 shadow-sm text-center space-y-4 mt-12">
          <div className="w-10 h-10 rounded-full bg-chilli/10 text-chilli flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-jaggery">
            Didn't find what you were looking for?
          </h3>
          <p className="text-xs sm:text-sm text-jaggery/75 max-w-md mx-auto leading-relaxed">
            Our central kitchen and customer support team in Hassan, Karnataka is happy to help with custom orders,
            delivery queries, or dietary questions.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-chilli text-cream text-xs font-bold hover:bg-[#8B3326] transition-colors shadow-xs cursor-pointer"
            >
              Send an Enquiry
            </button>
            <Link
              href="/track-order"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-jaggery/20 bg-cream text-jaggery text-xs font-semibold hover:bg-[#EFE5D5] transition-colors"
            >
              Track an Existing Order
            </Link>
          </div>
        </div>
      </section>

      {contactModalOpen && (
        <ContactInquiryModal
          isOpen={true}
          onClose={() => setContactModalOpen(false)}
        />
      )}
    </div>
  );
};

