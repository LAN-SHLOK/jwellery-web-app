import React from 'react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/ui/Navbar'), {
  ssr: true,
  loading: () => (
    <div className="fixed left-0 right-0 top-0 z-[100] h-16 border-b border-gray-200 bg-white md:h-20" />
  ),
});

const CartDrawerRoot = dynamic(() => import('@/components/cart/CartDrawerRoot'), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/ui/MobileBottomNav'), { ssr: false });
const Footer = dynamic(() => import('@/components/ui/Footer'), { ssr: true });

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartDrawerRoot />
      <MobileBottomNav />

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <Footer />
    </div>
  );
}
