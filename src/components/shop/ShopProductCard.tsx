'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, Eye, MapPin } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { PackSelector } from '../product/PackSelector';
import { Button } from '../brand/Button';

interface ShopProductCardProps {
  product: Product;
  onInspectDetails: (product: Product) => void;
}

export const ShopProductCard: React.FC<ShopProductCardProps> = ({
  product,
  onInspectDetails,
}) => {
  const { addItem } = useCart();

  // Initialize with popular variant or first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    return product.variants.find((v) => v.isPopular) || product.variants[0];
  });

  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageSrc);

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.available) return;
    addItem(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  const isAvailable = product.inStock !== false && selectedVariant.available;

  return (
    <article
      className="group relative flex flex-col justify-between bg-warm-white rounded-xl border border-jaggery/15 hover:border-jaggery/35 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      aria-labelledby={`product-heading-${product.id}`}
    >
      {/* ========================================================
          IMAGE CONTAINER & HOVER ACCENTS
          ======================================================== */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full bg-cream overflow-hidden block"
      >
        <Image
          src={imgSrc}
          alt={product.imageAlt || product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc('/images/categories/kuruk-thindi.jpg')}
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cream/90 backdrop-blur-sm border border-jaggery/10 text-[11px] font-sans font-semibold tracking-wider uppercase text-jaggery">
          {product.categoryLabel}
        </div>

        {/* Quick View Trigger on Image Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInspectDetails(product);
          }}
          aria-label={`Inspect ingredients and details for ${product.name}`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 hover:bg-cream text-jaggery flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm cursor-pointer z-10"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Subtle Bottom Shade */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-jaggery/20 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </Link>

      {/* ========================================================
          CARD BODY: Titles, Origin & Description
          ======================================================== */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Origin & In-Stock Status */}
          <div className="flex items-center justify-between gap-2 text-xs text-jaggery/60 mb-2">
            <span className="inline-flex items-center gap-1 font-sans">
              <MapPin className="w-3 h-3 text-leaf" />
              {product.origin}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-leaf">
              <span className="w-1.5 h-1.5 rounded-full bg-leaf" />
              Fresh batch
            </span>
          </div>

          {/* Title & Kannada Name */}
          <Link href={`/products/${product.slug}`} className="block group/title">
            <h2
              id={`product-heading-${product.id}`}
              className="font-serif text-lg sm:text-xl font-bold text-jaggery leading-snug group-hover/title:text-chilli transition-colors"
            >
              {product.name}
            </h2>
          </Link>

          <p className="font-kannada text-xs sm:text-sm text-jaggery/55 font-medium mt-0.5 mb-2">
            {product.kannadaName}
          </p>

          {/* Short Description */}
          <p className="font-sans text-xs sm:text-sm text-jaggery/75 line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription}
          </p>
        </div>

        {/* ========================================================
            PACK SELECTION & COMMERCE CONTROLS
            ======================================================== */}
        <div className="pt-3 border-t border-jaggery/10 space-y-3">
          {/* Pack Selector */}
          <PackSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={(v) => setSelectedVariant(v)}
            size="sm"
          />

          {/* Price & Purchase Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-jaggery/50 tracking-wider">
                Current Price
              </span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-jaggery">
                ₹{selectedVariant.price}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onInspectDetails(product)}
                aria-label={`Inspect recipe and ingredients for ${product.name}`}
                className="px-2.5 py-2 rounded-sm border border-jaggery/20 text-xs font-sans font-medium text-jaggery hover:bg-cream transition-colors cursor-pointer"
              >
                Details
              </button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className={`transition-all duration-200 ${
                  added ? 'bg-leaf hover:bg-leaf' : ''
                }`}
              >
                {added ? (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Check className="w-3.5 h-3.5" />
                    Added
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
