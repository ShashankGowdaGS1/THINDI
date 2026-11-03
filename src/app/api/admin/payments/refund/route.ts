import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { findOrderByReference } from '@/lib/checkout/orderStore';
import { requestOrderRefund, approveOrderRefund } from '@/lib/admin/adminStore';

const refundActionSchema = z.object({
  action: z.enum(['request', 'approve']),
  orderReference: z.string().trim().optional(),
  refundReference: z.string().trim().optional(),
  amountPaise: z.number().int().min(100).optional(),
  reason: z.string().trim().min(5).max(300).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = refundActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: parsed.error.format() }, { status: 400 });
    }

    const { action, orderReference, refundReference, amountPaise, reason } = parsed.data;

    if (action === 'request') {
      const guard = guardAdminApi(req, 'refunds:request');
      if (!guard.authorized || !guard.session) return guard.response!;

      if (!orderReference || !amountPaise || !reason) {
        return NextResponse.json({ error: 'Missing order reference, amount or reason.' }, { status: 400 });
      }

      const order = findOrderByReference(orderReference);
      if (!order) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }

      if (order.paymentStatus !== 'captured') {
        return NextResponse.json({ error: 'Cannot refund an order that was not captured.' }, { status: 400 });
      }

      if (amountPaise > order.pricing.finalAmountPaise) {
        return NextResponse.json(
          { error: `Refund amount cannot exceed captured order total of ₹${order.pricing.finalAmountPaise / 100}.` },
          { status: 400 }
        );
      }

      const refundRecord = requestOrderRefund({
        orderReference,
        paymentId: order.razorpayPaymentId,
        amountPaise,
        reason,
        requestedBy: guard.session.email,
      });

      return NextResponse.json({ success: true, refund: refundRecord });
    }

    if (action === 'approve') {
      const guard = guardAdminApi(req, 'refunds:approve');
      if (!guard.authorized || !guard.session) return guard.response!;

      if (!refundReference) {
        return NextResponse.json({ error: 'Refund reference is required for approval.' }, { status: 400 });
      }

      const result = approveOrderRefund(refundReference, guard.session.email, guard.session.role);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, refund: result.refund });
    }

    return NextResponse.json({ error: 'Unsupported refund action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Refund operation failed.' }, { status: 500 });
  }
}

