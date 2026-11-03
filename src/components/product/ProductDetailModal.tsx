'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Check, MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { PackSelector } from './PackSelector';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addItem, openCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      const initial = product.variants.find((v) => v.isPopular) || product.variants[0];
      setSelectedVariant(initial);
    }
  }, [product]);

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

  if (!isOpen || !product || !selectedVariant) return null;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-jaggery/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream-light border border-jaggery/20 rounded-md p-6 sm:p-8 shadow-2xl text-jaggery"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-jaggery-muted hover:text-jaggery transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Product Image */}
          <div className="relative aspect-square rounded-md overflow-hidden border border-jaggery/15 bg-cream-dark">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 350px"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-sans tracking-[0.2em] font-bold text-chilli">
                {product.categoryLabel}
              </span>
              <span className="text-jaggery-muted/40">·</span>
              <span className="font-kannada text-xs font-semibold text-jaggery-muted">
                {product.kannadaName}
              </span>
            </div>

            <h3
              id="product-detail-modal-title"
              className="font-display font-black text-2xl sm:text-3xl text-jaggery tracking-tight mb-2 leading-tight"
            >
              {product.name}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-jaggery-muted leading-relaxed mb-4">
              {product.fullDescription}
            </p>

            {/* Ingredients */}
            <div className="mb-5 bg-cream p-3.5 rounded border border-jaggery/10">
              <div className="text-[10px] uppercase font-sans tracking-widest font-bold text-jaggery-muted mb-2">
                Ingredients:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-sans font-medium text-jaggery bg-cream-dark/60 px-2 py-0.5 rounded"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Pack Selector */}
            <div className="mb-6">
              <PackSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1 justify-center"
                onClick={handleAddToCart}
                disabled={!selectedVariant.available}
              >
                {added ? 'Added to Basket ✓' : `Add to Basket — ₹${selectedVariant.price}`}
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  onClose();
                  openCart();
                }}
              >
                View Basket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

