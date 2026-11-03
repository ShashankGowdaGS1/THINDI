import {
  PincodeValidationResult,
  ShippingCheckRequest,
  ShippingCheckResponse,
} from './types';

/**
 * Validates Indian postal PIN codes with specific Karnataka geographic detection.
 * Valid PIN codes are 6 numeric digits, starting with 1-9.
 * Karnataka postal ranges start with 56, 57, 58, 59.
 */
export function validatePincode(input: string): PincodeValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      pincode: '',
      error: 'Please enter your 6-digit PIN code.',
    };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      pincode: trimmed,
      error: 'PIN code must contain only numeric digits.',
    };
  }

  if (trimmed.length !== 6) {
    return {
      isValid: false,
      pincode: trimmed,
      error: `PIN code must be exactly 6 digits (currently ${trimmed.length}).`,
    };
  }

  if (trimmed.startsWith('0')) {
    return {
      isValid: false,
      pincode: trimmed,
      error: 'Invalid PIN code. Postal codes cannot start with 0.',
    };
  }

  // Check Karnataka postal code range (560000 - 599999)
  const prefix = trimmed.substring(0, 2);
  const isKarnatakaRange = ['56', '57', '58', '59'].includes(prefix);

  return {
    isValid: true,
    pincode: trimmed,
    isKarnatakaRange,
  };
}

/**
 * Evaluates product-specific packaging and shipping restrictions
 * based on the cart contents.
 */
export function evaluateCartRestrictions(
  cartSummary?: ShippingCheckRequest['cartSummary']
): string[] {
  if (!cartSummary) return [];

  const restrictions: string[] = [];

  if (cartSummary.hasFragileItems) {
    restrictions.push(
      'Cart includes fragile items (Sandige/Appala) requiring reinforced protective carton dividers.'
    );
  }

  if (cartSummary.hasPickles) {
    restrictions.push(
      'Cart includes traditional pickles dispatched in cushioned, leak-resistant sealed ceramic/glass packaging.'
    );
  }

  if (cartSummary.hasShortShelfLife) {
    restrictions.push(
      'Cart includes perishable festive sweets requiring direct express route verification.'
    );
  }

  return restrictions;
}
