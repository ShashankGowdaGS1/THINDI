'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const PRESET_ACCOUNTS = [
  { role: 'Super Admin', email: 'superadmin@thindi.in', pass: 'ThindiSuperAdmin@2026', desc: 'Full system privileges' },
  { role: 'Operations', email: 'ops@thindi.in', pass: 'ThindiOps@2026', desc: 'Orders & dispatch' },
  { role: 'Inventory', email: 'inventory@thindi.in', pass: 'ThindiInv@2026', desc: 'Stock & batches' },
  { role: 'Support', email: 'support@thindi.in', pass: 'ThindiSupport@2026', desc: 'Tickets & tracking' },
  { role: 'Finance', email: 'finance@thindi.in', pass: 'ThindiFinance@2026', desc: 'Reconciliation & refunds' },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      router.replace('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F0E3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#2D241E] flex items-center justify-center gap-2">
            THINDI <span className="font-kannada font-normal text-2xl text-[#A43D2E]">ತಿಂಡಿ</span>
          </span>
          <h2 className="mt-2 text-sm font-semibold tracking-wide uppercase text-[#8C7A6B]">
            Operations & Fulfilment Portal
          </h2>
          <p className="mt-1 text-xs text-[#78695C]">
            Hassan Central Kitchen & Karnataka Distribution
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-[#FFFCF7] py-8 px-6 shadow-sm border border-[#E6D9C8] rounded-xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                Staff Email Address
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@thindi.in"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] placeholder-[#B5A493] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E] focus:border-[#A43D2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D241E] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-[#E6D9C8] rounded-md bg-[#FFFDF9] text-[#2D241E] placeholder-[#B5A493] focus:outline-hidden focus:ring-1 focus:ring-[#A43D2E] focus:border-[#A43D2E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-xs text-sm font-semibold text-white bg-[#A43D2E] hover:bg-[#8B3326] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#A43D2E] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 pt-6 border-t border-[#E6D9C8]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Demo Staff Role Switcher</span>
            </div>
            <p className="text-[11px] text-[#78695C] mb-3">
              Click any staff profile to test role-based access control:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {PRESET_ACCOUNTS.map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => handleSelectPreset(preset.email, preset.pass)}
                  className="flex items-center justify-between p-2 rounded-lg border border-[#E6D9C8] bg-[#FAF5EC] hover:bg-[#EFE5D5] transition-colors text-left group"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#2D241E] group-hover:text-[#A43D2E]">
                      {preset.role}
                    </span>
                    <p className="text-[10px] text-[#78695C]">{preset.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C7A6B] bg-[#E8DDD0] px-1.5 py-0.5 rounded">
                    Fill
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer notice */}
        <p className="mt-6 text-center text-[11px] text-[#8C7A6B]">
          Restricted access. All operations, stock modifications, and refunds are logged with cryptographically verified staff identities.
        </p>
      </div>
    </div>
  );
}

