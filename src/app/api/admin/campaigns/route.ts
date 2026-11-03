import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllAdminCampaigns } from '@/lib/admin/adminStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'campaigns:read');
  if (!guard.authorized) return guard.response!;

  const campaigns = getAllAdminCampaigns();
  return NextResponse.json({ success: true, campaigns });
}

