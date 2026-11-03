'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  CheckCircle,
  EyeOff,
  AlertTriangle,
  Edit,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Product } from '@/types/product';

interface AdminProductWithStock extends Product {
  totalStockAvailable?: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.kannadaName && p.kannadaName.includes(searchTerm)) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && (p.active ?? true)) ||
      (selectedStatus === 'draft' && !(p.active ?? true));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Products Catalogue
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ತಿಂಡಿ ಉತ್ಪನ್ನಗಳು)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Manage traditional snack offerings, pack variants, pricing, and mandatory FSSAI food declarations.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#A43D2E] text-white hover:bg-[#8B3326] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Search products by title or Kannada name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] placeholder-[#B5A493] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#8C7A6B] font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#8C7A6B] font-medium">Visibility:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E]"
            >
              <option value="all">All States</option>
              <option value="published">Published</option>
              <option value="draft">Draft / Hidden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Pack Variants</th>
              <th className="py-3 px-4 font-semibold">Pricing Range</th>
              <th className="py-3 px-4 font-semibold">Available Stock</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6D9C8]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#78695C]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                  <span>Loading catalogue...</span>
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const minPrice = Math.min(...p.variants.map((v) => v.price));
                const maxPrice = Math.max(...p.variants.map((v) => v.price));
                const isPublished = p.active ?? true;
                const totalStock = p.totalStockAvailable ?? 25;

                return (
                  <tr key={p.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-[#E6D9C8]/40 flex-shrink-0 relative">
                          <Image
                            src={p.imageSrc || '/images/hero-desktop.jpg'}
                            alt={p.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2D241E] text-xs">
                            {p.name}
                          </p>
                          <p className="font-kannada text-[#8C7A6B] text-[11px]">
                            {p.kannadaName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#78695C] capitalize">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 text-[#78695C]">
                      <span className="font-mono">{p.variants.length}</span> sizes
                      <span className="text-[10px] text-[#8C7A6B] block">
                        ({p.variants.map((v) => v.weight).join(', ')})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#2D241E] font-mono">
                      ₹{minPrice} {minPrice !== maxPrice ? `– ₹${maxPrice}` : ''}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono font-semibold ${
                          totalStock < 20 ? 'text-red-600' : 'text-[#365541]'
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isPublished
                            ? 'bg-[#365541]/10 text-[#365541]'
                            : 'bg-[#F2EAE0] text-[#78695C]'
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <CheckCircle className="w-2.5 h-2.5" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Draft</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1 text-[#8C7A6B] hover:text-[#2D241E] transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border border-[#E6D9C8] bg-white text-[#A43D2E] hover:bg-[#FAF5EC] transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#78695C]">
                  No products found matching your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
