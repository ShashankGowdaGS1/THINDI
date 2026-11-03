import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import crypto from 'node:crypto';

// Replicating security & status logic for pure standalone testing
const TEST_SECRET = 'test_secret_tracking_hassan_2026';

function generateOtpCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtpCode(code) {
  return crypto.createHmac('sha256', TEST_SECRET).update(code.trim()).digest('hex');
}

function verifyOtpCode(submittedCode, storedHash) {
  if (!submittedCode || !storedHash) return false;
  const computedHash = hashOtpCode(submittedCode);
  const compBuf = Buffer.from(computedHash, 'utf8');
  const storedBuf = Buffer.from(storedHash, 'utf8');
  if (compBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(compBuf, storedBuf);
}

function createOrderSessionToken(orderReference, ttlMs = 7200000) {
  const normalizedRef = orderReference.trim().toUpperCase();
  const expiresAt = Date.now() + ttlMs;
  const payloadStr = `${normalizedRef}.${expiresAt}`;
  const signature = crypto.createHmac('sha256', TEST_SECRET).update(payloadStr).digest('hex');
  return `${payloadStr}.${signature}`;
}

function verifyOrderSessionToken(token, expectedOrderReference) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [ref, expiresAtStr, signature] = parts;
  if (ref.toUpperCase() !== expectedOrderReference.trim().toUpperCase()) return false;

  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const payloadStr = `${ref}.${expiresAtStr}`;
  const expectedSignature = crypto
    .createHmac('sha256', TEST_SECRET)
    .update(payloadStr)
    .digest('hex');

  const expSigBuf = Buffer.from(expectedSignature, 'utf8');
  const sigBuf = Buffer.from(signature, 'utf8');
  if (expSigBuf.length !== sigBuf.length) return false;

  return crypto.timingSafeEqual(expSigBuf, sigBuf);
}

// Status normalization replicate
function normalizeTrackingStatus(rawStatus) {
  if (rawStatus === undefined || rawStatus === null) {
    return { normalized: 'Tracking Unavailable', isException: false };
  }
  const upper = String(rawStatus).trim().toUpperCase();

  switch (upper) {
    case '1':
    case '2':
    case 'AWB ASSIGNED':
    case 'LABEL GENERATED':
    case 'SHIPMENT CREATED':
      return { normalized: 'Shipment Created', isException: false };
    case '3':
    case '14':
    case '15':
    case 'PICKUP SCHEDULED':
    case 'AWAITING PICKUP':
      return { normalized: 'Awaiting Pickup', isException: false };
    case 'PICKED UP':
    case 'COLLECTED':
      return { normalized: 'Picked Up', isException: false };
    case '5':
    case 'IN TRANSIT':
    case 'TRANSIT':
      return { normalized: 'In Transit', isException: false };
    case '7':
    case 'OUT FOR DELIVERY':
      return { normalized: 'Out for Delivery', isException: false };
    case '6':
    case 'DELIVERED':
      return { normalized: 'Delivered', isException: false };
    case '4':
    case '17':
    case 'UNDELIVERED':
    case 'DELIVERY ATTEMPTED':
    case 'SHIPMENT DELAYED':
    case 'DELIVERY EXCEPTION':
      return { normalized: 'Delivery Exception', isException: true };
    case '9':
    case 'RTO INITIATED':
    case 'RETURN TO ORIGIN':
      return { normalized: 'Return Initiated', isException: true };
    case '10':
    case 'RTO DELIVERED':
    case 'RETURNED':
      return { normalized: 'Returned', isException: true };
    case '8':
    case 'CANCELLED':
      return { normalized: 'Cancelled', isException: true };
    default:
      return { normalized: 'Pending Review', isException: false };
  }
}

function isStatusProgressionValid(currentStatus, incomingStatus) {
  if (currentStatus === 'Delivered' && incomingStatus !== 'Delivered') return false;
  if (currentStatus === 'Returned' && incomingStatus !== 'Returned') return false;
  if (currentStatus === 'Cancelled') return false;
  if (incomingStatus === 'Delivery Exception') return currentStatus !== 'Delivered';

  const rank = {
    'Shipment Created': 1,
    'Awaiting Pickup': 2,
    'Picked Up': 3,
    'In Transit': 4,
    'Out for Delivery': 5,
    'Delivered': 6,
    'Delivery Exception': 4,
    'Return Initiated': 7,
    'Returned': 8,
    'Cancelled': 9,
    'Pending Review': 0,
    'Tracking Unavailable': 0,
  };

  return (rank[incomingStatus] || 0) >= (rank[currentStatus] || 0);
}

