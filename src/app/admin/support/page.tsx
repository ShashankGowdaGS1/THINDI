'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';
import { SupportTicket } from '@/types/tracking';

type TicketStatus = SupportTicket['status'];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newStatus, setNewStatus] = useState<TicketStatus>('in_progress');
  const [staffNote, setStaffNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/admin/support?status=${statusFilter}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error('Failed to load tickets', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleOpenTicket = (t: SupportTicket) => {
    setSelectedTicket(t);
    setNewStatus(t.status);
    setStaffNote('');
    setFeedback(null);
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/support/${selectedTicket.ticketReference}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: staffNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update ticket');
      }

      setFeedback({
        type: 'success',
        text: `Ticket ${selectedTicket.ticketReference} updated to ${newStatus.toUpperCase()}.`,
      });
      setSelectedTicket(null);
      fetchTickets();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error updating ticket' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Customer Support Triage
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ಗ್ರಾಹಕ ಸೇವೆ ಮತ್ತು ಸಹಾಯ)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Resolve delivery queries, transit damages, and order inquiries with verified customer tickets.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8C7A6B] font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[#E6D9C8] rounded-md bg-[#FFFCF7] text-[#2D241E]"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
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
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tickets Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6D9C8] bg-[#FAF5EC]/70 text-[#78695C] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Ticket Ref</th>
              <th className="py-3 px-4 font-semibold">Order Ref</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Subject / Message</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6D9C8]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#78695C]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
                  <span>Loading support tickets...</span>
                </td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-[#F2EAE0]/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#A43D2E]">
                    {t.ticketReference}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#2D241E]">
                    {t.orderReference ? (
                      <Link
                        href={`/admin/orders/${t.orderReference}`}
                        className="hover:underline font-semibold"
                      >
                        {t.orderReference}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#2D241E]">{t.customerName}</p>
                    <p className="text-[11px] text-[#78695C] font-mono">{t.customerEmail}</p>
                  </td>
                  <td className="py-3 px-4 text-[#78695C] capitalize">
                    {t.category.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-semibold text-[#2D241E] truncate">{t.subject}</p>
                    <p className="text-[#78695C] text-[11px] truncate">{t.message}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        t.status === 'resolved'
                          ? 'bg-[#365541]/10 text-[#365541]'
                          : t.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : t.status === 'closed'
                          ? 'bg-[#F2EAE0] text-[#78695C]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenTicket(t)}
                      className="px-2.5 py-1 text-xs font-semibold rounded border border-[#E6D9C8] bg-white text-[#A43D2E] hover:bg-[#FAF5EC] cursor-pointer"
                    >
                      Triage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#78695C]">
                  No support tickets found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Triage Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-[#8C7A6B]">
                  {selectedTicket.ticketReference}
                </span>
                <h3 className="font-serif text-base font-bold text-[#2D241E]">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#FAF5EC] rounded-lg border border-[#E6D9C8] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Customer:</span>
                <span className="font-semibold text-[#2D241E]">
                  {selectedTicket.customerName} ({selectedTicket.customerEmail})
                </span>
              </div>
              {selectedTicket.orderReference && (
                <div className="flex justify-between">
                  <span className="text-[#8C7A6B]">Order Ref:</span>
                  <Link
                    href={`/admin/orders/${selectedTicket.orderReference}`}
                    target="_blank"
                    className="font-mono text-[#A43D2E] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{selectedTicket.orderReference}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
              <div className="pt-2 border-t border-[#E6D9C8] text-[#2D241E] whitespace-pre-wrap">
                {selectedTicket.message}
              </div>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Update Ticket Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Internal Staff Note / Resolution Explanation
                </label>
                <textarea
                  rows={2}
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="e.g. Spoke to Bluedart hub manager; delivered to security desk at Malleshwaram..."
                  className="w-full p-2.5 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6D9C8]">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-3 py-1.5 border border-[#E6D9C8] rounded bg-white text-[#2D241E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Commit Status & Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
