import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// Replicating RBAC matrix and session token algorithms for standalone verification
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    'overview:read',
    'orders:read',
    'orders:write',
    'orders:fulfil',
    'orders:cancel',
    'products:read',
    'products:write',
    'products:publish',
    'products:archive',
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
    'inventory:adjust',
    'inventory:batches',
    'shipping:read',
    'shipping:dispatch',
    'payments:read',
    'support:read',
    'support:write',
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
    'shipping:read',
    'payments:read',
    'refunds:request',
    'support:read',
    'support:write',
    'audit:read',
  ],
  MARKETING_MANAGER: [
    'overview:read',
    'products:read',
    'categories:manage',
    'campaigns:read',
    'campaigns:write',
    'audit:read',
  ],
  FINANCE: [
    'overview:read',
    'orders:read',
    'payments:read',
    'refunds:request',
    'refunds:approve',
    'audit:read',
  ],
};

function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

const TEST_SECRET = 'thindi_admin_hmac_secret_test_2026';

function createAdminSessionToken(staff, ttlMs = 28800000) {
  const session = {
    sub: staff.id,
    email: staff.email,
    name: staff.name,
    role: staff.role,
    permissions: ROLE_PERMISSIONS[staff.role] || [],
    exp: Date.now() + ttlMs,
  };

  const payloadB64 = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TEST_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

function verifyAdminSessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;

  try {
    const expectedSig = crypto
      .createHmac('sha256', TEST_SECRET)
      .update(payloadB64)
      .digest('base64url');

    const expBuf = Buffer.from(expectedSig, 'utf8');
    const sigBuf = Buffer.from(signature, 'utf8');

    if (expBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expBuf, sigBuf)) {
      return null;
    }

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const session = JSON.parse(payloadJson);

    if (Date.now() > session.exp) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function validateProductForPublishing(product) {
  const errors = [];
  if (!product.name || product.name.trim().length < 2) {
    errors.push('Product name is required.');
  }
  if (!product.category) {
    errors.push('Product category must be assigned.');
  }
  if (!product.imageSrc) {
    errors.push('Primary product image is required.');
  }
  if (!product.variants || product.variants.length === 0) {
    errors.push('Product must have at least one active variant.');
  } else {
    product.variants.forEach((v, idx) => {
      if (!v.sku || v.sku.trim().length === 0) {
        errors.push(`Variant #${idx + 1} is missing a unique SKU identifier.`);
      }
      if (!v.weight || v.weight.trim().length === 0) {
        errors.push(`Variant #${idx + 1} is missing pack weight.`);
      }
      if (!v.price || v.price <= 0) {
        errors.push(`Variant #${idx + 1} price must be greater than zero.`);
      }
    });
  }

  // FSSAI Food compliance requirements
  if (!product.ingredients || product.ingredients.length === 0) {
    errors.push('Mandatory declaration: Ingredients list must be provided.');
  }
  if (!product.storageInstructions || product.storageInstructions.trim().length === 0) {
    errors.push('Mandatory declaration: Storage instructions are required.');
  }
  if (!product.shelfLife || product.shelfLife.trim().length === 0) {
    errors.push('Mandatory declaration: Shelf life statement is required.');
  }
  if (!product.foodDeclaration || product.foodDeclaration.trim().length === 0) {
    errors.push('Mandatory declaration: Vegetarian / artisan food declaration is required.');
  }

  return { valid: errors.length === 0, errors };
}

function evaluateBatchStatus(batch, now = new Date()) {
  const expiryDate = new Date(batch.expiryDate);
  const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  if (diffDays <= 0) return 'expired';
  if (diffDays <= 15) return 'near_expiry';
  return 'active';
}

function validateRefund(order, amountPaise) {
  if (order.paymentStatus !== 'captured') {
    return { valid: false, error: 'Cannot refund uncaptured order.' };
  }
  if (amountPaise <= 0) {
    return { valid: false, error: 'Refund amount must be greater than zero.' };
  }
  if (amountPaise > order.pricing.finalAmountPaise) {
    return {
      valid: false,
      error: `Refund of ₹${amountPaise / 100} exceeds order total of ₹${order.pricing.finalAmountPaise / 100}.`,
    };
  }
  return { valid: true };
}

// ==============================================================================
// TEST SUITES
// ==============================================================================

test('Stage 15: Role-Based Access Control (RBAC) Permissions Matrix', async (t) => {
  await t.test('SUPER_ADMIN has full permissions including staff & settings', () => {
    assert.equal(hasPermission('SUPER_ADMIN', 'staff:manage'), true);
    assert.equal(hasPermission('SUPER_ADMIN', 'settings:manage'), true);
    assert.equal(hasPermission('SUPER_ADMIN', 'refunds:approve'), true);
    assert.equal(hasPermission('SUPER_ADMIN', 'products:publish'), true);
    assert.equal(hasPermission('SUPER_ADMIN', 'inventory:adjust'), true);
  });

  await t.test('CUSTOMER_SUPPORT cannot publish products or approve refunds', () => {
    assert.equal(hasPermission('CUSTOMER_SUPPORT', 'products:publish'), false);
    assert.equal(hasPermission('CUSTOMER_SUPPORT', 'refunds:approve'), false);
    assert.equal(hasPermission('CUSTOMER_SUPPORT', 'staff:manage'), false);
    assert.equal(hasPermission('CUSTOMER_SUPPORT', 'inventory:adjust'), false);
    // Can request refunds and triage tickets
    assert.equal(hasPermission('CUSTOMER_SUPPORT', 'refunds:request'), true);
    assert.equal(hasPermission('CUSTOMER_SUPPORT', 'support:write'), true);
    assert.equal(hasPermission('CUSTOMER_SUPPORT', 'orders:read'), true);
  });

  await t.test('FINANCE has payments:read and refunds:approve permissions', () => {
    assert.equal(hasPermission('FINANCE', 'payments:read'), true);
    assert.equal(hasPermission('FINANCE', 'refunds:approve'), true);
    assert.equal(hasPermission('FINANCE', 'products:write'), false);
    assert.equal(hasPermission('FINANCE', 'shipping:dispatch'), false);
  });

  await t.test('INVENTORY_MANAGER can adjust stock and receive production batches', () => {
    assert.equal(hasPermission('INVENTORY_MANAGER', 'inventory:adjust'), true);
    assert.equal(hasPermission('INVENTORY_MANAGER', 'inventory:batches'), true);
    assert.equal(hasPermission('INVENTORY_MANAGER', 'products:publish'), true);
    assert.equal(hasPermission('INVENTORY_MANAGER', 'refunds:approve'), false);
  });

  await t.test('OPERATIONS_MANAGER can fulfil orders and dispatch shipments', () => {
    assert.equal(hasPermission('OPERATIONS_MANAGER', 'orders:fulfil'), true);
    assert.equal(hasPermission('OPERATIONS_MANAGER', 'shipping:dispatch'), true);
    assert.equal(hasPermission('OPERATIONS_MANAGER', 'staff:manage'), false);
  });
});

test('Stage 15: Cryptographic Admin Session Tokens & Constant-Time Verification', async (t) => {
  const staff = {
    id: 'staff-super-01',
    email: 'superadmin@thindi.in',
    name: 'Shashank R',
    role: 'SUPER_ADMIN',
  };

  const token = createAdminSessionToken(staff);
  assert.ok(token && typeof token === 'string');
  assert.equal(token.split('.').length, 2);

  await t.test('Authenticates valid token and restores staff permissions', () => {
    const verified = verifyAdminSessionToken(token);
    assert.ok(verified);
    assert.equal(verified.email, 'superadmin@thindi.in');
    assert.equal(verified.role, 'SUPER_ADMIN');
    assert.ok(verified.permissions.includes('staff:manage'));
  });

  await t.test('Rejects tampered payload role elevation attempt', () => {
    const [payloadB64, sig] = token.split('.');
    const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    decoded.role = 'SUPER_ADMIN'; // Attempting tampering
    decoded.email = 'attacker@evil.com';
    const tamperedPayload = Buffer.from(JSON.stringify(decoded)).toString('base64url');

    const fakeToken = `${tamperedPayload}.${sig}`;
    assert.equal(verifyAdminSessionToken(fakeToken), null);
  });

  await t.test('Rejects invalid signature or truncated token', () => {
    const [payloadB64] = token.split('.');
    assert.equal(verifyAdminSessionToken(`${payloadB64}.fakesig`), null);
    assert.equal(verifyAdminSessionToken('not.a.valid.token'), null);
    assert.equal(verifyAdminSessionToken(''), null);
  });

  await t.test('Rejects expired admin session token', () => {
    const expiredToken = createAdminSessionToken(staff, -1000); // Expired 1 second ago
    assert.equal(verifyAdminSessionToken(expiredToken), null);
  });
});

test('Stage 15: Product Catalogue Integrity & Mandatory FSSAI Disclosures', async (t) => {
  await t.test('Passes for valid product with complete ingredients, shelf life, and variants', () => {
    const valid = {
      name: 'Mysore Pak',
      category: 'sihi-thindi',
      imageSrc: '/images/products/mysore-pak.jpg',
      variants: [
        { id: 'v1', sku: 'THN-PAK-250', weight: '250g', price: 180 },
      ],
      ingredients: ['Gram Flour', 'Pure Cow Ghee', 'Sugar', 'Cardamom'],
      storageInstructions: 'Store in airtight box at room temperature.',
      shelfLife: '21 Days from packing',
      foodDeclaration: '100% Vegetarian artisan sweet made in pure cow ghee.',
    };

    const res = validateProductForPublishing(valid);
    assert.equal(res.valid, true);
    assert.equal(res.errors.length, 0);
  });

  await t.test('Fails when missing mandatory FSSAI packaging declarations', () => {
    const invalid = {
      name: 'Unlabeled Snack',
      category: 'kuruk-thindi',
      imageSrc: '/images/test.jpg',
      variants: [{ id: 'v1', sku: 'TEST-01', weight: '200g', price: 100 }],
      ingredients: [], // MISSING
      storageInstructions: '', // MISSING
      shelfLife: '', // MISSING
      foodDeclaration: '', // MISSING
    };

    const res = validateProductForPublishing(invalid);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes('Ingredients list must be provided')));
    assert.ok(res.errors.some((e) => e.includes('Shelf life statement is required')));
    assert.ok(res.errors.some((e) => e.includes('Vegetarian / artisan food declaration is required')));
  });

  await t.test('Fails when variant is missing unique SKU or has non-positive price', () => {
    const invalidVariant = {
      name: 'Chakkali',
      category: 'kuruk-thindi',
      imageSrc: '/images/test.jpg',
      variants: [{ id: 'v1', sku: '', weight: '200g', price: 0 }],
      ingredients: ['Rice Flour'],
      storageInstructions: 'Dry place',
      shelfLife: '30 Days',
      foodDeclaration: '100% Veg',
    };

    const res = validateProductForPublishing(invalidVariant);
    assert.equal(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes('missing a unique SKU identifier')));
    assert.ok(res.errors.some((e) => e.includes('price must be greater than zero')));
  });
});

