'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Edit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';
import { FestivalCampaign } from '@/types/campaign';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<FestivalCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<FestivalCampaign | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/campaigns', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error('Failed to load campaigns', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleEditClick = (c: FestivalCampaign) => {
    setSelectedCampaign({ ...c });
    setFeedback(null);
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/campaigns/${selectedCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCampaign),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update campaign');
      }

      setFeedback({
        type: 'success',
        text: `Campaign "${selectedCampaign.name}" updated successfully.`,
      });
      setSelectedCampaign(null);
      fetchCampaigns();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error updating campaign' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
            Seasonal Campaigns & Festivals
            <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
              (ಹಬ್ಬಗಳ ಸಂಭ್ರಮ)
            </span>
          </h1>
          <p className="text-xs text-[#78695C] mt-0.5">
            Schedule seasonal banners, festival packaging campaigns, and everyday tea-time celebrations.
          </p>
        </div>

        <Link
          href="/#festivals"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#E6D9C8] bg-[#FFFCF7] text-[#2D241E] hover:bg-[#FAF5EC] transition-colors"
        >
          <span>View on Homepage</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
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

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-[#78695C]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#A43D2E]" />
            <span>Loading seasonal campaigns...</span>
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#A43D2E]">
                    {camp.indexNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF5EC] text-[#8C7A6B] border border-[#E6D9C8]">
                    {camp.isEvergreen ? 'Evergreen' : 'Seasonal Window'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D241E]">
                    {camp.name}
                  </h3>
                  <p className="font-kannada text-xs text-[#A43D2E]">
                    {camp.kannadaName}
                  </p>
                </div>

                <div className="text-xs text-[#78695C] space-y-1">
                  <p className="font-medium text-[#2D241E]">
                    "{camp.headlineLine1} {camp.headlineLine2}"
                  </p>
                  <p className="text-[11px] line-clamp-3 mt-1">{camp.description}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E6D9C8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#8C7A6B]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">
                    {camp.isEvergreen ? 'Year-round' : `${camp.startDate} to ${camp.endDate}`}
                  </span>
                </div>
                <button
                  onClick={() => handleEditClick(camp)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 font-semibold text-[#A43D2E] hover:bg-[#FAF5EC] rounded transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFCF7] rounded-xl border border-[#E6D9C8] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#2D241E]">
                Edit Campaign: {selectedCampaign.name}
              </h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-1 text-[#8C7A6B] hover:text-[#2D241E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCampaign} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Headline Part 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedCampaign.headlineLine1}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        headlineLine1: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Headline Part 2 *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedCampaign.headlineLine2}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        headlineLine2: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Campaign Story Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={selectedCampaign.description}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={selectedCampaign.startDate || ''}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={selectedCampaign.endDate || ''}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                  Status Banner Text
                </label>
                <input
                  type="text"
                  value={selectedCampaign.statusText || ''}
                  onChange={(e) =>
                    setSelectedCampaign({
                      ...selectedCampaign,
                      statusText: e.target.value,
                    })
                  }
                  placeholder="e.g. Taking orders for Hassan festive deliveries"
                  className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6D9C8]">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="px-3 py-1.5 border border-[#E6D9C8] rounded bg-white text-[#2D241E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-[#A43D2E] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

