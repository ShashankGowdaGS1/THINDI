import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllProductionBatches, saveProductionBatch } from '@/lib/admin/adminStore';

const batchSchema = z.object({
  batchNumber: z.string().trim().min(3),
  variantSku: z.string().trim().min(1),
  productName: z.string().trim().min(2),
  productionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Production date must be YYYY-MM-DD'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expiry date must be YYYY-MM-DD'),
  shelfLifeDays: z.number().int().min(1),
  quantityProduced: z.number().int().min(1),
  storageLocation: z.string().trim().min(2),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'inventory:batches');
  if (!guard.authorized) return guard.response!;

  const batches = getAllProductionBatches();
  return NextResponse.json({ success: true, batches });
}

export async function POST(req: NextRequest) {
  const guard = guardAdminApi(req, 'inventory:batches');
  if (!guard.authorized || !guard.session) return guard.response!;

  try {
    const body = await req.json();
    const parsed = batchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid batch parameters.', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const batch = saveProductionBatch(
      {
        batchNumber: data.batchNumber.toUpperCase(),
        variantSku: data.variantSku.toUpperCase(),
        productName: data.productName,
        productionDate: data.productionDate,
        expiryDate: data.expiryDate,
        shelfLifeDays: data.shelfLifeDays,
        quantityProduced: data.quantityProduced,
        quantityRemaining: data.quantityProduced,
        status: 'active',
        storageLocation: data.storageLocation,
        notes: data.notes,
      },
      guard.session.email,
      guard.session.role
    );

    return NextResponse.json({ success: true, batch });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create batch.' }, { status: 500 });
  }
}

