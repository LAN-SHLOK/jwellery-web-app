'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Gem, Truck, Sparkles, Shield, Clock, Star } from 'lucide-react';

import ProductGrid from '@/components/product/ProductGrid';

const trustPillars = [
  {
    icon: Award,
    title: 'BIS Hallmarked',
    description: 'Every piece is certified for purity and quality with BIS hallmarking standards.',
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    icon: Gem,
    title: 'Premium Craftsmanship',
    description: 'Handcrafted designs with attention to detail and traditional techniques.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Truck,
    title: 'Insured Delivery',
    description: 'Safe and secure shipping with full insurance coverage across India.',
    gradient: 'from-blue-500 to-cyan-600',
  },
];

const featuredCollections = [
  {
    title: 'Bridal Collection',
    description: 'Elegant bangles, necklaces, and ceremonial jewelry for your special day.',
    href: '/collections',
    icon: Sparkles,
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
  },
  {
    title: 'Daily Wear',
    description: 'Lightweight rings, pendants, and earrings perfect for everyday elegance.',
    href: '/collections',
    icon: Star,
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
  },
  {
    title: 'Gift Collection',
    description: 'Thoughtfully curated pieces perfect for gifting on special occasions.',
    href: '/collections',
    icon: Award,
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200/30 to-yellow-200/30 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 text-sm font-medium text-amber-900"
            >
              <Sparkles size={16} className="animate-pulse" />
              Premium 22K Gold Jewelry
            </motion.div>
            
            <motion.h1 
              className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text font-serif text-5xl font-bold text-transparent md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Timeless Elegance
              <br />
              <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text">
                Crafted for You
              </span>
            </motion.h1>
            
            <motion.p 
              className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 md:text-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              BIS hallmarked jewelry with live gold pricing. Experience transparency in every piece with clear pricing breakdown.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                href="/collections" 
                className="ripple-hover group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">Explore Collections</span>
                <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-amber-600 to-yellow-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link 
                href="/about" 
                className="btn-hover inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:border-gray-900 hover:shadow-lg"
              >
                Our Story
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 pt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div>
                <p className="text-3xl font-bold text-gray-900 md:text-4xl">100%</p>
                <p className="mt-2 text-sm text-gray-600">BIS Certified</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 md:text-4xl">24/7</p>
                <p className="mt-2 text-sm text-gray-600">Support</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 md:text-4xl">22K</p>
                <p className="mt-2 text-sm text-gray-600">Pure Gold</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Enhanced */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {trustPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
                
                <div className={`relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.gradient} shadow-lg`}>
                  <pillar.icon size={28} className="text-white" />
                </div>
                
                <h3 className="relative text-xl font-bold text-gray-900">{pillar.title}</h3>
                <p className="relative mt-3 text-gray-600">{pillar.description}</p>
                
                {/* Decorative element */}
                <div className={`absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-gradient-to-br ${pillar.gradient} opacity-10 blur-2xl transition-all group-hover:scale-150`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections - Card Style */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl font-bold text-gray-900 md:text-5xl">
              Curated Collections
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover jewelry that tells your story
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <Link
                  href={collection.href}
                  className="group relative block overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl"
                >
                  {/* Gradient header */}
                  <div className={`relative h-48 bg-gradient-to-br ${collection.gradient} p-8`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <collection.icon size={48} className="relative text-white drop-shadow-lg" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900">{collection.title}</h3>
                    <p className="mt-3 text-gray-600">{collection.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 font-semibold text-gray-900">
                      Explore Collection
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div 
            className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="font-serif text-4xl font-bold text-gray-900 md:text-5xl">
                Featured Pieces
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Handcrafted with love, certified with trust
              </p>
            </div>
            <Link 
              href="/collections" 
              className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
            >
              View All Products
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500" />
                <div className="absolute inset-2 animate-pulse rounded-full bg-amber-100" />
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center">
              <Gem size={48} className="mx-auto text-gray-300" />
              <p className="mt-4 text-lg text-gray-600">No products available at the moment</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>

      {/* Why Choose Us - Premium Split */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
                <Shield size={16} />
                Why Choose Us
              </div>
              
              <h2 className="font-serif text-4xl font-bold text-gray-900 md:text-5xl">
                Transparent Pricing,
                <br />
                <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Certified Quality
                </span>
              </h2>
              
              <p className="mt-6 text-lg text-gray-600">
                Every piece comes with BIS hallmark certification and transparent pricing breakdown including gold value, making charges, and GST.
              </p>
              
              <div className="mt-10 space-y-6">
                {[
                  { icon: Award, title: 'BIS Hallmarked', desc: 'All jewelry is certified for purity', color: 'amber' },
                  { icon: Clock, title: 'Live Gold Pricing', desc: 'Prices updated daily based on market rates', color: 'blue' },
                  { icon: Truck, title: 'Insured Delivery', desc: 'Safe and secure shipping across India', color: 'green' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-${item.color}-100`}>
                      <item.icon size={20} className={`text-${item.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 shadow-2xl md:p-12"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative elements */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
              
              <div className="relative space-y-8">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-400">Purity Standard</p>
                  <p className="mt-2 text-4xl font-bold text-white">22K Gold</p>
                  <p className="mt-2 text-sm text-gray-300">91.67% pure gold content</p>
                </div>
                
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-400">GST Rate</p>
                  <p className="mt-2 text-4xl font-bold text-white">3%</p>
                  <p className="mt-2 text-sm text-gray-300">Transparent tax calculation</p>
                </div>
                
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-400">Customer Support</p>
                  <p className="mt-2 text-4xl font-bold text-white">24/7</p>
                  <p className="mt-2 text-sm text-gray-300">Always here to help you</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles size={48} className="mx-auto text-white" />
            <h2 className="mt-6 font-serif text-4xl font-bold text-white md:text-5xl">
              Start Your Jewelry Journey Today
            </h2>
            <p className="mt-6 text-xl text-white/90">
              Explore our collection of handcrafted 22K gold jewelry with BIS certification
            </p>
            <Link
              href="/collections"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              Browse Collections
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
