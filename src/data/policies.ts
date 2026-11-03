export type PolicyStatus = 'draft' | 'in_review' | 'approved' | 'published';

export interface PolicySection {
  id: string;
  title: string;
  kannadaTitle?: string;
  content: string[];
  notice?: string;
}

export interface BusinessPolicy {
  id: string;
  slug: string;
  title: string;
  kannadaTitle: string;
  version: string;
  status: PolicyStatus;
  summary: string;
  approvalTimestamp?: string;
  publicationTimestamp?: string;
  lastUpdated: string;
  approvedBy?: string;
  sections: PolicySection[];
}

export const POLICIES: Record<string, BusinessPolicy> = {
  shipping: {
    id: 'pol-shipping-01',
    slug: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    kannadaTitle: 'ರವಾನೆ ಮತ್ತು ಡೆಲಿವರಿ ನೀತಿ',
    version: '1.0-draft',
    status: 'in_review',
    summary:
      'Information regarding dispatch from our Hassan central kitchen, packaging standards for traditional foods, and planned delivery coverage across Karnataka.',
    lastUpdated: '2026-11-03',
    sections: [
      {
        id: 'dispatch-origin',
        title: '1. Central Kitchen Dispatch Origin',
        kannadaTitle: 'ಕೇಂದ್ರ ಅಡುಗೆಮನೆಯಿಂದ ರವಾನೆ',
        content: [
          'All THINDI orders are prepared, packaged, and dispatched directly from our central kitchen hub in Hassan, Karnataka (PIN: 573201).',
          'Because our snacks are crafted in traditional small batches without chemical shelf-life extenders, orders are staged fresh following receipt of customer payment confirmation.',
        ],
      },
      {
        id: 'coverage-boundaries',
        title: '2. Serviceable Delivery Locations',
        kannadaTitle: 'ವಿತರಣಾ ಪ್ರದೇಶಗಳು',
        content: [
          'THINDI operates a statewide distribution model planned across Karnataka postal districts, including Bengaluru Urban & Rural, Mysuru, Hassan, Mangaluru, Hubballi-Dharwad, Belagavi, Shivamogga, and Davanagere.',
          'Certain remote rural PIN codes may have extended transit schedules depending on local postal carrier connectivity. Customers can verify PIN code serviceability at checkout or using our Doorstep Delivery tool.',
        ],
      },
      {
        id: 'packaging-protections',
        title: '3. Food Packaging & Transit Protection',
        kannadaTitle: 'ಆಹಾರ ಪ್ಯಾಕೇಜಿಂಗ್ ಸುರಕ್ಷತೆ',
        content: [
          'Crispy Savouries (Chakkali, Kodubale, Nippattu): Hermetically heat-sealed in multi-layer moisture-barrier foil pouches to maintain freshness and crispness during road transit.',
          'Sun-Dried Delicacies (Appala, Sandige): Packed with internal cardboard buffers to prevent crushing.',
          'Traditional Pickles (Uppinakai): Cured in traditional ceramic jars and transferred to food-grade leak-proof barrier packaging with secondary sealing sleeves.',
        ],
      },
      {
        id: 'delivery-estimates',
        title: '4. Estimated Delivery Timelines',
        kannadaTitle: 'ಅಂದಾಜು ತಲುಪುವ ಸಮಯ',
        content: [
          'Standard Karnataka Road Transit: 2 to 4 business days from dispatch date.',
          'Bengaluru, Mysuru, and Hassan District Deliveries: Typically delivered within 24 to 48 hours following courier manifest.',
          'Orders are dispatched Monday through Saturday. Orders placed on Sunday or public holidays are manifested on the following business day.',
        ],
        notice:
          'Operational Note: Exact transit windows are verified dynamically at checkout based on active regional courier routes.',
      },
      {
        id: 'shipping-rates',
        title: '5. Delivery Charges & Free Shipping Threshold',
        kannadaTitle: 'ರವಾನೆ ಶುಲ್ಕಗಳು',
        content: [
          'Standard Delivery Fee: Flat ₹49 across all serviceable Karnataka PIN codes for standard cart weights.',
          'Free Shipping Benefit: Available on all customer orders with cart subtotal of ₹499 or higher.',
        ],
      },
      {
        id: 'failed-deliveries',
        title: '6. Delivery Attempts & Address Accuracy',
        kannadaTitle: 'ಡೆಲಿವರಿ ವಿಳಾಸ',
        content: [
          'Our logistics partners attempt delivery up to two (2) times. A valid working phone number is mandatory to receive courier OTP delivery verification.',
          'In the event of customer unavailability or incorrect address entry, the package is temporarily held at the nearest regional courier branch before return.',
        ],
      },
    ],
  },

  returns: {
    id: 'pol-returns-02',
    slug: 'returns-policy',
    title: 'Returns & Refund Policy',
    kannadaTitle: 'ಮರುಪಾವತಿ ಮತ್ತು ಬದಲಾವಣೆ ನೀತಿ',
    version: '1.0-draft',
    status: 'in_review',
    summary:
      'Clear guidelines on reporting transit damages, food quality issues, and replacement or refund requests under Indian consumer protection principles.',
    lastUpdated: '2026-11-03',
    sections: [
      {
        id: 'food-hygiene-nature',
        title: '1. Nature of Perishable Food Products',
        kannadaTitle: 'ಆಹಾರ ಉತ್ಪನ್ನಗಳ ಸ್ವರೂಪ',
        content: [
          'Due to the perishable nature and strict food safety hygiene requirements for packaged consumables, traditional snacks once delivered and unsealed cannot be returned for restock or resale.',
          'However, THINDI is committed to complete customer satisfaction and provides prompt remedies for transit damages, packaging compromises, or dispatch errors.',
        ],
      },
      {
        id: 'eligible-remedies',
        title: '2. Circumstances Eligible for Remedy',
        kannadaTitle: 'ಬದಲಾವಣೆ ಅಥವಾ ಮರುಪಾವತಿ ಅರ್ಹತೆ',
        content: [
          'Transit Damage: Outer carton or inner foil pouch arrives severely torn, crushed, or ruptured.',
          'Incorrect Items: Contents received do not match the items or pack sizes specified in the order confirmation.',
          'Missing Items: Any pack missing from an assorted THINDI Box or multi-item order.',
          'Quality Concern: In the rare event a product does not match our verified freshness and aroma standards upon opening.',
        ],
      },
      {
        id: 'reporting-process',
        title: '3. How to Request Support or Refund',
        kannadaTitle: 'ಸಹಾಯ ಕೋರುವ ವಿಧಾನ',
        content: [
          '1. Inspect your package upon arrival. If an issue is observed, notify our customer support team within 48 hours of delivery.',
          '2. Navigate to /track-order, look up your order with reference number and phone verification, and submit an Order Support Ticket with clear photos of the damaged item and outer label.',
          '3. Our Hassan operations desk will review the ticket within 24 business hours.',
        ],
      },
      {
        id: 'resolution-methods',
        title: '4. Refund & Replacement Methods',
        kannadaTitle: 'ಮರುಪಾವತಿ ಪ್ರಕ್ರಿಯೆ',
        content: [
          'Approved replacements are dispatched immediately via priority courier at no additional shipping charge.',
          'Approved monetary refunds are processed directly back to the original payment source (UPI account, debit/credit card, or net banking) via our Razorpay payment gateway within 5 to 7 business days.',
        ],
      },
      {
        id: 'cancellations',
        title: '5. Order Cancellations',
        kannadaTitle: 'ಆರ್ಡರ್ ರದ್ದತಿ',
        content: [
          'Orders can be cancelled free of charge before the packaging and kitchen staging status transitions to "Shipped".',
          'Once a courier AWB tracking number has been generated and handed over to logistics, the shipment is in active transit and cannot be recalled.',
        ],
      },
    ],
  },

  privacy: {
    id: 'pol-privacy-03',
    slug: 'privacy-policy',
    title: 'Customer Privacy Policy',
    kannadaTitle: 'ಗ್ರಾಹಕರ ಗೌಪ್ಯತಾ ನೀತಿ',
    version: '1.0-draft',
    status: 'in_review',
    summary:
      'Information on how personal information is collected, processed, and secured during checkout, delivery, and customer support interactions.',
    lastUpdated: '2026-11-03',
    sections: [
      {
        id: 'data-collection',
        title: '1. Personal Information We Collect',
        kannadaTitle: 'ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ',
        content: [
          'Customer Contact Details: Full name, delivery shipping address, telephone/mobile number, and email address collected during checkout.',
          'Order Verification Data: One-Time Passwords (OTPs) and cryptographically sealed session tokens used to authenticate order access without exposing private data.',
          'Technical Telemetry: IP addresses and user-agent strings recorded in administrative audit logs strictly for fraud prevention and order security.',
        ],
      },
      {
        id: 'purpose-processing',
        title: '2. Purpose of Processing',
        kannadaTitle: 'ಮಾಹಿತಿ ಬಳಕೆಯ ಉದ್ದೇಶ',
        content: [
          'To prepare, package, and deliver your food order from our Hassan kitchen to your verified Karnataka address.',
          'To transmit automated transactional SMS and email updates regarding shipment progress, courier tracking AWBs, and delivery milestones.',
          'To investigate customer care enquiries, replacement claims, and support tickets.',
          'THINDI does not sell, lease, or monetize customer contact records with third-party advertising brokers.',
        ],
      },
      {
        id: 'payment-security',
        title: '3. Payment Information & Gateway Security',
        kannadaTitle: 'ಪಾವತಿ ಭದ್ರತೆ',
        content: [
          'All digital payment transactions are processed through Razorpay, a PCI-DSS certified Indian payment aggregator.',
          'THINDI servers never receive, store, or process raw credit card numbers, debit card CVVs, or net banking credentials.',
        ],
      },
      {
        id: 'courier-sharing',
        title: '4. Third-Party Logistics Partners',
        kannadaTitle: 'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಪಾಲುದಾರರು',
        content: [
          'To fulfill physical deliveries, recipient name, delivery address, and phone numbers are shared securely with verified logistics partners (Shiprocket, Bluedart, Delhivery, India Post).',
          'Couriers are contractually prohibited from using customer phone numbers for promotional marketing.',
        ],
      },
      {
        id: 'customer-rights',
        title: '5. Your Rights & Grievance Contact',
        kannadaTitle: 'ಗ್ರಾಹಕರ ಹಕ್ಕುಗಳು',
        content: [
          'Customers may request verification, correction, or deletion of their historical contact records by writing to our team.',
          'Grievance & Privacy Desk: support@thindi.in · Hassan Central Kitchen Hub, Hassan, Karnataka - 573201.',
        ],
      },
    ],
  },

  terms: {
    id: 'pol-terms-04',
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions of Sale',
    kannadaTitle: 'ಮಾರಾಟ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು',
    version: '1.0-draft',
    status: 'in_review',
    summary:
      'Legal terms governing customer orders, retail transactions, pricing, product descriptions, and website usage for THINDI.',
    lastUpdated: '2026-11-03',
    sections: [
      {
        id: 'operator-identity',
        title: '1. Store Operator & Legal Identity',
        kannadaTitle: 'ಉದ್ಯಮದ ವಿವರ',
        content: [
          'This online retail storefront is owned and operated by THINDI, having its central kitchen operations and administrative facility located in Hassan, Karnataka, India.',
          'By accessing, browsing, or placing an order on this website, you agree to be bound by these Terms and Conditions and our referenced policies.',
        ],
      },
      {
        id: 'product-declarations',
        title: '2. Product Information & Compliance',
        kannadaTitle: 'ಉತ್ಪನ್ನ ವಿವರಣೆ ಮತ್ತು FSSAI',
        content: [
          'All food offerings are prepared under clean artisan hygiene standards and declared with ingredient, allergen, shelf life, and vegetarian status in compliance with FSSAI packaging guidelines.',
          'Because our products are crafted by hand using traditional recipes, minor natural variations in shape, spice hue, and spiral diameter may occur between batches.',
        ],
      },
      {
        id: 'pricing-currency',
        title: '3. Pricing, Taxes & Invoices',
        kannadaTitle: 'ಬೆಲೆ ಮತ್ತು ತೆರಿಗೆಗಳು',
        content: [
          'All prices are listed in Indian Rupees (INR / ₹) inclusive of applicable goods and services taxes (GST) unless explicitly noted.',
          'Promotional discount codes must be entered prior to checkout completion. A digital tax invoice is provided with every confirmed order.',
        ],
      },
      {
        id: 'order-acceptance',
        title: '4. Order Acceptance & Contract Formation',
        kannadaTitle: 'ಆರ್ಡರ್ ಸ್ವೀಕಾರ',
        content: [
          'Receipt of an order reference does not signify final acceptance of your order. THINDI reserves the right to cancel or limit quantities due to unforeseen kitchen stock depletion, regional transport blockades, or non-serviceable postal addresses.',
          'If an order is cancelled by THINDI after payment capture, the full captured amount is immediately refunded.',
        ],
      },
      {
        id: 'intellectual-property',
        title: '5. Intellectual Property & Brand Heritage',
        kannadaTitle: 'ಬೌದ್ಧಿಕ ಆಸ್ತಿ',
        content: [
          'All trade names, Kannada typography motifs, photographic compositions, product packaging designs, and editorial texts are proprietary assets of THINDI.',
          'Unauthorized commercial reproduction or scraping of content is strictly prohibited.',
        ],
      },
      {
        id: 'governing-law',
        title: '6. Governing Law & Jurisdiction',
        kannadaTitle: 'ಅನ್ವಯವಾಗುವ ಕಾನೂನು',
        content: [
          'These terms and transactions shall be governed by and construed in accordance with the laws of India.',
          'Any disputes arising in connection with orders shall be subject to the exclusive jurisdiction of the competent courts in Hassan, Karnataka.',
        ],
      },
    ],
  },
};

export const BUSINESS_POLICIES = POLICIES;

/**
 * Returns a policy by slug or undefined if not found.
 */
export function getPolicyBySlug(slug: string): BusinessPolicy | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return Object.values(POLICIES).find((p) => p.slug === normalized || p.id === normalized);
}

/**
 * Returns all policies that are currently in draft or in-review status.
 * Used for administrative launch-blocker auditing.
 */
export function getPolicyLaunchBlockers(): BusinessPolicy[] {
  return Object.values(POLICIES).filter((p) => p.status !== 'published' && p.status !== 'approved');
}
