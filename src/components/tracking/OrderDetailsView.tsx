'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/brand/Button';
import { ShipmentTimeline } from './ShipmentTimeline';
import { OrderSupportModal } from './OrderSupportModal';
import { OrderRecord } from '@/types/checkout';
import { ShipmentRecord } from '@/types/tracking';

interface OrderDetailsViewProps {
  order: OrderRecord;
  shipment: ShipmentRecord | null;
}

export const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ order, shipment }) => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const {
    orderReference,
    orderStatus,
    paymentStatus,
    shippingStatus,
    customer,
    shippingAddress,
    items,
    pricing,
    isDemoMode,
    createdAt,
  } = order;

  // Contextual headline
  let headline = 'Good things are coming.';
  let kannadaAccent = 'ನಿಮ್ಮ ತಿಂಡಿ ತಯಾರಾಗುತ್ತಿದೆ.';
  if (orderStatus === 'delivered' || shipment?.normalizedStatus === 'Delivered') {
    headline = 'Your Thindi has arrived!';
    kannadaAccent = 'ನಿಮ್ಮ ಮನೆಗೆ ತಲುಪಿದೆ!';
  } else if (paymentStatus === 'pending') {
    headline = "We're checking your payment.";
    kannadaAccent = 'ಪಾವತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.';
  } else if (orderStatus === 'cancelled') {
    headline = 'Your order was cancelled.';
    kannadaAccent = 'ಆರ್ಡರ್ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.';
  }

  const finalAmountRupees = pricing.finalAmountPaise / 100;

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Contextual Banner Header */}
        <div className="p-7 sm:p-9 rounded-2xl bg-warm-white border border-jaggery/15 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-chilli font-sans block">
              Order Tracking & Details
            </span>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream border border-jaggery/15 font-mono text-xs font-bold text-jaggery">
              <span>Order:</span>
              <span className="text-chilli">{orderReference}</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery">
            {headline}
          </h1>

          <p className="font-kannada text-base sm:text-lg text-jaggery/60 font-medium">
            {kannadaAccent}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-sans text-jaggery/70">
            <span>
              Placed on:{' '}
              <strong className="text-jaggery font-mono">
                {new Date(createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
            </span>
            <span>•</span>
            <span>
              Payment:{' '}
              <span
                className={`font-semibold capitalize ${
                  paymentStatus === 'captured' ? 'text-leaf' : 'text-chilli'
                }`}
              >
                {paymentStatus}
              </span>
            </span>
            <span>•</span>
            <span>
              Kitchen Status:{' '}
              <span className="font-semibold text-jaggery capitalize">{orderStatus}</span>
            </span>
          </div>
        </div>

        {/* Shipment Journey Timeline */}
        <ShipmentTimeline
          shipment={shipment}
          orderStatus={orderStatus}
          isDemoMode={isDemoMode}
        />

        {/* 2-Column Grid: Ordered Items & Delivery Destination */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Ordered Items (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-warm-white border border-jaggery/15 space-y-4">
            <h2 className="font-serif text-lg font-bold text-jaggery pb-2 border-b border-jaggery/10 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-chilli" />
              Ordered Items ({items.length})
            </h2>

            <div className="divide-y divide-jaggery/10">
              {items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded bg-cream overflow-hidden shrink-0 border border-jaggery/10">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-jaggery block text-sm">
                        {item.name}
                      </span>
                      {item.kannadaName && (
                        <span className="font-kannada text-jaggery/55 text-xs block">
                          {item.kannadaName}
                        </span>
                      )}
                      <span className="text-jaggery/60 text-xs font-mono">
                        {item.weight} × {item.quantity}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-sm text-jaggery">
                    ₹{item.lineTotalPaise / 100}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-3 border-t border-jaggery/10 space-y-2 text-xs font-sans">
              <div className="flex justify-between text-jaggery/75">
                <span>Items Subtotal</span>
                <span className="font-mono">₹{pricing.itemsSubtotalPaise / 100}</span>
              </div>
              {pricing.discountAmountPaise > 0 && (
                <div className="flex justify-between text-leaf font-medium">
                  <span>Discount</span>
                  <span className="font-mono">-₹{pricing.discountAmountPaise / 100}</span>
                </div>
              )}
              <div className="flex justify-between text-jaggery/75">
                <span>Delivery Charge</span>
                <span className="font-mono">
                  {pricing.isShippingFree ? (
                    <span className="text-leaf font-bold">FREE</span>
                  ) : (
                    `₹${pricing.shippingChargePaise / 100}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-jaggery/10 flex justify-between font-bold text-sm text-jaggery">
                <span>Total Amount Paid</span>
                <span className="font-serif text-lg">₹{finalAmountRupees}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Destination & Support (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Destination Snapshot */}
            <div className="p-6 rounded-2xl bg-warm-white border border-jaggery/15 space-y-3 text-xs font-sans">
              <h3 className="font-serif text-base font-bold text-jaggery pb-2 border-b border-jaggery/10 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-leaf" />
                Delivery Destination
              </h3>

              <div className="space-y-1 text-jaggery/80 leading-relaxed">
                <p className="font-bold text-jaggery">{shippingAddress.fullName}</p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>
                  {shippingAddress.city}, Karnataka - {shippingAddress.pincode}
                </p>
                <p className="font-mono text-jaggery/60 pt-1">Phone: +91 {shippingAddress.phone}</p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-leaf font-medium">
                <ShieldCheck className="w-4 h-4 text-leaf" />
                <span>Verified Customer Dispatch</span>
              </div>
            </div>

            {/* Support CTA Box */}
            <div className="p-6 rounded-2xl bg-cream border border-jaggery/15 space-y-3">
              <div className="flex items-center gap-2 text-jaggery">
                <HelpCircle className="w-5 h-5 text-chilli" />
                <h3 className="font-serif text-base font-bold">Need help with this order?</h3>
              </div>
              <p className="text-xs text-jaggery/75 font-sans leading-relaxed">
                Have questions regarding delivery, damaged packing, or missing items? Contact our Hassan kitchen care team directly.
              </p>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsSupportOpen(true)}
                className="w-full justify-center text-xs"
              >
                Contact Hassan Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Enquiry Modal */}
      <OrderSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        orderReference={orderReference}
        customerEmail={customer.email}
      />
    </div>
  );
};

