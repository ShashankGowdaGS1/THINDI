import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Button } from '@/components/brand/Button';
import { OrderDetailsView } from '@/components/tracking/OrderDetailsView';
import { findOrderByReference } from '@/lib/checkout/orderStore';
import { verifyOrderSessionToken } from '@/lib/tracking/security';
import { trackingProvider } from '@/lib/shipping/trackingAdapter';

interface OrderPageProps {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Order ${reference} | THINDI Foods`,
    description: `Track delivery progress and order details for reference ${reference}. Handcrafted in Hassan, Karnataka.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { reference } = await params;
  const { token } = await searchParams;

  const normalizedRef = reference.trim().toUpperCase();
  const order = findOrderByReference(normalizedRef);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
        <Header />
        <main className="flex-1 py-24 px-4 max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-chilli/10 text-chilli flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-jaggery">
            Order Not Found
          </h1>
          <p className="text-xs text-jaggery/70 leading-relaxed font-sans">
            No record was found matching reference <strong className="font-mono text-jaggery">{normalizedRef}</strong>. Please check your confirmation email for the exact reference.
          </p>
          <div className="pt-2">
            <Button href="/track-order" variant="primary">
              Return to Track Order
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check authorization: Either verified session cookie OR checkout confirmation token
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('thindi_order_session')?.value;
  const isSessionValid = verifyOrderSessionToken(sessionCookie, normalizedRef);
  const isTokenValid = Boolean(token && order.accessToken === token.trim());

  if (!isSessionValid && !isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
        <Header />
        <main className="flex-1 py-24 px-4 max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-jaggery/10 text-jaggery flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-chilli block">
            Identity Verification Required
          </span>
          <h1 className="font-serif text-2xl font-bold text-jaggery">
            Protecting Customer Privacy
          </h1>
          <p className="text-xs text-jaggery/70 leading-relaxed font-sans">
            To protect recipient address and contact details, please verify order ownership using your contact email.
          </p>
          <div className="pt-2">
            <Button
              href={`/track-order?ref=${encodeURIComponent(normalizedRef)}`}
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Verify & Track Order
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Retrieve shipment details
  const shipment = await trackingProvider.getTrackingDetails({
    orderReference: normalizedRef,
  });

  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      <Header />
      <main className="flex-1">
        <OrderDetailsView order={order} shipment={shipment} />
      </main>
      <Footer />
    </div>
  );
}

