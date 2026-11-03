import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req);
  if (!guard.authorized || !guard.session) {
    return guard.response!;
  }

  return NextResponse.json({
    success: true,
    user: guard.session,
  });
}

