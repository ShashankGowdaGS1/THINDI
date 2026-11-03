import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Extract products from src/data/products.ts
const productsFilePath = path.resolve('src/data/products.ts');
const rawSource = fs.readFileSync(productsFilePath, 'utf8');

function extractProducts(source) {
  const sigMatch = source.match(
    /export const SIGNATURE_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\s*export const ADDITIONAL_PRODUCTS/
  );
  const addMatch = source.match(
    /export const ADDITIONAL_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\s*export const ALL_SHOP_PRODUCTS/
  );
  if (!sigMatch || !addMatch) {
    throw new Error('Unable to extract product arrays from src/data/products.ts');
  }
  const sig = new Function(`return ${sigMatch[1]}`)();
  const add = new Function(`return ${addMatch[1]}`)();
  return [...sig, ...add];
}

const allProducts = extractProducts(rawSource);

// Lightweight test harness replicating pricingEngine.ts logic
function calculateOrderPricingTest(rawItems, pincode, promoCode) {
  if (!rawItems || rawItems.length === 0) {
    throw new Error('Cannot calculate pricing for an empty cart.');
  }

  const snapshots = [];
  let itemsSubtotalPaise = 0;
  let hasFragile = false;
  let hasPickle = false;
  let totalWeightGrams = 0;
  let itemCount = 0;

  for (const item of rawItems) {
    if (item.quantity <= 0) {
      throw new Error(`Invalid item quantity ${item.quantity} for product ${item.productId}`);
    }

    const product = allProducts.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product with ID "${item.productId}" was not found in the verified catalogue.`);
    }

    if (product.inStock === false) {
      throw new Error(`Product "${product.name}" is currently out of stock.`);
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      throw new Error(`Variant with ID "${item.variantId}" for product "${product.name}" is unavailable.`);
    }

    const isFragileItem =
      product.category === 'appala-sandige' ||
      product.name.toLowerCase().includes('sandige') ||
      product.name.toLowerCase().includes('appala');

    const isPickleItem =
      product.category === 'uppinakai' ||
      product.name.toLowerCase().includes('pickle') ||
      product.name.toLowerCase().includes('uppinakai');

    if (isFragileItem) hasFragile = true;
    if (isPickleItem) hasPickle = true;

    let weightGrams = 200;
    if (variant.weight.includes('400g')) weightGrams = 400;
    else if (variant.weight.includes('500g')) weightGrams = 500;
    else if (variant.weight.includes('1kg')) weightGrams = 1000;
    totalWeightGrams += weightGrams * item.quantity;
    itemCount += item.quantity;

    const unitPricePaise = Math.round(variant.price * 100);
    const lineTotalPaise = unitPricePaise * item.quantity;
    itemsSubtotalPaise += lineTotalPaise;

    snapshots.push({
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      name: product.name,
      kannadaName: product.kannadaName,
      weight: variant.weight,
      imageSrc: product.imageSrc,
      unitPricePaise,
      quantity: item.quantity,
      lineTotalPaise,
      isFragile: isFragileItem,
      isPickle: isPickleItem,
    });
  }

  const FREE_SHIPPING_THRESHOLD_PAISE = 49900;
  const STANDARD_SHIPPING_PAISE = 4900;
  let shippingChargePaise = STANDARD_SHIPPING_PAISE;
  let isShippingFree = false;
  let shippingRule = 'Standard Karnataka Courier Dispatch';

  if (itemsSubtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) {
    shippingChargePaise = 0;
    isShippingFree = true;
    shippingRule = 'Free Shipping on orders above ₹499';
  }

  let discountAmountPaise = 0;
  if (promoCode && promoCode.trim().toUpperCase() === 'HASSAN10') {
    if (itemsSubtotalPaise >= 30000) {
      discountAmountPaise = Math.round(itemsSubtotalPaise * 0.1);
    }
  }

  const taxAmountPaise = 0;
  const finalAmountPaise = Math.max(
    0,
    itemsSubtotalPaise - discountAmountPaise + taxAmountPaise + shippingChargePaise
  );

  return {
    snapshots,
    pricing: {
      itemsSubtotalPaise,
      shippingChargePaise,
      taxAmountPaise,
      discountAmountPaise,
      finalAmountPaise,
      currency: 'INR',
      isShippingFree,
      shippingRuleApplied: shippingRule,
    },
    hasFragile,
    hasPickle,
    itemCount,
    totalWeightGrams,
  };
}

// Verification function mimicking razorpayService.ts
function verifyRazorpayHmac(orderId, paymentId, signature, secret) {
  if (!secret) return false;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const genBuf = Buffer.from(generatedSignature, 'utf8');
  const sigBuf = Buffer.from(signature, 'utf8');
  if (genBuf.length !== sigBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(genBuf, sigBuf);
}

// Order reference and token generation
function generateOrderReference() {
  const year = new Date().getFullYear();
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  return `THN-${year}-${randomChars}`;
}

function generateAccessToken() {
  return crypto.randomBytes(24).toString('hex');
}

describe('Stage 13: Deterministic Integer Paise Pricing Engine', () => {
  test('Computes integer paise subtotal with 0 floating point errors', () => {
    // 2 x Hassan Chakkali 200g (₹125 = 12500 paise each)
    const result = calculateOrderPricingTest(
      [{ productId: 'thindi-chakkali-01', variantId: 'chk-200g', quantity: 2 }],
      '560001'
    );

    assert.equal(result.snapshots[0].unitPricePaise, 12500);
    assert.equal(result.snapshots[0].lineTotalPaise, 25000); // ₹250.00
    assert.equal(result.pricing.itemsSubtotalPaise, 25000);
    // Subtotal ₹250 is under ₹499 -> ₹49 standard shipping (4900 paise)
    assert.equal(result.pricing.shippingChargePaise, 4900);
    assert.equal(result.pricing.isShippingFree, false);
    assert.equal(result.pricing.finalAmountPaise, 29900); // ₹299.00
  });

  test('Applies Free Shipping threshold when subtotal >= ₹499 (49900 paise)', () => {
    // 4 x Hassan Chakkali 400g (₹240 * 4 = ₹960 = 96000 paise)
    const result = calculateOrderPricingTest(
      [{ productId: 'thindi-chakkali-01', variantId: 'chk-400g', quantity: 4 }],
      '573201'
    );

    assert.equal(result.pricing.itemsSubtotalPaise, 96000);
    assert.equal(result.pricing.shippingChargePaise, 0);
    assert.equal(result.pricing.isShippingFree, true);
    assert.equal(result.pricing.finalAmountPaise, 96000);
  });

  test('Calculates promotional coupon HASSAN10 correctly (10% off for orders >= ₹300)', () => {
    // 3 x Kodubale 200g (₹130 * 3 = ₹390 = 39000 paise)
    const result = calculateOrderPricingTest(
      [{ productId: 'thindi-kodubale-02', variantId: 'kod-200g', quantity: 3 }],
      '560001',
      'HASSAN10'
    );

    assert.equal(result.pricing.itemsSubtotalPaise, 39000);
    // 10% of 39000 paise = 3900 paise (₹39.00)
    assert.equal(result.pricing.discountAmountPaise, 3900);
    // Standard shipping ₹49 = 4900 paise
    assert.equal(result.pricing.shippingChargePaise, 4900);
    // Final: 39000 - 3900 + 4900 = 40000 paise (₹400.00)
    assert.equal(result.pricing.finalAmountPaise, 40000);
  });

  test('Detects fragile snacks (sandige/appala) and liquids (pickles) for packaging flags', () => {
    const result = calculateOrderPricingTest(
      [
        { productId: 'thindi-chakkali-01', variantId: 'chk-200g', quantity: 1 },
        { productId: 'thindi-akki-sandige-07', variantId: 'snd-200g', quantity: 1 },
        { productId: 'thindi-mango-uppinakai-04', variantId: 'mng-250g', quantity: 1 },
      ],
      '560001'
    );

    assert.equal(result.hasFragile, true, 'Sandige must flag fragile handling');
    assert.equal(result.hasPickle, true, 'Pickle must flag jar leak-resistant cushioning');
  });

  test('Rejects invalid item quantities or non-existent products', () => {
    assert.throws(
      () =>
        calculateOrderPricingTest(
          [{ productId: 'thindi-chakkali-01', variantId: 'chk-200g', quantity: 0 }],
          '560001'
        ),
      /Invalid item quantity/
    );

    assert.throws(
      () =>
        calculateOrderPricingTest(
          [{ productId: 'non-existent-product', variantId: 'v1', quantity: 1 }],
          '560001'
        ),
      /not found in the verified catalogue/
    );
  });
});

describe('Stage 13: Order Identity & Security Tokens', () => {
  test('Generates structured order reference with current year', () => {
    const ref = generateOrderReference();
    const currentYear = new Date().getFullYear().toString();
    assert.match(ref, new RegExp(`^THN-${currentYear}-[A-Z0-9]{6}$`));
  });

  test('Generates high-entropy access token for privacy-protected order URLs', () => {
    const token1 = generateAccessToken();
    const token2 = generateAccessToken();
    assert.equal(typeof token1, 'string');
    assert.equal(token1.length, 48); // 24 bytes in hex
    assert.notEqual(token1, token2);
  });
});

describe('Stage 13: Razorpay Payment Cryptographic Signature Verification', () => {
  const secret = 'test_secret_key_hassan_kitchen_2026';
  const orderId = 'order_test_987654';
  const paymentId = 'pay_test_123456';

  // Compute authentic signature
  const validSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  test('Authenticates valid HMAC SHA-256 signature', () => {
    const isValid = verifyRazorpayHmac(orderId, paymentId, validSignature, secret);
    assert.equal(isValid, true);
  });

  test('Rejects tampered signature', () => {
    const tampered = validSignature.slice(0, -2) + 'aa';
    const isValid = verifyRazorpayHmac(orderId, paymentId, tampered, secret);
    assert.equal(isValid, false);
  });

  test('Rejects signature with different length safely without throwing RangeError', () => {
    const shortSignature = 'invalid_short_sig';
    const isValid = verifyRazorpayHmac(orderId, paymentId, shortSignature, secret);
    assert.equal(isValid, false);
  });

  test('Rejects signature when secret is missing', () => {
    const isValid = verifyRazorpayHmac(orderId, paymentId, validSignature, '');
    assert.equal(isValid, false);
  });
});

describe('Stage 13: Karnataka Delivery Boundary & Postal Rules', () => {
  function isKarnatakaPincode(pincode) {
    if (!/^\d{6}$/.test(pincode)) return false;
    const prefix = pincode.slice(0, 2);
    return ['56', '57', '58', '59'].includes(prefix);
  }

  test('Accepts major Karnataka pin codes', () => {
    assert.equal(isKarnatakaPincode('560001'), true, 'Bengaluru');
    assert.equal(isKarnatakaPincode('573201'), true, 'Hassan');
    assert.equal(isKarnatakaPincode('570001'), true, 'Mysuru');
    assert.equal(isKarnatakaPincode('580001'), true, 'Hubballi');
    assert.equal(isKarnatakaPincode('590001'), true, 'Belagavi');
  });

  test('Rejects non-Karnataka pin codes', () => {
    assert.equal(isKarnatakaPincode('110001'), false, 'New Delhi');
    assert.equal(isKarnatakaPincode('400001'), false, 'Mumbai');
    assert.equal(isKarnatakaPincode('600001'), false, 'Chennai');
    assert.equal(isKarnatakaPincode('500001'), false, 'Hyderabad');
    assert.equal(isKarnatakaPincode('56001'), false, '5 digits invalid');
    assert.equal(isKarnatakaPincode('abcdef'), false, 'Letters invalid');
  });
});
