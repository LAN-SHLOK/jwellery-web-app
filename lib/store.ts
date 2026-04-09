import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BRAND_CONFIG } from '@/config/brand';

type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  goldWeight: number;
  goldPurity: '18K' | '22K';
  makingChargeType: 'fixed' | 'percentage';
  makingChargeValue: number;
  jewellerMargin: number;
  quantity: number;
  priceAtAdded: number;
};

type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  goldWeight: number;
  goldPurity: '18K' | '22K';
  makingChargeType: 'fixed' | 'percentage';
  makingChargeValue: number;
  jewellerMargin: number;
  category: string;
  addedAt: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  lastSyncedRate: number | null;
  addItem: (product: any, pricing: any) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, delta: number) => void;
  setIsOpen: (open: boolean) => void;
  syncPrices: (currentRate: number) => { changed: boolean };
  clearCart: () => void;
};

type WishlistStore = {
  items: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  moveToCart: (slug: string, pricing: any) => void;
  clearWishlist: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastSyncedRate: null,

      setIsOpen: (open) => set({ isOpen: open }),

      addItem: (product, pricing) => {
        const { items } = get();
        const existing = items.find((i) => i.slug === product.slug);

        if (existing) {
          set({
            items: items.map((i) =>
              i.slug === product.slug ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          });
          return;
        }

        set({
          items: [
            ...items,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images?.[0] || '',
              goldWeight: product.gold_weight_grams,
              goldPurity: product.gold_purity || '22K',
              makingChargeType: product.making_charge_type,
              makingChargeValue: product.making_charge_value,
              jewellerMargin: product.jeweller_margin,
              quantity: 1,
              priceAtAdded: pricing.finalPrice,
            },
          ],
          isOpen: true,
        });
      },

      removeItem: (slug) => {
        set({ items: get().items.filter((i) => i.slug !== slug) });
      },

      updateQuantity: (slug, delta) => {
        set({
          items: get().items.map((i) =>
            i.slug === slug ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
          ),
        });
      },

      // called when cart drawer opens — tells us if gold rate changed since last visit
      syncPrices: (currentRate) => {
        const prevRate = get().lastSyncedRate;
        const changed = prevRate !== null && prevRate !== currentRate;
        set({ lastSyncedRate: currentRate });
        return { changed };
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: BRAND_CONFIG.cartStorageKey }
  )
);

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const { items } = get();
        const existing = items.find((i) => i.slug === product.slug);

        if (existing) {
          return;
        }

        set({
          items: [
            ...items,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images?.[0] || '',
              goldWeight: product.gold_weight_grams,
              goldPurity: product.gold_purity || '22K',
              makingChargeType: product.making_charge_type,
              makingChargeValue: product.making_charge_value,
              jewellerMargin: product.jeweller_margin,
              category: product.category || 'jewellery',
              addedAt: Date.now(),
            },
          ],
        });
      },

      removeFromWishlist: (slug) => {
        set({ items: get().items.filter((i) => i.slug !== slug) });
      },

      isInWishlist: (slug) => {
        return get().items.some((i) => i.slug === slug);
      },

      moveToCart: (slug, pricing) => {
        const item = get().items.find((i) => i.slug === slug);
        if (!item) return;

        useCart.getState().addItem(
          {
            id: item.id,
            slug: item.slug,
            name: item.name,
            images: [item.image],
            gold_weight_grams: item.goldWeight,
            gold_purity: item.goldPurity,
            making_charge_type: item.makingChargeType,
            making_charge_value: item.makingChargeValue,
            jeweller_margin: item.jewellerMargin,
          },
          pricing
        );

        get().removeFromWishlist(slug);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: `${BRAND_CONFIG.name.toLowerCase()}-wishlist` }
  )
);
