import React from 'react';
import { ChakkaliMotif } from '@/components/brand/ChakkaliMotif';

export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-cream flex flex-col items-center justify-center p-8 text-jaggery">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <ChakkaliMotif className="w-12 h-12 text-chilli animate-spin-slow opacity-80" />
      </div>
      <p className="mt-4 font-serif text-base font-bold text-jaggery tracking-wide">
        THINDI <span className="font-kannada font-normal text-sm text-chilli">ತಿಂಡಿ</span>
      </p>
      <p className="text-[11px] font-mono text-jaggery/60 mt-0.5">
        Loading traditional flavours...
      </p>
    </div>
  );
}

