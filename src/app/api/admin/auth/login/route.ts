import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStaffByEmail, createAdminSessionToken } from '@/lib/admin/auth';
import { recordAuditLog } from '@/lib/admin/adminStore';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid staff email address'),
  password: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid login parameters.' }, { status: 400 });
    }

    const { email } = parsed.data;
    const staffUser = getStaffByEmail(email);

    if (!staffUser || !staffUser.active) {
      return NextResponse.json(
        { error: 'Invalid credentials or staff account is inactive.' },
        { status: 401 }
      );
    }

    // In production with Supabase Auth: verify password / OTP with Supabase client
    // For demo/development mode: verify authorized email and create secure signed session token
    const token = createAdminSessionToken(staffUser);

    recordAuditLog({
      action: 'STAFF_SIGN_IN',
      actorEmail: staffUser.email,
      actorRole: staffUser.role,
      targetResource: 'admin_auth',
      targetId: staffUser.id,
      details: `Staff member signed in with role ${staffUser.role}.`,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: staffUser.id,
        email: staffUser.email,
        fullName: staffUser.fullName,
        role: staffUser.role,
        department: staffUser.department,
      },
    });

    response.cookies.set('thindi_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed.' }, { status: 500 });
  }
}

