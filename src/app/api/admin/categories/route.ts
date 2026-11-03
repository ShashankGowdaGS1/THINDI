import { NextRequest, NextResponse } from 'next/server';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import {
  getAllAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
} from '@/lib/admin/adminStore';

export async function GET(req: NextRequest) {
  const guard = guardAdminApi(req, 'categories:manage');
  if (!guard.authorized) return guard.response!;

  const categories = getAllAdminCategories();
  return NextResponse.json({ success: true, categories });
}

export async function POST(req: NextRequest) {
  const guard = guardAdminApi(req, 'categories:manage');
  if (!guard.authorized || !guard.session) return guard.response!;

  try {
    const body = await req.json();
    if (!body.title || !body.id) {
      return NextResponse.json(
        { error: 'Category identifier (slug) and title are required.' },
        { status: 400 }
      );
    }

    const saved = saveAdminCategory(body, guard.session.email, guard.session.role);
    return NextResponse.json({ success: true, category: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save category.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const guard = guardAdminApi(req, 'categories:manage');
  if (!guard.authorized || !guard.session) return guard.response!;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Category ID is required.' }, { status: 400 });
  }

  const result = deleteAdminCategory(id, guard.session.email, guard.session.role);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'Category deleted successfully.' });
}

