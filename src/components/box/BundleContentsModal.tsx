'use client';

import React, { useEffect } from 'react';
import { X, PackageCheck, AlertCircle, ShoppingBag, Check } from 'lucide-react';
import { ThindiBundle } from '@/types/bundle';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

interface BundleContentsModalProps {
  bundle: ThindiBundle | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (bundle: ThindiBundle) => void;
  isAdded?: boolean;
}

export const BundleContentsModal: React.FC<BundleContentsModalProps> = ({
  bundle,
  isOpen,
  onClose,
  onAddToCart,
  isAdded = false,
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

  if (!isOpen || !bundle) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bundle-contents-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-jaggery/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-cream-light border border-jaggery/20 rounded-md p-6 sm:p-8 shadow-2xl text-jaggery"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-jaggery-muted hover:text-jaggery transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli"
          aria-label="Close contents window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-chilli">
            THE THINDI BOX · CURATED BUNDLE
          </span>
          <span className="text-jaggery-muted/30">/</span>
          <span className="font-mono text-xs text-jaggery-muted font-semibold">
            {bundle.sku}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-baseline gap-3 mb-2">
          <h3
            id="bundle-contents-title"
            className="font-display font-black text-2xl sm:text-3xl text-jaggery tracking-tight"
          >
            {bundle.name}
          </h3>
          <span className="font-kannada text-lg font-bold text-chilli">
            {bundle.kannadaName}
          </span>
        </div>

        <p className="font-sans text-xs sm:text-sm text-jaggery-muted leading-relaxed mb-6">
          {bundle.fullDescription}
        </p>

        {/* Itemized Contents Table */}
        <div className="mb-6 bg-cream rounded-md border border-jaggery/15 overflow-hidden">
          <div className="bg-cream-dark/60 px-4 py-2.5 border-b border-jaggery/10 flex items-center justify-between text-xs font-sans font-bold text-jaggery">
            <span>Pack Items ({bundle.itemCount} units)</span>
            <span className="text-chilli font-mono">{bundle.totalWeight}</span>
          </div>

          <div className="divide-y divide-jaggery/10">
            {bundle.contents.map((item, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-display font-bold text-sm text-jaggery">
                      {item.name}
                    </span>
                    <span className="font-kannada text-xs font-semibold text-jaggery-muted">
                      {item.kannadaName}
                    </span>
                  </div>
                  {item.description && (
                    <p className="font-sans text-xs text-jaggery-muted leading-snug">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block font-sans text-xs font-semibold text-jaggery bg-cream-dark px-2 py-0.5 rounded border border-jaggery/10">
                    {item.quantity} × {item.weight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allergens & Freshness Assurance */}
        <div className="mb-6 p-3.5 bg-turmeric/10 rounded border border-turmeric/25 flex items-start gap-2.5 text-xs text-jaggery leading-relaxed">
          <AlertCircle className="w-4 h-4 text-jaggery-muted shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Allergen Information:</strong>
            <span>{bundle.allergens}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-jaggery/10">
          <div>
            <span className="text-[10px] uppercase font-sans tracking-widest font-semibold text-jaggery-muted block">
              Demo Price
            </span>
            <div className="font-display font-black text-2xl text-jaggery">
              ₹{bundle.price}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={
                isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />
              }
              onClick={() => onAddToCart(bundle)}
              className={isAdded ? 'bg-leaf hover:bg-leaf' : ''}
            >
              {isAdded ? 'Added to Basket ✓' : 'Add Box to Basket'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

