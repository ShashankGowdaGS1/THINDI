'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  History,
  CheckCircle2,
  X,
  Loader2,
  CalendarClock,
} from 'lucide-react';
import { InventoryItemRecord, StockMovement } from '@/types/admin';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItemRecord[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState('');
  const [qtyChange, setQtyChange] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<StockMovement['reason']>('stock_correction');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
        setMovements(data.recentMovements || []);
      }
    } catch (e) {
      console.error('Failed to load inventory', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenAdjust = (sku?: string) => {
    if (sku) {
      setSelectedSku(sku);
    } else if (inventory.length > 0 && !selectedSku) {
      setSelectedSku(inventory[0].variantSku);
    }
    setQtyChange(10);
    setAdjustNotes('');
    setFeedback(null);
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantSku: selectedSku,
          quantityChange: Number(qtyChange),
          reason: adjustReason,
          notes: adjustNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to adjust stock');
      }

      setFeedback({
        type: 'success',
        text: `Stock for ${selectedSku} adjusted by ${qtyChange > 0 ? `+${qtyChange}` : qtyChange}.`,
      });
      setAdjustModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error adjusting stock' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPaise = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Inventory & Stock Ledger
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ದಾಸ್ತಾನು ಲೆಕ್ಕಪತ್ರ)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Real-time variant balances, reserved customer baskets, and transactional kitchen ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory/batches"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:bg-[#FAF5EC] transition-colors"
          >
            <CalendarClock className="w-4 h-4 text-[#A43D2E]" />
            <span>Production Batches</span>
          </Link>
          <button
            onClick={() => handleOpenAdjust()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#A43D2E] text-white hover:bg-[#8B3326] transition-colors shadow-xs cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Adjust Stock</span>
          </button>
        </div>
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
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Stock Balances Table */}
      <div className="space-y-3">
        <h2 className="font-serif text-base font-bold text-[#2D241E] flex items-center gap-2">
          <Boxes className="w-4 h-4 text-[#A43D2E]" />
          <span>Active Variant Stock Balances</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">SKU Code</th>
                <th className="py-3 px-4 font-semibold">Product & Pack</th>
                <th className="py-3 px-4 font-semibold">Available</th>
                <th className="py-3 px-4 font-semibold">Reserved</th>
                <th className="py-3 px-4 font-semibold">Threshold</th>
                <th className="py-3 px-4 font-semibold">Unit Price</th>
                <th className="py-3 px-4 font-semibold">Stock Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D9C8]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#78695C]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                    <span>Loading inventory balances...</span>
                  </td>
                </tr>
              ) : inventory.length > 0 ? (
                inventory.map((item) => {
                  const isLow = item.stockAvailable <= item.minThreshold;
                  return (
                    <tr key={item.variantSku} className="hover:bg-[#F2EAE0]/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#2D241E]">
                        {item.variantSku}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#2D241E]">{item.productName}</p>
                        <p className="text-[11px] text-[#78695C]">{item.variantWeight}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sm">
                        <span className={isLow ? 'text-red-600' : 'text-[#365541]'}>
                          {item.stockAvailable}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#78695C]">
                        {item.stockReserved}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#8C7A6B]">
                        {item.minThreshold}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#2D241E]">
                        {formatPaise(item.unitPricePaise)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.stockAvailable === 0
                              ? 'bg-red-100 text-red-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#365541]/10 text-[#365541]'
                          }`}
                        >
                          {item.stockAvailable === 0 ? (
                            'Out of Stock'
                          ) : isLow ? (
                            <>
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>Low Stock</span>
                            </>
                          ) : (
                            'Healthy'
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(item.variantSku)}
                          className="px-2.5 py-1 text-xs font-semibold rounded border border-[#E6D9C8] bg-white text-[#A43D2E] hover:bg-[#FAF5EC] transition-colors cursor-pointer"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#78695C]">
                    No inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactional Movement Ledger */}
      <div className="space-y-3 pt-4">
        <h2 className="font-serif text-base font-bold text-[#2D241E] flex items-center gap-2">
          <History className="w-4 h-4 text-[#8C7A6B]" />
          <span>Recent Stock Movement Ledger (Audit Trail)</span>
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">SKU</th>
                <th className="py-2.5 px-4 font-semibold">Reason</th>
                <th className="py-2.5 px-4 font-semibold">Change</th>
                <th className="py-2.5 px-4 font-semibold">Balance After</th>
                <th className="py-2.5 px-4 font-semibold">Actor / Staff</th>
                <th className="py-2.5 px-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D9C8]">
              {movements.length > 0 ? (
                movements.slice(0, 15).map((m) => (
                  <tr key={m.id} className="hover:bg-[#F2EAE0]/20 transition-colors">
                    <td className="py-2.5 px-4 text-[#78695C] font-mono">
                      {new Date(m.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[#2D241E]">
                      {m.variantSku}
                    </td>
                    <td className="py-2.5 px-4 capitalize text-[#78695C]">
                      {m.reason.replace('_', ' ')}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold">
                      <span className={m.quantityChange > 0 ? 'text-[#365541]' : 'text-red-600'}>
                        {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#2D241E]">
                      {m.newBalance}
                    </td>
                    <td className="py-2.5 px-4 text-[#8C7A6B] font-mono text-[11px]">
                      {m.actorEmail}
                    </td>
                    <td className="py-2.5 px-4 text-[#78695C] max-w-xs truncate">
                      {m.notes || '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#78695C]">
                    No stock movements recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#2D241E]">
                Adjust Inventory Stock
              </h3>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Variant SKU *
                </label>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                >
                  {inventory.map((inv) => (
                    <option key={inv.variantSku} value={inv.variantSku}>
                      {inv.variantSku} — {inv.productName} ({inv.variantWeight})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Adjustment Reason *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                >
                  <option value="production_receipt">Production Receipt (New Kitchen Fry)</option>
                  <option value="stock_correction">Physical Stock Correction / Recount</option>
                  <option value="damaged_spoilage">Damaged / Kitchen Spoilage</option>
                  <option value="expired_disposal">Expired Batch Disposal</option>
                  <option value="order_allocation">Order Allocation</option>
                  <option value="audit_adjustment">Quarterly Audit Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Quantity Delta (Positive to add, Negative to deduct) *
                </label>
                <input
                  type="number"
                  required
                  value={qtyChange}
                  onChange={(e) => setQtyChange(Number(e.target.value))}
                  placeholder="e.g. 25 or -5"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Operational Note
                </label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="e.g. Received 25 fresh jars from master cook"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6D9C8]">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-3 py-1.5 border border-[#E6D9C8] rounded bg-white text-[#2D241E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Applying...' : 'Commit Movement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
