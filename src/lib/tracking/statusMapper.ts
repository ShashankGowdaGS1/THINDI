import { NormalizedTrackingStatus } from '@/types/tracking';

/**
 * Normalizes courier status codes and text strings into clear, customer-friendly THINDI milestones.
 * Preserves the original courier status for auditing and support investigation.
 */
export function normalizeTrackingStatus(
  rawStatus: string | number | undefined | null
): {
  normalized: NormalizedTrackingStatus;
  isException: boolean;
  isCompleted: boolean;
  raw: string;
} {
  if (rawStatus === undefined || rawStatus === null) {
    return {
      normalized: 'Tracking Unavailable',
      isException: false,
      isCompleted: false,
      raw: 'NULL',
    };
  }

  const rawStr = String(rawStatus).trim();
  const upper = rawStr.toUpperCase();

  // Numeric Shiprocket status codes
  switch (upper) {
    case '1':
    case '2':
    case 'AWB ASSIGNED':
    case 'LABEL GENERATED':
    case 'MANIFESTED':
    case 'SHIPMENT CREATED':
      return {
        normalized: 'Shipment Created',
        isException: false,
        isCompleted: false,
        raw: rawStr,
      };

    case '3':
    case '14':
    case '15':
    case 'PICKUP SCHEDULED':
    case 'PICKUP QUEUED':
    case 'AWAITING PICKUP':
    case 'READY FOR PICKUP':
      return {
        normalized: 'Awaiting Pickup',
        isException: false,
        isCompleted: false,
        raw: rawStr,
      };

    case 'PICKED UP':
    case 'COLLECTED':
    case 'RECEIVED AT HUB':
    case 'PICKUP DONE':
      return {
        normalized: 'Picked Up',
        isException: false,
        isCompleted: false,
        raw: rawStr,
      };

    case '5':
    case '38':
    case 'IN TRANSIT':
    case 'TRANSIT':
    case 'REACHED AT HUB':
    case 'DEPARTED FROM HUB':
    case 'REACHED DESTINATION HUB':
    case 'CONNECTED TO HUB':
      return {
        normalized: 'In Transit',
        isException: false,
        isCompleted: false,
        raw: rawStr,
      };

    case '7':
    case 'OUT FOR DELIVERY':
    case 'DISPATCHED FOR DELIVERY':
      return {
        normalized: 'Out for Delivery',
        isException: false,
        isCompleted: false,
        raw: rawStr,
      };

    case '6':
    case 'DELIVERED':
    case 'SHIPMENT DELIVERED':
      return {
        normalized: 'Delivered',
        isException: false,
        isCompleted: true,
        raw: rawStr,
      };

    case '4':
    case '12':
    case '13':
    case '16':
    case '17':
    case '18':
    case 'UNDELIVERED':
    case 'DELIVERY ATTEMPTED':
    case 'DELIVERY ATTEMPT UNSUCCESSFUL':
    case 'SHIPMENT DELAYED':
    case 'DELAYED':
    case 'CUSTOMER NOT AVAILABLE':
    case 'ADDRESS INCOMPLETE':
    case 'DAMAGED':
    case 'LOST':
    case 'DELIVERY EXCEPTION':
      return {
        normalized: 'Delivery Exception',
        isException: true,
        isCompleted: false,
        raw: rawStr,
      };

    case '9':
    case 'RTO INITIATED':
    case 'RETURN TO ORIGIN':
    case 'RTO IN TRANSIT':
    case 'RETURN INITIATED':
      return {
        normalized: 'Return Initiated',
        isException: true,
        isCompleted: false,
        raw: rawStr,
      };

    case '10':
    case 'RTO DELIVERED':
    case 'RETURNED TO SELLER':
    case 'RETURNED':
      return {
        normalized: 'Returned',
        isException: true,
        isCompleted: true,
        raw: rawStr,
      };

    case '8':
    case 'CANCELED':
    case 'CANCELLED':
    case 'SHIPMENT CANCELLED':
      return {
        normalized: 'Cancelled',
        isException: true,
        isCompleted: true,
        raw: rawStr,
      };

    default:
      // Unknown courier codes explicitly marked as Pending Review rather than incorrectly assuming In Transit
      return {
        normalized: 'Pending Review',
        isException: false,
        isCompleted: false,
        raw: rawStr,
      };
  }
}

/**
 * Status hierarchy ranks to prevent out-of-order or stale tracking webhooks
 * from overwriting a more advanced authoritative delivery state.
 */
export const STATUS_RANK: Record<NormalizedTrackingStatus, number> = {
  'Shipment Created': 1,
  'Awaiting Pickup': 2,
  'Picked Up': 3,
  'In Transit': 4,
  'Out for Delivery': 5,
  'Delivered': 6,
  'Delivery Exception': 4, // Concurrent state
  'Return Initiated': 7,
  'Returned': 8,
  'Cancelled': 9,
  'Pending Review': 0,
  'Tracking Unavailable': 0,
};

/**
 * Checks whether an incoming status is valid to update the current status,
 * guarding against delayed out-of-order events.
 */
export function isStatusProgressionValid(
  currentStatus: NormalizedTrackingStatus,
  incomingStatus: NormalizedTrackingStatus
): boolean {
  // Delivered, Returned or Cancelled are terminal states and cannot be reverted by older transit scans
  if (currentStatus === 'Delivered' && incomingStatus !== 'Delivered') {
    return false;
  }
  if (currentStatus === 'Returned' && incomingStatus !== 'Returned') {
    return false;
  }
  if (currentStatus === 'Cancelled') {
    return false;
  }

  // Delivery Exceptions can happen during In Transit or Out for Delivery
  if (incomingStatus === 'Delivery Exception') {
    return currentStatus !== 'Delivered';
  }

  const currentRank = STATUS_RANK[currentStatus] || 0;
  const incomingRank = STATUS_RANK[incomingStatus] || 0;

  return incomingRank >= currentRank;
}

