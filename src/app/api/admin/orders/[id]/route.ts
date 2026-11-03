import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { findOrderByReference, updateOrderStatusAdmin } from '@/lib/checkout/orderStore';
import { getShipmentForOrder, getSupportTicketsForOrder } from '@/lib/tracking/trackingStore';
import { recordAuditLog } from '@/lib/admin/adminStore';
import { OrderStatus } from '@/types/checkout';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().max(250).optional(),
});

export async function GET(req: NextRequest, { params }: RouteContext) {
  const guard = guardAdminApi(req, 'orders:read');
  if (!guard.authorized) return guard.response!;

  const { id } = await params;
  const order = findOrderByReference(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  const shipment = getShipmentForOrder(order.orderReference);
  const supportTickets = getSupportTicketsForOrder(order.orderReference);

  return NextResponse.json({
    success: true,
    order,
    shipment,
    supportTickets,
  });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const guard = guardAdminApi(req, 'orders:fulfil');
  if (!guard.authorized || !guard.session) return guard.response!;

  const { id } = await params;
  const order = findOrderByReference(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid order status transition.', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, notes } = parsed.data;

    // Strict Rule: Unpaid orders cannot be marked as delivered or preparing
    if (order.paymentStatus !== 'captured' && (status === 'shipped' || status === 'delivered')) {
      return NextResponse.json(
        {
          error: `Cannot transition uncaptured order to "${status}". Payment must be verified first.`,
        },
        { status: 400 }
      );
    }

    const updated = updateOrderStatusAdmin(order.orderReference, status as OrderStatus, notes);

    recordAuditLog({
      action: 'ORDER_STATUS_CHANGED',
      actorEmail: guard.session.email,
      actorRole: guard.session.role,
      targetResource: 'orders',
      targetId: order.orderReference,
      details: `Changed order ${order.orderReference} status from "${order.orderStatus}" to "${status}"${notes ? ` (Note: ${notes})` : ''}`,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Status update failed.' }, { status: 500 });
  }
}

