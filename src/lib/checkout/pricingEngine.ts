import { ALL_SHOP_PRODUCTS } from '@/data/products';
import { CheckoutItemSnapshot, CheckoutPricing } from '@/types/checkout';

export interface RawCheckoutItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface PricingCalculationResult {
  snapshots: CheckoutItemSnapshot[];
  pricing: CheckoutPricing;
  hasFragile: boolean;
  hasPickle: boolean;
  itemCount: number;
  totalWeightGrams: number;
}

/**
 * Server-authoritative deterministic pricing engine.
 * Computes all financial quantities strictly in integer paise (1 INR = 100 Paise).
 * Validates product SKUs and live prices against the authoritative server catalog.
 */
export function calculateOrderPricing(
  rawItems: RawCheckoutItem[],
  pincode: string,
  promoCode?: string
): PricingCalculationResult {
  if (!rawItems || rawItems.length === 0) {
    throw new Error('Cannot calculate pricing for an empty cart.');
  }

  const snapshots: CheckoutItemSnapshot[] = [];
  let itemsSubtotalPaise = 0;
  let hasFragile = false;
  let hasPickle = false;
  let totalWeightGrams = 0;
  let itemCount = 0;

  for (const item of rawItems) {
    if (item.quantity <= 0) {
      throw new Error(`Invalid item quantity ${item.quantity} for product ${item.productId}`);
    }

    // Lookup authoritative product from server catalog
    const product = ALL_SHOP_PRODUCTS.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product with ID "${item.productId}" was not found in the verified catalogue.`);
    }

    if (product.inStock === false) {
      throw new Error(`Product "${product.name}" is currently out of stock.`);
    }

    // Lookup authoritative variant
    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      throw new Error(`Variant with ID "${item.variantId}" for product "${product.name}" is unavailable.`);
    }

    if (!variant.available) {
      throw new Error(`Pack size "${variant.weight}" for "${product.name}" is not currently available.`);
    }

    // Check product characteristics for protective shipping requirements
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

    // Estimate weight
    let weightGrams = 200;
    if (variant.weight.includes('400g')) weightGrams = 400;
    else if (variant.weight.includes('500g')) weightGrams = 500;
    else if (variant.weight.includes('1kg')) weightGrams = 1000;
    totalWeightGrams += weightGrams * item.quantity;
    itemCount += item.quantity;

    // Unit price in paise
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

  // Calculate Shipping fee
  // Free standard shipping on orders >= ₹499 (49,900 paise)
  const FREE_SHIPPING_THRESHOLD_PAISE = 49900;
  const STANDARD_SHIPPING_PAISE = 4900; // ₹49
  let shippingChargePaise = STANDARD_SHIPPING_PAISE;
  let isShippingFree = false;
  let shippingRule = 'Standard Karnataka Courier Dispatch';

  if (itemsSubtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) {
    shippingChargePaise = 0;
    isShippingFree = true;
    shippingRule = 'Free Shipping on orders above ₹499';
  }

  // Calculate promotional discount if valid code provided
  let discountAmountPaise = 0;
  if (promoCode && promoCode.trim().toUpperCase() === 'HASSAN10') {
    // 10% off for verified introductory promo code on subtotal >= ₹300
    if (itemsSubtotalPaise >= 30000) {
      discountAmountPaise = Math.round(itemsSubtotalPaise * 0.1);
    }
  }

  // Applicable taxes (Inclusive in product pricing under current Karnataka food category regulations)
  const taxAmountPaise = 0;

  const finalAmountPaise = Math.max(
    0,
    itemsSubtotalPaise - discountAmountPaise + taxAmountPaise + shippingChargePaise
  );

  const pricing: CheckoutPricing = {
    itemsSubtotalPaise,
    shippingChargePaise,
    taxAmountPaise,
    discountAmountPaise,
    finalAmountPaise,
    currency: 'INR',
    isShippingFree,
    shippingRuleApplied: shippingRule,
  };

  return {
    snapshots,
    pricing,
    hasFragile,
    hasPickle,
    itemCount,
    totalWeightGrams,
  };
}

