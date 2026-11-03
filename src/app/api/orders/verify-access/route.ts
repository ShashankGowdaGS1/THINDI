import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  verifyOtpCode,
  createOrderSessionToken,
} from '@/lib/tracking/security';
import {
  getAccessChallenge,
  recordChallengeAttempt,
  invalidateChallenge,
} from '@/lib/tracking/trackingStore';

const verifyAccessSchema = z.object({
  orderReference: z.string().trim().min(3).max(32),
  code: z.string().trim().regex(/^\d{6}$/, 'Verification code must be 6 digits'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyAccessSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    const { orderReference, code } = parsed.data;
    const normalizedRef = orderReference.trim().toUpperCase();

    const challenge = getAccessChallenge(normalizedRef);
    if (!challenge) {
      return NextResponse.json(
        {
          error:
            'Verification session expired or not found. Please request a new code from the track order page.',
        },
        { status: 400 }
      );
    }

    const isMatch = verifyOtpCode(code, challenge.codeHash);
    if (!isMatch) {
      const attempts = recordChallengeAttempt(normalizedRef);
      const remaining = Math.max(0, 5 - attempts);
      if (remaining === 0) {
        return NextResponse.json(
          {
            error:
              'Maximum verification attempts exceeded. For security, this code has been revoked. Please request a new code.',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: `Incorrect verification code. You have ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`,
        },
        { status: 400 }
      );
    }

    // Invalidate challenge immediately upon successful use
    invalidateChallenge(normalizedRef);

    // Create session token bound to this order
    const sessionToken = createOrderSessionToken(normalizedRef);

    const response = NextResponse.json({
      success: true,
      orderReference: normalizedRef,
      redirectUrl: `/orders/${normalizedRef}`,
    });

    // Set HttpOnly, Secure, SameSite=Lax cookie
    response.cookies.set('thindi_order_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60, // 2 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}

