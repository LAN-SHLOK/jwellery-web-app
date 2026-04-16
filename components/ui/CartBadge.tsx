'use client';

import { useCart } from '@/lib/store';
import { ShoppingBag } from 'lucide-react';

export default function CartBadge() {
  const count = useCart((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const setIsOpen = useCart((state) => state.setIsOpen);

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
      aria-label="Open cart"
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
          {count}
        </span>
      )}
    </button>
  );
}