test('Stage 15: Production Batch Expiry & Shelf Life Assessment', async (t) => {
  const now = new Date('2026-11-03T10:00:00Z');

  await t.test('Flags batches with <= 15 days remaining as near_expiry', () => {
    const batchNearExpiry = {
      batchNumber: 'BATCH-2026-01',
      expiryDate: '2026-11-14', // 11 days away
    };
    assert.equal(evaluateBatchStatus(batchNearExpiry, now), 'near_expiry');
  });

  await t.test('Flags batches past expiration date as expired', () => {
    const batchExpired = {
      batchNumber: 'BATCH-2026-02',
      expiryDate: '2026-11-01', // 2 days in the past
    };
    assert.equal(evaluateBatchStatus(batchExpired, now), 'expired');
  });

  await t.test('Marks batches with ample shelf life (>15 days) as active', () => {
    const batchActive = {
      batchNumber: 'BATCH-2026-03',
      expiryDate: '2026-12-05', // 32 days away
    };
    assert.equal(evaluateBatchStatus(batchActive, now), 'active');
  });
});

test('Stage 15: Financial Reconciliation & Refund Authorization Rules', async (t) => {
  const mockOrder = {
    orderReference: 'THN-2026-TEST01',
    paymentStatus: 'captured',
    pricing: {
      finalAmountPaise: 45000, // ₹450
    },
  };

  await t.test('Validates refund within captured amount threshold', () => {
    const res = validateRefund(mockOrder, 25000); // ₹250
    assert.equal(res.valid, true);
  });

  await t.test('Rejects refund exceeding captured order total', () => {
    const res = validateRefund(mockOrder, 50000); // ₹500 > ₹450
    assert.equal(res.valid, false);
    assert.ok(res.error.includes('exceeds order total'));
  });

  await t.test('Rejects refund for uncaptured / failed order', () => {
    const unpaidOrder = { ...mockOrder, paymentStatus: 'pending' };
    const res = validateRefund(unpaidOrder, 10000);
    assert.equal(res.valid, false);
    assert.ok(res.error.includes('Cannot refund uncaptured order'));
  });
});
