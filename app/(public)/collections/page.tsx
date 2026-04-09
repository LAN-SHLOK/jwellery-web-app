import type { Metadata } from 'next';

import { BRAND_CONFIG } from '@/config/brand';
import { getProductsWithPricing } from '@/lib/catalog';

import CollectionsClient from './CollectionsClient';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Collections',
  description: `Handcrafted 22K gold jewellery - rings, chains, earrings, bangles, pendants and necklaces. Priced live with today's gold rate. ${BRAND_CONFIG.tagline}`,
};

export default async function CollectionsPage() {
  const { products } = await getProductsWithPricing(null);

  return <CollectionsClient initialProducts={products} />;
}
