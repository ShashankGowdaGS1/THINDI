'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { CravingCategory } from '@/data/categories';
import { Product } from '@/types/product';
import { ShopProductCard } from '@/components/shop/ShopProductCard';
import { ProductDetailModal } from '@/components/product/ProductDetailModal';

interface CollectionPageViewProps {
  category: CravingCategory;
  allCategories: CravingCategory[];
  products: Product[];
}

export const CollectionPageView: React.FC<CollectionPageViewProps> = ({
  category,
  allCategories,
  products,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.kannadaName.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.price));
        const minB = Math.min(...b.variants.map((v) => v.price));
        return minA - minB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const maxA = Math.max(...a.variants.map((v) => v.price));
        const maxB = Math.max(...b.variants.map((v) => v.price));
        return maxB - maxA;
      });
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="space-y-12 pb-24">
      {/* ========================================================
          HERO BANNER
          ======================================================== */}
      <section className="relative bg-[#FAF5EC] border-b border-jaggery/10 pt-10 pb-12 sm:pt-16 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs font-sans text-jaggery/60">
              <li>
                <Link href="/" className="hover:text-chilli transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/shop" className="hover:text-chilli transition-colors">
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li>
                <span className="text-jaggery font-semibold">{category.title}</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-jaggery/15 text-xs font-semibold text-jaggery">
                <span className="font-mono text-chilli font-bold">{category.number}</span>
                <span>·</span>
                <span>{category.badge}</span>
                <span className="text-jaggery/30">|</span>
                <span className="font-kannada text-chilli font-medium">{category.kannadaBadge}</span>
              </div>

              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-jaggery tracking-tight">
                  {category.title}
                </h1>
                <p className="font-kannada text-xl sm:text-2xl text-chilli font-medium">
                  {category.kannadaTitle}
                </p>
              </div>

              <p className="font-sans text-sm sm:text-base text-jaggery/80 max-w-xl leading-relaxed">
                {category.description} Handcrafted with cold-pressed oils, stone-ground flours, and traditional
                recipes from Hassan kitchens.
              </p>

              {/* Items featured tags */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-sans">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-md bg-cream border border-jaggery/10 text-jaggery/80 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-16/10 lg:aspect-4/3 rounded-2xl overflow-hidden border border-jaggery/15 shadow-sm bg-cream">
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt || category.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quick Category Navigation Pills */}
          <div className="mt-10 pt-6 border-t border-jaggery/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-jaggery/60 mb-3 font-sans">
              Browse Other Collections
            </p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((c) => {
                const isActive = c.id === category.id;
                return (
                  <Link
                    key={c.id}
                    href={`/collections/${c.id}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-chilli text-cream font-bold shadow-xs'
                        : 'bg-cream border border-jaggery/15 text-jaggery/80 hover:border-chilli/40 hover:text-chilli'
                    }`}
                  >
                    <span>{c.title}</span>
                    <span className="ml-1.5 font-kannada opacity-70 text-[11px]">({c.kannadaTitle})</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRODUCTS CATALOGUE & FILTERS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-jaggery/10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-jaggery/60 font-sans">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} in {category.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-jaggery/40" />
              <input
                type="text"
                placeholder="Search this collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-jaggery/20 rounded-lg bg-cream text-jaggery placeholder-jaggery/40 focus:outline-hidden focus:ring-1 focus:ring-chilli"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-jaggery/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-2 text-xs border border-jaggery/20 rounded-lg bg-cream text-jaggery focus:outline-hidden focus:ring-1 focus:ring-chilli"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <ShopProductCard
                key={product.id}
                product={product}
                onInspectDetails={(p) => setInspectingProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#FAF5EC] rounded-2xl border border-jaggery/10 mt-8 space-y-4">
            <ShoppingBag className="w-10 h-10 text-jaggery/30 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-jaggery">
              No products found matching "{searchQuery}"
            </h3>
            <p className="text-xs text-jaggery/70 max-w-sm mx-auto">
              Try searching for a different keyword or browse all authentic savouries in our full shop catalogue.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-lg bg-chilli text-cream text-xs font-semibold hover:bg-[#8B3326] transition-colors"
            >
              Clear Search Filter
            </button>
          </div>
        )}
      </section>

      {/* Inspect Modal */}
      {inspectingProduct && (
        <ProductDetailModal
          product={inspectingProduct}
          isOpen={true}
          onClose={() => setInspectingProduct(null)}
        />
      )}
    </div>
  );
};

