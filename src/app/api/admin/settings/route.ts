import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getBusinessSettings, updateBusinessSettings } from '@/lib/admin/adminStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'settings:manage');
  if (!guard.authorized) return guard.response!;

  const settings = getBusinessSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  const guard = guardAdminApi(req, 'settings:manage');
  if (!guard.authorized || !guard.session) return guard.response!;

  try {
    const body = await req.json();
    const updated = updateBusinessSettings(body, guard.session.email, guard.session.role);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed.' }, { status: 500 });
  }
}

