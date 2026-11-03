import { NextRequest, NextResponse } from 'next/server';
import { ShippingCheckRequest } from '@/lib/shipping/types';
import { ShiprocketProvider } from '@/lib/shipping/shippingProvider';
import { MockShippingProvider } from '@/lib/shipping/mockShippingProvider';

export async function POST(req: NextRequest) {
  try {
    const body: ShippingCheckRequest = await req.json();

    if (!body || typeof body.deliveryPincode !== 'string') {
      return NextResponse.json(
        {
          status: 'unavailable',
          pincode: '',
          isLiveMode: false,
          isKarnataka: false,
          message: 'Pincode parameter is required.',
          kannadaMessage: 'ಪಿನ್‌ಕೋಡ್ ವಿವರ ಅಗತ್ಯವಿದೆ.',
        },
        { status: 400 }
      );
    }

    // Determine provider based on server-side credentials
    const shiprocket = new ShiprocketProvider();
    const provider = shiprocket.isConfigured()
      ? shiprocket
      : new MockShippingProvider();

    const result = await provider.checkServiceability(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        status: 'unverifiable',
        pincode: '',
        isLiveMode: false,
        isKarnataka: false,
        message: 'Delivery availability couldn’t be checked right now. Please try again.',
        kannadaMessage: 'ವಿತರಣಾ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.',
      },
      { status: 500 }
    );
  }
}
