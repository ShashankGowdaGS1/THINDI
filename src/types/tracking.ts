export type NormalizedTrackingStatus =
  | 'Shipment Created'
  | 'Awaiting Pickup'
  | 'Picked Up'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delivery Exception'
  | 'Return Initiated'
  | 'Returned'
  | 'Cancelled'
  | 'Tracking Unavailable'
  | 'Pending Review';

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  providerEventId?: string;
  providerStatusCode?: string;
  normalizedStatus: NormalizedTrackingStatus;
  eventDescription: string;
  eventLocation?: string;
  eventTime: string; // ISO 8601 string in UTC
  receivedAt: string;
  rawEventReference?: string;
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  orderReference: string;
  shippingProvider: 'shiprocket' | 'demo';
  providerShipmentId?: string;
  courierName?: string;
  awb: string;
  normalizedStatus: NormalizedTrackingStatus;
  providerStatus?: string;
  origin: string;
  destination: string;
  destinationPincode: string;
  shippedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  lastSyncedAt: string;
  events: ShipmentEvent[];
  isDemoMode?: boolean;
}

export interface OrderAccessChallenge {
  id: string;
  orderReference: string;
  email: string;
  codeHash: string;
  expiresAt: number; // Unix timestamp in ms
  attempts: number;
  verifiedAt?: number;
  lastSentAt: number;
}

export type SupportCategory =
  | 'delivery_issue'
  | 'damaged_product'
  | 'missing_item'
  | 'incorrect_item'
  | 'payment_issue'
  | 'general_order_enquiry';

export interface SupportTicket {
  id: string;
  ticketReference: string; // e.g. TKT-2026-XXXXXX
  orderReference?: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  preferredContact?: 'email' | 'phone';
  createdAt: string;
  updatedAt: string;
}

export interface OrderSessionPayload {
  orderReference: string;
  verifiedAt: number;
  expiresAt: number;
}

