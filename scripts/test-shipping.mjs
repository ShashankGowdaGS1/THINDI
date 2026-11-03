import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

// Direct functional validation testing
function validatePincode(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, pincode: '', error: 'Please enter your 6-digit PIN code.' };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { isValid: false, pincode: trimmed, error: 'PIN code must contain only numeric digits.' };
  }
  if (trimmed.length !== 6) {
    return { isValid: false, pincode: trimmed, error: `PIN code must be exactly 6 digits (currently ${trimmed.length}).` };
  }
  if (trimmed.startsWith('0')) {
    return { isValid: false, pincode: trimmed, error: 'Invalid PIN code. Postal codes cannot start with 0.' };
  }
  const prefix = trimmed.substring(0, 2);
  const isKarnatakaRange = ['56', '57', '58', '59'].includes(prefix);
  return { isValid: true, pincode: trimmed, isKarnatakaRange };
}

function evaluateCartRestrictions(cartSummary) {
  if (!cartSummary) return [];
  const restrictions = [];
  if (cartSummary.hasFragileItems) {
    restrictions.push('Cart includes fragile items (Sandige/Appala) requiring reinforced protective carton dividers.');
  }
  if (cartSummary.hasPickles) {
    restrictions.push('Cart includes traditional pickles dispatched in cushioned, leak-resistant sealed ceramic/glass packaging.');
  }
  return restrictions;
}

describe('Shipping Serviceability & Pincode Validation', () => {
  test('Validates authentic Karnataka PIN code (Hassan 573201)', () => {
    const res = validatePincode('573201');
    assert.equal(res.isValid, true);
    assert.equal(res.isKarnatakaRange, true);
    assert.equal(res.pincode, '573201');
  });

  test('Validates authentic Karnataka PIN code (Bengaluru 560001)', () => {
    const res = validatePincode('560001');
    assert.equal(res.isValid, true);
    assert.equal(res.isKarnatakaRange, true);
  });

  test('Validates non-Karnataka PIN code (Delhi 110001) as valid syntax but outside Karnataka', () => {
    const res = validatePincode('110001');
    assert.equal(res.isValid, true);
    assert.equal(res.isKarnatakaRange, false);
  });

  test('Rejects empty or whitespace-only input', () => {
    const res = validatePincode('   ');
    assert.equal(res.isValid, false);
    assert.match(res.error, /Please enter/i);
  });

  test('Rejects non-numeric characters in pincode', () => {
    const res = validatePincode('57320A');
    assert.equal(res.isValid, false);
    assert.match(res.error, /only numeric/i);
  });

  test('Rejects pincodes with fewer than 6 digits', () => {
    const res = validatePincode('57320');
    assert.equal(res.isValid, false);
    assert.match(res.error, /exactly 6 digits/i);
  });

  test('Rejects pincodes with more than 6 digits', () => {
    const res = validatePincode('5732019');
    assert.equal(res.isValid, false);
    assert.match(res.error, /exactly 6 digits/i);
  });

  test('Rejects pincodes starting with 0', () => {
    const res = validatePincode('012345');
    assert.equal(res.isValid, false);
    assert.match(res.error, /cannot start with 0/i);
  });

  test('Evaluates cart packaging restrictions for fragile items and pickles', () => {
    const restrictions = evaluateCartRestrictions({
      hasFragileItems: true,
      hasPickles: true,
    });
    assert.equal(restrictions.length, 2);
    assert.match(restrictions[0], /fragile/i);
    assert.match(restrictions[1], /pickles/i);
  });
});
