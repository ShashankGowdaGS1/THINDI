import { NextRequest, NextResponse } from 'next/server';
import { trackingProvider } from '@/lib/shipping/trackingAdapter';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    const headers: Record<string, string | null> = {
      'x-api-key': req.headers.get('x-api-key'),
      authorization: req.headers.get('authorization'),
      'x-shiprocket-token': req.headers.get('x-shiprocket-token'),
    };

    const result = await trackingProvider.processTrackingWebhook(rawBody, headers);
    if (!result.processed) {
      return NextResponse.json(
        { error: 'Webhook processing failed', reason: result.reason },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: 'success', reason: result.reason });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal webhook error', message: err.message },
      { status: 500 }
    );
  }
}

