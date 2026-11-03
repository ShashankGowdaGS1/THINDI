import { NextRequest, NextResponse } from 'next/server';
import {
  isWebhookProcessed,
  recordWebhookEvent,
  markOrderPaymentCaptured,
  markOrderPaymentFailed,
} from '@/lib/checkout/orderStore';
import { verifyWebhookSignature } from '@/lib/checkout/razorpayService';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // 1. Verify webhook signature if webhook secret is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      if (!signature || !verifyWebhookSignature(rawBody, signature)) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || 'unknown';

    // 2. Idempotency Check: Ignore if already processed
    if (isWebhookProcessed(eventId)) {
      return NextResponse.json({ status: 'ignored_already_processed' }, { status: 200 });
    }

    // 3. Process according to event type
    const entity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
    const orderReceipt = entity?.receipt; // Corresponds to internal orderReference
    const paymentId = entity?.id;

    if (orderReceipt) {
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        markOrderPaymentCaptured(orderReceipt, paymentId || 'webhook_captured', 'razorpay');
      } else if (eventType === 'payment.failed') {
        markOrderPaymentFailed(orderReceipt, entity?.error_description || 'Payment failed');
      }
    }

    // 4. Record webhook event
    recordWebhookEvent(eventId, eventType, JSON.stringify({ receipt: orderReceipt, paymentId }));

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Webhook processing error', message: error.message },
      { status: 500 }
    );
  }
}

