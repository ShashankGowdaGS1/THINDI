import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getOrderByReference,
  markOrderPaymentCaptured,
  markOrderPaymentFailed,
  recordPaymentAttempt,
} from '@/lib/checkout/orderStore';
import { verifyRazorpaySignature } from '@/lib/checkout/razorpayService';

const verifySchema = z.object({
  orderReference: z.string().min(1),
  accessToken: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  isDemoMode: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid verification payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      orderReference,
      accessToken,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isDemoMode = false,
    } = parsed.data;

    // Securely retrieve order using both reference and opaque accessToken
    const order = getOrderByReference(orderReference, accessToken);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or authorization token mismatch' },
        { status: 404 }
      );
    }

    // Verify cryptographic signature server-side
    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      markOrderPaymentFailed(orderReference, 'Tampered or invalid payment signature');
      recordPaymentAttempt({
        orderId: order.id,
        provider: isDemoMode ? 'demo' : 'razorpay',
        providerOrderId: razorpayOrderId,
        providerPaymentId: razorpayPaymentId,
        amountPaise: order.pricing.finalAmountPaise,
        currency: 'INR',
        status: 'failed',
        errorMessage: 'Invalid signature',
      });

      return NextResponse.json(
        { error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // Transition order to confirmed and payment to captured
    const updatedOrder = markOrderPaymentCaptured(
      orderReference,
      razorpayPaymentId,
      isDemoMode ? 'demo' : 'razorpay'
    );

    recordPaymentAttempt({
      orderId: order.id,
      provider: isDemoMode ? 'demo' : 'razorpay',
      providerOrderId: razorpayOrderId,
      providerPaymentId: razorpayPaymentId,
      amountPaise: order.pricing.finalAmountPaise,
      currency: 'INR',
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      orderReference: updatedOrder?.orderReference,
      accessToken: updatedOrder?.accessToken,
      redirectUrl: `/order-confirmation/${updatedOrder?.orderReference}?token=${updatedOrder?.accessToken}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

