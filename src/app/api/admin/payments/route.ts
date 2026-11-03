import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllOrders } from '@/lib/checkout/orderStore';
import { getAllRefunds } from '@/lib/admin/adminStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'payments:read');
  if (!guard.authorized) return guard.response!;

  const orders = getAllOrders();
  const refunds = getAllRefunds();

  // Financial reconciliation metrics
  let totalOrderValuePaise = 0;
  let totalCapturedPaise = 0;
  let totalPendingPaise = 0;
  let totalFailedPaise = 0;

  const paymentItems = orders.map((o) => {
    totalOrderValuePaise += o.pricing.finalAmountPaise;

    if (o.paymentStatus === 'captured') {
      totalCapturedPaise += o.pricing.finalAmountPaise;
    } else if (o.paymentStatus === 'pending') {
      totalPendingPaise += o.pricing.finalAmountPaise;
    } else if (o.paymentStatus === 'failed') {
      totalFailedPaise += o.pricing.finalAmountPaise;
    }

    return {
      orderReference: o.orderReference,
      customerName: o.customer.fullName,
      customerEmail: o.customer.email,
      amountPaise: o.pricing.finalAmountPaise,
      paymentStatus: o.paymentStatus,
      paymentProvider: o.paymentProvider,
      razorpayOrderId: o.razorpayOrderId,
      razorpayPaymentId: o.razorpayPaymentId,
      isDemoMode: o.isDemoMode,
      createdAt: o.createdAt,
    };
  });

  const totalRefundedPaise = refunds
    .filter((r) => r.status === 'processed')
    .reduce((sum, r) => sum + r.amountPaise, 0);

  return NextResponse.json({
    success: true,
    reconciliation: {
      totalOrderValuePaise,
      totalCapturedPaise,
      totalRefundedPaise,
      netCollectedPaise: totalCapturedPaise - totalRefundedPaise,
      totalPendingPaise,
      totalFailedPaise,
    },
    payments: paymentItems,
    refunds,
  });
}

