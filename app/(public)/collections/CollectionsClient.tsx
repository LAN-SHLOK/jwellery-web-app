'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

import ProductGrid from '@/components/product/ProductGrid';

const CATEGORIES = [
  { slug: null, label: 'All Products' },
  { slug: 'ring', label: 'Rings' },
  { slug: 'chain', label: 'Chains' },
  { slug: 'earring', label: 'Earrings' },
  { slug: 'bangle', label: 'Bangles' },
  { slug: 'pendant', label: 'Pendants' },
  { slug: 'necklace', label: 'Necklaces' },
];

type CollectionsClientProps = {
  initialProducts: any[];
};

export default function CollectionsClient({ initialProducts }: CollectionsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const products = useMemo(() => {
    if (!activeCategory) {
      return initialProducts;
    }
    return initialProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory, initialProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Collections
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Handcrafted 22K gold jewellery with live pricing and BIS hallmark certification
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
              <Filter size={18} />
              <span className="font-medium">Filter:</span>
            </div>
            {CATEGORIES.map((category) => (
              <button
                key={category.slug || 'all'}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.slug
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
