'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
  X,
} from 'lucide-react';
import { CravingCategory } from '@/data/categories';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CravingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCat, setNewCat] = useState<Partial<CravingCategory>>({
    id: '',
    title: '',
    kannadaTitle: '',
    description: '',
    imageSrc: '/images/categories/kuruk-thindi.jpg',
    imageAlt: '',
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      setFeedback({ type: 'success', text: `Category "${newCat.title}" saved successfully.` });
      setModalOpen(false);
      setNewCat({
        id: '',
        title: '',
        kannadaTitle: '',
        description: '',
        imageSrc: '/images/categories/kuruk-thindi.jpg',
        imageAlt: '',
      });
      fetchCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error saving category' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (catId: string, catTitle: string) => {
    if (!confirm(`Are you sure you want to delete category "${catTitle}"?`)) return;

    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/categories?id=${catId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }
      setFeedback({ type: 'success', text: `Category "${catTitle}" deleted.` });
      fetchCategories();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error deleting category' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Categories & Cravings
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ತಿಂಡಿ ವಿಭಾಗಗಳು)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Organize traditional snacks, seasonal sweets, and aged pickles into discoverable craving groups.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#A43D2E] text-white hover:bg-[#8B3326] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-[#78695C]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
            <span>Loading categories...</span>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2D241E]">
                      {cat.title}
                    </h3>
                    <p className="font-kannada text-xs text-[#A43D2E]">
                      {cat.kannadaTitle}
                    </p>
                    <p className="font-mono text-[10px] text-[#8C7A6B] mt-0.5">
                      Slug: {cat.id}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#FAF5EC] border border-[#E6D9C8] flex-shrink-0 relative">
                    <Image
                      src={cat.imageSrc || '/images/hero-desktop.jpg'}
                      alt={cat.imageAlt || cat.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <p className="text-xs text-[#78695C] mt-3 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6D9C8] flex items-center justify-between">
                <span className="text-[11px] text-[#8C7A6B]">
                  Category identifier: <strong className="font-mono text-[#2D241E]">{cat.id}</strong>
                </span>

                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.title)}
                  className="p-1.5 text-[#8C7A6B] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete category (Protected against active products)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#2D241E]">
                Add New Category
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Category Slug / Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={newCat.id}
                  onChange={(e) =>
                    setNewCat({
                      ...newCat,
                      id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                    })
                  }
                  placeholder="e.g. payasa-halwa"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Category Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newCat.title}
                  onChange={(e) => setNewCat({ ...newCat, title: e.target.value })}
                  placeholder="e.g. Payasa & Halwa"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Kannada Title (ಕನ್ನಡ ಶೀರ್ಷಿಕೆ) *
                </label>
                <input
                  type="text"
                  required
                  value={newCat.kannadaTitle}
                  onChange={(e) => setNewCat({ ...newCat, kannadaTitle: e.target.value })}
                  placeholder="ಪಾಯಸ ಮತ್ತು ಹಲ್ವ"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-kannada text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  placeholder="Artisan sweet varieties prepared in pure ghee..."
                  className="w-full p-2.5 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={newCat.imageSrc}
                  onChange={(e) => setNewCat({ ...newCat, imageSrc: e.target.value })}
                  placeholder="/images/categories/sihi-thindi.jpg"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6D9C8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-[#E6D9C8] rounded bg-white text-[#2D241E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
