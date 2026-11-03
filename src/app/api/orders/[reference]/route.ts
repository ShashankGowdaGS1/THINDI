import { NextRequest, NextResponse } from 'next/server';
import { findOrderByReference } from '@/lib/checkout/orderStore';
import { verifyOrderSessionToken } from '@/lib/tracking/security';
import { trackingProvider } from '@/lib/shipping/trackingAdapter';

interface RouteContext {
  params: Promise<{ reference: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { reference } = await params;
    const normalizedRef = reference.trim().toUpperCase();

    const order = findOrderByReference(normalizedRef);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 1. Check session cookie
    const sessionCookie = req.cookies.get('thindi_order_session')?.value;
    const isSessionValid = verifyOrderSessionToken(sessionCookie, normalizedRef);

    // 2. Check direct URL access token fallback (from checkout confirmation)
    const tokenParam = req.nextUrl.searchParams.get('token');
    const isTokenValid = Boolean(tokenParam && order.accessToken === tokenParam.trim());

    if (!isSessionValid && !isTokenValid) {
      return NextResponse.json(
        {
          error: 'unauthorized',
          message:
            'Order tracking requires verification. Please request an access code from the tracking page.',
        },
        { status: 401 }
      );
    }

    // Retrieve live or cached shipment details
    const shipment = await trackingProvider.getTrackingDetails({
      orderReference: normalizedRef,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderReference: order.orderReference,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        shippingStatus: order.shippingStatus,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        items: order.items,
        pricing: order.pricing,
        isDemoMode: order.isDemoMode,
        createdAt: order.createdAt,
      },
      shipment,
      canSubmitSupport: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve order details' },
      { status: 500 }
    );
  }
}

