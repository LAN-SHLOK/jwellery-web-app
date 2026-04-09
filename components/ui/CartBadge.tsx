'use client';

import { useCart } from '@/lib/store';
import { ShoppingBag } from 'lucide-react';

// tiny component — only loads Zustand, not the whole Navbar
export default function CartBadge() {
  const count = useCart((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const setIsOpen = useCart((state) => state.setIsOpen);

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-2 group"
      aria-label="Open cart"
    >
      <ShoppingBag size={18} className="text-brand-primary transition-transform duration-300 group-hover:scale-110" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand-accent text-white text-[8px] flex items-center justify-center rounded-full font-bold animate-scale-in">
          {count}
        </span>
      )}
    </button>
  );
}
