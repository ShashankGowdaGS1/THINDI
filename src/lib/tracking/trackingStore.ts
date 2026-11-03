import crypto from 'node:crypto';
import {
  ShipmentRecord,
  ShipmentEvent,
  OrderAccessChallenge,
  SupportTicket,
  SupportCategory,
  NormalizedTrackingStatus,
} from '@/types/tracking';
import { isStatusProgressionValid } from './statusMapper';

// In-memory tracking data stores
const challengesMap = new Map<string, OrderAccessChallenge>();
const shipmentsMap = new Map<string, ShipmentRecord>();
const awbToOrderMap = new Map<string, string>();
const supportTicketsMap = new Map<string, SupportTicket>();

// Seed sample shipment timelines for demo testing
function seedDemoShipments() {
  const now = Date.now();
  const dayMs = 24 * 3600 * 1000;

  // Shipment 1: In Transit (Delhivery)
  const ship1: ShipmentRecord = {
    id: 'ship-demo-01',
    orderId: 'demo-ord-01',
    orderReference: 'THN-2026-DEMO01',
    shippingProvider: 'demo',
    providerShipmentId: 'SR-DEMO-1001',
    courierName: 'Delhivery Surface',
    awb: 'THN-DEL-894120',
    normalizedStatus: 'In Transit',
    providerStatus: 'IN TRANSIT',
    origin: 'Hassan Processing Hub',
    destination: 'Malleshwaram, Bengaluru',
    destinationPincode: '560003',
    shippedAt: new Date(now - 1.5 * dayMs).toISOString(),
    estimatedDelivery: 'Tomorrow by 6:00 PM',
    lastSyncedAt: new Date().toISOString(),
    isDemoMode: true,
    events: [
      {
        id: 'evt-01-1',
        shipmentId: 'ship-demo-01',
        providerStatusCode: 'AWB_ASSIGNED',
        normalizedStatus: 'Shipment Created',
        eventDescription: 'Shipping label created and manifests generated at Hassan Kitchen.',
        eventLocation: 'Hassan, Karnataka',
        eventTime: new Date(now - 2 * dayMs).toISOString(),
        receivedAt: new Date(now - 2 * dayMs).toISOString(),
      },
      {
        id: 'evt-01-2',
        shipmentId: 'ship-demo-01',
        providerStatusCode: 'PICKED_UP',
        normalizedStatus: 'Picked Up',
        eventDescription: 'Parcel collected by courier partner from Hassan main center.',
        eventLocation: 'Hassan Hub',
        eventTime: new Date(now - 1.5 * dayMs).toISOString(),
        receivedAt: new Date(now - 1.5 * dayMs).toISOString(),
      },
      {
        id: 'evt-01-3',
        shipmentId: 'ship-demo-01',
        providerStatusCode: 'IN_TRANSIT',
        normalizedStatus: 'In Transit',
        eventDescription: 'Departed Hassan center, transit scan at Nelamangala Hub.',
        eventLocation: 'Nelamangala Hub, Bengaluru Rural',
        eventTime: new Date(now - 0.5 * dayMs).toISOString(),
        receivedAt: new Date(now - 0.5 * dayMs).toISOString(),
      },
    ],
  };

  // Shipment 2: Delivered (Blue Dart)
  const ship2: ShipmentRecord = {
    id: 'ship-demo-02',
    orderId: 'demo-ord-02',
    orderReference: 'THN-2026-DEMO02',
    shippingProvider: 'demo',
    providerShipmentId: 'SR-DEMO-1002',
    courierName: 'Blue Dart Express',
    awb: 'THN-BLR-554210',
    normalizedStatus: 'Delivered',
    providerStatus: 'DELIVERED',
    origin: 'Hassan Processing Hub',
    destination: 'Kuvempunagar, Mysuru',
    destinationPincode: '570023',
    shippedAt: new Date(now - 3 * dayMs).toISOString(),
    deliveredAt: new Date(now - 1 * dayMs).toISOString(),
    lastSyncedAt: new Date().toISOString(),
    isDemoMode: true,
    events: [
      {
        id: 'evt-02-1',
        shipmentId: 'ship-demo-02',
        providerStatusCode: 'AWB_ASSIGNED',
        normalizedStatus: 'Shipment Created',
        eventDescription: 'Package packed with reinforced inserts and labeled.',
        eventLocation: 'Hassan Hub',
        eventTime: new Date(now - 3.5 * dayMs).toISOString(),
        receivedAt: new Date(now - 3.5 * dayMs).toISOString(),
      },
      {
        id: 'evt-02-2',
        shipmentId: 'ship-demo-02',
        providerStatusCode: 'PICKED_UP',
        normalizedStatus: 'Picked Up',
        eventDescription: 'Shipment handed over to Blue Dart dispatch network.',
        eventLocation: 'Hassan',
        eventTime: new Date(now - 3 * dayMs).toISOString(),
        receivedAt: new Date(now - 3 * dayMs).toISOString(),
      },
      {
        id: 'evt-02-3',
        shipmentId: 'ship-demo-02',
        providerStatusCode: 'IN_TRANSIT',
        normalizedStatus: 'In Transit',
        eventDescription: 'Arrived at Mysuru Central Sorting Center.',
        eventLocation: 'Mysuru Hub',
        eventTime: new Date(now - 2 * dayMs).toISOString(),
        receivedAt: new Date(now - 2 * dayMs).toISOString(),
      },
      {
        id: 'evt-02-4',
        shipmentId: 'ship-demo-02',
        providerStatusCode: 'OUT_FOR_DELIVERY',
        normalizedStatus: 'Out for Delivery',
        eventDescription: 'Out for doorstep delivery with executive.',
        eventLocation: 'Kuvempunagar DC, Mysuru',
        eventTime: new Date(now - 1.2 * dayMs).toISOString(),
        receivedAt: new Date(now - 1.2 * dayMs).toISOString(),
      },
      {
        id: 'evt-02-5',
        shipmentId: 'ship-demo-02',
        providerStatusCode: 'DELIVERED',
        normalizedStatus: 'Delivered',
        eventDescription: 'Handed over directly to Anand Rao. Signed on delivery.',
        eventLocation: 'Mysuru',
        eventTime: new Date(now - 1 * dayMs).toISOString(),
        receivedAt: new Date(now - 1 * dayMs).toISOString(),
      },
    ],
  };

  shipmentsMap.set(ship1.orderReference, ship1);
  awbToOrderMap.set(ship1.awb, ship1.orderReference);

  shipmentsMap.set(ship2.orderReference, ship2);
  awbToOrderMap.set(ship2.awb, ship2.orderReference);
}

