import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { recordStockMovement, recordAuditLog } from '@/lib/admin/adminStore';

const adjustSchema = z.object({
  variantSku: z.string().trim().min(1, 'Variant SKU is required'),
  quantityChange: z.number().int().refine((val) => val !== 0, 'Change must not be zero'),
  reason: z.enum([
    'production_receipt',
    'order_reservation',
    'order_allocation',
    'cancellation_release',
    'stock_correction',
    'damaged_spoilage',
    'expired_disposal',
    'audit_adjustment',
  ]),
  notes: z.string().max(250).optional(),
});

export async function POST(req: NextRequest) {
  const guard = guardAdminApi(req, 'inventory:adjust');
  if (!guard.authorized || !guard.session) return guard.response!;

  try {
    const body = await req.json();
    const parsed = adjustSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid adjustment parameters.', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { variantSku, quantityChange, reason, notes } = parsed.data;
    const result = recordStockMovement({
      variantSku,
      quantityChange,
      reason,
      actorEmail: guard.session.email,
      notes,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    recordAuditLog({
      action: 'STOCK_ADJUSTMENT',
      actorEmail: guard.session.email,
      actorRole: guard.session.role,
      targetResource: 'inventory',
      targetId: variantSku,
      details: `Adjusted SKU ${variantSku} by ${quantityChange > 0 ? '+' : ''}${quantityChange} units (Reason: ${reason})`,
    });

    return NextResponse.json({ success: true, item: result.item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Stock adjustment failed.' }, { status: 500 });
  }
}

