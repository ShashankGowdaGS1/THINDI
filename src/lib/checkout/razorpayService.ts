import crypto from 'node:crypto';

export interface RazorpayOrderResult {
  orderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  isDemoMode: boolean;
}

/**
 * Checks whether live or test Razorpay credentials are configured.
 */
export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(keyId && keySecret && keyId.trim().length > 0 && keySecret.trim().length > 0);
}

/**
 * Creates an order on Razorpay servers, or simulates a demo order if unconfigured.
 */
export async function createRazorpayOrder(
  amountPaise: number,
  receiptReference: string
): Promise<RazorpayOrderResult> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (isRazorpayConfigured() && keyId && keySecret) {
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: receiptReference,
        notes: {
          brand: 'THINDI Foods',
          origin: 'Hassan, Karnataka',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Razorpay order creation failed: ${errText}`);
    }

    const data = await response.json();
    return {
      orderId: data.id,
      amountPaise: data.amount,
      currency: data.currency,
      keyId,
      isDemoMode: false,
    };
  }

  // Demo / Local development simulation mode
  return {
    orderId: `order_demo_${Date.now().toString(36)}`,
    amountPaise,
    currency: 'INR',
    keyId: 'rzp_test_demo_mode',
    isDemoMode: true,
  };
}

/**
 * Verifies Razorpay payment signature server-side using HMAC SHA256.
 * Formula: HMAC-SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // In demo simulation mode
  if (!isRazorpayConfigured() || !keySecret) {
    return signature.startsWith('demo_sig_');
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const genBuf = Buffer.from(generatedSignature, 'utf8');
  const sigBuf = Buffer.from(signature, 'utf8');
  if (genBuf.length !== sigBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(genBuf, sigBuf);
}

/**
 * Validates authenticity of incoming Razorpay Webhook requests.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expBuf = Buffer.from(expectedSignature, 'utf8');
  const sigBuf = Buffer.from(signatureHeader, 'utf8');
  if (expBuf.length !== sigBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expBuf, sigBuf);
}