seedDemoShipments();

/**
 * Access Challenge Management
 */
export function createAccessChallenge(
  orderReference: string,
  email: string,
  codeHash: string,
  ttlMs = 10 * 60 * 1000 // 10 minutes
): OrderAccessChallenge {
  const normalizedRef = orderReference.trim().toUpperCase();
  const challenge: OrderAccessChallenge = {
    id: crypto.randomUUID(),
    orderReference: normalizedRef,
    email: email.trim().toLowerCase(),
    codeHash,
    expiresAt: Date.now() + ttlMs,
    attempts: 0,
    lastSentAt: Date.now(),
  };

  challengesMap.set(normalizedRef, challenge);
  return challenge;
}

export function getAccessChallenge(orderReference: string): OrderAccessChallenge | null {
  const challenge = challengesMap.get(orderReference.trim().toUpperCase());
  if (!challenge) return null;

  // Check if expired
  if (Date.now() > challenge.expiresAt) {
    challengesMap.delete(orderReference.trim().toUpperCase());
    return null;
  }

  return challenge;
}

export function recordChallengeAttempt(orderReference: string): number {
  const challenge = getAccessChallenge(orderReference);
  if (!challenge) return 0;

  challenge.attempts += 1;
  if (challenge.attempts >= 5) {
    // Burn challenge on excessive failed attempts
    challengesMap.delete(orderReference.trim().toUpperCase());
  } else {
    challengesMap.set(orderReference.trim().toUpperCase(), challenge);
  }

  return challenge.attempts;
}

export function invalidateChallenge(orderReference: string): void {
  challengesMap.delete(orderReference.trim().toUpperCase());
}

/**
 * Shipment Retrieval & Event Management
 */
export function getShipmentForOrder(orderReference: string): ShipmentRecord | null {
  return shipmentsMap.get(orderReference.trim().toUpperCase()) || null;
}

