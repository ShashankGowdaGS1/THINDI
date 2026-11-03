import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllSupportTickets } from '@/lib/tracking/trackingStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'support:read');
  if (!guard.authorized) return guard.response!;

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');

  let tickets = getAllSupportTickets();
  if (statusFilter && statusFilter !== 'all') {
    tickets = tickets.filter((t) => t.status === statusFilter);
  }

  return NextResponse.json({ success: true, tickets });
}