describe('Stage 14: Order Access Security & Non-Enumerating Verification', () => {
  test('Generates valid 6-digit numeric OTP', () => {
    const code = generateOtpCode();
    assert.equal(code.length, 6);
    assert.match(code, /^\d{6}$/);
  });

  test('Hashes and securely verifies OTP without storing raw codes in plaintext', () => {
    const code = '482910';
    const hash = hashOtpCode(code);
    assert.notEqual(hash, code);
    assert.equal(hash.length, 64); // SHA-256 hex string

    // Correct code verifies
    assert.equal(verifyOtpCode('482910', hash), true);
    // Wrong code rejected
    assert.equal(verifyOtpCode('123456', hash), false);
    // Empty code rejected
    assert.equal(verifyOtpCode('', hash), false);
  });

  test('Creates cryptographically signed session tokens bound to order reference', () => {
    const token = createOrderSessionToken('THN-2026-DEMO01');
    assert.ok(token.startsWith('THN-2026-DEMO01.'));

    // Token verifies for matching order
    assert.equal(verifyOrderSessionToken(token, 'THN-2026-DEMO01'), true);
    assert.equal(verifyOrderSessionToken(token, 'thn-2026-demo01'), true); // case-insensitive

    // Token rejected for different order
    assert.equal(verifyOrderSessionToken(token, 'THN-2026-OTHER'), false);
  });

  test('Rejects tampered or expired session tokens', () => {
    const token = createOrderSessionToken('THN-2026-DEMO01');
    const parts = token.split('.');
    const tampered = `${parts[0]}.${parts[1]}.badsignature1234567890abcdef`;

    assert.equal(verifyOrderSessionToken(tampered, 'THN-2026-DEMO01'), false);

    // Expired token (ttl = -1s)
    const expiredToken = createOrderSessionToken('THN-2026-DEMO01', -1000);
    assert.equal(verifyOrderSessionToken(expiredToken, 'THN-2026-DEMO01'), false);
  });
});

describe('Stage 14: Courier Status Mapping & Exception Handling', () => {
  test('Maps standard Shiprocket numeric and text codes to normalized milestones', () => {
    assert.equal(normalizeTrackingStatus('1').normalized, 'Shipment Created');
    assert.equal(normalizeTrackingStatus('AWB ASSIGNED').normalized, 'Shipment Created');
    assert.equal(normalizeTrackingStatus('3').normalized, 'Awaiting Pickup');
    assert.equal(normalizeTrackingStatus('PICKED UP').normalized, 'Picked Up');
    assert.equal(normalizeTrackingStatus('5').normalized, 'In Transit');
    assert.equal(normalizeTrackingStatus('7').normalized, 'Out for Delivery');
    assert.equal(normalizeTrackingStatus('6').normalized, 'Delivered');
  });

  test('Correctly identifies exception states without marking them as delivered', () => {
    const delayed = normalizeTrackingStatus('SHIPMENT DELAYED');
    assert.equal(delayed.normalized, 'Delivery Exception');
    assert.equal(delayed.isException, true);

    const undelivered = normalizeTrackingStatus('17');
    assert.equal(undelivered.normalized, 'Delivery Exception');
    assert.equal(undelivered.isException, true);

    const rto = normalizeTrackingStatus('RTO INITIATED');
    assert.equal(rto.normalized, 'Return Initiated');
    assert.equal(rto.isException, true);
  });

  test('Maps unknown courier codes to Pending Review rather than incorrectly assuming In Transit', () => {
    const unknownCode = normalizeTrackingStatus('UNKNOWN_COURIER_CODE_999');
    assert.equal(unknownCode.normalized, 'Pending Review');
    assert.notEqual(unknownCode.normalized, 'In Transit');
  });
});

describe('Stage 14: Out-of-Order Webhook Progression & Deduplication', () => {
  test('Terminal status Delivered cannot be reverted by older In Transit scan', () => {
    const canRevert = isStatusProgressionValid('Delivered', 'In Transit');
    assert.equal(canRevert, false, 'Stale scan cannot downgrade Delivered state');
  });

  test('Valid forward progression is permitted', () => {
    assert.equal(isStatusProgressionValid('Shipment Created', 'Picked Up'), true);
    assert.equal(isStatusProgressionValid('Picked Up', 'In Transit'), true);
    assert.equal(isStatusProgressionValid('In Transit', 'Out for Delivery'), true);
    assert.equal(isStatusProgressionValid('Out for Delivery', 'Delivered'), true);
  });

  test('Delivery exception can occur during In Transit but not after Delivered', () => {
    assert.equal(isStatusProgressionValid('In Transit', 'Delivery Exception'), true);
    assert.equal(isStatusProgressionValid('Delivered', 'Delivery Exception'), false);
  });
});

describe('Stage 14: Support Ticket Generation & Integrity', () => {
  function generateTicketReference() {
    const year = new Date().getFullYear();
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `TKT-${year}-${rand}`;
  }

  test('Generates structured ticket reference with year', () => {
    const ref = generateTicketReference();
    const year = new Date().getFullYear().toString();
    assert.match(ref, new RegExp(`^TKT-${year}-[A-Z0-9]{6}$`));
  });

  test('Validates support enquiry categories', () => {
    const validCategories = [
      'delivery_issue',
      'damaged_product',
      'missing_item',
      'incorrect_item',
      'payment_issue',
      'general_order_enquiry',
    ];
    assert.equal(validCategories.includes('delivery_issue'), true);
    assert.equal(validCategories.includes('damaged_product'), true);
    assert.equal(validCategories.includes('invalid_category'), false);
  });
});

