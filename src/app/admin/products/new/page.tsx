'use client';

import React from 'react';
import { ProductForm } from '@/components/admin/ProductForm';

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
          Create New Product
          <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
            (ಹೊಸ ಉತ್ಪನ್ನ ಸೇರ್ಪಡೆ)
          </span>
        </h1>
        <p className="text-xs text-[#78695C] mt-0.5">
          Add an authentic Karnataka snack or sweet with pack variants and mandatory FSSAI food declarations.
        </p>
      </div>

      <ProductForm isNew={true} />
    </div>
  );
}

