'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Building,
  ShieldCheck,
  Truck,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { BusinessSettings } from '@/types/admin';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setFeedback({ type: 'success', text: 'Business settings and FSSAI declarations saved.' });
      setSettings(data.settings);
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error updating settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#78695C]">
        <Loader2 className="w-6 h-6 animate-spin text-[#A43D2E] mb-2" />
        <p className="text-xs">Loading business profile...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2D241E] flex items-center gap-2">
          Business Profile & Kitchen Settings
          <span className="font-kannada font-normal text-lg text-[#8C7A6B]">
            (ಉದ್ಯಮ ಮತ್ತು ಅಡುಗೆಮನೆ ಸಂರಚನೆ)
          </span>
        </h1>
        <p className="text-xs text-[#78695C] mt-0.5">
          Legal business entity, Hassan kitchen origin pincode, FSSAI compliance number, and shipping thresholds.
        </p>
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

      {/* 1. Legal Entity & Central Kitchen */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-[#A43D2E]" />
          <h2 className="font-serif text-base font-bold text-[#2D241E]">
            1. Legal Entity & Central Kitchen Hub
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Brand Trade Name
            </label>
            <input
              type="text"
              required
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Kannada Name (ಕನ್ನಡ ಹೆಸರು)
            </label>
            <input
              type="text"
              required
              value={settings.kannadaName}
              onChange={(e) => setSettings({ ...settings, kannadaName: e.target.value })}
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-kannada text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Kitchen Dispatch Origin
            </label>
            <input
              type="text"
              required
              value={settings.kitchenLocation}
              onChange={(e) => setSettings({ ...settings, kitchenLocation: e.target.value })}
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Origin Pincode (Hassan)
            </label>
            <input
              type="text"
              required
              value={settings.pickupPincode}
              onChange={(e) => setSettings({ ...settings, pickupPincode: e.target.value })}
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
            Registered Operating Address
          </label>
          <input
            type="text"
            required
            value={settings.operatingAddress}
            onChange={(e) => setSettings({ ...settings, operatingAddress: e.target.value })}
            className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
          />
        </div>
      </div>

      {/* 2. FSSAI Food Safety Compliance */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#365541]" />
          <h2 className="font-serif text-base font-bold text-[#2D241E]">
            2. FSSAI Food Safety & Regulatory License
          </h2>
        </div>

        <div className="text-xs">
          <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
            14-Digit FSSAI License Number *
          </label>
          <input
            type="text"
            required
            value={settings.fssaiNumber}
            onChange={(e) => setSettings({ ...settings, fssaiNumber: e.target.value })}
            placeholder="11224334000123"
            className="w-full max-w-sm px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
          />
          <p className="text-[11px] text-[#78695C] mt-1">
            Mandatory disclosure displayed across customer footers, invoices, and product packaging labels.
          </p>
        </div>
      </div>

      {/* 3. Commerce & Delivery Rules */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#B45309]" />
          <h2 className="font-serif text-base font-bold text-[#2D241E]">
            3. Shipping Thresholds & Pricing Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              required
              min={0}
              value={Math.round(settings.freeShippingThresholdPaise / 100)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  freeShippingThresholdPaise: Number(e.target.value) * 100,
                })
              }
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
            />
            <p className="text-[10px] text-[#78695C] mt-0.5">Orders equal or above this amount ship free</p>
          </div>

          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Standard Shipping Fee (₹)
            </label>
            <input
              type="number"
              required
              min={0}
              value={Math.round(settings.standardShippingFeePaise / 100)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  standardShippingFeePaise: Number(e.target.value) * 100,
                })
              }
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
            />
            <p className="text-[10px] text-[#78695C] mt-0.5">Applied when order total is below threshold</p>
          </div>
        </div>
      </div>

      {/* 4. Customer Support Channels */}
      <div className="p-6 rounded-xl border border-[#E6D9C8] bg-[#FFFCF7] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#78695C]" />
          <h2 className="font-serif text-base font-bold text-[#2D241E]">
            4. Customer Care & Kitchen Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Support Email
            </label>
            <input
              type="email"
              required
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Support Phone
            </label>
            <input
              type="text"
              required
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] font-mono text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
              Operating Hours
            </label>
            <input
              type="text"
              required
              value={settings.supportHours}
              onChange={(e) => setSettings({ ...settings, supportHours: e.target.value })}
              className="w-full px-3 py-2 border border-[#E6D9C8] rounded bg-[#FFFDF9] text-[#2D241E]"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-[#E6D9C8]">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 rounded bg-[#A43D2E] text-white text-xs font-semibold hover:bg-[#8B3326] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
        >
          {saving ? 'Saving Settings...' : 'Save Business Settings'}
        </button>
      </div>
    </form>
  );
}

