'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { getAllShopProducts } from '@/data/products';
import { Product } from '@/types/product';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const allProducts = getAllShopProducts();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small timeout to allow render before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const filteredProducts: Product[] = trimmed
    ? allProducts.filter((product) => {
        return (
          product.name.toLowerCase().includes(trimmed) ||
          product.kannadaName.toLowerCase().includes(trimmed) ||
          product.shortDescription.toLowerCase().includes(trimmed) ||
          product.categoryLabel.toLowerCase().includes(trimmed) ||
          Boolean(product.keywords?.some((k) => k.toLowerCase().includes(trimmed)))
        );
      })
    : [];

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleViewAllInShop = () => {
    onClose();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/shop');
    }
  };

  const popularTags = ['Chakkali', 'Kodubale', 'Nippattu', 'Obbattu', 'Uppinakai', 'Sandige'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search THINDI Pantry"
      className="fixed inset-0 z-50 overflow-y-auto bg-jaggery/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex items-start justify-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-cream border border-jaggery/20 rounded-xl shadow-2xl overflow-hidden mt-8 sm:mt-16 text-jaggery"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-jaggery/15 px-4 py-3 sm:py-4 bg-cream-light">
          <Search className="w-5 h-5 text-jaggery-muted shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleViewAllInShop();
              }
            }}
            placeholder="Search snacks, ingredients, cravings (e.g. Chakkali, Obbattu)..."
            className="w-full bg-transparent font-sans text-base sm:text-lg text-jaggery placeholder:text-jaggery-muted/60 focus:outline-none"
            aria-label="Search THINDI products"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-jaggery-muted hover:text-jaggery rounded"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-jaggery-muted hover:text-jaggery rounded"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results / Default Quick Links */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {trimmed ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-sans font-bold text-jaggery-muted">
                  Matching Products ({filteredProducts.length})
                </span>
                <button
                  type="button"
                  onClick={handleViewAllInShop}
                  className="text-xs font-sans font-semibold text-chilli hover:underline inline-flex items-center gap-1"
                >
                  <span>View in catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-10 text-center text-jaggery-muted">
                  <p className="font-display font-medium text-lg text-jaggery mb-1">
                    No matching snacks found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs font-sans max-w-sm mx-auto mb-4">
                    Try searching for classic Karnataka items like Chakkali, Kodubale, Nippattu, or Obbattu.
                  </p>
                  <button
                    type="button"
                    onClick={handleViewAllInShop}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-chilli text-cream text-xs font-semibold hover:bg-chilli-hover transition-colors"
                  >
                    <span>Browse All Products in Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => {
                    const lowestPrice = Math.min(...product.variants.map((v) => v.price));
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product.slug)}
                        className="w-full flex items-center gap-3.5 p-3 rounded-lg border border-jaggery/10 bg-warm-white hover:bg-cream-dark/50 hover:border-jaggery/25 text-left transition-all group"
                      >
                        <div className="relative w-14 h-14 rounded-md overflow-hidden bg-cream-dark shrink-0 border border-jaggery/10">
                          <Image
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            fill
                            sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display font-bold text-sm text-jaggery truncate group-hover:text-chilli transition-colors">
                              {product.name}
                            </span>
                            <span className="font-kannada text-xs text-chilli/90 shrink-0 font-medium">
                              {product.kannadaName}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-jaggery-muted truncate mt-0.5">
                            {product.shortDescription}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] uppercase font-sans text-jaggery-subtle block">
                            From
                          </span>
                          <span className="font-mono font-bold text-sm text-jaggery">
                            ₹{lowestPrice}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-xs uppercase tracking-wider font-sans font-bold text-jaggery-muted mb-3">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-cream-dark/70 hover:bg-turmeric/30 border border-jaggery/15 text-xs font-sans font-medium text-jaggery transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="text-xs uppercase tracking-wider font-sans font-bold text-jaggery-muted mb-3">
                Explore Categories
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: 'Savouries', kannada: 'ಖಾರ ತಿಂಡಿ', href: '/collections/kuruk-thindi' },
                  { label: 'Sweets', kannada: 'ಸಿಹಿ ತಿಂಡಿ', href: '/collections/sihi-thindi' },
                  { label: 'Pickles', kannada: 'ಉಪ್ಪಿನಕಾಯಿ', href: '/collections/uppinakai' },
                  { label: 'Crisps & Fryums', kannada: 'ಸಂಡಿಗೆ', href: '/collections/appala-sandige' },
                ].map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={onClose}
                    className="p-2.5 rounded-lg border border-jaggery/10 bg-warm-white hover:border-chilli/40 transition-colors text-center block"
                  >
                    <div className="font-display font-bold text-xs text-jaggery">{cat.label}</div>
                    <div className="font-kannada text-[11px] text-chilli mt-0.5">{cat.kannada}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-cream-dark/40 border-t border-jaggery/10 flex items-center justify-between text-[11px] font-sans text-jaggery-muted">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cream border border-jaggery/15 font-mono text-[10px]">
              ESC
            </span>
            <span className="hidden sm:inline">to close</span>
          </div>

          <button
            type="button"
            onClick={handleViewAllInShop}
            className="font-semibold text-chilli hover:underline inline-flex items-center gap-1 ml-auto"
          >
            <span>View All Products in Shop</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
