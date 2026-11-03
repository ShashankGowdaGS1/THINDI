'use client';

import React, { useEffect, useState, use } from 'react';
import { ProductForm } from '@/components/admin/ProductForm';
import { Product } from '@/types/product';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${resolvedParams.id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        }
      } catch (e) {
        console.error('Failed to load product', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#78695C]">
        <Loader2 className="w-6 h-6 animate-spin text-[#A43D2E] mb-2" />
        <p className="text-xs">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center bg-[#FFFCF7] rounded-xl border border-[#E6D9C8]">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h2 className="text-base font-bold text-[#2D241E]">Product Not Found</h2>
        <p className="text-xs text-[#78695C] mt-1">Product ID {resolvedParams.id} does not exist in the catalogue.</p>
        <Link
          href="/admin/products"
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#A43D2E] text-white"
        >
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
          Edit Product: {product.name}
          <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
            ({product.kannadaName})
          </span>
        </h1>
        <p className="text-xs text-[#78695C] mt-0.5">
          Modify product identity, variants, packaging, and FSSAI disclosures.
        </p>
      </div>

      <ProductForm initialProduct={product} isNew={false} />
    </div>
  );
}

