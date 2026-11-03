import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle2, AlertCircle, MapPin, Truck, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { getOrderByReference } from '@/lib/checkout/orderStore';
import { Button } from '@/components/brand/Button';
import { ChakkaliMotif } from '@/components/brand/ChakkaliMotif';

interface ConfirmationPageProps {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: ConfirmationPageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Order Confirmed: ${reference} | THINDI Foods`,
    description: `Order confirmation for reference ${reference}. Handcrafted traditional Karnataka snacks from Hassan.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { reference } = await params;
  const { token } = await searchParams;

  const order = getOrderByReference(reference, token);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
        <Header />
        <main className="flex-1 py-20 px-4 max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-chilli/10 text-chilli flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-jaggery">
            Order Lookup Restricted
          </h1>
          <p className="text-sm text-jaggery/70 leading-relaxed font-sans">
            To protect customer privacy, an order can only be viewed with its verified security access token.
          </p>
          <div className="pt-2">
            <Button href="/" variant="primary">
              Return to Homepage
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isConfirmed = order.orderStatus === 'confirmed';
  const finalAmountRupees = order.pricing.finalAmountPaise / 100;

  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      <Header />

        <main className="flex-1 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Confirmation Banner */}
            <div className="p-8 sm:p-10 rounded-2xl bg-warm-white border border-jaggery/15 shadow-sm text-center space-y-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-leaf/10 text-leaf flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-widest text-leaf font-sans block">
                Order Confirmed · Hassan Dispatch
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery">
                {isConfirmed ? 'Good thindi is on the way.' : "We're checking your payment."}
              </h1>

              <p className="font-kannada text-lg text-jaggery/60 font-medium">
                ನಿಮ್ಮ ತಿಂಡಿ ತಯಾರಿ ಶುರುವಾಗಿದೆ!
              </p>

              <div className="pt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream border border-jaggery/15 font-mono text-sm font-bold text-jaggery">
                <span>Ref:</span>
                <span className="text-chilli">{order.orderReference}</span>
              </div>

              {order.isDemoMode && (
                <div className="pt-2 max-w-sm mx-auto">
                  <span className="inline-block text-[11px] font-sans px-3 py-1 rounded bg-turmeric/20 text-jaggery font-semibold">
                    Demo Mode Order: Recorded in local development simulation
                  </span>
                </div>
              )}
            </div>

            {/* Order Details & Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Items List (7 cols) */}
              <div className="md:col-span-7 p-6 rounded-xl bg-warm-white border border-jaggery/15 space-y-4">
                <h2 className="font-serif text-lg font-bold text-jaggery pb-2 border-b border-jaggery/10">
                  Ordered Items ({order.items.length})
                </h2>

                <div className="divide-y divide-jaggery/10">
                  {order.items.map((item, idx) => (
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

                {/* Subtotal & Delivery Breakup */}
                <div className="pt-3 border-t border-jaggery/10 space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-jaggery/75">
                    <span>Snack Subtotal</span>
                    <span className="font-mono">₹{order.pricing.itemsSubtotalPaise / 100}</span>
                  </div>
                  {order.pricing.discountAmountPaise > 0 && (
                    <div className="flex justify-between text-leaf font-medium">
                      <span>Discount</span>
                      <span className="font-mono">-₹{order.pricing.discountAmountPaise / 100}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-jaggery/75">
                    <span>Delivery Charge</span>
                    <span className="font-mono">
                      {order.pricing.isShippingFree ? (
                        <span className="text-leaf font-bold">FREE</span>
                      ) : (
                        `₹${order.pricing.shippingChargePaise / 100}`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-jaggery/10 flex justify-between font-bold text-sm text-jaggery">
                    <span>Total Paid</span>
                    <span className="font-serif text-lg">₹{finalAmountRupees}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Delivery & Next Steps (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                {/* Delivery Snapshot */}
                <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 space-y-3 text-xs font-sans">
                  <h3 className="font-serif text-base font-bold text-jaggery pb-2 border-b border-jaggery/10 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-leaf" />
                    Delivery Destination
                  </h3>

                  <div className="space-y-1 text-jaggery/80 leading-relaxed">
                    <p className="font-bold text-jaggery">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>
                      {order.shippingAddress.city}, Karnataka - {order.shippingAddress.pincode}
                    </p>
                    <p className="font-mono text-jaggery/60 pt-1">Phone: +91 {order.shippingAddress.phone}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-leaf font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Estimated: 2–4 business days</span>
                  </div>
                </div>

                {/* Track Order Journey */}
                <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 text-center space-y-3">
                  <p className="text-xs text-jaggery/80 font-medium font-sans">
                    Monitor courier dispatch and real-time milestones:
                  </p>
                  <Button
                    href={`/orders/${order.orderReference}?token=${order.accessToken}`}
                    variant="outline"
                    size="md"
                    className="w-full justify-center"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Track Shipment Timeline
                  </Button>
                </div>

                {/* Return to Shop */}
                <div className="p-6 rounded-xl bg-cream border border-jaggery/15 text-center space-y-3">
                  <p className="text-xs text-jaggery/70">
                    Want to send another snack bundle to family or friends?
                  </p>
                  <Button href="/shop" variant="primary" size="md" className="w-full justify-center">
                    Explore More Thindi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
}

