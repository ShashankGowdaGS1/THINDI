import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { findOrderByReference, updateOrderStatusAdmin } from '@/lib/checkout/orderStore';
import { saveShipment, addShipmentTrackingEvent } from '@/lib/tracking/trackingStore';
import { recordAuditLog } from '@/lib/admin/adminStore';
import { ShipmentRecord } from '@/types/tracking';

const dispatchSchema = z.object({
  orderReference: z.string().trim().min(3),
  courierName: z.string().trim().min(2),
  awb: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  const guard = guardAdminApi(req, 'shipping:dispatch');
  if (!guard.authorized || !guard.session) return guard.response!;

  try {
    const body = await req.json();
    const parsed = dispatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid dispatch parameters.', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { orderReference, courierName, awb } = parsed.data;
    const order = findOrderByReference(orderReference);
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.paymentStatus !== 'captured') {
      return NextResponse.json(
        { error: 'Cannot dispatch unpaid order. Payment capture is required.' },
        { status: 400 }
      );
    }

    const assignedAwb = awb || `THN-${courierName.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const shipment: ShipmentRecord = {
      id: `ship-${Date.now().toString(36)}`,
      orderId: order.id,
      orderReference: order.orderReference,
      shippingProvider: 'shiprocket',
      providerShipmentId: `SR-${Date.now()}`,
      courierName,
      awb: assignedAwb,
      normalizedStatus: 'Picked Up',
      providerStatus: 'PICKED_UP',
      origin: 'Hassan Kitchen Dispatch Hub',
      destination: `${order.shippingAddress.city}, Karnataka`,
      destinationPincode: order.shippingAddress.pincode,
      shippedAt: now,
      estimatedDelivery: '2–3 business days',
      lastSyncedAt: now,
      isDemoMode: order.isDemoMode,
      events: [
        {
          id: `evt-${Date.now()}-1`,
          shipmentId: `ship-${Date.now().toString(36)}`,
          providerStatusCode: 'PICKED_UP',
          normalizedStatus: 'Picked Up',
          eventDescription: `Dispatched from Hassan facility via ${courierName}.`,
          eventLocation: 'Hassan Dispatch Facility',
          eventTime: now,
          receivedAt: now,
        },
      ],
    };

    saveShipment(shipment);
    updateOrderStatusAdmin(order.orderReference, 'shipped', `Dispatched via ${courierName} (AWB: ${assignedAwb})`);

    recordAuditLog({
      action: 'SHIPMENT_DISPATCHED',
      actorEmail: guard.session.email,
      actorRole: guard.session.role,
      targetResource: 'shipping',
      targetId: assignedAwb,
      details: `Created shipment for order ${order.orderReference} via ${courierName} (AWB: ${assignedAwb})`,
    });

    return NextResponse.json({ success: true, shipment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Dispatch failed.' }, { status: 500 });
  }
}

