import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAuditLogs } from '@/lib/admin/adminStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'audit:read');
  if (!guard.authorized) return guard.response!;

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);

  const logs = getAuditLogs(limit);
  return NextResponse.json({ success: true, logs });
}

