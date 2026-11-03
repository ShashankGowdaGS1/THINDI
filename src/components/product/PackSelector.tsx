'use client';

import React from 'react';
import { ProductVariant } from '@/types/product';

interface PackSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
  size?: 'sm' | 'md';
}

export const PackSelector: React.FC<PackSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  size = 'md',
}) => {
  return (
    <div className="flex flex-col gap-1.5" role="group" aria-label="Select Pack Size">
      <div className="flex items-center justify-between text-xs font-sans text-jaggery-muted">
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Select Pack Size:
        </span>
        <span className="font-mono font-medium text-jaggery">
          ₹{selectedVariant.price}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = v.id === selectedVariant.id;
          const isAvailable = v.available;

          return (
            <button
              key={v.id}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectVariant(v)}
              aria-pressed={isSelected}
              className={`relative font-sans text-xs font-semibold rounded-sm transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli cursor-pointer ${
                size === 'sm' ? 'px-2.5 py-1.5' : 'px-3 py-2'
              } ${
                isSelected
                  ? 'bg-jaggery text-cream border border-jaggery shadow-sm'
                  : 'bg-cream text-jaggery/85 border border-jaggery/20 hover:border-jaggery hover:bg-cream-dark'
              } ${!isAvailable ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
            >
              <span>{v.weight}</span>
              {v.isPopular && !isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-chilli" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

