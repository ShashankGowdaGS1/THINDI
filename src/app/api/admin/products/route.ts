import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import {
  getAllAdminProducts,
  saveAdminProduct,
  getInventoryBySku,
} from '@/lib/admin/adminStore';
import { Product } from '@/types/product';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'products:read');
  if (!guard.authorized) {
    return guard.response!;
  }

  const products = getAllAdminProducts();

  // Augment each variant with live stock available from inventory
  const augmented = products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => {
      const inv = getInventoryBySku(v.sku);
      return {
        ...v,
        stockAvailable: inv ? inv.stockAvailable : 0,
        stockReserved: inv ? inv.stockReserved : 0,
      };
    }),
  }));

  return NextResponse.json({ success: true, products: augmented });
}

export async function POST(req: NextRequest) {
  const guard = guardAdminApi(req, 'products:write');
  if (!guard.authorized || !guard.session) {
    return guard.response!;
  }

  try {
    const body = (await req.json()) as Product;

    // Check publication permission if marked published/active
    if (body.active && !guard.session.permissions.includes('products:publish')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to publish live products.' },
        { status: 403 }
      );
    }

    const saveResult = saveAdminProduct(body, guard.session.email, guard.session.role);
    if (!saveResult.success) {
      return NextResponse.json({ error: saveResult.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: saveResult.product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save product.' }, { status: 500 });
  }
}

