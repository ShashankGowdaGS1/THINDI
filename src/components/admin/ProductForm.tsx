'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import Link from 'next/link';

interface ProductFormProps {
  initialProduct?: Product;
  isNew?: boolean;
}

const CATEGORY_OPTIONS: { id: Product['category']; label: string }[] = [
  { id: 'kuruk-thindi', label: 'Kuruk Thindi (Crispy Snacks)' },
  { id: 'sihi-thindi', label: 'Sihi Thindi (Traditional Sweets)' },
  { id: 'uppinakai', label: 'Uppinakai (Aged Pickles)' },
  { id: 'appala-sandige', label: 'Appala & Sandige (Sun-Dried)' },
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  isNew = false,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Product>>(() => {
    if (initialProduct) return initialProduct;
    return {
      id: `thindi-${Date.now()}`,
      slug: '',
      name: '',
      kannadaName: '',
      shortDescription: '',
      fullDescription: '',
      category: 'kuruk-thindi',
      categoryLabel: 'Kuruk Thindi',
      imageSrc: '/images/products/chakkali.jpg',
      imageAlt: '',
      origin: 'Hassan, Karnataka',
      ingredients: ['Rice Flour', 'Urad Dal Flour', 'Butter', 'Sesame Seeds', 'Cumin', 'Salt', 'Groundnut Oil'],
      variants: [
        {
          id: `var-${Date.now()}-1`,
          sku: 'THN-PRD-200',
          weight: '200g Pack',
          price: 120,
          available: true,
          isPopular: true,
        },
      ],
      active: true,
      inStock: true,
      allergens: ['Contains sesame'],
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Transfer to an airtight container after opening.',
      shelfLife: '30 Days from packing',
      foodDeclaration: '100% Vegetarian artisan snack. Prepared in traditional wood-pressed groundnut oil without artificial preservatives or coloring.',
    };
  });

  const [ingredientsText, setIngredientsText] = useState(
    (formData.ingredients || []).join(', ')
  );
  const [allergensText, setAllergensText] = useState(
    (formData.allergens || []).join(', ')
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleNameChange = (name: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name };
      if (isNew && !prev.slug) {
        updated.slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      return updated;
    });
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: any
  ) => {
    const updatedVariants = [...(formData.variants || [])];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      sku: `THN-${formData.slug?.toUpperCase().slice(0, 4) || 'SKU'}-${Date.now().toString().slice(-3)}`,
      weight: '400g Pack',
      price: 220,
      available: true,
    };
    setFormData({
      ...formData,
      variants: [...(formData.variants || []), newVariant],
    });
  };

  const handleRemoveVariant = (index: number) => {
    const updated = (formData.variants || []).filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMsg(null);
    setSaving(true);

    // Parse comma lists
    const finalIngredients = ingredientsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalAllergens = allergensText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Product = {
      id: formData.id || `thindi-${Date.now()}`,
      slug: formData.slug || '',
      name: formData.name || '',
      kannadaName: formData.kannadaName || '',
      shortDescription: formData.shortDescription || '',
      fullDescription: formData.fullDescription || '',
      category: formData.category || 'kuruk-thindi',
      categoryLabel:
        CATEGORY_OPTIONS.find((c) => c.id === formData.category)?.label.split(' ')[0] ||
        'Kuruk Thindi',
      imageSrc: formData.imageSrc || '/images/products/chakkali.jpg',
      imageAlt: formData.imageAlt || formData.name || '',
      origin: formData.origin || 'Hassan, Karnataka',
      ingredients: finalIngredients,
      allergens: finalAllergens,
      variants: formData.variants || [],
      active: formData.active ?? true,
      inStock: formData.inStock ?? true,
      storageInstructions: formData.storageInstructions || '',
      shelfLife: formData.shelfLife || '',
      foodDeclaration: formData.foodDeclaration || '',
    };

    try {
      const endpoint = isNew ? '/api/admin/products' : `/api/admin/products/${payload.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccessMsg(`Product "${payload.name}" successfully saved to catalogue.`);
      if (isNew) {
        setTimeout(() => {
          router.push('/admin/products');
        }, 1200);
      }
    } catch (err: any) {
      setErrors([err.message || 'Error occurred while saving product.']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78695C] hover:text-[#A43D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D241E]">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded text-[#A43D2E] focus:ring-[#A43D2E]"
            />
            <span>Active / Published on Store</span>
          </label>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Product Cannot Be Published</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 mt-2">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Basic Product Details */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
        <h2 className="font-serif text-base font-bold text-[#2D241E]">
          1. Basic Product Identity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Product Title (English) *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Traditional Hassan Chakkali"
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Kannada Title (ಕನ್ನಡ ಶೀರ್ಷಿಕೆ) *
            </label>
            <input
              type="text"
              required
              value={formData.kannadaName}
              onChange={(e) => setFormData({ ...formData, kannadaName: e.target.value })}
              placeholder="ಉದಾ. ಹಾಸನ ಚಕ್ಕುಲಿ"
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] font-kannada focus:ring-1 focus:ring-[#A43D2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="traditional-hassan-chakkali"
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] font-mono focus:ring-1 focus:ring-[#A43D2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Primary Image Path / URL *
            </label>
            <input
              type="text"
              required
              value={formData.imageSrc}
              onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })}
              placeholder="/images/products/chakkali.jpg"
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] font-mono focus:ring-1 focus:ring-[#A43D2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Origin Location
            </label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="Hassan, Karnataka"
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
            Short Description
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Crisp, spiral crunch seasoned with cumin and roasted sesame"
            className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
            Full Craft Narrative / Story
          </label>
          <textarea
            rows={3}
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            placeholder="Detailed description of tradition, texture, and frying technique..."
            className="w-full p-2.5 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>
      </div>

      {/* 2. Mandatory Food Declarations (FSSAI) */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#365541]" />
          <h2 className="font-serif text-base font-bold text-[#2D241E]">
            2. Mandatory FSSAI Food Declarations
          </h2>
        </div>
        <p className="text-[11px] text-[#78695C]">
          Required for legal compliance on all packaged food offerings sold in Karnataka.
        </p>

        <div>
          <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
            Ingredients List (Comma-separated) *
          </label>
          <textarea
            rows={2}
            required
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Rice Flour, Urad Dal, Butter, White Sesame Seeds, Cumin Seeds, Salt, Cold-Pressed Groundnut Oil"
            className="w-full p-2.5 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Allergens Statement
            </label>
            <input
              type="text"
              value={allergensText}
              onChange={(e) => setAllergensText(e.target.value)}
              placeholder="Contains Sesame, Dairy (Butter)"
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Shelf Life Statement *
            </label>
            <input
              type="text"
              required
              value={formData.shelfLife}
              onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
              placeholder="e.g. 30 Days from packing"
              className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
            Storage Instructions *
          </label>
          <input
            type="text"
            required
            value={formData.storageInstructions}
            onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
            placeholder="Store in a cool dry place. Keep in an airtight container once opened."
            className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
            Food Purity & Artisan Declaration *
          </label>
          <input
            type="text"
            required
            value={formData.foodDeclaration}
            onChange={(e) => setFormData({ ...formData, foodDeclaration: e.target.value })}
            placeholder="100% Vegetarian artisan snack. Prepared in traditional wood-pressed groundnut oil without artificial preservatives."
            className="w-full px-3 py-2 text-xs border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] focus:ring-1 focus:ring-[#A43D2E]"
          />
        </div>
      </div>

      {/* 3. Pack Variants & Pricing */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-[#2D241E]">
            3. Pack Sizes & Pricing Variants
          </h2>
          <button
            type="button"
            onClick={handleAddVariant}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-[#E6D9C8] bg-[#FAF5EC] text-[#2D241E] hover:bg-[#EFE5D5]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Size Variant</span>
          </button>
        </div>

        <div className="space-y-3">
          {(formData.variants || []).map((variant, idx) => (
            <div
              key={variant.id || idx}
              className="p-3.5 rounded-lg border border-[#E6D9C8] bg-[#FAF5EC]/40 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-xs"
            >
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8C7A6B] mb-0.5">
                  Pack Weight
                </label>
                <input
                  type="text"
                  required
                  value={variant.weight}
                  onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                  placeholder="200g Pack"
                  className="w-full px-2 py-1.5 border border-[#E6D9C8] rounded bg-white text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8C7A6B] mb-0.5">
                  SKU Identifier
                </label>
                <input
                  type="text"
                  required
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(idx, 'sku', e.target.value.toUpperCase())}
                  placeholder="THN-CHK-200"
                  className="w-full px-2 py-1.5 border border-[#E6D9C8] rounded bg-white font-mono text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8C7A6B] mb-0.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={variant.price}
                  onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))}
                  placeholder="120"
                  className="w-full px-2 py-1.5 border border-[#E6D9C8] rounded bg-white font-mono text-[#2D241E]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#2D241E]">
                  <input
                    type="checkbox"
                    checked={variant.available}
                    onChange={(e) => handleVariantChange(idx, 'available', e.target.checked)}
                    className="rounded text-[#A43D2E]"
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-[#2D241E]">
                  <input
                    type="checkbox"
                    checked={variant.isPopular}
                    onChange={(e) => handleVariantChange(idx, 'isPopular', e.target.checked)}
                    className="rounded text-[#A43D2E]"
                  />
                  <span>Popular</span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                {(formData.variants || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Remove variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E6D9C8]">
        <Link
          href="/admin/products"
          className="px-4 py-2 text-xs font-semibold rounded border border-[#E6D9C8] bg-white text-[#2D241E] hover:bg-[#FAF5EC]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded bg-[#A43D2E] text-white hover:bg-[#8B3326] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Product...</span>
            </>
          ) : (
            <span>Save Product to Catalogue</span>
          )}
        </button>
      </div>
    </form>
  );
};

