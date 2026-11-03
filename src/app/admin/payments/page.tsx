'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  IndianRupee,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  X,
  FileCheck,
} from 'lucide-react';
import { RefundRecord } from '@/types/admin';

interface ReconciliationData {
  totalOrderValuePaise: number;
  totalCapturedPaise: number;
  totalPendingPaise: number;
  totalFailedPaise: number;
  totalRefundedPaise: number;
  netCollectedSalesPaise: number;
}

export default function AdminPaymentsPage() {
  const [reconciliation, setReconciliation] = useState<ReconciliationData | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'refunds'>('transactions');

  // Request Refund Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [refundOrderRef, setRefundOrderRef] = useState('');
  const [refundAmountRs, setRefundAmountRs] = useState<number>(100);
  const [refundReason, setRefundReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPaymentsData = async () => {
    try {
      const res = await fetch('/api/admin/payments', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setReconciliation(data.reconciliation);
        setPayments(data.paymentItems || []);
        setRefunds(data.refunds || []);
      }
    } catch (e) {
      console.error('Failed to load payments', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const handleOpenRefundModal = (orderRef: string, orderTotalPaise: number) => {
    setRefundOrderRef(orderRef);
    setRefundAmountRs(Math.round(orderTotalPaise / 100));
    setRefundReason('Damaged in transit / customer requested refund');
    setFeedback(null);
    setModalOpen(true);
  };

  const handleRequestRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          orderReference: refundOrderRef,
          amountPaise: Math.round(refundAmountRs * 100),
          reason: refundReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request refund');
      }

      setFeedback({
        type: 'success',
        text: `Refund request ${data.refund.refundReference} submitted for approval.`,
      });
      setModalOpen(false);
      fetchPaymentsData();
      setActiveTab('refunds');
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error creating refund' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveRefund = async (refundReference: string) => {
    if (!confirm(`Are you sure you want to approve and process refund ${refundReference}?`)) return;

    setFeedback(null);
    try {
      const res = await fetch('/api/admin/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          refundReference,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve refund');
      }

      setFeedback({
        type: 'success',
        text: `Refund ${refundReference} approved and processed successfully.`,
      });
      fetchPaymentsData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error approving refund' });
    }
  };

  const formatCurrency = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  const recon = reconciliation || {
    totalOrderValuePaise: 0,
    totalCapturedPaise: 0,
    totalPendingPaise: 0,
    totalFailedPaise: 0,
    totalRefundedPaise: 0,
    netCollectedSalesPaise: 0,
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Payments & Reconciliation
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ಪಾವತಿಗಳು ಮತ್ತು ಮರುಪಾವತಿ)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Razorpay gateway transactions, captured revenue, and dual-authorization refund ledger.
          </p>
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

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Gross Order Value
          </span>
          <p className="text-xl font-bold font-mono text-[#2D241E] mt-2">
            {formatCurrency(recon.totalOrderValuePaise)}
          </p>
          <p className="text-[10px] text-[#78695C] mt-0.5">All customer orders</p>
        </div>

        <div className="p-4 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Captured Payments
          </span>
          <p className="text-xl font-bold font-mono text-[#365541] mt-2">
            {formatCurrency(recon.totalCapturedPaise)}
          </p>
          <p className="text-[10px] text-[#78695C] mt-0.5">Settled via Razorpay / Demo</p>
        </div>

        <div className="p-4 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Processed Refunds
          </span>
          <p className="text-xl font-bold font-mono text-[#A43D2E] mt-2">
            {formatCurrency(recon.totalRefundedPaise)}
          </p>
          <p className="text-[10px] text-[#78695C] mt-0.5">{refunds.length} recorded refunds</p>
        </div>

        <div className="p-4 rounded-xl border border-[#E6D9C8] bg-[#FAF5EC] shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A6B] uppercase tracking-wider">
            Net Collected Sales
          </span>
          <p className="text-xl font-bold font-mono text-[#2D241E] mt-2">
            {formatCurrency(recon.netCollectedSalesPaise)}
          </p>
          <p className="text-[10px] text-[#78695C] mt-0.5">Captured minus refunds</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E6D9C8] flex items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'transactions'
              ? 'border-b-2 border-[#A43D2E] text-[#A43D2E]'
              : 'text-[#78695C] hover:text-[#2D241E]'
          }`}
        >
          Payment Transactions ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'refunds'
              ? 'border-b-2 border-[#A43D2E] text-[#A43D2E]'
              : 'text-[#78695C] hover:text-[#2D241E]'
          }`}
        >
          Refunds & Approvals ({refunds.length})
        </button>
      </div>

      {/* Tab 1: Transactions */}
      {activeTab === 'transactions' && (
        <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Gateway / Provider</th>
                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D9C8]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#78695C]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                    <span>Loading transactions...</span>
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.orderReference} className="hover:bg-[#F2EAE0]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#2D241E]">
                      {p.orderReference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#2D241E]">{p.customerName}</p>
                      <p className="text-[11px] text-[#78695C] font-mono">{p.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#2D241E]">
                      {formatCurrency(p.amountPaise)}
                    </td>
                    <td className="py-3 px-4 uppercase text-[#78695C] font-mono">
                      {p.paymentProvider}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#8C7A6B]">
                      {p.razorpayPaymentId || p.razorpayOrderId || 'DEMO_PAID'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          p.paymentStatus === 'captured'
                            ? 'bg-[#365541]/10 text-[#365541]'
                            : p.paymentStatus === 'refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.paymentStatus === 'captured' && (
                        <button
                          onClick={() => handleOpenRefundModal(p.orderReference, p.amountPaise)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-[#E6D9C8] bg-white text-[#A43D2E] hover:bg-[#FAF5EC] cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Refund</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#78695C]">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Refunds */}
      {activeTab === 'refunds' && (
        <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Refund Ref</th>
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold">Requested By</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D9C8]">
              {refunds.length > 0 ? (
                refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#A43D2E]">
                      {ref.refundReference}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#2D241E]">
                      {ref.orderReference}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#2D241E]">
                      {formatCurrency(ref.amountPaise)}
                    </td>
                    <td className="py-3 px-4 text-[#78695C] max-w-xs truncate">
                      {ref.reason}
                    </td>
                    <td className="py-3 px-4 text-[#8C7A6B] font-mono text-[11px]">
                      {ref.requestedBy}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          ref.status === 'processed'
                            ? 'bg-[#365541]/10 text-[#365541]'
                            : ref.status === 'requested'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ref.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {ref.status === 'requested' && (
                        <button
                          onClick={() => handleApproveRefund(ref.refundReference)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-[#365541] text-white hover:bg-[#2A4333] transition-colors cursor-pointer"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#78695C]">
                    No refunds requested or processed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Request Refund Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#2D241E]">
                Initiate Refund Request
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestRefundSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Order Reference *
                </label>
                <input
                  type="text"
                  required
                  value={refundOrderRef}
                  onChange={(e) => setRefundOrderRef(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Refund Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={refundAmountRs}
                  onChange={(e) => setRefundAmountRs(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Business Justification / Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Explain why this refund is being granted (e.g. food transit damage)..."
                  className="w-full p-2.5 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
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
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
