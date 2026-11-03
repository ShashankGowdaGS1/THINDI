import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import { getAdminProductById, saveAdminProduct } from '@/lib/admin/adminStore';
import { Product } from '@/types/product';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const guard = guardAdminApi(req, 'products:read');
  if (!guard.authorized) return guard.response!;

  const { id } = await params;
  const product = getAdminProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const guard = guardAdminApi(req, 'products:write');
  if (!guard.authorized || !guard.session) return guard.response!;

  const { id } = await params;
  const existing = getAdminProductById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Product;
    const merged: Product = { ...existing, ...body, id };

    const saveResult = saveAdminProduct(merged, guard.session.email, guard.session.role);
    if (!saveResult.success) {
      return NextResponse.json({ error: saveResult.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, product: saveResult.product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed.' }, { status: 500 });
  }
}

