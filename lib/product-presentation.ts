const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  bangle: '/placeholders/bangle.svg',
  chain: '/placeholders/chain.svg',
  earring: '/placeholders/earring.svg',
  necklace: '/placeholders/necklace.svg',
  pendant: '/placeholders/pendant.svg',
  ring: '/placeholders/ring.svg',
};

export function getProductFallbackImage(category?: string | null) {
  if (!category) {
    return '/logo-placeholder.svg';
  }

  return CATEGORY_FALLBACK_IMAGES[category] ?? '/logo-placeholder.svg';
}

export function getStorefrontAvailability(stock: number) {
  if (stock <= 0) {
    return {
      availabilityLabel: 'Out of Stock',
      badgeLabel: null,
      cardLabel: 'Out of Stock',
    };
  }

  if (stock === 1) {
    return {
      availabilityLabel: '1 in stock',
      badgeLabel: '1 in stock',
      cardLabel: '1 in stock',
    };
  }

  if (stock <= 4) {
    return {
      availabilityLabel: `${stock} in stock`,
      badgeLabel: `${stock} in stock`,
      cardLabel: `${stock} in stock`,
    };
  }

  return {
    availabilityLabel: `${stock} in stock`,
    badgeLabel: null,
    cardLabel: `${stock} in stock`,
  };
}
