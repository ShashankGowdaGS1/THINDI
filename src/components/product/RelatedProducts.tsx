'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { getRelatedProducts } from '@/data/products';

interface RelatedProductsProps {
  currentProduct: Product;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
}) => {
  const related = getRelatedProducts(currentProduct);

  if (!related || related.length === 0) return null;

  return (
    <section
      aria-label="Complementary Snacks"
      className="py-14 sm:py-20 border-t border-jaggery/10 bg-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf font-sans block mb-1">
              Complete Your Snack Break
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-jaggery">
              Pairs well with...
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-leaf hover:text-chilli transition-colors"
          >
            <span>Explore all thindi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((prod) => {
            const minPrice = Math.min(...prod.variants.map((v) => v.price));
            return (
              <Link
                key={prod.id}
                href={`/products/${prod.slug}`}
                className="group flex flex-col justify-between bg-warm-white rounded-xl border border-jaggery/15 hover:border-jaggery/35 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-4"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-cream mb-3.5">
                    <Image
                      src={prod.imageSrc}
                      alt={prod.imageAlt || prod.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-cream/90 text-[10px] font-semibold uppercase text-jaggery">
                      {prod.categoryLabel}
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-jaggery group-hover:text-chilli transition-colors leading-snug">
                    {prod.name}
                  </h3>
                  <p className="font-kannada text-xs text-jaggery/55 mb-1.5">
                    {prod.kannadaName}
                  </p>
                  <p className="text-xs text-jaggery/70 line-clamp-2 leading-relaxed">
                    {prod.shortDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-jaggery/10 flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-jaggery">
                    From ₹{minPrice}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-chilli group-hover:translate-x-0.5 transition-transform">
                    <span>View snack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

