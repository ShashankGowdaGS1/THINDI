import crypto from 'node:crypto';
import {
  OrderRecord,
  PaymentAttemptRecord,
  WebhookEventRecord,
  OrderStatus,
  PaymentStatus,
  CheckoutCustomer,
  CheckoutAddress,
  CheckoutItemSnapshot,
  CheckoutPricing,
} from '@/types/checkout';

// In-memory persistent order storage (safe fallback and fast state resolution)
const ordersMap = new Map<string, OrderRecord>();
const paymentAttempts: PaymentAttemptRecord[] = [];
const webhookEventsMap = new Map<string, WebhookEventRecord>();

// Seed sample orders for demo mode & local development testing
function seedDemoOrders() {
  const now = new Date().toISOString();

  // Demo Order 1: In Transit to Bengaluru
  ordersMap.set('THN-2026-DEMO01', {
    id: 'demo-ord-01',
    orderReference: 'THN-2026-DEMO01',
    accessToken: 'demo_token_rohini_2026',
    customer: {
      fullName: 'Rohini Kumar',
      phone: '9845012345',
      email: 'rohini@example.com',
    },
    shippingAddress: {
      fullName: 'Rohini Kumar',
      phone: '9845012345',
      addressLine1: '#42, 3rd Cross, Malleshwaram',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560003',
    },
    items: [
      {
        productId: 'thindi-chakkali-01',
        variantId: 'chk-200g',
        sku: 'THN-CHK-200',
        name: 'Traditional Hassan Chakkali',
        kannadaName: 'ಹಾಸನ ಚಕ್ಕುಲಿ',
        weight: '200g',
        imageSrc: '/images/products/chakkali.jpg',
        unitPricePaise: 12500,
        quantity: 2,
        lineTotalPaise: 25000,
      },
      {
        productId: 'thindi-mango-uppinakai-04',
        variantId: 'mng-250g',
        sku: 'THN-MNG-250',
        name: 'Mavinkayi Mango Pickle',
        kannadaName: 'ಮಾವಿನಕಾಯಿ ಉಪ್ಪಿನಕಾಯಿ',
        weight: '250g Jar',
        imageSrc: '/images/products/mango-uppinakai.jpg',
        unitPricePaise: 16000,
        quantity: 1,
        lineTotalPaise: 16000,
        isPickle: true,
      },
    ],
    pricing: {
      itemsSubtotalPaise: 41000,
      shippingChargePaise: 4900,
      taxAmountPaise: 0,
      discountAmountPaise: 0,
      finalAmountPaise: 45900,
      currency: 'INR',
      isShippingFree: false,
      shippingRuleApplied: 'Standard Karnataka Courier Dispatch',
    },
    orderStatus: 'confirmed',
    paymentStatus: 'captured',
    shippingStatus: 'shipped',
    paymentProvider: 'demo',
    isDemoMode: true,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: now,
  });

  // Demo Order 2: Delivered in Mysuru
  ordersMap.set('THN-2026-DEMO02', {
    id: 'demo-ord-02',
    orderReference: 'THN-2026-DEMO02',
    accessToken: 'demo_token_anand_2026',
    customer: {
      fullName: 'Anand Rao',
      phone: '9886012345',
      email: 'anand@example.com',
    },
    shippingAddress: {
      fullName: 'Anand Rao',
      phone: '9886012345',
      addressLine1: '#15, Temple Road, Kuvempunagar',
      city: 'Mysuru',
      state: 'Karnataka',
      pincode: '570023',
    },
    items: [
      {
        productId: 'thindi-kodubale-02',
        variantId: 'kod-200g',
        sku: 'THN-KOD-200',
        name: 'Crisp Ring Kodubale',
        kannadaName: 'ಖಾರ ಕೋಡುಬಳೆ',
        weight: '200g',
        imageSrc: '/images/products/kodubale.jpg',
        unitPricePaise: 13000,
        quantity: 3,
        lineTotalPaise: 39000,
      },
      {
        productId: 'thindi-akki-sandige-07',
        variantId: 'snd-200g',
        sku: 'THN-SND-200',
        name: 'Sun-Dried Akki Sandige',
        kannadaName: 'ಅಕ್ಕಿ ಸಂಡಿಗೆ',
        weight: '200g Pack',
        imageSrc: '/images/products/akki-sandige.jpg',
        unitPricePaise: 11000,
        quantity: 2,
        lineTotalPaise: 22000,
        isFragile: true,
      },
    ],
    pricing: {
      itemsSubtotalPaise: 61000,
      shippingChargePaise: 0,
      taxAmountPaise: 0,
      discountAmountPaise: 0,
      finalAmountPaise: 61000,
      currency: 'INR',
      isShippingFree: true,
      shippingRuleApplied: 'Free Shipping on orders above ₹499',
    },
    orderStatus: 'delivered',
    paymentStatus: 'captured',
    shippingStatus: 'delivered',
    paymentProvider: 'demo',
    isDemoMode: true,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: now,
  });
}

seedDemoOrders();

/**
 * Internal lookup for server operations (e.g. verifying email ownership or admin inspection).
 * Searches by order reference or internal ID.
 */
