import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BRAND_CONFIG } from '@/config/brand';

type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  goldWeight: number;
  makingChargeType: 'fixed' | 'percentage';
  makingChargeValue: number;
  jewellerMargin: number;
  quantity: number;
  priceAtAdded: number; // snapshot for reference only, not used at checkout
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
