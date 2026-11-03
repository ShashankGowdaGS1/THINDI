'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, SlidersHorizontal, ArrowUpDown, Sparkles, AlertCircle } from 'lucide-react';
import { getAllShopProducts } from '@/data/products';
import { Product } from '@/types/product';
import { ShopProductCard } from './ShopProductCard';
import { ProductDetailModal } from '../product/ProductDetailModal';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';

const CATEGORIES = [
  { id: 'all', label: 'All Thindi', kannada: 'ಎಲ್ಲಾ ತಿಂಡಿ' },
  { id: 'kuruk-thindi', label: 'Kuruk Thindi', kannada: 'ಕುರುಕ್ ತಿಂಡಿ' },
  { id: 'sihi-thindi', label: 'Sihi Thindi', kannada: 'ಸಿಹಿ ತಿಂಡಿ' },
  { id: 'uppinakai', label: 'Uppinakai', kannada: 'ಉಪ್ಪಿನಕಾಯಿ' },
  { id: 'appala-sandige', label: 'Appala & Sandige', kannada: 'ಅಪ್ಪಳ & ಸಂಡಿಗೆ' },
];

export const ShopCatalogue: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state synchronization
  const currentCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);

  // Helper to update query parameters in URL cleanly
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || (key === 'category' && value === 'all') || (key === 'sort' && value === 'featured') || (key === 'inStock' && value === 'false')) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const allProducts = useMemo(() => getAllShopProducts(), []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Category filter
    if (currentCategory !== 'all') {
      list = list.filter((p) => p.category === currentCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchKannada = p.kannadaName.includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q) || p.fullDescription.toLowerCase().includes(q);
        const matchCategory = p.categoryLabel.toLowerCase().includes(q) || p.category.includes(q);
        const matchKeywords = p.keywords?.some((k) => k.toLowerCase().includes(q));
        return matchName || matchKannada || matchDesc || matchCategory || matchKeywords;
      });
    }

    // In-stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.inStock !== false);
    }

    // Sorting
    switch (currentSort) {
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        list.sort((a, b) => {
          const minA = Math.min(...a.variants.map((v) => v.price));
          const minB = Math.min(...b.variants.map((v) => v.price));
          return minA - minB;
        });
        break;
      case 'price-desc':
        list.sort((a, b) => {
          const minA = Math.min(...a.variants.map((v) => v.price));
          const minB = Math.min(...b.variants.map((v) => v.price));
          return minB - minA;
        });
        break;
      case 'featured':
      default:
        list.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
        break;
    }

    return list;
  }, [allProducts, currentCategory, searchQuery, inStockOnly, currentSort]);

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <section id="shop-catalogue" className="py-10 sm:py-14 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            PREVIEW CATALOGUE NOTICE
            Transparent disclosure regarding sample recipe prices
            ======================================================== */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-xl bg-warm-white border border-jaggery/15 flex items-start sm:items-center justify-between gap-3 text-xs text-jaggery/75">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-leaf mt-1 sm:mt-0 shrink-0" />
            <span>
              <strong>Catalogue Preview:</strong> Authentic traditional snacks handcrafted in Hassan. Sample weights and prices reflect initial production kitchen runs.
            </span>
          </div>
          <span className="hidden md:inline font-kannada text-jaggery/50 text-[11px] shrink-0">
            ಹಾಸನದ ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರ
          </span>
        </div>

        {/* ========================================================
            CATEGORY FILTER BAR (Horizontally scrollable on mobile)
            ======================================================== */}
        <div className="mb-8 pb-2 border-b border-jaggery/15">
          <div
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1"
            role="tablist"
            aria-label="Filter by Product Category"
          >
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => updateUrlParams({ category: cat.id })}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium whitespace-nowrap transition-all duration-200 select-none cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-jaggery text-cream shadow-sm'
                      : 'bg-warm-white text-jaggery/80 hover:text-jaggery hover:bg-cream-dark/50 border border-jaggery/15'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`font-kannada text-xs ${
                      isActive ? 'text-turmeric' : 'text-jaggery/45'
                    }`}
                  >
                    {cat.kannada}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            SEARCH, SORT & ACTIVE FILTER ROW
            ======================================================== */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Input Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-jaggery/40" />
            <input
              type="text"
              placeholder="Search chakkali, obbattu, pickles..."
              value={searchQuery}
              onChange={(e) => updateUrlParams({ q: e.target.value })}
              aria-label="Search THINDI snacks"
              className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-jaggery/20 bg-warm-white text-jaggery text-sm placeholder-jaggery/40 focus:outline-none focus:ring-2 focus:ring-chilli/30 focus:border-chilli transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => updateUrlParams({ q: null })}
                aria-label="Clear search text"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-jaggery/10 hover:bg-jaggery/20 text-jaggery flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right Side Controls: Sort Selector & Stock Filter */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 flex-wrap">
            {/* In-Stock Filter Toggle */}
            <label className="inline-flex items-center gap-2 text-xs font-sans text-jaggery cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) =>
                  updateUrlParams({ inStock: e.target.checked ? 'true' : 'false' })
                }
                className="rounded border-jaggery/30 text-chilli focus:ring-chilli h-4 w-4"
              />
              <span>In-stock only</span>
            </label>

            {/* Sort Selector Dropdown */}
            <div className="inline-flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-jaggery/50 hidden sm:inline" />
              <select
                value={currentSort}
                onChange={(e) => updateUrlParams({ sort: e.target.value })}
                aria-label="Sort product catalogue"
                className="px-3 py-2 rounded-lg border border-jaggery/20 bg-warm-white text-jaggery text-xs font-sans font-medium focus:outline-none focus:ring-2 focus:ring-chilli/30 focus:border-chilli transition-all cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================
            RESULT METRICS & ACTIVE FILTERS RESET CUE
            ======================================================== */}
        <div className="flex items-center justify-between text-xs text-jaggery/60 mb-6">
          <span>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'snack' : 'authentic snacks'}
            {currentCategory !== 'all' && (
              <span> in {CATEGORIES.find((c) => c.id === currentCategory)?.label}</span>
            )}
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </span>

          {(currentCategory !== 'all' || searchQuery || inStockOnly || currentSort !== 'featured') && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-chilli hover:underline font-medium cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* ========================================================
            PRODUCT GRID OR EMPTY STATE
            ======================================================== */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ShopProductCard
                key={product.id}
                product={product}
                onInspectDetails={(p) => setInspectProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-jaggery/5 flex items-center justify-center mx-auto text-jaggery/40">
              <ChakkaliMotif size={36} color="#2D241E" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-jaggery">
              No thindi found for that craving.
            </h3>

            <p className="font-sans text-sm text-jaggery/70 leading-relaxed">
              Try another search or explore all our favourites from Hassan.
            </p>

            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={clearAllFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal for full ingredients, allergen notes & origin */}
      <ProductDetailModal
        product={inspectProduct}
        isOpen={Boolean(inspectProduct)}
        onClose={() => setInspectProduct(null)}
      />
    </section>
  );
};

