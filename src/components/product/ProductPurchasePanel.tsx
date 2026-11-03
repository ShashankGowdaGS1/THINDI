'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Check,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Info,
  ChevronDown,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { PackSelector } from './PackSelector';
import { ProductDeliveryChecker } from './ProductDeliveryChecker';
import { Button } from '../brand/Button';

interface ProductPurchasePanelProps {
  product: Product;
}

export const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
}) => {
  const { addItem, openCart } = useCart();

  // Selected variant state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    return product.variants.find((v) => v.isPopular) || product.variants[0];
  });

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 540) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Accordion active sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ingredients: true,
    storage: false,
    allergens: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 10) return 10;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.available) return;
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const isAvailable = product.inStock !== false && selectedVariant.available;

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      {/* ========================================================
          BREADCRUMBS
          ======================================================== */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-jaggery/50 font-sans">
        <Link href="/" className="hover:text-jaggery transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-jaggery/30" />
        <Link href="/shop" className="hover:text-jaggery transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3 h-3 text-jaggery/30" />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-jaggery transition-colors capitalize"
        >
          {product.categoryLabel}
        </Link>
        <ChevronRight className="w-3 h-3 text-jaggery/30" />
        <span className="text-jaggery font-medium truncate max-w-[140px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* ========================================================
          HEADER: Origin, Category, Title & Kannada
          ======================================================== */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="px-2.5 py-1 rounded bg-jaggery/5 border border-jaggery/10 text-xs font-semibold uppercase tracking-wider text-jaggery">
            {product.categoryLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-leaf font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {product.origin}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-jaggery tracking-tight leading-[1.1] mb-1">
          {product.name}
        </h1>

        <p className="font-kannada text-xl sm:text-2xl font-semibold text-chilli mb-3">
          {product.kannadaName}
        </p>

        <p className="font-sans text-sm sm:text-base text-jaggery/80 leading-relaxed max-w-xl">
          {product.shortDescription}
        </p>
      </div>

      {/* ========================================================
          PRICE & STOCK DISPLAY
          ======================================================== */}
      <div className="p-4 rounded-xl bg-warm-white border border-jaggery/15 flex items-baseline justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-jaggery/50 block mb-0.5">
            Price ({selectedVariant.weight})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-jaggery">
              ₹{selectedVariant.price * quantity}
            </span>
            {quantity > 1 && (
              <span className="text-xs font-sans text-jaggery/60">
                (₹{selectedVariant.price} each)
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf/10 text-leaf text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
              Fresh Batch in Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chilli/10 text-chilli text-xs font-medium">
              Temporarily Sold Out
            </span>
          )}
          <span className="block text-[11px] font-mono text-jaggery/40 mt-1">
            SKU: {selectedVariant.sku}
          </span>
        </div>
      </div>

      {/* ========================================================
          PACK SIZE SELECTION
          ======================================================== */}
      <div>
        <PackSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelectVariant={(v) => setSelectedVariant(v)}
          size="md"
        />
      </div>

      {/* ========================================================
          QUANTITY & ADD TO CART CONTROLS
          ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        {/* Quantity selector */}
        <div className="inline-flex items-center justify-between border border-jaggery/20 rounded-md bg-warm-white px-2 py-1.5 shrink-0 sm:w-36">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || !isAvailable}
            aria-label="Decrease quantity"
            className="w-8 h-8 rounded flex items-center justify-center text-jaggery hover:bg-jaggery/10 disabled:opacity-40 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span
            className="font-mono text-base font-bold text-jaggery px-2 select-none"
            aria-live="polite"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 10 || !isAvailable}
            aria-label="Increase quantity"
            className="w-8 h-8 rounded flex items-center justify-center text-jaggery hover:bg-jaggery/10 disabled:opacity-40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Add to Cart Button */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!isAvailable}
          onClick={handleAddToCart}
          className={`flex-1 justify-center transition-all duration-200 ${
            added ? 'bg-leaf hover:bg-leaf' : ''
          }`}
          icon={added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
        >
          {added ? `Added to Box (${quantity}) ✓` : `Add ${quantity} to Box · ₹${selectedVariant.price * quantity}`}
        </Button>
      </div>

      {/* ========================================================
          DELIVERY CHECKER INTEGRATION
          ======================================================== */}
      <ProductDeliveryChecker
        product={product}
        selectedVariant={selectedVariant}
      />

      {/* ========================================================
          MOBILE STICKY PURCHASE BAR (Visible when scrolled)
          ======================================================== */}
      {showStickyBar && (
        <div
          aria-label="Quick mobile purchase"
          className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-cream/95 backdrop-blur-md border-t border-jaggery/15 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="truncate max-w-[55%]">
            <span className="text-[10px] uppercase font-semibold text-jaggery/50 block truncate">
              {product.name} ({selectedVariant.weight})
            </span>
            <span className="font-serif text-lg font-bold text-jaggery">
              ₹{selectedVariant.price * quantity}
            </span>
          </div>

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
            {added ? 'Added ✓' : `Add to Box`}
          </Button>
        </div>
      )}

      {/* ========================================================
          TRANSPARENT PRODUCT DISCLOSURES (Accordions)
          ======================================================== */}
      <div className="pt-4 border-t border-jaggery/10 divide-y divide-jaggery/10 text-sm">
        {/* Ingredients */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleSection('ingredients')}
            aria-expanded={openSections.ingredients}
            className="w-full flex items-center justify-between text-left font-serif font-bold text-jaggery hover:text-chilli transition-colors cursor-pointer"
          >
            <span>Verified Ingredients ({product.ingredients.length})</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSections.ingredients ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.ingredients && (
            <div className="pt-2.5 pb-1">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-jaggery/80 font-sans">
                {product.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-chilli shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Storage Guidance & Shelf Life */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleSection('storage')}
            aria-expanded={openSections.storage}
            className="w-full flex items-center justify-between text-left font-serif font-bold text-jaggery hover:text-chilli transition-colors cursor-pointer"
          >
            <span>Storage & Shelf Life</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSections.storage ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.storage && (
            <div className="pt-2.5 pb-1 text-xs text-jaggery/80 font-sans space-y-2">
              <p>
                <strong>Storage:</strong> {product.storageInstructions || 'Store in an airtight container away from moisture.'}
              </p>
              <p>
                <strong>Shelf Life:</strong> {product.shelfLife || '60 days from dispatch.'}
              </p>
            </div>
          )}
        </div>

        {/* Allergen Notice & Food Declaration */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => toggleSection('allergens')}
            aria-expanded={openSections.allergens}
            className="w-full flex items-center justify-between text-left font-serif font-bold text-jaggery hover:text-chilli transition-colors cursor-pointer"
          >
            <span>Allergen & Quality Declarations</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSections.allergens ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.allergens && (
            <div className="pt-2.5 pb-1 text-xs text-jaggery/80 font-sans space-y-2">
              {product.allergens && product.allergens.length > 0 && (
                <div>
                  <strong className="text-chilli">Allergens:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {product.allergens.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-jaggery/70 pt-1">
                {product.foodDeclaration || 'Traditional homemade-style food preparation. Free from synthetic flavourings.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
