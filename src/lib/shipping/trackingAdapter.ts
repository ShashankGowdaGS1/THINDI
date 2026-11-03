import { ShipmentRecord, ShipmentEvent, NormalizedTrackingStatus } from '@/types/tracking';
import { normalizeTrackingStatus } from '@/lib/tracking/statusMapper';
import {
  getShipmentForOrder,
  getShipmentByAwb,
  saveShipment,
  addShipmentTrackingEvent,
} from '@/lib/tracking/trackingStore';

export interface ITrackingProvider {
  name: string;
  isConfigured(): boolean;
  getTrackingDetails(identifier: {
    awb?: string;
    shipmentId?: string;
    orderReference?: string;
  }): Promise<ShipmentRecord | null>;
  normalizeTrackingEvents(rawActivities: any[], shipmentId: string): ShipmentEvent[];
  processTrackingWebhook(
    payload: any,
    headers: Record<string, string | null>
  ): Promise<{ processed: boolean; reason?: string }>;
}

/**
 * Shiprocket Courier Tracking Adapter
 * Grounded in official documentation: https://apidocs.shiprocket.in/
 */
export class ShiprocketTrackingAdapter implements ITrackingProvider {
  name = 'Shiprocket Tracking';

  private apiToken: string | undefined;
  private webhookToken: string | undefined;

  constructor() {
    this.apiToken = process.env.SHIPROCKET_API_TOKEN;
    this.webhookToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.apiToken && this.apiToken.trim().length > 0);
  }

  async getTrackingDetails(identifier: {
    awb?: string;
    shipmentId?: string;
    orderReference?: string;
  }): Promise<ShipmentRecord | null> {
    // 1. If an order reference or AWB exists in local store, check first
    if (identifier.orderReference) {
      const local = getShipmentForOrder(identifier.orderReference);
      if (local && (local.isDemoMode || !this.isConfigured())) {
        return local;
      }
    }
    if (identifier.awb) {
      const localByAwb = getShipmentByAwb(identifier.awb);
      if (localByAwb && (localByAwb.isDemoMode || !this.isConfigured())) {
        return localByAwb;
      }
    }

    // 2. If Shiprocket credentials unconfigured, return local or null without sending fake requests
    if (!this.isConfigured()) {
      if (identifier.orderReference) {
        return getShipmentForOrder(identifier.orderReference);
      }
      return null;
    }

    // 3. Query official Shiprocket Tracking API
    try {
      const awbOrId = identifier.awb || identifier.shipmentId;
      if (!awbOrId) return null;

      const endpoint = identifier.awb
        ? `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(awbOrId)}`
        : `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${encodeURIComponent(awbOrId)}`;

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiToken}`,
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        // Return cached local shipment if external API call encounters rate limits or errors
        return identifier.orderReference ? getShipmentForOrder(identifier.orderReference) : null;
      }

      const data = await res.json();
      const trackData = data.tracking_data;
      if (!trackData || !trackData.shipment_track || trackData.shipment_track.length === 0) {
        return identifier.orderReference ? getShipmentForOrder(identifier.orderReference) : null;
      }

      const primaryTrack = trackData.shipment_track[0];
      const normalizedStatusInfo = normalizeTrackingStatus(
        primaryTrack.current_status || trackData.shipment_status
      );

      const shipmentId = String(primaryTrack.id || `sr-${primaryTrack.awb_code}`);
      const rawActivities = trackData.shipment_track_activities || [];
      const normalizedEvents = this.normalizeTrackingEvents(rawActivities, shipmentId);

      const record: ShipmentRecord = {
        id: shipmentId,
        orderId: String(primaryTrack.order_id || primaryTrack.order_no || 'unknown'),
        orderReference: identifier.orderReference || String(primaryTrack.order_no || ''),
        shippingProvider: 'shiprocket',
        providerShipmentId: String(primaryTrack.shipment_id || ''),
        courierName: primaryTrack.courier_name || 'Courier Partner',
        awb: primaryTrack.awb_code,
        normalizedStatus: normalizedStatusInfo.normalized,
        providerStatus: primaryTrack.current_status,
        origin: primaryTrack.origin || 'Hassan, Karnataka',
        destination: primaryTrack.destination || 'Karnataka',
        destinationPincode: primaryTrack.destination_postcode || '',
        shippedAt: primaryTrack.pickup_date,
        deliveredAt: primaryTrack.delivered_date,
        lastSyncedAt: new Date().toISOString(),
        events: normalizedEvents,
        isDemoMode: false,
      };

      saveShipment(record);
      return record;
    } catch {
      // Graceful fallback to cached store on network error
      return identifier.orderReference ? getShipmentForOrder(identifier.orderReference) : null;
    }
  }

  normalizeTrackingEvents(rawActivities: any[], shipmentId: string): ShipmentEvent[] {
    if (!Array.isArray(rawActivities)) return [];

    return rawActivities.map((act, idx) => {
      const statusInfo = normalizeTrackingStatus(act.activity || act.status);
      let eventDateIso: string;

      try {
        eventDateIso = new Date(act.date).toISOString();
      } catch {
        eventDateIso = new Date().toISOString();
      }

      return {
        id: `evt-${shipmentId}-${idx}`,
        shipmentId,
        providerStatusCode: act.status || act.sr_status,
        normalizedStatus: statusInfo.normalized,
        eventDescription: act.activity || act.status || 'Courier transit checkpoint scan',
        eventLocation: act.location || undefined,
        eventTime: eventDateIso,
        receivedAt: new Date().toISOString(),
        rawEventReference: JSON.stringify(act),
      };
    });
  }

  async processTrackingWebhook(
    payload: any,
    headers: Record<string, string | null>
  ): Promise<{ processed: boolean; reason?: string }> {
    // 1. Verify webhook authorization header if configured
    if (this.webhookToken) {
      const authHeader = headers['x-api-key'] || headers['authorization'] || headers['x-shiprocket-token'];
      if (!authHeader || !authHeader.includes(this.webhookToken)) {
        return { processed: false, reason: 'Invalid or missing webhook security token' };
      }
    }

    if (!payload || !payload.awb) {
      return { processed: false, reason: 'Payload missing required AWB reference' };
    }

    const awb = String(payload.awb).trim();
    const existingShipment = getShipmentByAwb(awb);
    if (!existingShipment) {
      return { processed: false, reason: `No registered shipment matching AWB ${awb}` };
    }

    const rawStatus = payload.current_status || payload.status;
    const normalized = normalizeTrackingStatus(rawStatus);

    let eventTime: string;
    try {
      eventTime = payload.current_timestamp ? new Date(payload.current_timestamp).toISOString() : new Date().toISOString();
    } catch {
      eventTime = new Date().toISOString();
    }

    const eventResult = addShipmentTrackingEvent(existingShipment.orderReference, {
      shipmentId: existingShipment.id,
      providerEventId: payload.event_id || `webhook-${awb}-${Date.now()}`,
      providerStatusCode: String(rawStatus),
      normalizedStatus: normalized.normalized,
      eventDescription: payload.scans || payload.activity || `Status update: ${normalized.normalized}`,
      eventLocation: payload.location || payload.city || undefined,
      eventTime,
    });

    return { processed: eventResult.success, reason: eventResult.reason };
  }
}

export const trackingProvider = new ShiprocketTrackingAdapter();

