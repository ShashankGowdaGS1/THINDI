import {
  ShippingCheckRequest,
  ShippingCheckResponse,
} from './types';
import { validatePincode, evaluateCartRestrictions } from './serviceability';
import { IShippingProvider } from './shippingProvider';

/**
 * Mock/Demo Shipping Provider for development and demonstration.
 * Never fabricates prices, fake dates, or false carrier confirmations.
 * Transparently communicates demo status.
 */
export class MockShippingProvider implements IShippingProvider {
  name = 'Demo Provider';

  isConfigured(): boolean {
    return true; // Always available in demo mode
  }

  async checkServiceability(
    request: ShippingCheckRequest
  ): Promise<ShippingCheckResponse> {
    const validation = validatePincode(request.deliveryPincode);

    if (!validation.isValid) {
      return {
        status: 'unavailable',
        pincode: request.deliveryPincode,
        isLiveMode: false,
        isKarnataka: false,
        message: validation.error || 'Please enter a valid 6-digit postal code.',
        kannadaMessage: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ೬ ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ.',
      };
    }

    const restrictions = evaluateCartRestrictions(request.cartSummary);

    if (validation.isKarnatakaRange) {
      return {
        status: 'demo',
        pincode: validation.pincode,
        isLiveMode: false,
        isKarnataka: true,
        locationHint: 'Karnataka Postal Region Detected',
        message:
          'Delivery checker demo — live courier API is not configured yet. Pincode is in the planned Karnataka distribution network.',
        kannadaMessage:
          'ಡೆಮೊ ಪರೀಕ್ಷೆ — ಕರ್ನಾಟಕ ರಾಜ್ಯ ವಿತರಣಾ ಜಾಲದ ಭಾಗವಾಗಿ ಯೋಜಿಸಲಾಗಿದೆ.',
        restrictions: restrictions.length > 0 ? restrictions : undefined,
      };
    }

    return {
      status: 'demo',
      pincode: validation.pincode,
      isLiveMode: false,
      isKarnataka: false,
      locationHint: 'Outside Karnataka Region',
      message:
        'Delivery checker demo — THINDI is currently focusing initial batch dispatches exclusively within Karnataka.',
      kannadaMessage:
        'ಡೆಮೊ ಪರೀಕ್ಷೆ — ಮೊದಲ ಹಂತದಲ್ಲಿ ಕರ್ನಾಟಕದಾದ್ಯಂತ ಮಾತ್ರ ವಿತರಣೆ ಪ್ರಾರಂಭವಾಗಲಿದೆ.',
      restrictions: restrictions.length > 0 ? restrictions : undefined,
    };
  }
}
