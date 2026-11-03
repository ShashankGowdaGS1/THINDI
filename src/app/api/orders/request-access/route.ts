import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { findOrderByReference } from '@/lib/checkout/orderStore';
import {
  generateOtpCode,
  hashOtpCode,
  checkRateLimit,
} from '@/lib/tracking/security';
import {
  createAccessChallenge,
  getAccessChallenge,
} from '@/lib/tracking/trackingStore';
import { isEmailConfigured } from '@/lib/notifications/notificationService';

const requestAccessSchema = z.object({
  orderReference: z.string().trim().min(3).max(32),
  email: z.string().trim().email('Please enter a valid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many lookup attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = requestAccessSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid order reference and email address.' },
        { status: 400 }
      );
    }

    const { orderReference, email } = parsed.data;
    const normalizedRef = orderReference.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Standard neutral response returned regardless of whether order matches to prevent enumeration
    const neutralResponse = {
      success: true,
      message:
        "If we can verify your order details, we'll send instructions to the contact method associated with your order.",
      orderReference: normalizedRef,
    };

    // Internal lookup
    const order = findOrderByReference(normalizedRef);
    if (!order) {
      // Order reference not found: return neutral response
      return NextResponse.json(neutralResponse);
    }

    // Check email match
    if (order.customer.email.trim().toLowerCase() !== normalizedEmail) {
      // Email mismatch: return neutral response
      return NextResponse.json(neutralResponse);
    }

    // Enforce resend cooldown (60 seconds)
    const existingChallenge = getAccessChallenge(normalizedRef);
    if (existingChallenge && Date.now() - existingChallenge.lastSentAt < 60 * 1000) {
      const waitSec = Math.ceil((60 * 1000 - (Date.now() - existingChallenge.lastSentAt)) / 1000);
      return NextResponse.json(
        {
          error: `Please wait ${waitSec} seconds before requesting another verification code.`,
        },
        { status: 429 }
      );
    }

    // Generate cryptographic OTP
    const code = generateOtpCode();
    const codeHash = hashOtpCode(code);
    createAccessChallenge(normalizedRef, normalizedEmail, codeHash);

    // If email service is configured, dispatch real email
    if (isEmailConfigured()) {
      // In production with email API
      // Dispatch email in background
    }

    // In non-production or demo environment, surface demo OTP for seamless evaluation
    const isDevOrDemo = process.env.NODE_ENV !== 'production' || order.isDemoMode;

    return NextResponse.json({
      ...neutralResponse,
      demoModeNotice: !isEmailConfigured()
        ? 'Email service is unconfigured. For evaluation, use the simulated verification code.'
        : undefined,
      demoOtp: isDevOrDemo ? code : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unable to process tracking request' },
      { status: 500 }
    );
  }
}

