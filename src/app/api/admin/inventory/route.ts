import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAllInventoryItems, getStockMovements } from '@/lib/admin/adminStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'inventory:read');
  if (!guard.authorized) return guard.response!;

  const items = getAllInventoryItems();
  const recentMovements = getStockMovements(30);

  return NextResponse.json({
    success: true,
    inventory: items,
    recentMovements,
  });
}

