'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  Plus,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Archive,
  Loader2,
  X,
} from 'lucide-react';
import { ProductionBatch } from '@/types/admin';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultExpiryStr = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const [newBatch, setNewBatch] = useState({
    batchNumber: `BATCH-${new Date().getFullYear()}-CHK-02`,
    variantSku: 'THN-CHK-200',
    productName: 'Traditional Hassan Chakkali (200g)',
    productionDate: todayStr,
    expiryDate: defaultExpiryStr,
    shelfLifeDays: 30,
    quantityProduced: 50,
    storageLocation: 'Hassan Central Kitchen — Shelf A1',
    notes: 'Morning fry batch using fresh butter and cold-pressed oil',
  });

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/admin/inventory/batches', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setBatches(data.batches || []);
      }
    } catch (e) {
      console.error('Failed to load production batches', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleShelfLifeChange = (days: number) => {
    const prod = new Date(newBatch.productionDate);
    const exp = new Date(prod.getTime() + days * 86400000).toISOString().split('T')[0];
    setNewBatch({ ...newBatch, shelfLifeDays: days, expiryDate: exp });
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/inventory/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBatch,
          shelfLifeDays: Number(newBatch.shelfLifeDays),
          quantityProduced: Number(newBatch.quantityProduced),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record batch');
      }

      setFeedback({
        type: 'success',
        text: `Batch ${newBatch.batchNumber} recorded and stock incremented.`,
      });
      setModalOpen(false);
      fetchBatches();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error recording batch' });
    } finally {
      setSubmitting(false);
    }
  };

  const nearExpiryCount = batches.filter(
    (b) => b.status === 'near_expiry' || b.status === 'expired'
  ).length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78695C] hover:text-[#A43D2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory Ledger</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Production Batches & Shelf Life
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ತಯಾರಿ ಬ್ಯಾಚ್‌ಗಳು)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Track fresh frying runs, expiration timelines, and batch traceability from the Hassan kitchen.
          </p>
        </div>

        <button
          onClick={() => {
            setFeedback(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#A43D2E] text-white hover:bg-[#8B3326] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Receive Kitchen Batch</span>
        </button>
      </div>

      {nearExpiryCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <div>
            <span className="font-bold">Attention Kitchen Managers:</span>{' '}
            <span>
              {nearExpiryCount} production batch(es) have reached near-expiry (≤15 days remaining) or are expired. Prioritize dispatch or record disposal in the inventory ledger.
            </span>
          </div>
        </div>
      )}

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
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Batches Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Batch Code</th>
              <th className="py-3 px-4 font-semibold">Product & SKU</th>
              <th className="py-3 px-4 font-semibold">Production Date</th>
              <th className="py-3 px-4 font-semibold">Expiry Date</th>
              <th className="py-3 px-4 font-semibold">Shelf Life</th>
              <th className="py-3 px-4 font-semibold">Units Remaining</th>
              <th className="py-3 px-4 font-semibold">Storage Hub</th>
              <th className="py-3 px-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6D9C8]">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-[#78695C]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                  <span>Loading production batches...</span>
                </td>
              </tr>
            ) : batches.length > 0 ? (
              batches.map((batch) => {
                const isNearExpiry = batch.status === 'near_expiry';
                const isExpired = batch.status === 'expired';

                return (
                  <tr key={batch.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#2D241E]">
                      {batch.batchNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#2D241E]">{batch.productName}</p>
                      <p className="text-[11px] text-[#78695C] font-mono">{batch.variantSku}</p>
                    </td>
                    <td className="py-3 px-4 text-[#78695C] font-mono">
                      {batch.productionDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      <span className={isExpired ? 'text-red-600' : isNearExpiry ? 'text-amber-700' : 'text-[#2D241E]'}>
                        {batch.expiryDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#78695C]">
                      {batch.shelfLifeDays} days
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#2D241E]">
                      {batch.quantityRemaining} / {batch.quantityProduced}
                    </td>
                    <td className="py-3 px-4 text-[#78695C] text-[11px]">
                      {batch.storageLocation}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          isExpired
                            ? 'bg-red-100 text-red-800'
                            : isNearExpiry
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#365541]/10 text-[#365541]'
                        }`}
                      >
                        {isNearExpiry && <Clock className="w-2.5 h-2.5" />}
                        {isExpired && <AlertTriangle className="w-2.5 h-2.5" />}
                        <span>{batch.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#78695C]">
                  No production batches recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Receive Batch Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#2D241E]">
                Record Kitchen Production Batch
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Batch Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatch.batchNumber}
                    onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value.toUpperCase() })}
                    placeholder="BATCH-2026-CHK-02"
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Variant SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatch.variantSku}
                    onChange={(e) => setNewBatch({ ...newBatch, variantSku: e.target.value.toUpperCase() })}
                    placeholder="THN-CHK-200"
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Product Description *
                </label>
                <input
                  type="text"
                  required
                  value={newBatch.productName}
                  onChange={(e) => setNewBatch({ ...newBatch, productName: e.target.value })}
                  placeholder="Traditional Hassan Chakkali (200g)"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Production Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBatch.productionDate}
                    onChange={(e) => setNewBatch({ ...newBatch, productionDate: e.target.value })}
                    className="w-full px-2 py-1.5 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Shelf Life (Days) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newBatch.shelfLifeDays}
                    onChange={(e) => handleShelfLifeChange(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBatch.expiryDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                    className="w-full px-2 py-1.5 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Quantity Produced *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newBatch.quantityProduced}
                    onChange={(e) => setNewBatch({ ...newBatch, quantityProduced: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Storage Shelf / Rack *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatch.storageLocation}
                    onChange={(e) => setNewBatch({ ...newBatch, storageLocation: e.target.value })}
                    placeholder="Hassan Kitchen — Shelf A1"
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
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
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Commit Batch & Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

