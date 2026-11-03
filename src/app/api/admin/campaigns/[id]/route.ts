import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { updateAdminCampaign } from '@/lib/admin/adminStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const guard = guardAdminApi(req, 'campaigns:write');
  if (!guard.authorized || !guard.session) return guard.response!;

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = updateAdminCampaign(id, body, guard.session.email, guard.session.role);
    if (!updated) {
      return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, campaign: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed.' }, { status: 500 });
  }
}

