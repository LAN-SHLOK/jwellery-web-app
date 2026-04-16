'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-xl font-medium text-gray-900">
              {BRAND_CONFIG.name}
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              Premium 22K gold jewelry with BIS hallmark certification and transparent pricing.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-gray-900"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-gray-900"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-gray-900"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Shop
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/collections"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  All Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=rings"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=necklaces"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=bangles"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Bangles
                </Link>
              </li>
              <li>
                <Link
                  href="/collections?category=earrings"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Earrings
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-gray-400" />
                <span className="text-sm text-gray-600">{BRAND_CONFIG.contact.whatsapp}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-gray-400" />
                <span className="text-sm text-gray-600">{BRAND_CONFIG.contact.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-gray-400" />
                <span className="text-sm text-gray-600">{BRAND_CONFIG.contact.address}</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs font-medium text-gray-500">Business Hours</p>
              <p className="mt-2 text-sm text-gray-600">{BRAND_CONFIG.hours.weekdays}</p>
              <p className="text-sm text-gray-600">{BRAND_CONFIG.hours.sunday}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              © {currentYear} {BRAND_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="link-hover text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="link-hover text-sm text-gray-500 hover:text-gray-900">
                Terms of Service
              </Link>
              <Link href="/shipping-policy" className="link-hover text-sm text-gray-500 hover:text-gray-900">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
