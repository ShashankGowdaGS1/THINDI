import { OrderRecord } from '@/types/checkout';
import { ShipmentRecord } from '@/types/tracking';

const sentNotificationEvents = new Set<string>();

export interface NotificationResult {
  sent: boolean;
  provider: 'resend' | 'unconfigured';
  messageId?: string;
  reason?: string;
}

/**
 * Checks whether transactional email service credentials are configured.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY);
}

/**
 * Sends or logs transactional email notification safely and idempotently.
 */
async function sendTransactionalEmail(
  to: string,
  subject: string,
  kannadaSubject: string,
  htmlContent: string,
  idempotencyKey: string
): Promise<NotificationResult> {
  // Idempotency check: prevent duplicate emails from replay or repeated webhooks
  if (sentNotificationEvents.has(idempotencyKey)) {
    return {
      sent: false,
      provider: 'unconfigured',
      reason: 'Notification already dispatched for this event (idempotent)',
    };
  }

  if (!isEmailConfigured()) {
    // When unconfigured, do not claim email was sent.
    return {
      sent: false,
      provider: 'unconfigured',
      reason: 'Transactional email provider is unconfigured in this environment',
    };
  }

  try {
    // In production with RESEND_API_KEY
    const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'THINDI Kitchen <orders@thindi.in>',
        to: [to],
        subject: `${subject} · ${kannadaSubject}`,
        html: htmlContent,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      sentNotificationEvents.add(idempotencyKey);
      return { sent: true, provider: 'resend', messageId: data.id };
    }

    return { sent: false, provider: 'resend', reason: 'Email API provider returned non-200' };
  } catch (err: any) {
    return { sent: false, provider: 'resend', reason: err.message };
  }
}

/**
 * Triggered when payment is verified and order confirmed.
 */
export async function onOrderConfirmed(order: OrderRecord): Promise<NotificationResult> {
  const key = `order_confirmed_${order.orderReference}`;
  return sendTransactionalEmail(
    order.customer.email,
    `Order Confirmed: ${order.orderReference}`,
    'ನಿಮ್ಮ ತಿಂಡಿ ತಯಾರಾಗುತ್ತಿದೆ',
    `<p>Namaskara ${order.customer.fullName}, your order ${order.orderReference} is confirmed from our Hassan facility.</p>`,
    key
  );
}

/**
 * Triggered when parcel is picked up by courier.
 */
export async function onShipmentDispatched(
  order: OrderRecord,
  shipment: ShipmentRecord
): Promise<NotificationResult> {
  const key = `shipment_dispatched_${shipment.awb}`;
  return sendTransactionalEmail(
    order.customer.email,
    `Your snacks are dispatched! (AWB: ${shipment.awb})`,
    'ನಿಮ್ಮ ತಿಂಡಿ ಪ್ರಯಾಣದಲ್ಲಿದೆ',
    `<p>Handcrafted snacks for order ${order.orderReference} have been handed to ${shipment.courierName}. Track AWB: ${shipment.awb}.</p>`,
    key
  );
}

/**
 * Triggered when package is out for delivery.
 */
export async function onOutForDelivery(
  order: OrderRecord,
  shipment: ShipmentRecord
): Promise<NotificationResult> {
  const key = `out_for_delivery_${shipment.awb}`;
  return sendTransactionalEmail(
    order.customer.email,
    `Out for Delivery today: ${order.orderReference}`,
    'ಇಂದೇ ನಿಮ್ಮ ಮನೆಗೆ ತಲುಪಲಿದೆ',
    `<p>Your snack package is out for delivery today with the courier executive.</p>`,
    key
  );
}

/**
 * Triggered when package is delivered.
 */
export async function onDelivered(
  order: OrderRecord,
  shipment: ShipmentRecord
): Promise<NotificationResult> {
  const key = `delivered_${shipment.awb}`;
  return sendTransactionalEmail(
    order.customer.email,
    `Delivered: Enjoy your Thindi!`,
    'ನಿಮ್ಮ ಮನೆ ತಲುಪಿದೆ',
    `<p>Your order ${order.orderReference} has been delivered. Enjoy the authentic crunch of Hassan!</p>`,
    key
  );
}

/**
 * Triggered on courier delivery exception.
 */
export async function onDeliveryException(
  order: OrderRecord,
  shipment: ShipmentRecord,
  details: string
): Promise<NotificationResult> {
  const key = `exception_${shipment.awb}_${Date.now()}`;
  return sendTransactionalEmail(
    order.customer.email,
    `Delivery Update for ${order.orderReference}`,
    'ವಿತರಣಾ ಮಾಹಿತಿ',
    `<p>Courier status notice: ${details}. Contact THINDI care if you need assistance.</p>`,
    key
  );
}

