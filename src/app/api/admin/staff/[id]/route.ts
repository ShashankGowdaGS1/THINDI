import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { updateStaffUser } from '@/lib/admin/auth';
import { recordAuditLog } from '@/lib/admin/adminStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateStaffSchema = z.object({
  role: z.enum([
    'SUPER_ADMIN',
    'OPERATIONS_MANAGER',
    'INVENTORY_MANAGER',
    'CUSTOMER_SUPPORT',
    'MARKETING_MANAGER',
    'FINANCE',
  ]).optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const guard = guardAdminApi(req, 'staff:manage');
  if (!guard.authorized || !guard.session) return guard.response!;

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateStaffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: parsed.error.format() }, { status: 400 });
    }

    const updated = updateStaffUser(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    recordAuditLog({
      action: 'STAFF_PERMISSIONS_CHANGED',
      actorEmail: guard.session.email,
      actorRole: guard.session.role,
      targetResource: 'staff',
      targetId: id,
      details: `Updated staff ${updated.email}: Role=${updated.role}, Active=${updated.active}`,
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed.' }, { status: 500 });
  }
}

