import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateOrderPricing } from '@/lib/checkout/pricingEngine';
import { createPendingOrder, recordPaymentAttempt } from '@/lib/checkout/orderStore';
import { createRazorpayOrder } from '@/lib/checkout/razorpayService';
import { validatePincode } from '@/lib/shipping/serviceability';

const customerSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Please enter a valid email address'),
});

const addressSchema = z.object({
  fullName: z.string().trim().min(2, 'Recipient name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  addressLine1: z.string().trim().min(5, 'Address line 1 must have at least 5 characters'),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().trim().min(2, 'City or town is required'),
  district: z.string().optional(),
  state: z.string().refine((val) => val.toLowerCase() === 'karnataka', {
    message: 'Delivery is currently available across Karnataka only.',
  }),
  pincode: z.string().regex(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
});

const createOrderSchema = z.object({
  customer: customerSchema,
  shippingAddress: addressSchema,
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().min(1),
      quantity: z.number().int().min(1).max(20),
    })
  ).min(1, 'Cannot create an order with an empty cart'),
  notes: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { customer, shippingAddress, items, notes } = parsed.data;

    // Validate PIN code and Karnataka restriction policy
    const pincodeValidation = validatePincode(shippingAddress.pincode);
    if (!pincodeValidation.isValid || !pincodeValidation.isKarnatakaRange) {
      return NextResponse.json(
        {
          error: 'Delivery unavailable',
          message:
            'THINDI currently dispatches exclusively across Karnataka PIN codes (56xxxx - 59xxxx).',
        },
        { status: 400 }
      );
    }

    // 1. Calculate authoritative pricing from server catalogue
    const pricingResult = calculateOrderPricing(items, shippingAddress.pincode);

    // 2. Initialize Razorpay order or simulated demo order
    const provisionalRef = `THN-ORD-${Date.now().toString(36).toUpperCase()}`;
    const rzpOrder = await createRazorpayOrder(
      pricingResult.pricing.finalAmountPaise,
      provisionalRef
    );

    // 3. Persist pending order in server order store
    const orderRecord = createPendingOrder({
      customer,
      shippingAddress,
      items: pricingResult.snapshots,
      pricing: pricingResult.pricing,
      paymentProvider: rzpOrder.isDemoMode ? 'demo' : 'razorpay',
      razorpayOrderId: rzpOrder.orderId,
      isDemoMode: rzpOrder.isDemoMode,
      notes,
    });

    // 4. Record payment attempt
    recordPaymentAttempt({
      orderId: orderRecord.id,
      provider: rzpOrder.isDemoMode ? 'demo' : 'razorpay',
      providerOrderId: rzpOrder.orderId,
      amountPaise: pricingResult.pricing.finalAmountPaise,
      currency: 'INR',
      status: 'initiated',
    });

    return NextResponse.json({
      success: true,
      orderReference: orderRecord.orderReference,
      accessToken: orderRecord.accessToken,
      razorpayOrderId: rzpOrder.orderId,
      amountPaise: pricingResult.pricing.finalAmountPaise,
      currency: 'INR',
      keyId: rzpOrder.keyId,
      isDemoMode: rzpOrder.isDemoMode,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initiate checkout order' },
      { status: 400 }
    );
  }
}
