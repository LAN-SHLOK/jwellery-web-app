import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="luxury-panel rounded-[2rem] px-8 py-20 text-center">
        <p className="section-kicker">No products available</p>
        <p className="mt-5 font-serif text-3xl text-brand-primary">This selection is temporarily unavailable, but the wider collection is still open to browse.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  );
}
