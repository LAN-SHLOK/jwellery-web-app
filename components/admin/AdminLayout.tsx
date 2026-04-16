'use client';

import { type ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  type LucideIcon,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Star,
  Tag,
  TrendingUp,
  X,
} from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';

type AdminLayoutProps = {
  children: ReactNode;
};

type NavLink = {
  href: string;
  icon: LucideIcon;
  name: string;
};

const NAV_LINKS: NavLink[] = [
  { href: '/admin/dashboard', icon: LayoutDashboard, name: 'Dashboard' },
  { href: '/admin/gold-rate', icon: TrendingUp, name: 'Gold Rate' },
  { href: '/admin/products', icon: Package, name: 'Products' },
  { href: '/admin/orders', icon: ShoppingBag, name: 'Orders' },
  { href: '/admin/coupons', icon: Tag, name: 'Coupons' },
  { href: '/admin/reviews', icon: Star, name: 'Reviews' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLink = NAV_LINKS.find((link) => pathname.startsWith(link.href));
  const pageName = activeLink?.name || 'Admin';

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      // Clear any client-side state and redirect to home
      window.history.replaceState(null, '', '/');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 lg:hidden">
        <div>
          <p className="font-serif text-lg font-medium text-gray-900">{BRAND_CONFIG.name}</p>
          <p className="text-xs text-gray-500">{pageName}</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <p className="font-serif text-lg font-medium text-gray-900">{BRAND_CONFIG.name}</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/"
              className="mb-2 flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-medium text-gray-900 sm:text-3xl">
              {pageName}
            </h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
