import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllOrders } from '@/lib/checkout/orderStore';
import { getAllShipments } from '@/lib/tracking/trackingStore';
import { trackingProvider } from '@/lib/shipping/trackingAdapter';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'shipping:read');
  if (!guard.authorized) return guard.response!;

  const shipments = getAllShipments();
  const orders = getAllOrders();

  // Orders that are paid and ready for dispatch (preparing or confirmed without shipment)
  const readyForDispatch = orders.filter((o) => {
    if (o.paymentStatus !== 'captured') return false;
    if (o.orderStatus === 'delivered' || o.orderStatus === 'cancelled') return false;
    return true;
  });

  return NextResponse.json({
    success: true,
    shipments,
    readyForDispatch,
    providerConfig: {
      provider: 'Shiprocket',
      configured: trackingProvider.isConfigured(),
      pickupLocation: 'Hassan Kitchen Hub (573201)',
    },
  });
}

