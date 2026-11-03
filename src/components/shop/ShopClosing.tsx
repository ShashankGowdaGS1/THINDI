'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Home } from 'lucide-react';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const ShopClosing: React.FC = () => {
  return (
    <section
      aria-label="Shop Closing Suggestions"
      className="py-16 sm:py-20 bg-warm-white border-t border-jaggery/10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-turmeric/20 text-jaggery mb-4">
          <Gift className="w-6 h-6 text-chilli" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery mb-3">
          Still craving something?
        </h2>

        <p className="font-kannada text-base text-jaggery/60 font-medium mb-3">
          ವಿಶೇಷ ಹಬ್ಬದ ಬಾಕ್ಸ್‌ಗಳು ಬೇಕೇ?
        </p>

        <p className="font-sans text-sm sm:text-base text-jaggery/75 max-w-lg mx-auto leading-relaxed mb-8">
          Looking for custom gift boxes, corporate orders, or family festive bundles? Explore curated assortments packed in brass-embossed celebration boxes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button
            href="/#thindi-box"
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore THINDI Boxes
          </Button>

          <Button
            href="/"
            variant="outline"
            size="md"
            icon={<Home className="w-4 h-4" />}
            iconPosition="left"
          >
            Back to Homepage
          </Button>
        </div>
      </div>
    </section>
  );
};

