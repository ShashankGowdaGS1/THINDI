'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '../brand/Button';
import { ChakkaliMotif } from '../brand/ChakkaliMotif';
import { CheckoutCustomer, CheckoutAddress, CheckoutPricing, CheckoutItemSnapshot } from '@/types/checkout';

interface CalculationState {
  pricing: CheckoutPricing;
  snapshots: CheckoutItemSnapshot[];
  itemCount: number;
  hasFragile: boolean;
  hasPickle: boolean;
  totalWeightGrams: number;
}

export const CheckoutWizard: React.FC = () => {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customer Contact State
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    fullName: '',
    phone: '',
    email: '',
  });

  // Shipping Address State
  const [address, setAddress] = useState<CheckoutAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Bengaluru',
    district: '',
    state: 'Karnataka',
    pincode: '560001',
  });

  // Server Authoritative Calculation Result
  const [calcResult, setCalcResult] = useState<CalculationState | null>(null);

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Demo Payment Modal State
  const [demoOrderInfo, setDemoOrderInfo] = useState<{
    orderReference: string;
    accessToken: string;
    razorpayOrderId: string;
    amountPaise: number;
  } | null>(null);

  const [isSummaryOpenMobile, setIsSummaryOpenMobile] = useState(false);

  // Calculate pricing server-side on load and when pincode or promo changes
  const refreshServerPricing = async (pincodeVal?: string, promo?: string) => {
    if (items.length === 0) return;
    try {
      const payloadItems = items.map((i) => ({
        productId: i.product.id,
        variantId: i.variant.id,
        quantity: i.quantity,
      }));

      const res = await fetch('/api/checkout/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: payloadItems,
          pincode: pincodeVal || address.pincode,
          promoCode: promo || appliedPromo,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCalcResult({
          pricing: data.pricing,
          snapshots: data.items,
          itemCount: data.itemCount,
          hasFragile: data.hasFragile,
          hasPickle: data.hasPickle,
          totalWeightGrams: data.totalWeightGrams,
        });
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    refreshServerPricing();
  }, [items]);

  if (items.length === 0 && !demoOrderInfo) {
    return (
      <div className="py-24 max-w-md mx-auto px-4 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-jaggery mb-3">
          Your cart is empty
        </h1>
        <p className="text-sm text-jaggery/70 mb-6">
          Add some delicious traditional savouries before checking out.
        </p>
        <Button href="/shop" variant="primary">
          Explore Shop
        </Button>
      </div>
    );
  }

  // Handle Step 1 Validation & Proceed to Step 2
  const handleProceedToDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.email.trim()) {
      setError('Please provide all contact details.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(customer.phone.trim())) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!address.addressLine1.trim() || !address.city.trim() || !address.pincode.trim()) {
      setError('Please complete the mandatory address fields.');
      return;
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setError('PIN code must be exactly 6 digits.');
      return;
    }

    const prefix = address.pincode.trim().substring(0, 2);
    if (!['56', '57', '58', '59'].includes(prefix)) {
      setError('THINDI currently delivers exclusively across Karnataka PIN codes (56xxxx - 59xxxx).');
      return;
    }

    refreshServerPricing(address.pincode);
    setStep(2);
  };

  // Handle Step 2 Proceed to Review & Payment
  const handleProceedToPayment = () => {
    setStep(3);
  };

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'HASSAN10') {
      setAppliedPromo('HASSAN10');
      refreshServerPricing(address.pincode, 'HASSAN10');
    } else {
      setError('Invalid coupon code. Try HASSAN10 for orders above ₹300.');
    }
  };

  // Step 3: Initiate Order Creation and Razorpay payment
  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const payloadItems = items.map((i) => ({
        productId: i.product.id,
        variantId: i.variant.id,
        quantity: i.quantity,
      }));

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          shippingAddress: {
            ...address,
            fullName: address.fullName.trim() || customer.fullName.trim(),
            phone: address.phone.trim() || customer.phone.trim(),
          },
          items: payloadItems,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || orderData.error || 'Failed to initialize order.');
      }

      // If Razorpay live/test credentials are fully configured
      if (!orderData.isDemoMode && typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: 'INR',
          name: 'THINDI Foods',
          description: `Order ${orderData.orderReference}`,
          image: '/images/products/chakkali.jpg',
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            await verifyAndCompleteOrder({
              orderReference: orderData.orderReference,
              accessToken: orderData.accessToken,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              isDemoMode: false,
            });
          },
          prefill: {
            name: customer.fullName,
            email: customer.email,
            contact: customer.phone,
          },
          theme: {
            color: '#2D241E',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setError(`Payment declined: ${resp.error?.description || 'Please try another method.'}`);
          setLoading(false);
        });
        rzp.open();
        return;
      }

      // If in Demo / Local Dev Simulation mode
      setDemoOrderInfo({
        orderReference: orderData.orderReference,
        accessToken: orderData.accessToken,
        razorpayOrderId: orderData.razorpayOrderId,
        amountPaise: orderData.amountPaise,
      });
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Complete Payment Verification
  const verifyAndCompleteOrder = async (verifyPayload: {
    orderReference: string;
    accessToken: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    isDemoMode: boolean;
  }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment signature verification failed.');
      }

      // Clear client cart only upon verified order confirmation
      clearCart();
      router.push(data.redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed.');
      setLoading(false);
    }
  };

  const finalPayableRupees = calcResult
    ? calcResult.pricing.finalAmountPaise / 100
    : subtotal + (subtotal >= 499 ? 0 : 49);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="mb-10 text-center sm:text-left pb-6 border-b border-jaggery/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-[2px] bg-chilli" />
            <span className="text-xs font-semibold uppercase tracking-widest text-chilli font-sans">
              Secure Checkout · Hassan Dispatch
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery">
            Your thindi is almost home.
          </h1>

          <p className="font-kannada text-lg text-jaggery/60 font-medium mt-1">
            ನಿಮ್ಮ ತಿಂಡಿ, ನಿಮ್ಮ ಮನೆಗೆ.
          </p>

          <p className="font-sans text-sm sm:text-base text-jaggery/75 mt-1">
            Just a few details before your favourite snacks are on their way.
          </p>
        </div>

        {/* Progress Step Indicator */}
        <div className="mb-8 max-w-xl mx-auto sm:mx-0">
          <div className="flex items-center justify-between text-xs font-sans font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-chilli' : 'text-jaggery/40'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-chilli text-cream' : 'bg-jaggery/10 text-jaggery'}`}>
                1
              </span>
              <span>Delivery Address</span>
            </div>

            <span className="w-8 sm:w-16 h-[1px] bg-jaggery/20" />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-chilli' : 'text-jaggery/40'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-chilli text-cream' : 'bg-jaggery/10 text-jaggery'}`}>
                2
              </span>
              <span>Shipping Review</span>
            </div>

            <span className="w-8 sm:w-16 h-[1px] bg-jaggery/20" />

            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-chilli' : 'text-jaggery/40'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-chilli text-cream' : 'bg-jaggery/10 text-jaggery'}`}>
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-chilli/10 border border-chilli/30 text-xs sm:text-sm text-chilli-dark flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-chilli shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>Action required:</strong> {error}
            </div>
          </div>
        )}

        {/* Two-Column Layout (Forms Left ~60%, Persistent Summary Right ~40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ========================================================
              LEFT COLUMN: 3-Step Checkout Wizard Content
              ======================================================== */}
          <div className="lg:col-span-7">
            {/* STEP 1: Contact & Delivery Address Form */}
            {step === 1 && (
              <form onSubmit={handleProceedToDelivery} className="space-y-6">
                <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 space-y-5">
                  <h2 className="font-serif text-xl font-bold text-jaggery pb-2 border-b border-jaggery/10">
                    1. Contact Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="sm:col-span-2">
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        Full Name <span className="text-chilli">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohini Kumar"
                        value={customer.fullName}
                        onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        Mobile Number <span className="text-chilli">*</span>
                      </label>
                      <div className="flex">
                        <span className="px-3 py-2.5 bg-jaggery/5 border border-r-0 border-jaggery/20 rounded-l text-xs font-mono text-jaggery flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="98450 XXXXX"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-3.5 py-2.5 rounded-r border border-jaggery/20 bg-cream text-jaggery text-sm font-mono focus:outline-none focus:border-chilli"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        Email Address <span className="text-chilli">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rohini@example.com"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 space-y-5">
                  <h2 className="font-serif text-xl font-bold text-jaggery pb-2 border-b border-jaggery/10">
                    2. Karnataka Delivery Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="sm:col-span-2">
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        Flat, House no., Building, Apartment <span className="text-chilli">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. #42, 3rd Cross, Malleshwaram"
                        value={address.addressLine1}
                        onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        Area, Street, Sector, Village (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Temple"
                        value={address.addressLine2}
                        onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        City / Town <span className="text-chilli">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bengaluru"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm focus:outline-none focus:border-chilli"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        PIN Code <span className="text-chilli">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="560001"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 rounded border border-jaggery/20 bg-cream text-jaggery text-sm font-mono focus:outline-none focus:border-chilli"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-semibold text-jaggery mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Karnataka"
                        className="w-full px-3.5 py-2.5 rounded border border-jaggery/15 bg-jaggery/5 text-jaggery/70 text-sm font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link href="/cart" className="text-xs font-semibold text-jaggery/60 hover:text-jaggery">
                    ← Return to Cart
                  </Link>

                  <Button type="submit" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    Continue to Delivery Review
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: Delivery & Packaging Review */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-jaggery/10">
                    <h2 className="font-serif text-xl font-bold text-jaggery">
                      2. Delivery & Packaging Protection
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-chilli hover:underline"
                    >
                      Edit Address
                    </button>
                  </div>

                  <div className="p-3.5 rounded-lg bg-cream border border-jaggery/10 text-xs font-sans space-y-1">
                    <div className="font-bold text-jaggery">
                      Delivering to: {customer.fullName} ({customer.phone})
                    </div>
                    <div className="text-jaggery/75">
                      {address.addressLine1}, {address.city}, Karnataka - {address.pincode}
                    </div>
                  </div>

                  {/* Packaging Protection Declarations */}
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-lg border border-leaf/20 bg-leaf/5 flex items-start gap-2.5 text-xs">
                      <Truck className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-jaggery font-semibold">Dispatch from Hassan:</strong>
                        <p className="text-jaggery/80 mt-0.5">
                          Standard courier dispatch across Karnataka destinations (2-4 business days depending on district).
                        </p>
                      </div>
                    </div>

                    {calcResult?.hasFragile && (
                      <div className="p-3 rounded-lg border border-turmeric/30 bg-turmeric/10 flex items-start gap-2.5 text-xs">
                        <ShieldCheck className="w-4 h-4 text-jaggery shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-jaggery font-semibold">Reinforced Packaging Applied:</strong>
                          <p className="text-jaggery/80 mt-0.5">
                            Cart contains delicate traditional sandige/appala. Reinforced carton inserts applied to prevent breakage.
                          </p>
                        </div>
                      </div>
                    )}

                    {calcResult?.hasPickle && (
                      <div className="p-3 rounded-lg border border-leaf/20 bg-leaf/5 flex items-start gap-2.5 text-xs">
                        <ShieldCheck className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-jaggery font-semibold">Leak-Resistant Jar Cushioning:</strong>
                          <p className="text-jaggery/80 mt-0.5">
                            Traditional pickles packed with sealed tamper-evident foil and cushioned wrap.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-jaggery/60 hover:text-jaggery flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Address
                  </button>

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleProceedToPayment}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Payment (₹{finalPayableRupees})
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Payment Execution */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-jaggery/10">
                    <h2 className="font-serif text-xl font-bold text-jaggery">
                      3. Payment Method
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs text-leaf font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      Razorpay Standard
                    </span>
                  </div>

                  <p className="text-xs text-jaggery/75 leading-relaxed font-sans">
                    Complete your payment via UPI (Google Pay, PhonePe, Paytm), Net Banking, or Cards. Your order will be confirmed immediately once the transaction is authenticated.
                  </p>

                  <div className="p-4 rounded-lg bg-cream border border-jaggery/15 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-jaggery">
                      <span>Total Amount to Pay</span>
                      <span className="font-serif text-lg">₹{finalPayableRupees}</span>
                    </div>
                    <div className="text-jaggery/60">
                      Dispatched to: {address.city}, Karnataka - {address.pincode}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      onClick={handleInitiatePayment}
                      className="w-full justify-center text-base"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Securing Order...
                        </span>
                      ) : (
                        `Pay ₹${finalPayableRupees} via Razorpay`
                      )}
                    </Button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-jaggery/60 hover:text-jaggery flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Delivery Review
                </button>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: Persistent Order Summary (~40%)
              ======================================================== */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-xl bg-warm-white border border-jaggery/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-jaggery/10">
                <h3 className="font-serif text-lg font-bold text-jaggery">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>
                <span className="font-mono text-xs font-semibold text-jaggery">
                  ₹{finalPayableRupees}
                </span>
              </div>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-jaggery/5 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded bg-cream overflow-hidden shrink-0 border border-jaggery/10">
                        <Image
                          src={item.product.imageSrc}
                          alt={item.product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-jaggery block truncate max-w-[150px]">
                          {item.product.name}
                        </span>
                        <span className="text-jaggery/50 font-mono text-[11px]">
                          {item.variant.weight} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-jaggery">
                      ₹{item.variant.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-jaggery/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. HASSAN10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded border border-jaggery/20 bg-cream text-xs uppercase font-mono text-jaggery placeholder:font-sans focus:outline-none focus:border-chilli"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-jaggery/10 hover:bg-jaggery/20 text-xs font-semibold text-jaggery transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <p className="text-xs text-leaf font-medium">
                  ✓ Code {appliedPromo} applied: 10% discount on snacks!
                </p>
              )}

              {/* Summary Totals */}
              <div className="pt-3 border-t border-jaggery/10 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-jaggery/75">
                  <span>Items Subtotal</span>
                  <span className="font-mono font-medium">₹{subtotal}</span>
                </div>

                {calcResult && calcResult.pricing.discountAmountPaise > 0 && (
                  <div className="flex justify-between text-leaf font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-₹{calcResult.pricing.discountAmountPaise / 100}</span>
                  </div>
                )}

                <div className="flex justify-between text-jaggery/75">
                  <span>Delivery Charge</span>
                  <span className="font-mono font-medium">
                    {calcResult?.pricing.isShippingFree ? (
                      <span className="text-leaf font-bold">FREE</span>
                    ) : (
                      '₹49'
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-jaggery/50 text-[11px]">
                  <span>GST / Tax</span>
                  <span>Included in prices</span>
                </div>
              </div>

              <div className="pt-3 border-t border-jaggery/10 flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-base font-bold text-jaggery block">
                    Total Payable
                  </span>
                  <span className="text-[10px] text-jaggery/50">
                    Authoritative server calculation
                  </span>
                </div>
                <span className="font-serif text-2xl font-bold text-jaggery">
                  ₹{finalPayableRupees}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DEMO MODE SIMULATION MODAL
          Safely executes the payment callback and verification in dev
          without requiring production Razorpay credentials.
          ======================================================== */}
      {demoOrderInfo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jaggery/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative max-w-md w-full bg-cream rounded-2xl border border-jaggery/20 p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-turmeric/20 text-jaggery flex items-center justify-center mx-auto">
              <ChakkaliMotif size={36} color="#2D241E" />
            </div>

            <h2 id="demo-modal-title" className="font-serif text-2xl font-bold text-jaggery">
              Demo Order Simulation
            </h2>

            <div className="p-3 bg-warm-white rounded-lg border border-jaggery/15 text-xs text-jaggery/80 text-left space-y-1">
              <div>
                <strong>Order Reference:</strong> {demoOrderInfo.orderReference}
              </div>
              <div>
                <strong>Amount:</strong> ₹{demoOrderInfo.amountPaise / 100}
              </div>
              <div className="text-[11px] text-jaggery/60 pt-1">
                Notice: Razorpay live keys are in development demo mode. No actual debit will occur.
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                type="button"
                variant="primary"
                disabled={loading}
                onClick={() =>
                  verifyAndCompleteOrder({
                    orderReference: demoOrderInfo.orderReference,
                    accessToken: demoOrderInfo.accessToken,
                    razorpayOrderId: demoOrderInfo.razorpayOrderId,
                    razorpayPaymentId: `pay_demo_${Date.now()}`,
                    razorpaySignature: `demo_sig_${Date.now()}`,
                    isDemoMode: true,
                  })
                }
                className="w-full justify-center"
              >
                {loading ? 'Verifying...' : 'Simulate Successful Payment'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setError('Payment was simulated as cancelled by customer.');
                  setDemoOrderInfo(null);
                }}
                className="text-xs text-jaggery/60 hover:text-chilli py-1 transition-colors"
              >
                Simulate Payment Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

