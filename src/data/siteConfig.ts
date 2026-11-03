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

