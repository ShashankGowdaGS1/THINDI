'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const validImages = images && images.length > 0 ? images : ['/images/products/chakkali.jpg'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const activeImage = validImages[activeIndex] || validImages[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ========================================================
          LARGE MAIN ACTIVE IMAGE
          ======================================================== */}
      <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full rounded-2xl overflow-hidden border border-jaggery/15 bg-warm-white shadow-sm group">
        <Image
          src={imgError[activeIndex] ? '/images/categories/kuruk-thindi.jpg' : activeImage}
          alt={`${productName} — View ${activeIndex + 1} of ${validImages.length}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center transform transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => setImgError((prev) => ({ ...prev, [activeIndex]: true }))}
        />

        {/* Ambient subtle vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-jaggery/15 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Zoom inspection button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          aria-label="Zoom in to inspect snack texture"
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-cream/90 hover:bg-cream text-jaggery shadow-md backdrop-blur-sm transition-all duration-200 cursor-pointer opacity-90 group-hover:opacity-100"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Mobile Next / Prev Chevrons */}
        {validImages.length > 1 && (
          <div className="sm:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous view"
              className="p-1.5 rounded-full bg-cream/80 text-jaggery shadow pointer-events-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next view"
              className="p-1.5 rounded-full bg-cream/80 text-jaggery shadow pointer-events-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          ACCESSIBLE THUMBNAIL SELECTOR STRIP
          ======================================================== */}
      {validImages.length > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto py-1"
          role="region"
          aria-label="Thumbnail views"
        >
          {validImages.map((src, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isSelected}
                aria-label={`View ${index + 1}: ${productName}`}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-chilli ${
                  isSelected
                    ? 'border-chilli ring-2 ring-chilli/20 scale-[1.02]'
                    : 'border-jaggery/15 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={imgError[index] ? '/images/categories/kuruk-thindi.jpg' : src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                  loading="lazy"
                  onError={() => setImgError((prev) => ({ ...prev, [index]: true }))}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================
          LIGHTWEIGHT FULLSCREEN TEXTURE ZOOM MODAL
          ======================================================== */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution snack view"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jaggery/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imgError[activeIndex] ? '/images/categories/kuruk-thindi.jpg' : activeImage}
              alt={`${productName} — Zoom View`}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Close zoom preview"
              className="absolute top-4 right-4 p-2.5 rounded-full bg-cream/90 hover:bg-cream text-jaggery shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