export function findOrderByReference(orderReferenceOrId: string): OrderRecord | null {
  if (!orderReferenceOrId) return null;
  const normalized = orderReferenceOrId.trim();
  const direct = ordersMap.get(normalized.toUpperCase());
  if (direct) return direct;

  for (const order of ordersMap.values()) {
    if (order.id === normalized || order.orderReference.toUpperCase() === normalized.toUpperCase()) {
      return order;
    }
  }
  return null;
}

/**
 * Generates an opaque, human-friendly order reference.
 * Example: THN-2026-7B8K2F
 */
export function generateOrderReference(): string {
  const year = new Date().getFullYear();
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  return `THN-${year}-${randomChars}`;
}

/**
 * Generates a cryptographically strong access token to protect order URLs.
 */
export function generateAccessToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export interface CreateOrderParams {
  customer: CheckoutCustomer;
  shippingAddress: CheckoutAddress;
  items: CheckoutItemSnapshot[];
  pricing: CheckoutPricing;
  paymentProvider: 'razorpay' | 'demo';
  razorpayOrderId?: string;
  isDemoMode: boolean;
  notes?: string;
}

/**
 * Creates and persists a pending order record.
 */
export function createPendingOrder(params: CreateOrderParams): OrderRecord {
  const id = crypto.randomUUID();
  const orderReference = generateOrderReference();
  const accessToken = generateAccessToken();
  const now = new Date().toISOString();

  const record: OrderRecord = {
    id,
    orderReference,
    accessToken,
    customer: params.customer,
    shippingAddress: params.shippingAddress,
    items: params.items,
    pricing: params.pricing,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    shippingStatus: 'quoted',
    paymentProvider: params.paymentProvider,
    razorpayOrderId: params.razorpayOrderId,
    isDemoMode: params.isDemoMode,
    notes: params.notes,
    createdAt: now,
    updatedAt: now,
  };

  ordersMap.set(orderReference, record);
  return record;
}

/**
 * Retrieves an order by reference, securely validating the access token if provided.
 */
export function getOrderByReference(
  orderReference: string,
  accessToken?: string | null
): OrderRecord | null {
  const order = ordersMap.get(orderReference.trim().toUpperCase());
  if (!order) return null;

  // If accessToken is supplied, ensure it matches to prevent unauthorized order snooping
  if (accessToken && order.accessToken !== accessToken.trim()) {
    return null;
  }

  return order;
}

/**
 * Updates an order upon successful payment capture or verification.
 */
export function markOrderPaymentCaptured(
  orderReference: string,
  paymentId: string,
  provider: 'razorpay' | 'demo'
): OrderRecord | null {
  const order = ordersMap.get(orderReference.trim().toUpperCase());
  if (!order) return null;

  order.paymentStatus = 'captured';
  order.orderStatus = 'confirmed';
  order.razorpayPaymentId = paymentId;
  order.paymentProvider = provider;
  order.updatedAt = new Date().toISOString();

  ordersMap.set(order.orderReference, order);
  return order;
}

/**
 * Marks an order payment as failed.
 */
export function markOrderPaymentFailed(
  orderReference: string,
  errorMessage?: string
): OrderRecord | null {
  const order = ordersMap.get(orderReference.trim().toUpperCase());
  if (!order) return null;

  order.paymentStatus = 'failed';
  order.notes = errorMessage ? `Payment error: ${errorMessage}` : order.notes;
  order.updatedAt = new Date().toISOString();

  ordersMap.set(order.orderReference, order);
  return order;
}

/**
 * Records a payment attempt for auditing.
 */
export function recordPaymentAttempt(attempt: Omit<PaymentAttemptRecord, 'id' | 'createdAt'>): PaymentAttemptRecord {
  const record: PaymentAttemptRecord = {
    ...attempt,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  paymentAttempts.push(record);
  return record;
}

export function getAllOrders(): OrderRecord[] {
  return Array.from(ordersMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateOrderStatusAdmin(
  orderReferenceOrId: string,
  newStatus: OrderStatus,
  notes?: string
): OrderRecord | null {
  const order = findOrderByReference(orderReferenceOrId);
  if (!order) return null;

  order.orderStatus = newStatus;
  if (notes) {
    order.notes = order.notes ? `${order.notes} | ${notes}` : notes;
  }
  order.updatedAt = new Date().toISOString();
  ordersMap.set(order.orderReference, order);
  return order;
}

/**
 * Checks if a webhook event ID has already been recorded (idempotency protection).
 */
export function isWebhookProcessed(providerEventId: string): boolean {
  return webhookEventsMap.has(providerEventId);
}

/**
 * Records a processed webhook event.
 */
export function recordWebhookEvent(
  providerEventId: string,
  eventType: string,
  summary: string
): WebhookEventRecord {
  const now = new Date().toISOString();
  const record: WebhookEventRecord = {
    id: crypto.randomUUID(),
    providerEventId,
    eventType,
    processed: true,
    payloadSummary: summary,
    receivedAt: now,
    processedAt: now,
  };
  webhookEventsMap.set(providerEventId, record);
  return record;
}

