'use client';

import React, { useState } from 'react';
import { Search, MapPin, CheckCircle2, AlertCircle, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ShippingCheckResponse } from '@/lib/shipping/types';
import { useCart } from '@/context/CartContext';
import { Button } from '../brand/Button';

export const PincodeChecker: React.FC = () => {
  const { items } = useCart();
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<ShippingCheckResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (validationError) setValidationError(null);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!pincode) {
      setValidationError('Please enter your 6-digit PIN code.');
      return;
    }

    if (pincode.length !== 6) {
      setValidationError(`PIN code must be exactly 6 digits (currently ${pincode.length}).`);
      return;
    }

    setLoading(true);
    setValidationError(null);

    // Compute cart summary for product-specific restrictions
    const hasFragileItems = items.some((i) => i.product.name.toLowerCase().includes('sandige') || i.product.name.toLowerCase().includes('appala'));
    const hasPickles = items.some((i) => i.product.name.toLowerCase().includes('pickle') || i.product.name.toLowerCase().includes('uppinakai'));
    const totalWeightGrams = items.reduce((sum, item) => sum + 400 * item.quantity, 0) || 500;

    try {
      const res = await fetch('/api/shipping/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryPincode: pincode,
          cartSummary: {
            totalWeightGrams,
            hasFragileItems,
            hasPickles,
            itemCount: items.length,
          },
        }),
      });

      const data: ShippingCheckResponse = await res.json();
      setResult(data);

      // Save checked pincode non-sensitively to localStorage for checkout reuse
      try {
        localStorage.setItem('thindi_last_checked_pincode', pincode);
      } catch {
        // ignore storage errors
      }
    } catch {
      setResult({
        status: 'unverifiable',
        pincode,
        isLiveMode: false,
        isKarnataka: false,
        message: 'Delivery availability couldn’t be checked right now. Please try again.',
        kannadaMessage: 'ವಿತರಣಾ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-cream-light/95 border border-jaggery/20 rounded-md p-5 sm:p-7 shadow-[0_8px_24px_-4px_rgba(45,36,30,0.08)]">
      <div className="mb-4">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-jaggery tracking-tight mb-1">
          Can THINDI reach you?
        </h3>
        <p className="font-sans text-xs sm:text-sm text-jaggery-muted">
          Enter your delivery PIN code to check serviceability across Karnataka.
        </p>
      </div>

      <form onSubmit={handleCheck} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pincode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit PIN code"
              className="w-full px-4 py-3 rounded bg-cream border border-jaggery/25 text-base font-mono font-medium text-jaggery placeholder:font-sans placeholder:text-sm placeholder:text-jaggery-muted/60 focus:outline-none focus:ring-2 focus:ring-leaf focus:border-leaf"
              aria-label="Enter 6-digit delivery PIN code"
              aria-invalid={Boolean(validationError)}
            />
            <span className="absolute right-3.5 top-3.5 text-jaggery-muted/40 font-mono text-xs select-none">
              {pincode.length}/6
            </span>
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={loading}
            className="bg-leaf hover:bg-leaf-light text-cream shrink-0 justify-center px-6"
            icon={
              loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )
            }
          >
            {loading ? 'Checking...' : 'Check Delivery'}
          </Button>
        </div>

        {validationError && (
          <div className="flex items-center gap-2 text-xs font-sans text-chilli mt-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </form>

      {/* SERVICEABILITY RESULT DISPLAY */}
      {result && (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 pt-4 border-t border-jaggery/15 space-y-3 animate-in fade-in duration-200"
        >
          {/* Status Badge & Headline */}
          <div className="flex items-start gap-2.5">
            {result.status === 'available' && (
              <CheckCircle2 className="w-5 h-5 text-leaf shrink-0 mt-0.5" />
            )}
            {result.status === 'demo' && (
              <ShieldCheck className="w-5 h-5 text-turmeric-deep shrink-0 mt-0.5" />
            )}
            {result.status === 'unavailable' && (
              <AlertCircle className="w-5 h-5 text-chilli shrink-0 mt-0.5" />
            )}
            {result.status === 'unverifiable' && (
              <AlertTriangle className="w-5 h-5 text-turmeric-deep shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-0.5">
                <span className="font-display font-bold text-sm sm:text-base text-jaggery">
                  {result.status === 'available' && 'Serviceable in Your Area'}
                  {result.status === 'demo' && (result.isKarnataka ? 'Karnataka Region Detected' : 'Outside Target Region')}
                  {result.status === 'unavailable' && 'Location Currently Unserviceable'}
                  {result.status === 'unverifiable' && 'Temporarily Unverifiable'}
                </span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-cream rounded border border-jaggery/15 text-jaggery">
                  {result.pincode}
                </span>
              </div>

              <p className="font-sans text-xs text-jaggery-muted leading-relaxed">
                {result.message}
              </p>

              <span className="font-kannada text-xs font-semibold text-leaf block mt-1">
                {result.kannadaMessage}
              </span>
            </div>
          </div>

          {/* Cart Specific Packaging / Fragile Notes */}
          {result.restrictions && result.restrictions.length > 0 && (
            <div className="p-3 bg-cream rounded border border-jaggery/15 text-xs text-jaggery space-y-1">
              <strong className="font-semibold block text-chilli">
                Shipment Packaging Requirements:
              </strong>
              {result.restrictions.map((r, i) => (
                <div key={i} className="text-jaggery-muted leading-snug">
                  • {r}
                </div>
              ))}
            </div>
          )}

          {/* Verified live delivery time estimate if provider returned one */}
          {result.estimatedDays && (
            <div className="p-2.5 bg-leaf/10 rounded border border-leaf/20 flex items-center justify-between text-xs text-leaf font-medium">
              <span>Estimated Delivery Window:</span>
              <strong className="font-bold">{result.estimatedDays}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
