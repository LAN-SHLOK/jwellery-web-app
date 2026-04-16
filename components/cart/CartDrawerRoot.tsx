'use client';

import dynamic from 'next/dynamic';

import { useCart } from '@/lib/store';

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });

export default function CartDrawerRoot() {
  const isOpen = useCart((state) => state.isOpen);

  if (!isOpen) {
    return null;
  }

  return <CartDrawer />;
}
