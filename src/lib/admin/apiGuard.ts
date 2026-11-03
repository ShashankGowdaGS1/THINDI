import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, hasPermission } from './auth';
import { AdminPermission, AdminSession } from '@/types/admin';

export interface GuardResult {
  authorized: boolean;
  session?: AdminSession;
  response?: NextResponse;
}

export function guardAdminApi(
  req: NextRequest,
  requiredPermission?: AdminPermission
): GuardResult {
  const token = req.cookies.get('thindi_admin_session')?.value;
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Admin authentication session required.' },
        { status: 401 }
      ),
    };
  }

  const session = verifyAdminSessionToken(token);
  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: Admin session expired or invalid.' },
        { status: 401 }
      ),
    };
  }

  if (requiredPermission && !hasPermission(session.role, requiredPermission)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: `Forbidden: Staff role "${session.role}" lacks required permission "${requiredPermission}".`,
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, session };
}

