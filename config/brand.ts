
export const BRAND_CONFIG = {
  name: 'Innov8 Jewels',
  tagline: 'Heirloom 22K gold jewellery shaped for the modern collector.',
  logo: {
    url: '/logo-placeholder.svg',
    width: 180,
    height: 60,
  },
  theme: {
    primary: 'hsl(26, 28%, 15%)',
    accent: 'hsl(42, 55%, 62%)',
    text: 'hsl(26, 18%, 14%)',
    background: 'hsl(36, 38%, 97%)',
    muted: 'hsl(36, 28%, 93%)',
    fonts: {
      sans: 'manrope',
      serif: 'cormorant-garamond',
    },
  },
  contact: {
    whatsapp: '+919173903740',
    email: 'concierge@innov8jewels.com',
    address: 'Zaveri Bazaar, Mumbai, Maharashtra',
  },
  hours: {
    weekdays: 'Mon - Sat: 10:00 AM - 8:00 PM',
    sunday: 'Sunday: 11:00 AM - 6:00 PM',
  },
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
  },
  cloudinaryFolder: 'innov8-products',
  cartStorageKey: 'jewels-cart-v1',
};

export type BrandConfig = typeof BRAND_CONFIG;

export function whatsappChatUrl(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  if (!digits) {
    return '#';
  }

  return `https://wa.me/${digits}`;
}
