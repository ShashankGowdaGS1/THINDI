export type ServiceabilityStatus =
  | 'available'
  | 'unavailable'
  | 'unverifiable'
  | 'demo';

export type ProductDeliveryCategory =
  | 'dry-snack' // Chakkali, Kodubale, Nippattu
  | 'fragile' // Sandige, Appala
  | 'pickle' // Mango Uppinakai (leakproof jars)
  | 'short-shelf-life'; // Fresh sweets (restricted zones only)

export interface PincodeValidationResult {
  isValid: boolean;
  pincode: string;
  error?: string;
  isKarnatakaRange?: boolean;
}

export interface ShippingCheckRequest {
  deliveryPincode: string;
  cartSummary?: {
    totalWeightGrams?: number;
    hasFragileItems?: boolean;
    hasPickles?: boolean;
    hasShortShelfLife?: boolean;
    itemCount?: number;
  };
}

export interface ShippingCheckResponse {
  status: ServiceabilityStatus;
  pincode: string;
  isLiveMode: boolean;
  isKarnataka: boolean;
  message: string;
  kannadaMessage: string;
  locationHint?: string;
  restrictions?: string[];
  estimatedDays?: string;
  shippingRate?: number;
}