export function getShipmentByAwb(awb: string): ShipmentRecord | null {
  const orderRef = awbToOrderMap.get(awb.trim());
  if (!orderRef) return null;
  return shipmentsMap.get(orderRef) || null;
}

export function getAllShipments(): ShipmentRecord[] {
  return Array.from(shipmentsMap.values()).sort(
    (a, b) => new Date(b.lastSyncedAt).getTime() - new Date(a.lastSyncedAt).getTime()
  );
}

export function saveShipment(shipment: ShipmentRecord): void {
  shipmentsMap.set(shipment.orderReference.toUpperCase(), shipment);
  if (shipment.awb) {
    awbToOrderMap.set(shipment.awb.trim(), shipment.orderReference.toUpperCase());
  }
}

/**
 * Adds a tracking event to a shipment, enforcing status progression rules
 * and deduplicating repeated scans.
 */
export function addShipmentTrackingEvent(
  orderReference: string,
  event: Omit<ShipmentEvent, 'id' | 'receivedAt'>
): { success: boolean; reason?: string; shipment?: ShipmentRecord } {
  const shipment = getShipmentForOrder(orderReference);
  if (!shipment) {
    return { success: false, reason: 'Shipment record not found' };
  }

  // Deduplication: check if providerEventId or identical eventTime + status exists
  const isDuplicate = shipment.events.some(
    (e) =>
      (event.providerEventId && e.providerEventId === event.providerEventId) ||
      (e.eventTime === event.eventTime && e.normalizedStatus === event.normalizedStatus)
  );

  if (isDuplicate) {
    return { success: true, reason: 'Event already recorded (idempotent)', shipment };
  }

  // Check out-of-order progression
  const canUpdateStatus = isStatusProgressionValid(shipment.normalizedStatus, event.normalizedStatus);

  const fullEvent: ShipmentEvent = {
    ...event,
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
  };

  shipment.events.push(fullEvent);
  // Sort events chronologically ascending
  shipment.events.sort((a, b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime());

  if (canUpdateStatus) {
    shipment.normalizedStatus = event.normalizedStatus;
    if (event.providerStatusCode) {
      shipment.providerStatus = event.providerStatusCode;
    }
    if (event.normalizedStatus === 'Delivered') {
      shipment.deliveredAt = event.eventTime;
    }
  }

  shipment.lastSyncedAt = new Date().toISOString();
  saveShipment(shipment);

  return { success: true, shipment };
}

/**
 * Support Ticket Management
 */
export function generateTicketReference(): string {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TKT-${year}-${rand}`;
}

export function createSupportTicket(params: {
  orderReference?: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  preferredContact?: 'email' | 'phone';
}): SupportTicket {
  const ticketReference = generateTicketReference();
  const now = new Date().toISOString();

  const ticket: SupportTicket = {
    id: crypto.randomUUID(),
    ticketReference,
    orderReference: params.orderReference?.trim().toUpperCase(),
    customerEmail: params.customerEmail.trim().toLowerCase(),
    customerPhone: params.customerPhone?.trim(),
    customerName: params.customerName?.trim(),
    category: params.category,
    subject: params.subject.trim(),
    message: params.message.trim(),
    status: 'open',
    preferredContact: params.preferredContact || 'email',
    createdAt: now,
    updatedAt: now,
  };

  supportTicketsMap.set(ticketReference, ticket);
  return ticket;
}

export function getSupportTicketsForOrder(orderReference: string): SupportTicket[] {
  const norm = orderReference.trim().toUpperCase();
  return Array.from(supportTicketsMap.values()).filter((t) => t.orderReference === norm);
}

export function getAllSupportTickets(): SupportTicket[] {
  return Array.from(supportTicketsMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getSupportTicketByReference(ticketReference: string): SupportTicket | null {
  return supportTicketsMap.get(ticketReference.trim().toUpperCase()) || null;
}

export function updateSupportTicketStatus(
  ticketReference: string,
  newStatus: SupportTicket['status'],
  note?: string
): SupportTicket | null {
  const ticket = supportTicketsMap.get(ticketReference.trim().toUpperCase());
  if (!ticket) return null;

  ticket.status = newStatus;
  ticket.updatedAt = new Date().toISOString();
  if (note) {
    ticket.message = `${ticket.message}\n\n[Staff Note]: ${note}`;
  }
  supportTicketsMap.set(ticket.ticketReference, ticket);
  return ticket;
}

