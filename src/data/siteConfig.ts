/**
 * Centralized Site & Brand Configuration for THINDI
 *
 * Keeps all brand copy, location data, navigation destinations, and customer support
 * links synchronized across the website without duplicating strings or inventing fake
 * addresses, phone numbers, or social media handles.
 */

export interface NavItem {
  label: string;
  href?: string;
  action?: 'contact' | 'notice';
  noticeTitle?: string;
  noticeDescription?: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    kannadaName: string;
    tagline: string;
    location: string;
    sublocationNote: string;
  };
  navigation: {
    explore: NavItem[];
    customerHelp: NavItem[];
  };
  socialLinks: Array<{
    platform: string;
    url: string;
  }>; // Empty until official verified handles are provided
  legal: {
    brandOwner: string;
    region: string;
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: 'THINDI',
    kannadaName: 'ತಿಂಡಿ',
    tagline: 'Traditional Karnataka flavours. A little closer to home.',
    location: 'Hassan, Karnataka',
    sublocationNote: 'Artisan savouries and traditional confections rooted in Hassan, Karnataka.',
  },
  navigation: {
    explore: [
      { label: 'Home', href: '/' },
      { label: 'Shop All Thindi', href: '/shop' },
      { label: 'Collections', href: '/collections/kuruk-thindi' },
      { label: 'THINDI Boxes', href: '/combos' },
      { label: 'Our Story', href: '/our-story' },
      { label: 'Track Order', href: '/track-order' },
    ],
    customerHelp: [
      { label: 'Contact Us', href: '/contact', action: 'contact' },
      { label: 'Customer FAQs', href: '/faq' },
      { label: 'Shipping & Delivery', href: '/shipping-policy' },
      { label: 'Returns & Damages', href: '/returns-policy' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
  },
  // Strictly empty: No fabricated Instagram, Twitter, WhatsApp, or Facebook handles
  socialLinks: [],
  legal: {
    brandOwner: 'THINDI Foods',
    region: 'Hassan, Karnataka',
  },
};

/**
 * Resolves the canonical site URL dynamically for production, preview, or local dev.
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL environment variable (when defined and not localhost/placeholder)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel production system env)
 * 3. VERCEL_URL (Vercel deployment env)
 * 4. Active deployed URL: https://thindi-psi.vercel.app
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('thindi.in')) {
    return envUrl.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://thindi-psi.vercel.app';
}


