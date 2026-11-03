'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, RefreshCw, Truck } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';
import { ShippingCheckResponse } from '@/lib/shipping/types';

interface ProductDeliveryCheckerProps {
  product: Product;
  selectedVariant: ProductVariant;
}

export const ProductDeliveryChecker: React.FC<ProductDeliveryCheckerProps> = ({
  product,
  selectedVariant,
}) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShippingCheckResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (error) setError(null);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!pincode) {
      setError('Please enter your 6-digit PIN code.');
      return;
    }

    if (pincode.length !== 6) {
      setError(`PIN code must be exactly 6 digits (currently ${pincode.length}).`);
      return;
    }

    setLoading(true);
    setError(null);

    const isFragile =
      product.category === 'appala-sandige' ||
      product.name.toLowerCase().includes('sandige') ||
      product.name.toLowerCase().includes('appala');
    const isPickle =
      product.category === 'uppinakai' ||
      product.name.toLowerCase().includes('pickle') ||
      product.name.toLowerCase().includes('uppinakai');

    // Parse weight roughly for estimation
    let weightGrams = 400;
    if (selectedVariant.weight.includes('200g')) weightGrams = 200;
    else if (selectedVariant.weight.includes('400g')) weightGrams = 400;
    else if (selectedVariant.weight.includes('500g')) weightGrams = 500;
    else if (selectedVariant.weight.includes('1kg')) weightGrams = 1000;

    try {
      const res = await fetch('/api/shipping/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryPincode: pincode,
          cartSummary: {
            totalWeightGrams: weightGrams,
            hasFragileItems: isFragile,
            hasPickles: isPickle,
            itemCount: 1,
          },
        }),
      });

      const data: ShippingCheckResponse = await res.json();
      setResult(data);
    } catch {
      setError('Unable to verify PIN code serviceability at this moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 border-t border-jaggery/10">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="w-4 h-4 text-leaf" />
        <span className="text-xs font-semibold uppercase tracking-wider text-jaggery">
          Check delivery to your area
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit PIN code"
            value={pincode}
            onChange={handleInputChange}
            aria-label="Enter 6-digit delivery PIN code"
            className="w-full px-3 py-2 rounded border border-jaggery/20 bg-warm-white text-jaggery text-xs font-mono placeholder:font-sans placeholder-jaggery/40 focus:outline-none focus:ring-1 focus:ring-leaf focus:border-leaf"
          />
        </div>

        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-4 py-2 rounded bg-jaggery text-cream hover:bg-jaggery/90 disabled:opacity-50 text-xs font-sans font-medium transition-colors cursor-pointer shrink-0"
        >
          {loading ? (
            <span className="inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Checking
            </span>
          ) : (
            'Check'
          )}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-xs text-chilli flex items-center gap-1 font-sans">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {result && (
        <div
          className={`mt-2.5 p-2.5 rounded text-xs font-sans border ${
            result.status === 'available' || (result.status === 'demo' && result.isKarnataka)
              ? 'bg-leaf/5 border-leaf/20 text-leaf-dark'
              : 'bg-chilli/5 border-chilli/20 text-chilli-dark'
          }`}
        >
          <div className="flex items-start gap-2">
            {result.status === 'available' || (result.status === 'demo' && result.isKarnataka) ? (
              <CheckCircle2 className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-chilli shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{result.message}</p>
              {(result.status === 'available' || result.status === 'demo') && (
                <p className="text-[11px] text-jaggery/70">
                  {result.estimatedDays
                    ? `Estimated dispatch: ${result.estimatedDays}`
                    : 'Dispatch schedules activated upon order confirmation.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
