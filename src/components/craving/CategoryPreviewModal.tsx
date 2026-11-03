'use client';

import React, { useEffect } from 'react';
import { X, Check, MapPin, Sparkles } from 'lucide-react';
import { CravingCategory } from '@/data/categories';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

interface CategoryPreviewModalProps {
  category: CravingCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryPreviewModal: React.FC<CategoryPreviewModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-jaggery/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-cream-light border border-jaggery/20 rounded-md p-6 sm:p-8 shadow-2xl text-jaggery"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-jaggery-muted hover:text-jaggery transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-chilli tracking-wider">
            {category.number}
          </span>
          <span className="text-jaggery-muted/40">/</span>
          <span className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-jaggery-muted">
            {category.badge}
          </span>
          <span className="font-kannada text-xs font-medium text-chilli ml-auto">
            {category.kannadaBadge}
          </span>
        </div>

        {/* Main Title */}
        <div className="flex items-baseline gap-3 mb-2">
          <h3
            id="category-modal-title"
            className="text-2xl sm:text-3xl font-display font-black text-jaggery tracking-tight"
          >
            {category.title}
          </h3>
          <span className="font-kannada text-xl font-bold text-chilli">
            {category.kannadaTitle}
          </span>
        </div>

        <p className="font-sans text-sm sm:text-base text-jaggery-muted mb-6">
          {category.description}
        </p>

        {/* Featured Varieties List */}
        <div className="bg-cream rounded border border-jaggery/15 p-4 mb-6">
          <div className="text-[10px] uppercase tracking-widest font-sans font-bold text-jaggery-muted mb-2.5">
            Traditional Varieties in this Collection:
          </div>
          <ul className="space-y-2">
            {category.items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2.5 text-sm font-sans font-medium text-jaggery"
              >
                <span className="w-4 h-4 rounded-full bg-turmeric/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-jaggery" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hassan Kitchens Heritage Notice */}
        <div className="bg-cream-dark/60 p-3.5 rounded border border-jaggery/10 flex items-start gap-2.5 mb-6 text-xs text-jaggery-muted leading-relaxed">
          <MapPin className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
          <span>
            Handcrafted in Hassan, Karnataka with stone-ground flours and time-tested recipes. Explore all authentic savouries in this collection.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs font-sans text-jaggery-muted">
            <ChakkaliMotif size={22} color="#2D241E" accentColor="#A43D2E" />
            <span>Hassan Small Batch</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              href={`/collections/${category.id}`}
              onClick={onClose}
            >
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

