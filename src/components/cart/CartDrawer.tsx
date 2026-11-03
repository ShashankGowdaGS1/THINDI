'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    incrementItem,
    decrementItem,
    removeItem,
    subtotal,
    totalCount,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
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
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-jaggery/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeCart}
    >
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          className="w-screen max-w-md bg-cream-light border-l border-jaggery/15 shadow-2xl flex flex-col text-jaggery"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-jaggery/10 flex items-center justify-between bg-cream">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cream-dark rounded border border-jaggery/10">
                <ShoppingBag className="w-5 h-5 text-chilli" />
              </div>
              <div>
                <h2
                  id="cart-drawer-title"
                  className="font-display font-bold text-xl text-jaggery leading-tight"
                >
                  Your Snack Basket
                </h2>
                <span className="font-kannada text-xs font-semibold text-chilli">
                  ನಿಮ್ಮ ತಿಂಡಿ ಬುಟ್ಟಿ ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-jaggery-muted hover:text-jaggery transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli"
              aria-label="Close basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-jaggery-muted">
                <div className="p-4 bg-cream rounded-full border border-jaggery/15 mb-4 opacity-75">
                  <ChakkaliMotif size={48} color="#5C4E43" accentColor="#A43D2E" />
                </div>
                <h3 className="font-display font-bold text-lg text-jaggery mb-1">
                  Your basket is currently empty
                </h3>
                <p className="font-sans text-xs text-jaggery-muted max-w-xs mb-6">
                  Add freshly roasted Hassan chakkali, kodubale, or spiced pickles to start your selection.
                </p>
                <Button variant="outline" size="sm" href="/shop" onClick={closeCart}>
                  Browse Signature Picks
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-cream rounded-md border border-jaggery/15 flex gap-3.5 items-start"
                >
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded overflow-hidden border border-jaggery/10 bg-cream-dark">
                    <Image
                      src={item.product.imageSrc}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Info & Quantity controls */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-display font-bold text-sm text-jaggery truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-jaggery-muted/60 hover:text-chilli p-1 transition-colors"
                        aria-label={`Remove ${item.product.name} from basket`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-sans text-xs font-semibold text-chilli bg-chilli/10 px-1.5 py-0.5 rounded">
                        {item.variant.weight}
                      </span>
                      <span className="font-sans text-xs text-jaggery-muted">
                        ₹{item.variant.price} each
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-jaggery/20 rounded bg-cream-light">
                        <button
                          onClick={() => decrementItem(item.id)}
                          className="p-1.5 hover:bg-cream-dark text-jaggery transition-colors rounded-l"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-semibold px-2.5 text-jaggery select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="p-1.5 hover:bg-cream-dark text-jaggery transition-colors rounded-r"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this item */}
                      <div className="font-mono font-bold text-sm text-jaggery">
                        ₹{item.variant.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Notice */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-jaggery/10 bg-cream space-y-4 pb-[max(1.25rem,calc(1.25rem+env(safe-area-inset-bottom,0px)))]">
              {/* Subtotal */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-sans text-xs uppercase tracking-wider font-semibold text-jaggery-muted block">
                    Subtotal
                  </span>
                </div>
                <div className="font-display font-black text-2xl text-jaggery">
                  ₹{subtotal}
                </div>
              </div>

              {/* Delivery info badge */}
              <div className="p-3 bg-cream-dark/60 rounded border border-jaggery/15 text-xs text-jaggery leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
                <span>
                  Shipping calculated after delivery details are confirmed at checkout.
                </span>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </Button>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center font-sans text-xs font-semibold text-jaggery-muted hover:text-chilli py-1 transition-colors"
                >
                  View Full Cart & Quantity Breakdown →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

