'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

interface ProductStoryProps {
  product: Product;
}

export const ProductStory: React.FC<ProductStoryProps> = ({ product }) => {
  const storyTitle = product.storyTitle || 'A little story behind the crunch';
  const storyContent = product.storyContent || product.fullDescription;
  const storyImage = product.galleryImages?.[1] || product.imageSrc;

  return (
    <section
      aria-label={`Culinary heritage of ${product.name}`}
      className="py-14 sm:py-20 border-t border-jaggery/10 bg-warm-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Cultural Story (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <ChakkaliMotif size={22} color="#A43D2E" />
              <span className="text-xs font-semibold uppercase tracking-widest text-chilli font-sans">
                Heritage & Craft
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery tracking-tight leading-snug">
              {storyTitle}
            </h2>

            <p className="font-kannada text-lg text-jaggery/60 font-medium">
              ಹಾಸನದ ಕೈರುಚಿ ಮತ್ತು ಪರಂಪರೆ
            </p>

            <p className="font-sans text-base sm:text-lg text-jaggery/80 leading-relaxed max-w-xl pt-2">
              {storyContent}
            </p>

            <div className="pt-4 flex items-center gap-3 text-xs text-jaggery/60">
              <span className="w-2 h-2 rounded-full bg-turmeric" />
              <span>Prepared with authentic recipes · Handcrafted in Hassan, Karnataka</span>
            </div>
          </div>

          {/* Right Column: Close-up Texture/Platter Photograph (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-jaggery/15 shadow-md bg-cream">
              <Image
                src={storyImage}
                alt={`${product.name} craft and texture detail`}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover object-center"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-jaggery/30 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

