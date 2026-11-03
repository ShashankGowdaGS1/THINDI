export interface CheckoutCustomer {
  fullName: string;
  phone: string; // 10-digit Indian mobile number
  email: string;
}

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string; // Currently restricted to 'Karnataka' for launch
  pincode: string; // 6-digit PIN code
}

export interface CheckoutItemSnapshot {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  kannadaName: string;
  weight: string;
  imageSrc: string;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
  isFragile?: boolean;
  isPickle?: boolean;
}

export interface CheckoutPricing {
  itemsSubtotalPaise: number;
  shippingChargePaise: number;
  taxAmountPaise: number;
  discountAmountPaise: number;
  finalAmountPaise: number;
  currency: 'INR';
  isShippingFree?: boolean;
  shippingRuleApplied?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded';

export type ShippingStatus =
  | 'unfulfilled'
  | 'quoted'
  | 'manifested'
  | 'shipped'
  | 'delivered';

export interface OrderRecord {
  id: string;
  orderReference: string; // e.g. THN-2026-XXXX
  accessToken: string; // Opaque security token for confirmation retrieval
  customer: CheckoutCustomer;
  shippingAddress: CheckoutAddress;
  items: CheckoutItemSnapshot[];
  pricing: CheckoutPricing;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  paymentProvider: 'razorpay' | 'demo';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  estimatedDelivery?: string;
  isDemoMode: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAttemptRecord {
  id: string;
  orderId: string;
  provider: 'razorpay' | 'demo';
  providerOrderId: string;
  providerPaymentId?: string;
  amountPaise: number;
  currency: string;
  status: 'initiated' | 'success' | 'failed';
  errorMessage?: string;
  createdAt: string;
}

export interface WebhookEventRecord {
  id: string;
  providerEventId: string;
  eventType: string;
  processed: boolean;
  payloadSummary: string;
  receivedAt: string;
  processedAt?: string;
}

