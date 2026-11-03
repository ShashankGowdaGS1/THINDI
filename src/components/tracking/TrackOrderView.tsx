'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Package,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  KeyRound,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/brand/Button';
import { ChakkaliMotif } from '@/components/brand/ChakkaliMotif';

export const TrackOrderView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRef = searchParams.get('ref') || '';

  // Form State
  const [orderReference, setOrderReference] = useState(initialRef);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');

  // Verification Code State
  const [code, setCode] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [neutralMessage, setNeutralMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle Step 1: Request Verification Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeutralMessage(null);

    try {
      const res = await fetch('/api/orders/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: orderReference.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request tracking verification.');
      }

      setNeutralMessage(data.message);
      if (data.demoOtp) {
        setDemoCodeHint(data.demoOtp);
      }
      setStep('verify');

      // Start 60 second cooldown
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Unable to start verification.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Submit Verification Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: orderReference.trim(),
          code: code.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      // Successful verification sets HttpOnly cookie and redirects
      router.push(data.redirectUrl || `/orders/${encodeURIComponent(orderReference.trim().toUpperCase())}`);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 pb-12 sm:pt-8 sm:pb-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Compact Editorial Introduction */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-full bg-warm-white border border-jaggery/15 flex items-center justify-center mx-auto text-jaggery shadow-sm mb-2">
            <ChakkaliMotif size={32} color="#2D241E" />
          </div>

          <span className="text-[11px] font-semibold uppercase tracking-widest text-chilli font-sans block">
            YOUR THINDI JOURNEY
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-jaggery">
            Where&apos;s my Thindi?
          </h1>

          <p className="font-kannada text-base text-jaggery/60 font-semibold">
            ನನ್ನ ತಿಂಡಿ ಎಲ್ಲಿದೆ?
          </p>

          <p className="font-sans text-xs sm:text-sm text-jaggery-muted max-w-md mx-auto leading-relaxed">
            Enter your order reference and email to securely view your shipment status.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-chilli/10 border border-chilli/30 text-xs sm:text-sm text-chilli-dark flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-chilli shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Neutral Message Notice */}
        {neutralMessage && step === 'verify' && (
          <div className="mb-6 p-4 rounded-xl bg-leaf/10 border border-leaf/30 text-xs text-jaggery space-y-1">
            <div className="font-bold text-leaf flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Verification In Progress
            </div>
            <p className="text-jaggery/80 leading-relaxed font-sans">{neutralMessage}</p>
          </div>
        )}

        {/* Demo Mode OTP Hint (when email service unconfigured) */}
        {demoCodeHint && step === 'verify' && (
          <div className="mb-6 p-3.5 rounded-xl bg-turmeric/20 border border-turmeric/40 text-xs text-jaggery space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                Demo Mode: Simulated OTP Code
              </span>
              <button
                type="button"
                onClick={() => setCode(demoCodeHint)}
                className="text-[11px] font-bold text-chilli underline cursor-pointer"
              >
                Auto-fill Code
              </button>
            </div>
            <p className="font-mono text-base font-bold text-chilli tracking-widest text-center py-1 bg-cream rounded border border-jaggery/10">
              {demoCodeHint}
            </p>
            <p className="text-[10px] text-jaggery/65">
              Notice: Since live email provider is unconfigured, this simulated code is provided for interface testing.
            </p>
          </div>
        )}

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-warm-white border border-jaggery/15 shadow-sm space-y-5">
          {step === 'request' ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-3 text-xs font-sans">
                <div>
                  <label className="block uppercase font-bold text-jaggery mb-1">
                    Order Reference <span className="text-chilli">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. THN-2026-DEMO01"
                    value={orderReference}
                    onChange={(e) => setOrderReference(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery font-mono text-sm uppercase focus:outline-none focus:border-chilli"
                  />
                  <span className="text-[11px] text-jaggery/55 block mt-1">
                    Sent in your order confirmation email and invoice.
                  </span>
                </div>

                <div>
                  <label className="block uppercase font-bold text-jaggery mb-1">
                    Email Address <span className="text-chilli">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rohini@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                  />
                  <span className="text-[11px] text-jaggery/55 block mt-1">
                    Used to confirm identity before sharing destination & timeline details.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full justify-center text-sm font-semibold"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {loading ? 'Verifying...' : 'Send Verification Code'}
                </Button>
              </div>

              <div className="pt-3 border-t border-jaggery/10 flex items-center justify-between text-[11px] text-jaggery/65">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-leaf" />
                  Privacy-first guest access
                </span>
                <span>Hassan Kitchen Care</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-jaggery">
                    Enter 6-Digit Code
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="text-xs font-semibold text-chilli hover:underline"
                  >
                    Change Order Details
                  </button>
                </div>

                <div className="p-3 bg-cream rounded-lg border border-jaggery/10 text-xs text-jaggery/80">
                  Verifying order: <strong className="font-mono text-jaggery">{orderReference}</strong>
                </div>

                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.5em] px-4 py-3 rounded border border-jaggery/20 bg-cream text-jaggery font-mono text-2xl font-bold focus:outline-none focus:border-chilli"
                />
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading || code.length !== 6}
                  className="w-full justify-center text-sm font-semibold"
                  icon={<KeyRound className="w-4 h-4" />}
                >
                  {loading ? 'Validating...' : 'Verify & View Timeline'}
                </Button>

                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <span className="text-xs text-jaggery/55">
                      Resend code in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRequestCode}
                      className="text-xs font-semibold text-chilli hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Demo Sample Helper Buttons */}
        <div className="mt-8 p-4 rounded-xl bg-cream border border-jaggery/15 text-center space-y-2">
          <p className="text-xs text-jaggery/70 font-sans">
            Want to test sample tracking journeys? Click a demo order below:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setOrderReference('THN-2026-DEMO01');
                setEmail('rohini@example.com');
                setStep('request');
              }}
              className="text-xs px-2.5 py-1 rounded bg-warm-white border border-jaggery/15 font-mono text-jaggery hover:border-chilli transition-colors"
            >
              THN-2026-DEMO01 (In Transit)
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderReference('THN-2026-DEMO02');
                setEmail('anand@example.com');
                setStep('request');
              }}
              className="text-xs px-2.5 py-1 rounded bg-warm-white border border-jaggery/15 font-mono text-jaggery hover:border-chilli transition-colors"
            >
              THN-2026-DEMO02 (Delivered)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

