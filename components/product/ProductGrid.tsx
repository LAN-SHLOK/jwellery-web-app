import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm px-8 py-20 text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-3">No products available</p>
        <p className="text-xl font-semibold text-gray-900">Check back soon for new arrivals</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  );
}
