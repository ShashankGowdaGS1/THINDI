import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllStaff } from '@/lib/admin/auth';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'staff:manage');
  if (!guard.authorized) return guard.response!;

  const staff = getAllStaff();
  return NextResponse.json({ success: true, staff });
}

