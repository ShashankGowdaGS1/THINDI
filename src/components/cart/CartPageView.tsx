'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

export const CartPageView: React.FC = () => {
  const { items, subtotal, totalCount, incrementItem, decrementItem, removeItem } = useCart();

  const FREE_SHIPPING_THRESHOLD = 499;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const estimatedShipping = subtotal > 0 ? (isFreeShipping ? 0 : 49) : 0;
  const estimatedTotal = subtotal + estimatedShipping;

  if (items.length === 0) {
    return (
      <div className="py-20 sm:py-28 max-w-xl mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-warm-white border border-jaggery/15 flex items-center justify-center mx-auto mb-6 text-jaggery/40 shadow-sm">
          <ChakkaliMotif size={48} color="#2D241E" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery mb-3">
          Your snack box is feeling a little empty.
        </h1>

        <p className="font-kannada text-lg text-jaggery/60 font-medium mb-3">
          ಬಾಕ್ಸ್ ಖಾಲಿಯಾಗಿದೆ!
        </p>

        <p className="font-sans text-base text-jaggery/75 max-w-md mx-auto leading-relaxed mb-8">
          Good thindi is just a few clicks away. Fresh chakkali, crisp kodubale, and authentic Karnataka savouries handcrafted in Hassan.
        </p>

        <Button
          href="/shop"
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Explore THINDI
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 pb-4 border-b border-jaggery/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery">
              Your Snack Box
            </h1>
            <p className="font-kannada text-sm text-jaggery/60 mt-0.5">
              ನಿಮ್ಮ ತಿಂಡಿ ಬುಟ್ಟಿ ({totalCount} {totalCount === 1 ? 'ಪ್ಯಾಕ್' : 'ಪ್ಯಾಕ್‌ಗಳು'})
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-leaf hover:text-chilli transition-colors"
          >
            ← Continue exploring snacks
          </Link>
        </div>

        {/* Delivery Transparency Notice */}
        <div className="mb-8 p-4 rounded-xl bg-warm-white border border-jaggery/15 flex items-center gap-3 text-xs sm:text-sm">
          <Truck className="w-5 h-5 text-leaf shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-jaggery">
              Doorstep Delivery:
            </span>{' '}
            <span className="text-jaggery/80">
              Shipping calculated after delivery details are confirmed.
            </span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ========================================================
              LEFT COLUMN: Cart Items Table / List (~65%)
              ======================================================== */}
          <div className="lg:col-span-8 space-y-4">
            <div className="border border-jaggery/15 rounded-xl bg-warm-white divide-y divide-jaggery/10 overflow-hidden shadow-sm">
              {items.map((item) => {
                const lineTotal = item.variant.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Thumbnail & Titles */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-cream shrink-0 border border-jaggery/10">
                        <Image
                          src={item.product.imageSrc}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover object-center"
                        />
                      </div>

                      <div>
                        <h2 className="font-serif text-base sm:text-lg font-bold text-jaggery">
                          {item.product.name}
                        </h2>
                        {item.product.kannadaName && (
                          <span className="font-kannada text-xs text-jaggery/55 block">
                            {item.product.kannadaName}
                          </span>
                        )}
                        <div className="inline-flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-jaggery/5 text-jaggery">
                            {item.variant.weight}
                          </span>
                          <span className="text-xs text-jaggery/60">
                            ₹{item.variant.price} / pack
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-jaggery/5">
                      <div className="inline-flex items-center border border-jaggery/20 rounded bg-cream px-2 py-1">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.id)}
                          aria-label={`Decrease ${item.product.name} quantity`}
                          className="w-7 h-7 flex items-center justify-center text-jaggery hover:bg-jaggery/10 rounded transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-sm font-bold text-jaggery px-2.5">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.id)}
                          aria-label={`Increase ${item.product.name} quantity`}
                          className="w-7 h-7 flex items-center justify-center text-jaggery hover:bg-jaggery/10 rounded transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="font-serif text-lg font-bold text-jaggery block">
                          ₹{lineTotal}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        className="p-2 text-jaggery/40 hover:text-chilli transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Summary & Proceed to Checkout (~35%)
              ======================================================== */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-jaggery pb-3 border-b border-jaggery/10">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm font-sans">
                <div className="flex items-center justify-between text-jaggery/80">
                  <span>Snack Subtotal ({totalCount} items)</span>
                  <span className="font-mono font-medium">₹{subtotal}</span>
                </div>

                <div className="flex items-start justify-between text-jaggery/80 gap-2">
                  <span>Delivery</span>
                  <span className="text-xs text-jaggery-muted italic text-right">
                    Calculated after delivery details are confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between text-jaggery/60 text-xs">
                  <span>Taxes</span>
                  <span>Included in prices</span>
                </div>
              </div>

              <div className="pt-3 border-t border-jaggery/10 flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-lg font-bold text-jaggery block">
                    Subtotal
                  </span>
                  <span className="text-[11px] text-jaggery/50 font-sans">
                    Shipping verified at checkout
                  </span>
                </div>
                <span className="font-serif text-2xl font-bold text-jaggery">
                  ₹{subtotal}
                </span>
              </div>

              <div className="pt-3 space-y-2.5">
                <Button
                  href="/checkout"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-[11px] text-center text-jaggery/55">
                  Safe & Secure Indian Checkout Powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

