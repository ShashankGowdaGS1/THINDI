'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { SIGNATURE_PRODUCTS } from '@/data/products';
import { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { PackSelector } from './PackSelector';
import { ProductDetailModal } from './ProductDetailModal';
import { Button } from '../brand/Button';

export const SignaturePicksSection: React.FC = () => {
  const { addItem, openCart } = useCart();
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Maintain selected variant per product
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>(() => {
    const initial: Record<string, ProductVariant> = {};
    SIGNATURE_PRODUCTS.forEach((prod) => {
      initial[prod.id] = prod.variants.find((v) => v.isPopular) || prod.variants[0];
    });
    return initial;
  });

  // Track "Added ✓" state per product
  const [addedStates, setAddedStates] = useState<Record<string, boolean>>({});

  const handleSelectVariant = (productId: string, variant: ProductVariant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const handleAddToCart = (product: Product) => {
    const variant = selectedVariants[product.id] || product.variants[0];
    addItem(product, variant, 1);
    setAddedStates((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedStates((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const chakkali = SIGNATURE_PRODUCTS[0];
  const remainingProducts = SIGNATURE_PRODUCTS.slice(1);

  return (
    <>
      <section
        id="signature-picks"
        className="relative bg-cream-light pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 border-b border-jaggery/10 overflow-hidden"
        aria-label="Signature Products"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========================================================
              SECTION HEADER
              Eyebrow, Headline, Kannada Accent, Supporting Copy
              ======================================================== */}
          <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-6 h-[1.5px] bg-chilli" />
              <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-jaggery-muted">
                MADE FOR EVERY CRAVING
              </span>
              <span className="text-xs font-kannada font-semibold text-chilli">
                · ನಮ್ಮ ತಿಂಡಿ
              </span>
            </div>

            {/* Main Heading */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-5">
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-jaggery tracking-[-0.03em] leading-[1.05]">
                The THINDI Picks.
              </h2>
              <span className="font-kannada text-2xl sm:text-3xl lg:text-4xl font-bold text-chilli tracking-wide">
                ನಮ್ಮ ಜನಪ್ರಿಯ ತಿಂಡಿಗಳು
              </span>
            </div>

            {/* Supporting Copy */}
            <p className="font-sans text-base sm:text-lg lg:text-xl text-jaggery-muted leading-relaxed max-w-2xl text-pretty">
              Crunchy, spicy, and impossible to stop at just one. Discover the flavours
              that make every snack break special.
            </p>
          </div>

          {/* ========================================================
              DESKTOP ASYMMETRIC MERCHANDISE LAYOUT (Hidden on mobile < 1024px)
              Left: Large Featured Chakkali (Spacious hero card, 6 cols)
              Right: 3 Balanced Editorial Items (Stacked list/cards, 6 cols)
              ======================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12 items-stretch mb-20">
            {/* LEFT: Large Chakkali Featured Product */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="h-full rounded-md border border-jaggery/15 bg-cream p-7 xl:p-9 flex flex-col justify-between shadow-[0_12px_36px_-10px_rgba(45,36,30,0.08)]">
                {/* Large Chakkali Image */}
                <div
                  className="group relative aspect-[4/3] rounded overflow-hidden border border-jaggery/10 bg-cream-dark mb-6 cursor-pointer"
                  onClick={() => setDetailProduct(chakkali)}
                >
                  <Image
                    src={chakkali.imageSrc}
                    alt={chakkali.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1280px) 50vw, 600px"
                    className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Subtle origin tag */}
                  <div className="absolute top-4 left-4 bg-cream/95 backdrop-blur-sm px-3 py-1 rounded-sm border border-jaggery/15 text-[10px] uppercase font-sans font-bold tracking-wider text-jaggery">
                    Signature Origin · Hassan
                  </div>
                  {/* Quick view button */}
                  <div className="absolute bottom-4 right-4 bg-cream/90 backdrop-blur-sm p-2 rounded-full border border-jaggery/15 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-jaggery" />
                  </div>
                </div>

                {/* Chakkali Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="font-display font-black text-2xl xl:text-3xl text-jaggery tracking-tight">
                        {chakkali.name}
                      </h3>
                      <span className="font-kannada text-xl font-bold text-chilli shrink-0">
                        {chakkali.kannadaName}
                      </span>
                    </div>

                    <p className="font-sans text-sm text-jaggery-muted leading-relaxed mb-6">
                      {chakkali.shortDescription}
                    </p>

                    {/* Pack Selector */}
                    <div className="mb-6">
                      <PackSelector
                        variants={chakkali.variants}
                        selectedVariant={
                          selectedVariants[chakkali.id] || chakkali.variants[0]
                        }
                        onSelectVariant={(v) => handleSelectVariant(chakkali.id, v)}
                      />
                    </div>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="pt-4 border-t border-jaggery/10 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-sans tracking-widest font-semibold text-jaggery-muted block">
                        Price
                      </span>
                      <div className="font-display font-black text-2xl text-jaggery">
                        ₹{selectedVariants[chakkali.id]?.price || chakkali.variants[0].price}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setDetailProduct(chakkali)}
                        className="font-sans text-xs font-semibold text-jaggery hover:text-chilli underline underline-offset-4 decoration-jaggery/30 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli rounded"
                      >
                        View Details
                      </button>

                      <Button
                        variant="primary"
                        size="md"
                        icon={
                          addedStates[chakkali.id] ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )
                        }
                        onClick={() => handleAddToCart(chakkali)}
                        className={addedStates[chakkali.id] ? 'bg-leaf hover:bg-leaf' : ''}
                      >
                        {addedStates[chakkali.id] ? 'Added ✓' : 'Add to Basket'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Three Products (Kodubale, Nippattu, Mango Uppinakai) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              {remainingProducts.map((product) => {
                const currentVariant =
                  selectedVariants[product.id] || product.variants[0];
                const isAdded = addedStates[product.id];

                return (
                  <div
                    key={product.id}
                    className="rounded-md border border-jaggery/15 bg-cream p-5 xl:p-6 flex flex-col sm:flex-row gap-5 items-center shadow-[0_4px_20px_-4px_rgba(45,36,30,0.06)] hover:border-jaggery/35 transition-colors"
                  >
                    {/* Thumbnail Image */}
                    <div
                      className="group relative w-full sm:w-40 sm:h-40 aspect-square sm:aspect-auto shrink-0 rounded overflow-hidden border border-jaggery/10 bg-cream-dark cursor-pointer"
                      onClick={() => setDetailProduct(product)}
                    >
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 1280px) 20vw, 200px"
                        className="object-cover transform transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-cream/90 backdrop-blur-sm p-1.5 rounded-full border border-jaggery/15 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3.5 h-3.5 text-jaggery" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <h3 className="font-display font-bold text-lg xl:text-xl text-jaggery truncate">
                            {product.name}
                          </h3>
                          <span className="font-kannada text-base font-bold text-chilli shrink-0">
                            {product.kannadaName}
                          </span>
                        </div>

                        <p className="font-sans text-xs text-jaggery-muted line-clamp-2 mb-3">
                          {product.shortDescription}
                        </p>

                        {/* Pack Selector */}
                        <div className="mb-3.5">
                          <PackSelector
                            size="sm"
                            variants={product.variants}
                            selectedVariant={currentVariant}
                            onSelectVariant={(v) => handleSelectVariant(product.id, v)}
                          />
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-jaggery/10">
                        <div className="font-display font-black text-xl text-jaggery">
                          ₹{currentVariant.price}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDetailProduct(product)}
                            className="font-sans text-xs text-jaggery-muted hover:text-jaggery underline decoration-jaggery/20 p-1"
                          >
                            Details
                          </button>

                          <Button
                            variant="primary"
                            size="sm"
                            icon={
                              isAdded ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <ShoppingBag className="w-3.5 h-3.5" />
                              )
                            }
                            onClick={() => handleAddToCart(product)}
                            className={isAdded ? 'bg-leaf hover:bg-leaf' : ''}
                          >
                            {isAdded ? 'Added ✓' : 'Add'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              MOBILE RESPONSIVE MERCHANDISE FLOW (< 1024px)
              1. Large Chakkali featured card
              2. Clean, well-spaced vertical stack for remaining items
              Large touch targets, no horizontal overflow
              ======================================================== */}
          <div className="lg:hidden flex flex-col space-y-6 mb-16">
            {/* 1. Featured Chakkali Mobile Card */}
            <div className="rounded-md border border-jaggery/15 bg-cream p-5 shadow-sm">
              <div
                className="relative aspect-[4/3] rounded overflow-hidden border border-jaggery/10 bg-cream-dark mb-4 cursor-pointer"
                onClick={() => setDetailProduct(chakkali)}
              >
                <Image
                  src={chakkali.imageSrc}
                  alt={chakkali.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-cream/95 px-2.5 py-0.5 rounded text-[10px] uppercase font-sans font-bold tracking-wider text-jaggery">
                  Hassan Signature
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="font-display font-bold text-xl text-jaggery">
                  {chakkali.name}
                </h3>
                <span className="font-kannada text-lg font-bold text-chilli">
                  {chakkali.kannadaName}
                </span>
              </div>

              <p className="font-sans text-xs text-jaggery-muted leading-relaxed mb-4">
                {chakkali.shortDescription}
              </p>

              <div className="mb-4">
                <PackSelector
                  variants={chakkali.variants}
                  selectedVariant={
                    selectedVariants[chakkali.id] || chakkali.variants[0]
                  }
                  onSelectVariant={(v) => handleSelectVariant(chakkali.id, v)}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-jaggery/10">
                <div className="font-display font-black text-2xl text-jaggery">
                  ₹{selectedVariants[chakkali.id]?.price || chakkali.variants[0].price}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailProduct(chakkali)}
                    className="font-sans text-xs font-semibold text-jaggery-muted hover:text-jaggery underline p-2"
                  >
                    Details
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={
                      addedStates[chakkali.id] ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )
                    }
                    onClick={() => handleAddToCart(chakkali)}
                    className={addedStates[chakkali.id] ? 'bg-leaf hover:bg-leaf' : ''}
                  >
                    {addedStates[chakkali.id] ? 'Added ✓' : 'Add to Basket'}
                  </Button>
                </div>
              </div>
            </div>

            {/* 2. Remaining 3 Products Mobile Cards */}
            {remainingProducts.map((product) => {
              const currentVariant =
                selectedVariants[product.id] || product.variants[0];
              const isAdded = addedStates[product.id];

              return (
                <div
                  key={product.id}
                  className="rounded-md border border-jaggery/15 bg-cream p-4 sm:p-5 shadow-sm"
                >
                  <div className="flex gap-4 items-start mb-3">
                    <div
                      className="relative w-24 h-24 shrink-0 rounded overflow-hidden border border-jaggery/10 bg-cream-dark cursor-pointer"
                      onClick={() => setDetailProduct(product)}
                    >
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base text-jaggery truncate mb-0.5">
                        {product.name}
                      </h3>
                      <span className="font-kannada text-sm font-semibold text-chilli block mb-1">
                        {product.kannadaName}
                      </span>
                      <p className="font-sans text-xs text-jaggery-muted line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <PackSelector
                      size="sm"
                      variants={product.variants}
                      selectedVariant={currentVariant}
                      onSelectVariant={(v) => handleSelectVariant(product.id, v)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-jaggery/10">
                    <div className="font-display font-black text-xl text-jaggery">
                      ₹{currentVariant.price}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDetailProduct(product)}
                        className="font-sans text-xs text-jaggery-muted hover:text-jaggery underline p-1.5"
                      >
                        Details
                      </button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={
                          isAdded ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <ShoppingBag className="w-3.5 h-3.5" />
                          )
                        }
                        onClick={() => handleAddToCart(product)}
                        className={isAdded ? 'bg-leaf hover:bg-leaf' : ''}
                      >
                        {isAdded ? 'Added ✓' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
      />
    </>
  );
};

