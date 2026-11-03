import crypto from 'node:crypto';
import { AdminRole, AdminPermission, StaffUser, AdminSession } from '@/types/admin';

const ADMIN_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.ORDER_SESSION_SECRET ||
  'thindi_hassan_admin_secure_key_2026';

// Role-to-Permissions Mapping enforcing the principle of least privilege
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    'overview:read',
    'orders:read',
    'orders:write',
    'orders:fulfil',
    'products:read',
    'products:write',
    'products:publish',
    'categories:manage',
    'inventory:read',
    'inventory:adjust',
    'inventory:batches',
    'shipping:read',
    'shipping:dispatch',
    'payments:read',
    'refunds:request',
    'refunds:approve',
    'support:read',
    'support:write',
    'campaigns:read',
    'campaigns:write',
    'customers:read',
    'staff:manage',
    'settings:manage',
    'audit:read',
  ],
  OPERATIONS_MANAGER: [
    'overview:read',
    'orders:read',
    'orders:write',
    'orders:fulfil',
    'inventory:read',
    'shipping:read',
    'shipping:dispatch',
    'support:read',
    'customers:read',
    'audit:read',
  ],
  INVENTORY_MANAGER: [
    'overview:read',
    'products:read',
    'products:write',
    'products:publish',
    'categories:manage',
    'inventory:read',
    'inventory:adjust',
    'inventory:batches',
    'audit:read',
  ],
  CUSTOMER_SUPPORT: [
    'overview:read',
    'orders:read',
    'support:read',
    'support:write',
    'customers:read',
  ],
  FINANCE: [
    'overview:read',
    'orders:read',
    'payments:read',
    'refunds:request',
    'refunds:approve',
    'audit:read',
  ],
  MARKETING_MANAGER: [
    'overview:read',
    'products:read',
    'campaigns:read',
    'campaigns:write',
    'categories:manage',
  ],
};

export function getPermissionsForRole(role: AdminRole): AdminPermission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const perms = getPermissionsForRole(role);
  return perms.includes(permission);
}

// In-memory staff directory seeded with authorized operational staff for evaluation
export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'staff-01',
    email: 'superadmin@thindi.in',
    fullName: 'Shankar Gowda',
    role: 'SUPER_ADMIN',
    active: true,
    department: 'Executive Operations',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'staff-02',
    email: 'ops@thindi.in',
    fullName: 'Raghu Hassan',
    role: 'OPERATIONS_MANAGER',
    active: true,
    department: 'Kitchen Dispatch & Logistics',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'staff-03',
    email: 'inventory@thindi.in',
    fullName: 'Lalitha Rao',
    role: 'INVENTORY_MANAGER',
    active: true,
    department: 'Raw Materials & Packing Quality',
    createdAt: '2026-02-01T08:30:00Z',
  },
  {
    id: 'staff-04',
    email: 'support@thindi.in',
    fullName: 'Deepa Nayak',
    role: 'CUSTOMER_SUPPORT',
    active: true,
    department: 'Customer Happiness Desk',
    createdAt: '2026-02-10T09:15:00Z',
  },
  {
    id: 'staff-05',
    email: 'finance@thindi.in',
    fullName: 'Mahesh Kumar',
    role: 'FINANCE',
    active: true,
    department: 'Accounts & Reconciliation',
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'staff-06',
    email: 'marketing@thindi.in',
    fullName: 'Pooja Hegde',
    role: 'MARKETING_MANAGER',
    active: true,
    department: 'Brand & Seasonal Campaigns',
    createdAt: '2026-02-20T10:30:00Z',
  },
];

// In-memory mutable staff map
const staffMap = new Map<string, StaffUser>();
INITIAL_STAFF_USERS.forEach((s) => staffMap.set(s.email.toLowerCase(), s));

export function getStaffByEmail(email: string): StaffUser | null {
  return staffMap.get(email.trim().toLowerCase()) || null;
}

export function getAllStaff(): StaffUser[] {
  return Array.from(staffMap.values());
}

export function updateStaffUser(id: string, updates: Partial<StaffUser>): StaffUser | null {
  for (const [email, user] of staffMap.entries()) {
    if (user.id === id) {
      const updated = { ...user, ...updates };
      staffMap.set(email, updated);
      return updated;
    }
  }
  return null;
}

/**
 * Creates a cryptographically signed session token for authenticated admin staff.
 * Token structure: userId.email.role.issuedAt.expiresAt.signature
 */
export function createAdminSessionToken(
  user: StaffUser,
  ttlMs = 8 * 60 * 60 * 1000 // 8 hours
): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + ttlMs;
  const payloadStr = `${user.id}.${user.email}.${user.role}.${issuedAt}.${expiresAt}`;
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payloadStr).digest('hex');

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies the validity and signature of an admin session token.
 */
export function verifyAdminSessionToken(token: string | undefined | null): AdminSession | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 6) return null;

  const [userId, email, roleStr, issuedAtStr, expiresAtStr, signature] = parts;
  const role = roleStr as AdminRole;
  const issuedAt = parseInt(issuedAtStr, 10);
  const expiresAt = parseInt(expiresAtStr, 10);

  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return null; // Expired
  }

  const payloadStr = `${userId}.${email}.${roleStr}.${issuedAtStr}.${expiresAtStr}`;
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadStr)
    .digest('hex');

  const expSigBuf = Buffer.from(expectedSignature, 'utf8');
  const sigBuf = Buffer.from(signature, 'utf8');

  if (expSigBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expSigBuf, sigBuf)) {
    return null; // Tampered
  }

  // Ensure staff user still exists and is active
  const user = getStaffByEmail(email);
  if (!user || !user.active) {
    return null; // Deactivated account
  }

  return {
    userId,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    permissions: getPermissionsForRole(user.role),
    issuedAt,
    expiresAt,
  };
}

