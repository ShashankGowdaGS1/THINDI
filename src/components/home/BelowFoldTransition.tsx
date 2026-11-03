import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const BelowFoldTransition: React.FC = () => {
  return (
    <section
      className="relative bg-cream-light py-16 sm:py-24 border-b border-jaggery/10 overflow-hidden"
      aria-label="Upcoming Categories Transition"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative subtle separator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="w-12 sm:w-16 h-[1px] bg-jaggery/20" />
          <ChakkaliMotif size={24} color="#5C4E43" accentColor="#A43D2E" />
          <span className="w-12 sm:w-16 h-[1px] bg-jaggery/20" />
        </div>

        {/* Minimal poetic typographic sequence */}
        <h2 className="font-display font-medium text-2xl sm:text-4xl lg:text-5xl text-jaggery leading-snug tracking-tight mb-8">
          <span className="text-jaggery font-bold">Something crunchy.</span>{' '}
          <span className="text-chilli font-bold">Something sweet.</span>{' '}
          <span className="text-leaf font-bold">Something pickled.</span>
        </h2>

        {/* Subtle Kannada echo & category hint */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-kannada font-medium text-jaggery-muted/90 mb-10">
          <span className="px-3 py-1 rounded bg-cream border border-jaggery/10">
            ಗರಿಗರಿ ಖಾರ
          </span>
          <span className="text-jaggery-muted/40">✦</span>
          <span className="px-3 py-1 rounded bg-cream border border-jaggery/10">
            ಪಾರಂಪರಿಕ ಸಿಹಿ
          </span>
          <span className="text-jaggery-muted/40">✦</span>
          <span className="px-3 py-1 rounded bg-cream border border-jaggery/10">
            ಮನೆ ಉಪ್ಪಿನಕಾಯಿ
          </span>
        </div>

        <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-jaggery-muted font-medium mb-4">
          A timeless Karnataka pantry · Hassan Kitchens
        </p>

        {/* Quiet scroll invite */}
        <div className="inline-flex flex-col items-center gap-1.5 text-jaggery-subtle">
          <span className="text-[11px] font-sans tracking-widest uppercase">
            Product collections arriving soon
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce opacity-60 text-chilli" />
        </div>
      </div>
    </section>
  );
};

