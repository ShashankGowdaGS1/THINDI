import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllOrders } from '@/lib/checkout/orderStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'orders:read');
  if (!guard.authorized) return guard.response!;

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  const paymentFilter = url.searchParams.get('payment');
  const query = url.searchParams.get('q')?.toLowerCase();

  let orders = getAllOrders();

  if (statusFilter && statusFilter !== 'all') {
    orders = orders.filter((o) => o.orderStatus === statusFilter);
  }

  if (paymentFilter && paymentFilter !== 'all') {
    orders = orders.filter((o) => o.paymentStatus === paymentFilter);
  }

  if (query) {
    orders = orders.filter(
      (o) =>
        o.orderReference.toLowerCase().includes(query) ||
        o.customer.fullName.toLowerCase().includes(query) ||
        o.customer.email.toLowerCase().includes(query) ||
        o.customer.phone.includes(query)
    );
  }

  return NextResponse.json({ success: true, orders });
}

