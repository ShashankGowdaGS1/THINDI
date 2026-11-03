import {
  ShippingCheckRequest,
  ShippingCheckResponse,
} from './types';
import { validatePincode, evaluateCartRestrictions } from './serviceability';

export interface IShippingProvider {
  name: string;
  isConfigured(): boolean;
  checkServiceability(request: ShippingCheckRequest): Promise<ShippingCheckResponse>;
}

/**
 * Shiprocket Shipping Integration Adapter
 * Grounded in official Shiprocket API documentation (https://apidocs.shiprocket.in/)
 * Serviceability endpoint: GET https://apiv2.shiprocket.in/v1/external/courier/serviceability/
 */
export class ShiprocketProvider implements IShippingProvider {
  name = 'Shiprocket';

  private pickupPincode: string;
  private apiToken: string | undefined;

  constructor() {
    // Hassan registered business pickup pincode
    this.pickupPincode = process.env.THINDI_PICKUP_PINCODE || '573201';
    this.apiToken = process.env.SHIPROCKET_API_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.apiToken && this.apiToken.trim().length > 0);
  }

  async checkServiceability(
    request: ShippingCheckRequest
  ): Promise<ShippingCheckResponse> {
    const validation = validatePincode(request.deliveryPincode);
    if (!validation.isValid) {
      return {
        status: 'unavailable',
        pincode: request.deliveryPincode,
        isLiveMode: true,
        isKarnataka: false,
        message: validation.error || 'Invalid postal code.',
        kannadaMessage: 'ಅಮಾನ್ಯವಾದ ಪಿನ್‌ಕೋಡ್.',
      };
    }

    if (!this.isConfigured()) {
      throw new Error('Shiprocket credentials are not configured on the server.');
    }

    const weightKg = ((request.cartSummary?.totalWeightGrams || 500) / 1000).toFixed(2);
    const url = new URL('https://apiv2.shiprocket.in/v1/external/courier/serviceability/');
    url.searchParams.set('pickup_postcode', this.pickupPincode);
    url.searchParams.set('delivery_postcode', validation.pincode);
    url.searchParams.set('weight', weightKg);
    url.searchParams.set('cod', '0');

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiToken}`,
        },
        // 8 second network timeout
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        return {
          status: 'unverifiable',
          pincode: validation.pincode,
          isLiveMode: true,
          isKarnataka: Boolean(validation.isKarnatakaRange),
          message: 'Delivery availability couldn’t be checked right now. Please try again.',
          kannadaMessage: 'ವಿತರಣಾ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        };
      }

      const data = await res.json();
      const couriers = data?.data?.available_courier_companies || [];
      const isServiceable = couriers.length > 0;

      if (!isServiceable) {
        return {
          status: 'unavailable',
          pincode: validation.pincode,
          isLiveMode: true,
          isKarnataka: Boolean(validation.isKarnatakaRange),
          message: 'We couldn’t find an eligible delivery option for this location.',
          kannadaMessage: 'ಈ ಸ್ಥಳಕ್ಕೆ ವಿತರಣಾ ಆಯ್ಕೆಗಳು ಲಭ್ಯವಿಲ್ಲ.',
        };
      }

      // Read earliest verified estimate if provider returns it
      const fastest = couriers[0];
      const estimatedDays = fastest?.etd ? `${fastest.etd} business days` : undefined;
      const rate = typeof fastest?.rate === 'number' ? Math.round(fastest.rate) : undefined;

      return {
        status: 'available',
        pincode: validation.pincode,
        isLiveMode: true,
        isKarnataka: Boolean(validation.isKarnatakaRange),
        message: 'Delivery options found for your area.',
        kannadaMessage: 'ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ವಿತರಣಾ ಸೌಲಭ್ಯ ಲಭ್ಯವಿದೆ.',
        estimatedDays,
        shippingRate: rate,
        restrictions: evaluateCartRestrictions(request.cartSummary),
      };
    } catch {
      return {
        status: 'unverifiable',
        pincode: validation.pincode,
        isLiveMode: true,
        isKarnataka: Boolean(validation.isKarnatakaRange),
        message: 'Delivery availability couldn’t be checked right now. Please try again.',
        kannadaMessage: 'ವಿತರಣಾ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.',
      };
    }
  }
}
